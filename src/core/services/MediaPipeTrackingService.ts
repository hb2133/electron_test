import {
    FaceLandmarker,
    FilesetResolver,
    HandLandmarker,
    PoseLandmarker,
} from '@mediapipe/tasks-vision';
import type {
    HandLandmarkerResult,
} from '@mediapipe/tasks-vision';
import { BuildTrackingPayload } from '@/core/infra/tracking/TrackingProtocol';

const TargetFrameIntervalMilliseconds = 1000 / 30;
const HandConnections: ReadonlyArray<readonly [number, number]> = [
    [0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8],
    [0, 9], [9, 10], [10, 11], [11, 12], [0, 13], [13, 14], [14, 15], [15, 16],
    [0, 17], [17, 18], [18, 19], [19, 20], [5, 9], [9, 13], [13, 17],
];

export interface MediaPipeTrackingOptions
{
    CameraId: string;
    UseWideAspectRatio: boolean;
    VideoVisible: boolean;
    FaceTracking: boolean;
    PoseTracking: boolean;
    HandTracking: boolean;
}

export interface MediaPipeTrackingMetrics
{
    FramesPerSecond: number;
    InferenceMilliseconds: number;
}

export interface MediaPipeTrackingCallbacks
{
    OnReady: () => void;
    OnPayload: (Payload: Float32Array) => void;
    OnMetrics: (Metrics: MediaPipeTrackingMetrics) => void;
    OnError: (Error: Error) => void;
}

export interface TrackingPreviewTargets
{
    Video: HTMLVideoElement;
    Canvas: HTMLCanvasElement;
}

export interface CameraOption
{
    Id: string;
    Label: string;
}

export class MediaPipeTrackingService
{
    private Face?: FaceLandmarker;
    private Hand?: HandLandmarker;
    private Pose?: PoseLandmarker;
    private Stream?: MediaStream;
    private AnimationFrame?: number;
    private Options?: MediaPipeTrackingOptions;
    private Targets?: TrackingPreviewTargets;
    private Callbacks?: MediaPipeTrackingCallbacks;
    private ProcessingCanvas = document.createElement('canvas');
    private LastFrameTime = 0;
    private FrameCount = 0;
    private FrameCountStart = 0;
    private ReportedFramesPerSecond = 0;

    public async EnumerateCameras(): Promise<CameraOption[]>
    {
        let Devices = await navigator.mediaDevices.enumerateDevices();
        const HasUsableCameraId = Devices.some((Device) =>
            Device.kind === 'videoinput' && Device.deviceId.length > 0);

        if (HasUsableCameraId == false)
        {
            const PermissionStream = await navigator.mediaDevices.getUserMedia({
                audio: false,
                video: true,
            });
            PermissionStream.getTracks().forEach((Track) => Track.stop());
            Devices = await navigator.mediaDevices.enumerateDevices();
        }

        let CameraNumber = 0;
        return Devices
            .filter((Device) => Device.kind === 'videoinput')
            .map((Device) =>
            {
                CameraNumber += 1;
                return {
                    Id: Device.deviceId,
                    Label: Device.label || `Camera ${CameraNumber}`,
                };
            });
    }

