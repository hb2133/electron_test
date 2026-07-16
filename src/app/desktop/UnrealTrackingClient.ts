import { EventEmitter } from 'events';
import { Socket } from 'net';
import {
    TrackingPayloadFloatCount,
    TrackingProtocolId,
} from '@/core/infra/tracking/TrackingProtocol';
import type {
    TrackingCommand,
    TrackingConnectionStatus,
} from '@/core/infra/tracking/TrackingBridgeTypes';

const ReconnectDelayMilliseconds = 1000;
const SendIntervalMilliseconds = 10;

export class UnrealTrackingClient extends EventEmitter
{
    private readonly Host = '127.0.0.1';
    private readonly Port = 33685;
    private Socket?: Socket;
    private LatestPayload = new Float32Array(TrackingPayloadFloatCount);
    private ReconnectTimer?: NodeJS.Timeout;
    private SendTimer?: NodeJS.Timeout;
    private ReceiveBuffer = '';
    private IsStopped = true;
    private Status: TrackingConnectionStatus = {
        Phase: 'stopped',
        Host: this.Host,
        Port: this.Port,
    };

    public Start(): void
    {
        if (this.IsStopped == false)
        {
            return;
        }

        this.IsStopped = false;
        this.SendTimer = setInterval(() => this.SendLatestPayload(), SendIntervalMilliseconds);
        this.Connect();
    }

    public Stop(): void
    {
        this.IsStopped = true;
        if (this.ReconnectTimer != null)
        {
            clearTimeout(this.ReconnectTimer);
        }
        if (this.SendTimer != null)
        {
            clearInterval(this.SendTimer);
        }

        this.ReconnectTimer = undefined;
        this.SendTimer = undefined;
        this.Socket?.destroy();
        this.Socket = undefined;
        this.SetStatus({ Phase: 'stopped', Host: this.Host, Port: this.Port });
    }

    public SetPayload(Payload: number[]): void
    {
        if (Payload.length !== TrackingPayloadFloatCount)
        {
            return;
        }

        if (Payload.every((Value) => Number.isFinite(Value)) == false)
        {
            return;
        }

        this.LatestPayload = Float32Array.from(Payload);
    }

    public GetStatus(): TrackingConnectionStatus
    {
        return { ...this.Status };
    }

    private Connect(): void
    {
        if (this.IsStopped == true)
        {
            return;
        }

        this.SetStatus({ Phase: 'connecting', Host: this.Host, Port: this.Port });
        const ClientSocket = new Socket();
        this.Socket = ClientSocket;
        ClientSocket.setNoDelay(true);

        ClientSocket.on('connect', () =>
        {
            this.ReceiveBuffer = '';
            this.SetStatus({ Phase: 'connected', Host: this.Host, Port: this.Port });
        });
        ClientSocket.on('data', (Chunk) => this.HandleData(Chunk));
        ClientSocket.on('error', (Error) =>
        {
            this.SetStatus({
                Phase: 'disconnected',
                Host: this.Host,
                Port: this.Port,
                LastError: Error.message,
            });
        });
        ClientSocket.on('close', () =>
        {
            if (this.Socket === ClientSocket)
            {
                this.Socket = undefined;
            }
            this.ScheduleReconnect();
        });

        ClientSocket.connect(this.Port, this.Host);
    }

    private ScheduleReconnect(): void
    {
        if (this.IsStopped == true || this.ReconnectTimer != null)
        {
            return;
        }

        if (this.Status.Phase !== 'disconnected')
        {
            this.SetStatus({ Phase: 'disconnected', Host: this.Host, Port: this.Port });
        }

        this.ReconnectTimer = setTimeout(() =>
        {
            this.ReconnectTimer = undefined;
            this.Connect();
        }, ReconnectDelayMilliseconds);
    }

    private SendLatestPayload(): void
    {
        if (this.Socket == null || this.Status.Phase !== 'connected')
        {
            return;
        }

        const Packet = Buffer.allocUnsafe(8 + (TrackingPayloadFloatCount * 4));
        Packet.writeInt32LE(TrackingProtocolId, 0);
        Packet.writeUInt32LE(TrackingPayloadFloatCount, 4);
        for (let Index = 0; Index < TrackingPayloadFloatCount; Index += 1)
        {
            Packet.writeFloatLE(this.LatestPayload[Index], 8 + (Index * 4));
        }
        this.Socket.write(Packet);
    }

    private HandleData(Chunk: Buffer): void
    {
        this.ReceiveBuffer += Chunk.toString('utf8');
        let NewlineIndex = this.ReceiveBuffer.indexOf('\n');
        while (NewlineIndex >= 0)
        {
            const Line = this.ReceiveBuffer.slice(0, NewlineIndex).replace(/\r$/, '');
            this.ReceiveBuffer = this.ReceiveBuffer.slice(NewlineIndex + 1);
            const Command = ParseTrackingCommand(Line);
            if (Command != null)
            {
                this.emit('command', Command);
            }
            NewlineIndex = this.ReceiveBuffer.indexOf('\n');
        }
    }

    private SetStatus(Status: TrackingConnectionStatus): void
    {
        this.Status = Status;
        this.emit('status', this.GetStatus());
    }
}

function ParseTrackingCommand(Line: string): TrackingCommand | undefined
{
    if (Line === 'quit')
    {
        return { Name: 'quit' };
    }

    const SeparatorIndex = Line.indexOf(':');
    if (SeparatorIndex < 0)
    {
        return undefined;
    }

    const Name = Line.slice(0, SeparatorIndex);
    if (
        Name !== 'setVideoVisible'
        && Name !== 'setFaceTracking'
        && Name !== 'setPoseTracking'
        && Name !== 'setHandTracking'
    )
    {
        return undefined;
    }

    return {
        Name,
        Value: Line.slice(SeparatorIndex + 1) === 'true',
    };
}
