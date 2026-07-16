import type {
    MediaPipeTrackingCallbacks,
    MediaPipeTrackingOptions,
    MediaPipeTrackingService,
    TrackingPreviewTargets,
} from '@/core/services/MediaPipeTrackingService';

export async function StartTrackingAction(
    Service: MediaPipeTrackingService,
    Targets: TrackingPreviewTargets,
    Options: MediaPipeTrackingOptions,
    Callbacks: MediaPipeTrackingCallbacks,
): Promise<void>
{
    try
    {
        await Service.Start(Targets, Options, Callbacks);
    }
    catch (CaughtError: unknown)
    {
        Callbacks.OnError(CaughtError instanceof Error ? CaughtError : new Error(String(CaughtError)));
    }
}
