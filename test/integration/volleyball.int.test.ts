import { describe, test } from 'vitest';
import Controller, { Volleyball } from '../../src/daktronics';

/* more tests will be added Soon(TM) */

const devCOMPort = 'COM3';

describe('volleyball', () => {
    test('clock.short', async () => {
        return new Promise((resolve, reject) => {
            const controller = new Controller(devCOMPort);
            const volleyball = new Volleyball(controller);
            controller.connect();

            volleyball.clock.short.on('update', (clock) => {
                if (clock === '12:34') {
                    resolve(`✅ Got "12:34" from clock.short!`)
                } else {
                    reject(`🚫 Expected "12:34" but got "${clock}". Check the controller settings and make sure the main clock is set to 12:34.`);
                }
            });
        });
    });
});
