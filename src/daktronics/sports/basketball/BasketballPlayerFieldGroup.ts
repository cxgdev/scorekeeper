import BooleanField from '../../BooleanField';
import Field from '../../Field';
import Packet from '../../types/Packet';

/** Represents a group of players and their data. */
export class BasketballPlayerFieldGroup {
    /** Whether this player is currently marked as in-game */
    public readonly status: BooleanField;
    /** Player's number represented as a two character long string. */
    public readonly number: Field<string>;
    /** How many fouls this player has committed */
    public readonly fouls: Field<number>;
    /** How many points this player has scored */
    public readonly points: Field<number>;

    constructor(startItem: number) {
        this.status = new BooleanField(startItem, '>');
        this.number = new Field(startItem + 1, 2, 'R', '');
        this.fouls = new Field(startItem + 3, 2, 'R', 0, Number);
        this.points = new Field(startItem + 5, 2, 'R', 0, Number);
    }

    public update(packet: Packet) {
        this.status.update(packet);
        this.number.update(packet);
        this.fouls.update(packet);
        this.points.update(packet);
    }

    public toObject() {
        return {
            number: this.number.value,
            status: this.status.value,
            fouls: this.fouls.value,
            points: this.points.value
        };
    }
}

export default BasketballPlayerFieldGroup;
