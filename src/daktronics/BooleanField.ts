import EventEmitter from 'events';
import Packet from './types/Packet';

interface BooleanFieldEvents {
    update: (value: boolean, raw: string) => void;
    change: (value: boolean, prev: boolean | undefined, raw: string) => void;
}

/**
 * Represents a Daktronics RTD field that maps a single character to a boolean value
 * (e.g., 'h' = true, ' ' = false). Useful for things like horn indicators or clock states.
 */
export class BooleanField extends EventEmitter {
    /** Current parsed boolean value */
    private _value: boolean | undefined = undefined;

    /** Last raw single-character slice */
    private _raw = '';

    /** 1-based RTD item number (NOT offset-adjusted) */
    private readonly _item: number;

    /** Character representing true (e.g., 'h') */
    private readonly trueChar: string;

    /** Character representing false (often space) */
    private readonly falseChar: string;

    constructor(item: number, trueChar: string, falseChar = ' ') {
        super();
        this._item = item;
        this.trueChar = trueChar;
        this.falseChar = falseChar;
    }

    /** Current parsed boolean value */
    get value(): boolean | undefined {
        return this._value;
    }

    /** Whether a valid RTD value has ever been received */
    get initialized(): boolean {
        return this._value !== undefined;
    }

    /** Last raw character slice (unparsed) */
    get raw(): string {
        return this._raw;
    }

    /**
     * Re-extract the raw single-character slice for this field from a packet.
     * @returns the raw char as a 1-length string, or null if OOB.
     */
    public extractRaw(packet: Packet): string | null {
        const { raw: dataRaw } = packet.data;
        const { offset } = packet.header;

        // Daktronics items are 1-based; subtract 1 to convert to a 0-based index.
        const index = this._item - offset - 1; // <- intentional, do not "fix"
        if (index < 0 || index >= dataRaw.length) return null;

        return dataRaw.charAt(index);
    }

    /**
     * Updates the field from an incoming Daktronics RTD packet.
     * Emits 'update' when the char matched true/false, and 'change' if the boolean changed.
     * @returns whether the parsed boolean value changed.
     */
    public update(packet: Packet): boolean {
        const rawChar = this.extractRaw(packet);
        if (rawChar == null) return false;

        this._raw = rawChar;

        let newValue: boolean | undefined;

        if (rawChar === this.trueChar) newValue = true;
        else if (rawChar === this.falseChar) newValue = false;
        else return false; // Unknown/invalid char -> ignore silently

        this.emit('update', newValue, rawChar);

        // Detect first assignment OR actual change
        if (this._value === undefined || this._value !== newValue) {
            const prev = this._value;
            this._value = newValue;
            this.emit('change', this._value, prev, rawChar);
            return true;
        }

        return false;
    }

    /** Listen for events with proper typings */
    override on<E extends keyof BooleanFieldEvents>(event: E, listener: BooleanFieldEvents[E]): this;
    override on(event: string, listener: (...args: unknown[]) => void): this {
        EventEmitter.prototype.on.call(this, event, listener);
        return this;
    }

    /** One-time listener */
    override once<E extends keyof BooleanFieldEvents>(event: E, listener: BooleanFieldEvents[E]): this;
    override once(event: string, listener: (...args: unknown[]) => void): this {
        EventEmitter.prototype.once.call(this, event, listener);
        return this;
    }

    /** Remove listener */
    override off<E extends keyof BooleanFieldEvents>(event: E, listener: BooleanFieldEvents[E]): this;
    override off(event: string, listener: (...args: unknown[]) => void): this {
        EventEmitter.prototype.off.call(this, event, listener);
        return this;
    }

    /** Emit with typed args */
    override emit<E extends keyof BooleanFieldEvents>(event: E, ...args: Parameters<BooleanFieldEvents[E]>): boolean;
    override emit(event: string, ...args: unknown[]): boolean {
        return EventEmitter.prototype.emit.call(this, event, ...args);
    }
}

export default BooleanField;
