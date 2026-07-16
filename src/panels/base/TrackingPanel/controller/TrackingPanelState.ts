import type { CameraOption } from '@/core/services/MediaPipeTrackingService';
import type { TrackingConnectionStatus } from '@/core/infra/tracking/TrackingBridgeTypes';

export type TrackingRuntimePhase = 'idle' | 'starting' | 'running' | 'stopping' | 'error';

export interface TrackingPanelState
{
    RuntimePhase: TrackingRuntimePhase;
    Cameras: CameraOption[];
    SelectedCameraId: string;
    UseWideAspectRatio: boolean;
    VideoVisible: boolean;
    FaceTracking: boolean;
    PoseTracking: boolean;
    HandTracking: boolean;
    FramesPerSecond: number;
    InferenceMilliseconds: number;
    Connection: TrackingConnectionStatus;
    ErrorMessage?: string;
}

export const InitialTrackingPanelState: TrackingPanelState = {
    RuntimePhase: 'idle',
    Cameras: [],
    SelectedCameraId: '',
    UseWideAspectRatio: false,
    VideoVisible: false,
    FaceTracking: true,
    PoseTracking: true,
    HandTracking: true,
    FramesPerSecond: 0,
    InferenceMilliseconds: 0,
    Connection: {
        Phase: 'connecting',
        Host: '127.0.0.1',
        Port: 33685,
    },
};