    public async Start(
        Targets: TrackingPreviewTargets,
        Options: MediaPipeTrackingOptions,
        Callbacks: MediaPipeTrackingCallbacks,
    ): Promise<void>
    {
        await this.Stop();
        this.Options = { ...Options };
        this.Targets = Targets;
        this.Callbacks = Callbacks;

        try
        {
            this.Stream = await navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                    deviceId: Options.CameraId.length > 0 ? { exact: Options.CameraId } : undefined,
                    width: { ideal: 640 },
                    height: { ideal: Options.UseWideAspectRatio == true ? 360 : 480 },
                    frameRate: { ideal: 30, max: 30 },
                },
            });
            Targets.Video.srcObject = this.Stream;
            await Targets.Video.play();
            this.PrepareCanvases(Targets, Options.UseWideAspectRatio);
            await this.CreateLandmarkers();

            this.LastFrameTime = 0;
            this.FrameCount = 0;
            this.FrameCountStart = performance.now();
            this.ReportedFramesPerSecond = 0;
            Callbacks.OnReady();
            this.AnimationFrame = requestAnimationFrame((Timestamp) => this.ProcessFrame(Timestamp));
        }
        catch (Error: unknown)
        {
            await this.Stop();
            Callbacks.OnError(ToError(Error));
        }
    }

    public UpdateOptions(Options: Partial<MediaPipeTrackingOptions>): void
    {
        if (this.Options != null)
        {
            this.Options = { ...this.Options, ...Options };
        }
    }

    public async Stop(): Promise<void>
    {
        if (this.AnimationFrame != null)
        {
            cancelAnimationFrame(this.AnimationFrame);
        }
        this.AnimationFrame = undefined;
        this.Stream?.getTracks().forEach((Track) => Track.stop());
        this.Stream = undefined;
        this.Targets?.Video.pause();
        if (this.Targets != null)
        {
            this.Targets.Video.srcObject = null;
        }

        this.Face?.close();
        this.Hand?.close();
        this.Pose?.close();
        this.Face = undefined;
        this.Hand = undefined;
        this.Pose = undefined;
        this.Options = undefined;
        this.Targets = undefined;
        this.Callbacks = undefined;
    }

    private PrepareCanvases(Targets: TrackingPreviewTargets, UseWideAspectRatio: boolean): void
    {
        const Width = 640;
        const Height = UseWideAspectRatio == true ? 360 : 480;
        this.ProcessingCanvas.width = Width;
        this.ProcessingCanvas.height = Height;
        Targets.Canvas.width = Width;
        Targets.Canvas.height = Height;
    }

    private async CreateLandmarkers(): Promise<void>
    {
        const AssetRoot = new URL('../mediapipe/', document.baseURI);
        const WasmFiles = await FilesetResolver.forVisionTasks(new URL('wasm', AssetRoot).toString());
        const CommonOptions = {
            runningMode: 'VIDEO' as const,
            minTrackingConfidence: 0.5,
        };

        this.Hand = await HandLandmarker.createFromOptions(WasmFiles, {
            ...CommonOptions,
            baseOptions: {
                modelAssetPath: new URL('models/hand_landmarker.task', AssetRoot).toString(),
                delegate: 'GPU',
            },
            numHands: 2,
            minHandDetectionConfidence: 0.5,
            minHandPresenceConfidence: 0.5,
        });
        this.Face = await FaceLandmarker.createFromOptions(WasmFiles, {
            ...CommonOptions,
            baseOptions: {
                modelAssetPath: new URL('models/face_landmarker.task', AssetRoot).toString(),
                delegate: 'GPU',
            },
            numFaces: 1,
            outputFaceBlendshapes: true,
            outputFacialTransformationMatrixes: true,
            minFaceDetectionConfidence: 0.5,
            minFacePresenceConfidence: 0.5,
        });
        this.Pose = await PoseLandmarker.createFromOptions(WasmFiles, {
            ...CommonOptions,
            baseOptions: {
                modelAssetPath: new URL('models/pose_landmarker_lite.task', AssetRoot).toString(),
                delegate: 'GPU',
            },
            numPoses: 1,
            minPoseDetectionConfidence: 0.5,
            minPosePresenceConfidence: 0.5,
            outputSegmentationMasks: false,
        });
    }

    private ProcessFrame(Timestamp: number): void
    {
        if (this.Options == null || this.Targets == null || this.Callbacks == null)
        {
            return;
        }

        this.AnimationFrame = requestAnimationFrame((NextTimestamp) => this.ProcessFrame(NextTimestamp));
        if (Timestamp - this.LastFrameTime < TargetFrameIntervalMilliseconds)
        {
            return;
        }
        this.LastFrameTime = Timestamp;

        try
        {
            this.DrawCameraFrame(this.Targets.Video);
            const InferenceStart = performance.now();
            const HandResult = this.Options.HandTracking == true
                ? this.Hand?.detectForVideo(this.ProcessingCanvas, Timestamp)
                : undefined;
            const FaceResult = this.Options.FaceTracking == true
                ? this.Face?.detectForVideo(this.ProcessingCanvas, Timestamp)
                : undefined;
            const PoseResult = this.Options.PoseTracking == true
                ? this.Pose?.detectForVideo(this.ProcessingCanvas, Timestamp)
                : undefined;
            const InferenceMilliseconds = Math.round(performance.now() - InferenceStart);

            this.DrawPreview(HandResult, InferenceMilliseconds);
            const Payload = BuildTrackingPayload(
                { Hand: HandResult, Face: FaceResult, Pose: PoseResult },
                {
                    IncludeHand: this.Options.HandTracking,
                    IncludeFace: this.Options.FaceTracking,
                    IncludePose: this.Options.PoseTracking,
                },
            );
            this.Callbacks.OnPayload(Payload);
            this.ReportMetrics(Timestamp, InferenceMilliseconds);
            PoseResult?.close();
        }
        catch (Error: unknown)
        {
            const Callbacks = this.Callbacks;
            void this.Stop().then(() => Callbacks?.OnError(ToError(Error)));
        }
    }

    private DrawCameraFrame(Video: HTMLVideoElement): void
    {
        const Context = this.ProcessingCanvas.getContext('2d');
        if (Context == null)
        {
            throw new Error('카메라 프레임 캔버스를 초기화할 수 없습니다.');
        }

        Context.save();
        Context.clearRect(0, 0, this.ProcessingCanvas.width, this.ProcessingCanvas.height);
        Context.translate(this.ProcessingCanvas.width, 0);
        Context.scale(-1, 1);
        Context.drawImage(Video, 0, 0, this.ProcessingCanvas.width, this.ProcessingCanvas.height);
        Context.restore();
    }

    private DrawPreview(
        HandResult: HandLandmarkerResult | undefined,
        InferenceMilliseconds: number,
    ): void
    {
        if (this.Targets == null || this.Options == null)
        {
            return;
        }

        const Context = this.Targets.Canvas.getContext('2d');
        if (Context == null)
        {
            return;
        }

        if (this.Options.VideoVisible == true)
        {
            Context.drawImage(this.ProcessingCanvas, 0, 0);
        }
        else
        {
            Context.fillStyle = '#000000';
            Context.fillRect(0, 0, this.Targets.Canvas.width, this.Targets.Canvas.height);
        }

        if (this.Options.HandTracking == true && HandResult != null)
        {
            DrawHandLandmarks(Context, HandResult, this.Targets.Canvas.width, this.Targets.Canvas.height);
        }

        DrawMetricsOverlay(Context, this.ReportedFramesPerSecond, InferenceMilliseconds);
    }

    private ReportMetrics(Timestamp: number, InferenceMilliseconds: number): void
    {
        this.FrameCount += 1;
        const Elapsed = Timestamp - this.FrameCountStart;
        if (Elapsed < 1000 || this.Callbacks == null)
        {
            return;
        }

        this.ReportedFramesPerSecond = Math.round((this.FrameCount * 1000) / Elapsed);
        this.Callbacks.OnMetrics({
            FramesPerSecond: this.ReportedFramesPerSecond,
            InferenceMilliseconds,
        });
        this.FrameCount = 0;
        this.FrameCountStart = Timestamp;
    }
}

