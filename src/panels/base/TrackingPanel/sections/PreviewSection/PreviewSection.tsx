import { useEffect, useRef } from 'react';
import type { TrackingPreviewTargets } from '@/panels/base/TrackingPanel/controller/TrackingPanelTypes';

export interface PreviewSectionProps
{
    OnTargetsReady: (Targets: TrackingPreviewTargets) => void;
}

export function PreviewSection({ OnTargetsReady }: PreviewSectionProps)
{
    const VideoRef = useRef<HTMLVideoElement>(null);
    const CanvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() =>
    {
        if (VideoRef.current != null && CanvasRef.current != null)
        {
            OnTargetsReady({ Video: VideoRef.current, Canvas: CanvasRef.current });
        }
    }, [OnTargetsReady]);

    return (
        <section className="PreviewSection" data-ue-component="PreviewSection" data-ue-root>
            <div className="PreviewViewport">
                <video ref={VideoRef} muted playsInline aria-hidden="true" />
                <canvas ref={CanvasRef} aria-label="MediaPipe tracking preview" />
            </div>
        </section>
    );
}
