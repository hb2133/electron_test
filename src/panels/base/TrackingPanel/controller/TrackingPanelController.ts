import { MediaPipeTrackingService } from '@/core/services/MediaPipeTrackingService';
import type { TrackingCommand } from '@/core/infra/tracking/TrackingBridgeTypes';
import { InitialTrackingPanelState } from './TrackingPanelState';
import type { TrackingPanelState } from './TrackingPanelState';
import type {
    TrackingPanelListener,
    TrackingPreviewTargets,
    TrackingToggleName,
} from './TrackingPanelTypes';
import { StartTrackingAction } from './actions/StartTrackingAction';
import { StopTrackingAction } from './actions/StopTrackingAction';

export class TrackingPanelController
{
    private readonly Service = new MediaPipeTrackingService();
    private readonly Listeners = new Set<TrackingPanelListener>();
    private State: TrackingPanelState = InitialTrackingPanelState;
    private Targets?: TrackingPreviewTargets;
    private RemoveStatusListener?: () => void;
    private RemoveCommandListener?: () => void;
    private IsInitialized = false;

    public readonly Subscribe = (Listener: TrackingPanelListener): (() => void) =>
    {
        this.Listeners.add(Listener);
        return () => this.Listeners.delete(Listener);
    };

    public readonly GetSnapshot = (): TrackingPanelState => this.State;

    public async Initialize(): Promise<void>
    {
        this.RemoveStatusListener = window.WorkbenchBridge.Tracking.OnConnectionStatus((Connection) =>
        {
            this.SetState({ Connection });
        });
        this.RemoveCommandListener = window.WorkbenchBridge.Tracking.OnCommand((Command) =>
        {
            this.HandleCommand(Command);
        });

        try
        {
            const [Cameras, Connection, LaunchConfig] = await Promise.all([
                this.Service.EnumerateCameras(),
                window.WorkbenchBridge.Tracking.GetConnectionStatus(),
                window.WorkbenchBridge.Tracking.GetLaunchConfig(),
            ]);
            const CameraIndex = Math.min(LaunchConfig.CameraIndex, Math.max(Cameras.length - 1, 0));
            this.SetState({
                Cameras,
                Connection,
                SelectedCameraId: Cameras[CameraIndex]?.Id ?? '',
                UseWideAspectRatio: LaunchConfig.UseWideAspectRatio,
            });
            this.IsInitialized = true;
            this.TryAutoStart();
        }
        catch (CaughtError: unknown)
        {
            this.SetState({
                RuntimePhase: 'error',
                ErrorMessage: CaughtError instanceof Error ? CaughtError.message : String(CaughtError),
            });
        }
    }

    public AttachPreview(Targets: TrackingPreviewTargets): void
    {
        this.Targets = Targets;
        this.TryAutoStart();
    }

    public SetCamera(CameraId: string): void
    {
        if (this.State.RuntimePhase === 'idle' || this.State.RuntimePhase === 'error')
        {
            this.SetState({ SelectedCameraId: CameraId });
        }
    }

    public SetWideAspectRatio(IsWide: boolean): void
    {
        if (this.State.RuntimePhase === 'idle' || this.State.RuntimePhase === 'error')
        {
            this.SetState({ UseWideAspectRatio: IsWide });
        }
    }

    public SetToggle(Name: TrackingToggleName, Value: boolean): void
    {
        this.SetState({ [Name]: Value });
        this.Service.UpdateOptions({ [Name]: Value });
    }

    public async Start(): Promise<void>
    {
        if (this.Targets == null || this.State.RuntimePhase === 'starting' || this.State.RuntimePhase === 'running')
        {
            return;
        }

        this.SetState({ RuntimePhase: 'starting', ErrorMessage: undefined });
        await StartTrackingAction(
            this.Service,
            this.Targets,
            {
                CameraId: this.State.SelectedCameraId,
                UseWideAspectRatio: this.State.UseWideAspectRatio,
                VideoVisible: this.State.VideoVisible,
                FaceTracking: this.State.FaceTracking,
                PoseTracking: this.State.PoseTracking,
                HandTracking: this.State.HandTracking,
            },
            {
                OnReady: () => this.SetState({ RuntimePhase: 'running' }),
                OnPayload: (Payload) => window.WorkbenchBridge.Tracking.SendPayload(Array.from(Payload)),
                OnMetrics: (Metrics) => this.SetState({
                    FramesPerSecond: Metrics.FramesPerSecond,
                    InferenceMilliseconds: Metrics.InferenceMilliseconds,
                }),
                OnError: (Error) => this.SetState({
                    RuntimePhase: 'error',
                    ErrorMessage: Error.message,
                    FramesPerSecond: 0,
                    InferenceMilliseconds: 0,
                }),
            },
        );
    }

    public async Stop(): Promise<void>
    {
        if (this.State.RuntimePhase === 'idle' || this.State.RuntimePhase === 'stopping')
        {
            return;
        }

        this.SetState({ RuntimePhase: 'stopping' });
        try
        {
            await StopTrackingAction(this.Service);
            this.SetState({
                RuntimePhase: 'idle',
                FramesPerSecond: 0,
                InferenceMilliseconds: 0,
            });
        }
        catch (CaughtError: unknown)
        {
            this.SetState({
                RuntimePhase: 'error',
                ErrorMessage: CaughtError instanceof Error ? CaughtError.message : String(CaughtError),
            });
        }
    }

    public async Dispose(): Promise<void>
    {
        this.RemoveStatusListener?.();
        this.RemoveCommandListener?.();
        await this.Service.Stop();
        this.Listeners.clear();
    }

    private HandleCommand(Command: TrackingCommand): void
    {
        if (Command.Name === 'setVideoVisible' && Command.Value != null)
        {
            this.SetToggle('VideoVisible', Command.Value);
        }
        else if (Command.Name === 'setFaceTracking' && Command.Value != null)
        {
            this.SetToggle('FaceTracking', Command.Value);
        }
        else if (Command.Name === 'setPoseTracking' && Command.Value != null)
        {
            this.SetToggle('PoseTracking', Command.Value);
        }
        else if (Command.Name === 'setHandTracking' && Command.Value != null)
        {
            this.SetToggle('HandTracking', Command.Value);
        }
    }

    private TryAutoStart(): void
    {
        if (this.IsInitialized == true && this.Targets != null && this.State.RuntimePhase === 'idle')
        {
            void this.Start();
        }
    }

    private SetState(Patch: Partial<TrackingPanelState>): void
    {
        this.State = { ...this.State, ...Patch };
        for (const Listener of this.Listeners)
        {
            Listener();
        }
    }
}
