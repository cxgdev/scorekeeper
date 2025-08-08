import EventEmitter from 'events';
import Packet from './types/Packet';

interface FieldEvents<DataType> {
    /**
     * Fired on every packet that successfully maps to this field (even if value didn't change).
     * @param value The parsed value of the field
     * @param raw The raw, unformatted value
     */
    update: (value: DataType, raw: string) => void;
    /**
     * Fired only when the parsed value changes.
     * @param value The new parsed value.
     * @param prev The previous value
     * @param raw The raw, unformatted value
     */
    change: (value: DataType, prev: DataType, raw: string) => void;
}

export class Field<DataType> extends EventEmitter {
    /** The current parsed value of this field */
    private _value: DataType;

    /** The last raw slice (unparsed, untrimmed) of this field */
    private _raw: string = '';

    /** 1-based RTD item index (see Daktronics docs) */
    private readonly _item: number;

    /** Fixed field length in bytes/chars */
    private readonly _length: number;

    /** Justification in the RTD payload */
    private readonly _justify: 'L' | 'R';

    /** Parse from trimmed raw -> DataType */
    private readonly _parser: (raw: string) => DataType;

    /** Equality comparator for DataType (default: strict ===) */
    private readonly _equals: (a: DataType, b: DataType) => boolean;

    constructor(
        item: number,
        length: number,
        justify: 'L' | 'R',
        initial: DataType,
        parser: (raw: string) => DataType = (v) => v as unknown as DataType,
        equals: (a: DataType, b: DataType) => boolean = (a, b) => a === b
    ) {
        super();
        this._item = item;
        this._length = length;
        this._justify = justify;
        this._value = initial;
        this._parser = parser;
        this._equals = equals;
    }

    /** Current parsed value */
    get value(): DataType {
        return this._value;
    }

    /** Last raw slice (unparsed, untrimmed) */
    get raw(): string {
        return this._raw;
    }

    /** Recompute the raw slice for this field from a packet (or null if OOB). */
    private extractRaw(packet: Packet): string | null {
        const { raw: dataRaw } = packet.data;
        const { offset } = packet.header;

        // Daktronics items are 1-based; subtract 1 to convert to 0-based index.
        const start = this._item - offset - 1;
        const end = start + this._length;

        if (start < 0 || end > dataRaw.length) return null;
        return dataRaw.slice(start, end);
    }

    /**
     * Update the field from a packet.
     * @returns whether the parsed value changed.
     */
    public update(packet: Packet): boolean {
        const raw = this.extractRaw(packet);
        if (raw == null) return false;

        // Always store the raw slice, even if it trims to empty.
        this._raw = raw;

        // Right-justified = left padding spaces, left-justified = right padding spaces.
        const trimmed = this._justify === 'R' ? raw.trimStart() : raw.trimEnd();

        if (!trimmed.length) return false;

        let newValue: DataType;

        try {
            newValue = this._parser(trimmed);
        } catch {
            return false;
        }

        // Emit update for every successful parse
        this.emit('update', newValue, raw);

        // Emit change only when different
        if (!this._equals(this._value, newValue)) {
            const prev = this._value;
            this._value = newValue;
            this.emit('change', this._value, prev, raw);
            return true;
        }

        return false;
    }

    /** String representation of the parsed value */
    toString(): string {
        return String(this._value);
    }

    override on<K extends keyof FieldEvents<DataType>>(event: K, listener: FieldEvents<DataType>[K]): this {
        return super.on(event, listener);
    }

    override emit<K extends keyof FieldEvents<DataType>>(event: K, ...args: Parameters<FieldEvents<DataType>[K]>): boolean {
        return super.emit(event, ...args);
    }
}

export default Field;
