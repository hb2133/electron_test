import type { MediaPipeTrackingService } from '@/core/services/MediaPipeTrackingService';

export async function StopTrackingAction(Service: MediaPipeTrackingService): Promise<void>
{
    try
    {
        await Service.Stop();
    }
    catch (CaughtError: unknown)
    {
        throw CaughtError instanceof Error ? CaughtError : new Error(String(CaughtError));
    }
}
