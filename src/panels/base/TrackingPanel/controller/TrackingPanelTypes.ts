import type { TrackingPreviewTargets } from '@/core/services/MediaPipeTrackingService';

export type TrackingPanelListener = () => void;
export type TrackingToggleName = 'VideoVisible' | 'FaceTracking' | 'PoseTracking' | 'HandTracking';
export type { TrackingPreviewTargets };
