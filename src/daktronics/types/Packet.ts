export interface Packet {
    /** The full raw packet string, from \x16 to \x17 */
    raw: string;
    /** Header portion, before \x02 (usually starts with \x16 and includes display ID + address) */
    header: {
        /** Raw header from the packet */
        raw: string;
        displayId: string;
        address: string;
        offset: number;
    };
    /** Main data body, between \x02 and \x04 */
    data: {
        raw: string;
    };
}

export default Packet;
