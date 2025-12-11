import Controller from '../Controller';
import Packet from '../types/Packet';
import Field from '../Field';
import BooleanField from '../BooleanField';

export default abstract class Sport {
    private controller: Controller;

    constructor(controller: Controller) {
        this.controller = controller;

        // Wait for a packet then parse it
        this.controller.on('packet', (packet) => {
            this.parsePacket(packet);
        });
    }

    /**
     * Takes a packet from the controller and reads the data we can get from the sport.
     * @param packet The full packet read from the controller
     */
    private parsePacket(packet: Packet): void {
        this.updateFields(this, packet);
    }

    // ---------- Type guards ----------

    private isField(v: unknown): v is Field<string | number> {
        return v instanceof Field;
    }

    private isBooleanField(v: unknown): v is BooleanField {
        return v instanceof BooleanField;
    }

    private isObjectRecord(v: unknown): v is Record<string, unknown> {
        return typeof v === 'object' && v !== null && !Array.isArray(v);
    }

    /**
     * Automatically updates any `Field` / `BooleanField` items inside a structure.
     * Walks arrays and plain objects recursively. Uses type guards to avoid "unsafe-argument".
     * @param obj The structure to search
     * @param packet The packet to update from
     */
    private updateFields(obj: unknown, packet: Packet): void {
        if (Array.isArray(obj)) {
            for (const entry of obj) {
                this.updateFields(entry, packet);
            }
            return;
        }

        if (this.isField(obj) || this.isBooleanField(obj)) {
            obj.update(packet);
            return;
        }

        if (this.isObjectRecord(obj)) {
            for (const value of Object.values(obj)) {
                this.updateFields(value, packet);
            }
        }
    }

    /**
     * Returns a given field from the packet
     * @param packet The packet to retreive the field from
     * @param item The starting index of the field (or item number as seen in Daktronics RTD documentation)
     * @param length The length of the field
     * @param justify The justification, or alignment, of the field. Determines where whitespace will be trimmed
     */
    protected getField(packet: Packet, item: number, length: number, justify?: 'L' | 'R'): string | null {
        const { raw: dataRaw } = packet.data;
        const { offset } = packet.header;

        const start = item - offset - 1;
        const end = start + length;

        if (start < 0 || end > dataRaw.length) return null;

        const raw = dataRaw.slice(start, end);

        if (justify === 'R')
            return raw.trimStart(); // right-justified
        else return raw.trimEnd(); // left-justified
    }
}
