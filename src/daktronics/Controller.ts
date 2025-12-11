import EventEmitter from 'events';
import { SerialPort } from 'serialport';
import Packet from './types/Packet';

interface ControllerEvents {
    /**
     * Runs when the serial connection to the controller has been established.
     * @param connection The raw [Node SerialPort](https://serialport.io/) connection.
     */
    connect: (connection: SerialPort) => void;
    /** Runs when the serial connection to the controller has been closed. */
    disconnect: () => void;
    /**
     * Runs when the serial connection encounters an error.
     * @param error The error encountered
     */
    error: (error: Error) => void;
    /**
     * Runs when a chunk of data is received from the controller. \
     * **NOTE** - This data might not be a full packet and could be cut off.
     * @param chunk The chunk of data received
     */
    chunk: (chunk: Buffer) => void;
    /**
     * Runs when a full packet has been received and parsed.
     * @param packet The parsed packet received
     */
    packet: (packet: Packet) => void;
    /**
     * Fires when a full packet is received and gives the raw string of a packet before parsing any further.
     * @param raw The raw, string data received from a packet
     */
    raw: (raw: string) => void;
}

/**
 * Handles the connection and parsing of data from a Daktronics All Sport 5000 controller.
 */
export class Controller extends EventEmitter {
    /** The port to attempt to connect to the controller on. */
    private port: string;

    /** The SerialPort instance reading the controller data. */
    private serial?: SerialPort;

    /** The current unfinished buffer being read by the parser. */
    private buffer: Buffer<ArrayBuffer> = Buffer.alloc(0);

    constructor(port: string) {
        super();
        this.port = port;
    }

    /**
     * Connects to a Daktronics All Sport 5000
     */
    public connect() {
        // Check for existing connections
        if (this.serial?.isOpen) {
            throw new Error(`Port ${this.port} is already connected`);
        }

        // Connect to the controller with the right settings
        this.serial = new SerialPort({
            path: this.port,
            baudRate: 19200,
            dataBits: 8,
            stopBits: 1,
            parity: 'none'
        });

        // Open connection
        this.serial.open(() => {
            // Connection opened
            this.emit('connect', this.serial!);
        });

        // Wait for incoming data
        this.serial.on('data', (chunk: Buffer) => {
            this.handleChunk(chunk);
        });

        // Wait for error
        this.serial.on('error', (error) => {
            this.emit('error', error);
        });

        // Wait for port close
        this.serial.on('close', () => {
            this.emit('disconnect');
        });
    }

    /** Disconnects from the controller and closes the underlying connection. */
    public disconnect() {
        // Check if this.serial exists
        if (!this.serial) return;

        // Check if it's opened
        if (this.serial.isOpen) {
            // Serial connection is open; close it
            this.serial.close();
        }

        // Reset values back to their starting points

        this.serial = undefined;
        this.buffer = Buffer.alloc(0);
    }

    /**
     * Handles when we receive a chunk of information from the controller.
     * A chunk does not necessarily mean a full message. One message can be split up between chunks.
     * The message content is determined by the start (\x16) and end (\x17) characters.
     *
     * @param chunk The Buffer that contains the data for this chunk
     */
    private handleChunk(chunk: Buffer) {
        // Emit the chunk event
        this.emit('chunk', chunk);

        // Add this chunk to the current packet
        this.buffer = Buffer.concat([this.buffer, chunk]);

        // Loop that keeps trying to extract full packets from the buffer.
        // If it finds one, it processes it and keeps going on to find new ones.
        while (true) {
            // Find the packet start and index
            const startIndex = this.buffer.indexOf(0x16);
            const endIndex = this.buffer.indexOf(0x17, startIndex);

            // If neither the start or end characters exist in the buffer
            // yet, we can't parse a complete packet, so break out of the loop.
            if (startIndex === -1 || endIndex === -1) break;

            // Extract a complete packet from the buffer from the start to end character
            const raw = this.buffer.slice(startIndex, endIndex + 1); // endIndex + 1 includes the end character byte

            // Remove the current packet from the buffer.
            // This ensures we don't process the same packet twice.
            this.buffer = this.buffer.slice(endIndex + 1);

            const packet = this.parseRawPacket(raw);

            if (packet) {
                // Call the sport-specific parsing method
                this.emit('packet', packet);
            }
        }
    }

    /**
     * Takes a raw packet and converts it into a {@link Packet}.
     * @param rawBuffer The raw buffer from the reader.
     * @returns The converted packet.
     */
    private parseRawPacket(rawBuffer: Buffer): Packet | null {
        // Convert buffer to string, using 'latin1' to preserve all control characters (like \x02, \x04, etc.)
        const raw = rawBuffer.toString('latin1');

        // Emit the raw packet event
        this.emit('raw', raw);

        // Split at the start-of-data marker (\x02)
        const parts = raw.split('\x02');
        if (parts.length < 2) return null;

        // Get the header string from before \x02
        const headerRaw = parts[0];

        // Everything after \x02 includes the main data + \x04 + checksum
        const dataAndChecksum = parts[1];

        // Find the location of \x04 (end of data marker)
        const checksumStart = dataAndChecksum.indexOf('\x04');
        if (checksumStart === -1) return null;

        // Slice out the raw data portion (excluding checksum)
        const dataRaw = dataAndChecksum.slice(0, checksumStart);

        // Parse known header fields

        // Skip \x16 (SYN), take next 10 characters = Display ID
        const displayId = headerRaw.slice(1, 11); // e.g., "0000000001"

        // Skip \x01 (SOH), take next 10 characters = Address
        const address = headerRaw.slice(12, 22); // e.g., "0042100000"

        // Get the last 3 digits of the header string as the data offset
        // This tells you the "starting item number" of the data section
        const offset = Number(headerRaw.slice(-3));

        // Return a fully structured object
        return {
            raw,
            header: {
                raw: headerRaw,
                displayId,
                address,
                offset
            },
            data: {
                raw: dataRaw
            }
        };
    }

    /* EVENT AUTOCOMPLETE */

    override on<K extends keyof ControllerEvents>(event: K, listener: ControllerEvents[K]): this {
        return super.on(event, listener);
    }

    override emit<K extends keyof ControllerEvents>(event: K, ...args: Parameters<ControllerEvents[K]>): boolean {
        return super.emit(event, ...args);
    }
}

export default Controller;
