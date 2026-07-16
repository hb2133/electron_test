import { useCallback, useEffect, useMemo } from 'react';
import { TrackingPanelController } from './controller/TrackingPanelController';
import { PreviewSection } from './sections/PreviewSection/PreviewSection';

export function TrackingPanel()
{
    const Controller = useMemo(() => new TrackingPanelController(), []);
    const AttachPreview = useCallback((Targets: Parameters<typeof Controller.AttachPreview>[0]) =>
    {
        Controller.AttachPreview(Targets);
    }, [Controller]);

    useEffect(() =>
    {
        void Controller.Initialize();
        return () =>
        {
            void Controller.Dispose();
        };
    }, [Controller]);

    return (
        <div className="TrackingPanel" data-ue-page="TrackingPanel">
            <PreviewSection OnTargetsReady={AttachPreview} />
        </div>
    );
}