function DrawMetricsOverlay(
    Context: CanvasRenderingContext2D,
    FramesPerSecond: number,
    InferenceMilliseconds: number,
): void
{
    Context.save();
    Context.font = 'bold 28px Arial, sans-serif';
    Context.lineWidth = 6;
    Context.strokeStyle = '#000000';
    Context.fillStyle = '#ffffff';
    Context.textBaseline = 'top';

    const FpsText = `FPS: ${FramesPerSecond}`;
    const InferenceText = `Inference time: ${InferenceMilliseconds}ms`;
    Context.strokeText(FpsText, 12, 8);
    Context.fillText(FpsText, 12, 8);
    Context.font = 'bold 24px Arial, sans-serif';
    Context.strokeText(InferenceText, 12, 44);
    Context.fillText(InferenceText, 12, 44);
    Context.restore();
}

function DrawHandLandmarks(
    Context: CanvasRenderingContext2D,
    Result: HandLandmarkerResult,
    Width: number,
    Height: number,
): void
{
    for (let HandIndex = 0; HandIndex < Result.landmarks.length; HandIndex += 1)
    {
        const Landmarks = Result.landmarks[HandIndex];
        const IsRight = Result.handedness[HandIndex]?.[0]?.categoryName === 'Right';
        const Color = IsRight == true ? '#00d9e7' : '#ff8a00';
        Context.strokeStyle = Color;
        Context.fillStyle = Color;
        Context.lineWidth = 2;

        for (const [StartIndex, EndIndex] of HandConnections)
        {
            const Start = Landmarks[StartIndex];
            const End = Landmarks[EndIndex];
            if (Start == null || End == null)
            {
                continue;
            }
            Context.beginPath();
            Context.moveTo(Start.x * Width, Start.y * Height);
            Context.lineTo(End.x * Width, End.y * Height);
            Context.stroke();
        }

        for (const Landmark of Landmarks)
        {
            Context.beginPath();
            Context.arc(Landmark.x * Width, Landmark.y * Height, 3, 0, Math.PI * 2);
            Context.fill();
        }
    }
}

function ToError(Value: unknown): Error
{
    return Value instanceof Error ? Value : new Error(String(Value));
}
