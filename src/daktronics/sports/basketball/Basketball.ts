import BooleanField from '../../BooleanField';
import Field from '../../Field';
import Sport from '../Sport';
import BasketballPlayerFieldGroup from './BasketballPlayerFieldGroup';

export class Basketball extends Sport {
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
        shot: {
            /** Shot Clock Time (mm:ss) */
            shotClockTime: new Field(201, 8, 'L', ''),
            /** Shot Clock Horn (' ' or 'h') */
            shotClockHorn: new BooleanField(209, 'h')
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
        /** The team's score */
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
            active: new BooleanField(132, '<'),
            /** Home Time Out Text (' ' or 'TIME') */
            text: new Field(133, 4, 'L', '')
        },
        possession: {
            /** Home Possession Indicator (' ' or '<') */
            indicator: new BooleanField(210, '<'),
            /** Home Possession Arrow (' ' or '<') */
            arrow: new BooleanField(211, '<'),
            /** Home Possession Text (' ' or 'POSS') */
            text: new Field(212, 4, 'L', '')
        },
        bonus: {
            /** Home 1-on-1 Bonus Indicator (' ' or '<') */
            oneOnOne: new BooleanField(222, '<'),
            /** Home 2-shot Bonus Indicator (' ' or '<') */
            twoShot: new BooleanField(223, '<'),
            /** Home Bonus Text (' ' or 'BONUS') */
            text: new Field(224, 5, 'L', '')
        },
        fouls: {
            /** Home Team Fouls */
            team: new Field(236, 2, 'R', 0, Number),
            /** Home Player-Foul-Points ('nn-nn-nn') */
            playerFoulPoints: new Field(240, 8, 'L', '')
        },
        scoreByPeriod: {
            /** Home Score - Current Period */
            current: new Field(282, 2, 'R', 0, Number),
            /** Home Score - Period 1 */
            period1: new Field(264, 2, 'R', 0, Number),
            /** Home Score - Period 2 */
            period2: new Field(266, 2, 'R', 0, Number),
            /** Home Score - Period 3 */
            period3: new Field(268, 2, 'R', 0, Number),
            /** Home Score - Period 4 */
            period4: new Field(270, 2, 'R', 0, Number),
            /** Home Score - Period 5 */
            period5: new Field(272, 2, 'R', 0, Number),
            /** Home Score - Period 6 */
            period6: new Field(274, 2, 'R', 0, Number),
            /** Home Score - Period 7 */
            period7: new Field(276, 2, 'R', 0, Number),
            /** Home Score - Period 8 */
            period8: new Field(278, 2, 'R', 0, Number),
            /** Home Score - Period 9 */
            period9: new Field(280, 2, 'R', 0, Number),
        },
        /** The players configured as being currently in-game via `MASS SUB.` and `INDIV. SUB.` */
        inGame: Array.from({ length: 5 }, (_, i) => {
            const startItem = 304 + i * 7;
            return new BasketballPlayerFieldGroup(startItem);
        }),
        /** The players configured as being on this team via `MENU > SELECT HOME > EDIT PLAYERS?` */
        roster: Array.from({ length: 15 }, (_, i) => {
            const startItem = 346 + i * 7;
            return new BasketballPlayerFieldGroup(startItem);
        })
    };

    /** Guest team metadata and stats */
    public readonly guest = {
        /** The team's full name. */
        name: new Field(68, 20, 'L', ''),
        /** The team's abbreviated name. */
        abbreviation: new Field(98, 10, 'L', ''),
        /** The team's score */
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
            active: new BooleanField(137, '>'),
            /** Guest Time Out Text (' ' or 'TIME') */
            text: new Field(138, 4, 'L', '')
        },
        possession: {
            /** Guest Possession Indicator (' ' or '>') */
            indicator: new BooleanField(216, '>'),
            /** Guest Possession Arrow (' ' or '>') */
            arrow: new BooleanField(217, '>'),
            /** Guest Possession Text (' ' or 'POSS') */
            text: new Field(218, 4, 'L', '')
        },
        bonus: {
            /** Guest 1-on-1 Bonus Indicator (' ' or '>') */
            oneOnOne: new BooleanField(229, '>'),
            /** Guest 2-shot Bonus Indicator (' ' or '>') */
            twoShot: new BooleanField(230, '>'),
            /** Guest Bonus Text (' ' or 'BONUS') */
            text: new Field(231, 5, 'L', '')
        },
        fouls: {
            /** Guest Team Fouls */
            team: new Field(238, 2, 'R', 0, Number),
            /** Guest Player-Foul-Points ('nn-nn-nn') */
            playerFoulPoints: new Field(248, 8, 'L', '')
        },
        // scoreByPeriod: {
        //     /** Guest Score - Current Period */
        //     current: new Field(302, 2, 'R', 0, Number),
        //     /** Guest Score - Period 1 */
        //     period1: new Field(284, 2, 'R', 0, Number),
        //     /** Guest Score - Period 2 */
        //     period2: new Field(286, 2, 'R', 0, Number),
        //     /** Guest Score - Period 3 */
        //     period3: new Field(288, 2, 'R', 0, Number),
        //     /** Guest Score - Period 4 */
        //     period4: new Field(290, 2, 'R', 0, Number),
        //     /** Guest Score - Period 5 */
        //     period5: new Field(292, 2, 'R', 0, Number),
        //     /** Guest Score - Period 6 */
        //     period6: new Field(294, 2, 'R', 0, Number),
        //     /** Guest Score - Period 7 */
        //     period7: new Field(296, 2, 'R', 0, Number),
        //     /** Guest Score - Period 8 */
        //     period8: new Field(298, 2, 'R', 0, Number),
        //     /** Guest Score - Period 9 */
        //     period9: new Field(300, 2, 'R', 0, Number),
        // },
        /** The players configured as being currently in-game via `MASS SUB.` and `INDIV. SUB.` */
        inGame: Array.from({ length: 5 }, (_, i) => {
            const startItem = 475 + i * 7;
            return new BasketballPlayerFieldGroup(startItem);
        }),
        /** The players configured as being on this team via `MENU > SELECT GUEST > EDIT PLAYERS?` */
        roster: Array.from({ length: 15 }, (_, i) => {
            const startItem = 517 + i * 7;
            return new BasketballPlayerFieldGroup(startItem);
        })
    };

    /** Overall match/game information */
    public readonly game = {
        /** The period the current game is in (ex: 1, 2, 3..) */
        period: new Field(142, 2, 'R', 0, Number),
        /** The period the current game is in including ordinals (ex: '1st', 'OT', 'OT/2'...) */
        periodText: new Field(144, 4, 'L', ''),
        /** Description for the currnet period the game is in (ex: 'End of 1st') */
        periodDescription: new Field(148, 12, 'L', ''),
        /** Internal Relay (' ' or 'z', 's', 'h') */
        internalRelay: new Field(160, 1, 'L', ''),
        adPanels: {
            /** Ad Panel / Caption Power ('c') */
            adPanelCaptionPower: new BooleanField(161, 'c'),
            /** Ad Panel / Caption #1 (' ' or 'c') */
            adPanelCaption1: new BooleanField(162, 'c'),
            /** Ad Panel / Caption #2 (' ' or 'c') */
            adPanelCaption2: new BooleanField(163, 'c'),
            /** Ad Panel / Caption #3 (' ' or 'c') */
            adPanelCaption3: new BooleanField(164, 'c'),
            /** Ad Panel / Caption #4 (' ' or 'c') */
            adPanelCaption4: new BooleanField(165, 'c')
        }
    };
}

export default Basketball;
