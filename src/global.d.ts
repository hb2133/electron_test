import type { TrackingBridge } from '@/core/infra/tracking/TrackingBridgeTypes';

declare global
{
    interface Window
    {
        WorkbenchBridge: {
            Tracking: TrackingBridge;
        };
    }
}

export {};
