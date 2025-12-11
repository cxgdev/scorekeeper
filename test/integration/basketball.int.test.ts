import { describe, test } from 'vitest';
import Controller, { Basketball } from '../../src/daktronics';
import Field from '../../src/daktronics/Field';

const devCOMPort = 'COM3';

function testField<T>(field: Field<T>, expected: string | number | boolean, label: string) {
    return new Promise((resolve) => {
        console.log(`${label} - ${expected}`);
        field.on('update', (value) => {
            if (value === expected) {
                resolve(`✅ Got expected value "${expected}" from field ${field.constructor.name}!`);
            }
        });
    });
}

describe('basketball', () => {
    const controller = new Controller(devCOMPort);
    const basketball = new Basketball(controller);

    controller.connect();

    describe('clock', () => {
        test('clock.short', async () => await testField(basketball.clock.short, '00:30', 'clock.short'));
        test('clock.long', async () => await testField(basketball.clock.short, '00:30.0', 'clock.long'));
    });
});
