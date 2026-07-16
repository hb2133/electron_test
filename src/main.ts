import { app, BrowserWindow } from 'electron';
import { CreateMainWindow } from './app/desktop/createMainWindow';
import { RegisterTrackingIpc } from './app/desktop/registerTrackingIpc';
import { UnrealTrackingClient } from './app/desktop/UnrealTrackingClient';
import type { TrackingLaunchConfig } from './core/infra/tracking/TrackingBridgeTypes';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

if (require('electron-squirrel-startup'))
{
    app.quit();
}

const TrackingClient = new UnrealTrackingClient();
const LaunchConfig = ParseTrackingLaunchConfig();
const UnregisterTrackingIpc = RegisterTrackingIpc(TrackingClient, LaunchConfig);

app.on('ready', () =>
{
    TrackingClient.Start();
    CreateMainWindow({
        MainWindowEntry: MAIN_WINDOW_WEBPACK_ENTRY,
        PreloadEntry: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    });
});

app.on('before-quit', () =>
{
    TrackingClient.Stop();
    UnregisterTrackingIpc();
});

app.on('window-all-closed', () =>
{
    if (process.platform !== 'darwin')
    {
        app.quit();
    }
});

app.on('activate', () =>
{
    if (BrowserWindow.getAllWindows().length === 0)
    {
        CreateMainWindow({
            MainWindowEntry: MAIN_WINDOW_WEBPACK_ENTRY,
            PreloadEntry: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
        });
    }
});

function ParseTrackingLaunchConfig(): TrackingLaunchConfig
{
    const ArgumentOffset = app.isPackaged == true ? 1 : 2;
    const UserArguments = process.argv
        .slice(ArgumentOffset)
        .filter((Argument) => Argument.startsWith('--') == false);
    const CameraIndexValue = Number.parseInt(UserArguments[0] ?? '0', 10);
    const AspectRatioValue = Number.parseInt(UserArguments[1] ?? '0', 10);

    return {
        CameraIndex: Number.isFinite(CameraIndexValue) == true && CameraIndexValue >= 0
            ? CameraIndexValue
            : 0,
        UseWideAspectRatio: AspectRatioValue !== 0,
    };
}
