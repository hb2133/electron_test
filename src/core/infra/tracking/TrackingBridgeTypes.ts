export const TrackingIpcChannels = {
    GetStatus: 'tracking:get-status',
    GetLaunchConfig: 'tracking:get-launch-config',
    Payload: 'tracking:payload',
    Status: 'tracking:status',
    Command: 'tracking:command',
} as const;

export type TrackingConnectionPhase = 'connecting' | 'connected' | 'disconnected' | 'stopped';

export interface TrackingConnectionStatus
{
    Phase: TrackingConnectionPhase;
    Host: string;
    Port: number;
    LastError?: string;
}

export type TrackingCommandName =
    | 'quit'
    | 'setVideoVisible'
    | 'setFaceTracking'
    | 'setPoseTracking'
    | 'setHandTracking';

export interface TrackingCommand
{
    Name: TrackingCommandName;
    Value?: boolean;
}

export interface TrackingLaunchConfig
{
    CameraIndex: number;
    UseWideAspectRatio: boolean;
}

export interface TrackingBridge
{
    GetConnectionStatus: () => Promise<TrackingConnectionStatus>;
    GetLaunchConfig: () => Promise<TrackingLaunchConfig>;
    SendPayload: (Payload: number[]) => void;
    OnConnectionStatus: (Listener: (Status: TrackingConnectionStatus) => void) => () => void;
    OnCommand: (Listener: (Command: TrackingCommand) => void) => () => void;
}
