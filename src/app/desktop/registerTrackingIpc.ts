import { app, BrowserWindow, ipcMain } from 'electron';
import { UnrealTrackingClient } from './UnrealTrackingClient';
import { TrackingIpcChannels } from '@/core/infra/tracking/TrackingBridgeTypes';
import type {
    TrackingCommand,
    TrackingConnectionStatus,
    TrackingLaunchConfig,
} from '@/core/infra/tracking/TrackingBridgeTypes';

export function RegisterTrackingIpc(
    Client: UnrealTrackingClient,
    LaunchConfig: TrackingLaunchConfig,
): () => void
{
    ipcMain.handle(TrackingIpcChannels.GetStatus, () => Client.GetStatus());
    ipcMain.handle(TrackingIpcChannels.GetLaunchConfig, () => ({ ...LaunchConfig }));
    ipcMain.on(TrackingIpcChannels.Payload, (_Event, Payload: unknown) =>
    {
        if (Array.isArray(Payload))
        {
            Client.SetPayload(Payload.filter((Value): Value is number => typeof Value === 'number'));
        }
    });

    const StatusListener = (Status: TrackingConnectionStatus) =>
    {
        Broadcast(TrackingIpcChannels.Status, Status);
    };
    const CommandListener = (Command: TrackingCommand) =>
    {
        Broadcast(TrackingIpcChannels.Command, Command);
        if (Command.Name === 'quit')
        {
            app.quit();
        }
    };
    Client.on('status', StatusListener);
    Client.on('command', CommandListener);

    return () =>
    {
        ipcMain.removeHandler(TrackingIpcChannels.GetStatus);
        ipcMain.removeHandler(TrackingIpcChannels.GetLaunchConfig);
        ipcMain.removeAllListeners(TrackingIpcChannels.Payload);
        Client.off('status', StatusListener);
        Client.off('command', CommandListener);
    };
}

function Broadcast(Channel: string, Payload: unknown): void
{
    for (const Window of BrowserWindow.getAllWindows())
    {
        Window.webContents.send(Channel, Payload);
    }
}
