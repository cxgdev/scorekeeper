import BooleanField from '../BooleanField';
import Field from '../Field';
import Packet from '../types/Packet';

export class VolleyballPlayerFieldGroup {
    public readonly status: BooleanField;
    public readonly number: Field<string>;
    /** A value that can be defined in the All Sport console settings under `MENU` > `EDIT SETTINGS?` > `USER DEF 1` or `USER DEF 2` */
    public readonly userDefined1: Field<string>;
    /** A value that can be defined in the All Sport console settings under `MENU` > `EDIT SETTINGS?` > `USER DEF 1` or `USER DEF 2` */
    public readonly userDefined2: Field<string>;

    constructor(startItem: number) {
        this.status = new BooleanField(startItem, '>');
        this.number = new Field(startItem + 1, 2, 'R', '');
        this.userDefined1 = new Field(startItem + 3, 2, 'R', '');
        this.userDefined2 = new Field(startItem + 5, 2, 'R', '');
    }

    public update(packet: Packet) {
        this.status.update(packet);
        this.number.update(packet);
        this.userDefined1.update(packet);
        this.userDefined2.update(packet);
    }

    public toObject() {
        return {
            number: this.number.value,
            status: this.status.value,
            user1: this.userDefined1.value,
            user2: this.userDefined2.value
        };
    }
}

export default VolleyballPlayerFieldGroup;
