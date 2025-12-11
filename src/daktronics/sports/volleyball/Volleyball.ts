import BooleanField from '../../BooleanField';
import Field from '../../Field';
import Sport from '../Sport';
import VolleyballPlayerFieldGroup from './VolleyballPlayerFieldGroup';

export class Volleyball extends Sport {
    /** Data about the main clock, timeouts, and horn status */
    public readonly clock = {
        /** Main Clock Time (mm:ss/ss.t) */
        short: new Field(1, 5, 'L', ''),
        /** Main Clock Time (mm:ss.t) */
        long: new Field(6, 8, 'L', ''),
        withTimeoutsAndTOD: {
            /** Main Clock/Time Out/TOD (mm:ss/ss.t) */
            short: new Field(14, 5, 'L', ''),
            /** Main Clock/Time Out/TOD (mm:ss.t) */
            long: new Field(19, 8, 'L', '')
        },
        /** Main Clock = 0 (' ' or 'z') */
        zero: new BooleanField(27, 'z'),
        /** Main Clock Stopped (' ' or 's') */
        stopped: new BooleanField(28, 's'),
        horn: {
            /** Main Clock/Time Out Horn (' ' or 'h') */
            mainClockOrTimeoutHorn: new BooleanField(29, 'h'),
            /** Main Clock Horn (' ' or 'h') */
            mainClockHorn: new BooleanField(30, 'h'),
            /** Time Out Horn (' ' or 'h') */
            timeoutHorn: new BooleanField(31, 'h')
        },
        /** Time Out Time (mm:ss) */
        timeoutTime: new Field(32, 8, 'L', ''),
        /** Time of Day (hh:mm:ss) */
        timeOfDay: new Field(40, 8, 'L', '')
    };

    /** Home team metadata and stats */
    public readonly home = {
        /** The team's full name. */
        name: new Field(48, 20, 'L', ''),
        /** The team's abbreviated name. */
        abbreviation: new Field(88, 10, 'L', ''),
        /** The team's score for the current set. */
        score: new Field(108, 4, 'R', 0, Number),
        timeouts: {
            /** The amount of FULL timeouts this team has remaining. */
            full: new Field(116, 2, 'R', 0, Number),
            /** The amount of PARTIAL timeouts this team has remaining. */
            partial: new Field(118, 2, 'R', 0, Number),
            /** The amount of TELEVISION timeouts this team has remaining. */
            television: new Field(120, 2, 'R', 0, Number),
            /** The total amount of timeouts this team has remaining. */
            total: new Field(122, 2, 'R', 0, Number),
            /** Whether this team currently has an active timeout running. */
            active: new BooleanField(132, '<')
        },
        /** Whether this team's serve indicator is on. */
        serving: new BooleanField(201, '<'),
        /** Number of sets this team has won */
        setsWon: new Field(215, 2, 'R', 0, Number),
        roster: Array.from({ length: 15 }, (_, i) => {
            const startItem = 304 + i * 7;
            return new VolleyballPlayerFieldGroup(startItem);
        }),
        inGamePlayers: Array.from({ length: 6 }, (_, i) => {
            const startItem = 262 + i * 7;
            return new VolleyballPlayerFieldGroup(startItem);
        })
    };

    /** Guest team metadata and stats */
    public readonly guest = {
        /** The team's full name. */
        name: new Field(68, 20, 'L', ''),
        /** The team's abbreviated name. */
        abbreviation: new Field(98, 10, 'L', ''),
        /** The team's score for the current set. */
        score: new Field(112, 4, 'R', 0, Number),
        timeouts: {
            /** The amount of FULL timeouts this team has remaining. */
            full: new Field(124, 2, 'R', 0, Number),
            /** The amount of PARTIAL timeouts this team has remaining. */
            partial: new Field(126, 2, 'R', 0, Number),
            /** The amount of TELEVISION timeouts this team has remaining. */
            television: new Field(128, 2, 'R', 0, Number),
            /** The total amount of timeouts this team has remaining. */
            total: new Field(130, 2, 'R', 0, Number),
            /** Whether this team currently has an active timeout running. */
            active: new BooleanField(137, '>')
        },
        /** Whether this team's serve indicator is on. */
        serving: new BooleanField(208, '>'),
        /** Number of sets this team has won */
        setsWon: new Field(217, 2, 'R', 0, Number),
        /** This team's roster of players, including their stats */
        roster: Array.from({ length: 15 }, (_, i) => {
            const startItem = 471 + i * 7;
            return new VolleyballPlayerFieldGroup(startItem);
        }),
        /** This team's roster of players in-game, including their stats */
        inGamePlayers: Array.from({ length: 6 }, (_, i) => {
            const startItem = 429 + i * 7;
            return new VolleyballPlayerFieldGroup(startItem);
        })
    };

    /** Overall match/game information */
    public readonly game = {
        /** Current Game Number */
        number: new Field(142, 2, 'R', 0, Number),
        /** Match Number */
        matchNumber: new Field(219, 3, 'R', 0, Number),
        /** Home Score - Current Game */
        homeSets: new Field(240, 2, 'R', 0, Number),
        /** Guest Score - Current Game */
        guestSets: new Field(260, 2, 'R', 0, Number)
    };
}

export default Volleyball;
