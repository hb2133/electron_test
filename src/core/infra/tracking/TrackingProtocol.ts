import type {
    FaceLandmarkerResult,
    HandLandmarkerResult,
    PoseLandmarkerResult,
} from '@mediapipe/tasks-vision';

export const TrackingProtocolId = 1001;
export const TrackingPayloadFloatCount = 422;

const LeftPresentIndex = 0;
const LeftNormalizedIndex = 1;
const LeftWorldIndex = 64;
const RightPresentIndex = 127;
const RightNormalizedIndex = 128;
const RightWorldIndex = 191;
const BlendshapeIndex = 254;
const FaceMatrixIndex = 306;
const PosePresentIndex = 322;
const PoseNormalizedIndex = 323;

export interface TrackingResultSet
{
    Hand?: HandLandmarkerResult;
    Face?: FaceLandmarkerResult;
    Pose?: PoseLandmarkerResult;
}

export interface TrackingPayloadOptions
{
    IncludeHand: boolean;
    IncludeFace: boolean;
    IncludePose: boolean;
}

export function BuildTrackingPayload(
    Results: TrackingResultSet,
    Options: TrackingPayloadOptions,
): Float32Array
{
    const Payload = new Float32Array(TrackingPayloadFloatCount);

    if (Options.IncludeHand == true && Results.Hand != null)
    {
        WriteHands(Payload, Results.Hand);
    }

    if (Options.IncludeFace == true && Results.Face != null)
    {
        WriteFace(Payload, Results.Face);
    }

    if (Options.IncludePose == true && Results.Pose != null)
    {
        WritePose(Payload, Results.Pose);
    }

    return Payload;
}

function WriteHands(Payload: Float32Array, Result: HandLandmarkerResult): void
{
    for (let HandIndex = 0; HandIndex < Result.landmarks.length; HandIndex += 1)
    {
        const Category = Result.handedness[HandIndex]?.[0];
        const IsMediaPipeRight = Category?.categoryName === 'Right';
        const PresentIndex = IsMediaPipeRight == true ? LeftPresentIndex : RightPresentIndex;
        const NormalizedIndex = IsMediaPipeRight == true ? LeftNormalizedIndex : RightNormalizedIndex;
        const WorldIndex = IsMediaPipeRight == true ? LeftWorldIndex : RightWorldIndex;

        Payload[PresentIndex] = 1;
        WriteLandmarks(Payload, NormalizedIndex, Result.landmarks[HandIndex], 21);
        WriteLandmarks(Payload, WorldIndex, Result.worldLandmarks[HandIndex] ?? [], 21);
    }
}

function WriteFace(Payload: Float32Array, Result: FaceLandmarkerResult): void
{
    const Categories = Result.faceBlendshapes[0]?.categories ?? [];
    for (const Category of Categories)
    {
        if (Category.index >= 0 && Category.index < 52)
        {
            Payload[BlendshapeIndex + Category.index] = Category.score;
        }
    }

    const Matrix = Result.facialTransformationMatrixes[0];
    if (Matrix != null && Matrix.rows === 4 && Matrix.columns === 4)
    {
        for (let Index = 0; Index < 16; Index += 1)
        {
            Payload[FaceMatrixIndex + Index] = Matrix.data[Index] ?? 0;
        }
    }
}

function WritePose(Payload: Float32Array, Result: PoseLandmarkerResult): void
{
    const Landmarks = Result.landmarks[0];
    if (Landmarks == null)
    {
        return;
    }

    Payload[PosePresentIndex] = 1;
    WriteLandmarks(Payload, PoseNormalizedIndex, Landmarks, 33);
}

function WriteLandmarks(
    Payload: Float32Array,
    StartIndex: number,
    Landmarks: ReadonlyArray<{ x: number; y: number; z: number }>,
    MaximumCount: number,
): void
{
    const Count = Math.min(Landmarks.length, MaximumCount);
    for (let Index = 0; Index < Count; Index += 1)
    {
        const Landmark = Landmarks[Index];
        Payload[StartIndex + (Index * 3)] = Landmark.x;
        Payload[StartIndex + (Index * 3) + 1] = Landmark.y;
        Payload[StartIndex + (Index * 3) + 2] = Landmark.z;
    }
}
