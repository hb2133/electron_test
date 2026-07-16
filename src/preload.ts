import { contextBridge, ipcRenderer } from 'electron';
import type { IpcRendererEvent } from 'electron';
import {
    TrackingIpcChannels,
} from '@/core/infra/tracking/TrackingBridgeTypes';
import type {
    TrackingBridge,
    TrackingCommand,
    TrackingConnectionStatus,
} from '@/core/infra/tracking/TrackingBridgeTypes';

const Tracking: TrackingBridge = {
    GetConnectionStatus: () => ipcRenderer.invoke(TrackingIpcChannels.GetStatus),
    GetLaunchConfig: () => ipcRenderer.invoke(TrackingIpcChannels.GetLaunchConfig),
    SendPayload: (Payload) => ipcRenderer.send(TrackingIpcChannels.Payload, Payload),
    OnConnectionStatus: (Listener) =>
    {
        const WrappedListener = (_Event: IpcRendererEvent, Status: TrackingConnectionStatus) => Listener(Status);
        ipcRenderer.on(TrackingIpcChannels.Status, WrappedListener);
        return () => ipcRenderer.removeListener(TrackingIpcChannels.Status, WrappedListener);
    },
    OnCommand: (Listener) =>
    {
        const WrappedListener = (_Event: IpcRendererEvent, Command: TrackingCommand) => Listener(Command);
        ipcRenderer.on(TrackingIpcChannels.Command, WrappedListener);
        return () => ipcRenderer.removeListener(TrackingIpcChannels.Command, WrappedListener);
    },
};

contextBridge.exposeInMainWorld('WorkbenchBridge', { Tracking });
