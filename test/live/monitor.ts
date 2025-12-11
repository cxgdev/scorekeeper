import blessed from 'blessed';
import Controller, { Basketball, BooleanField, Field } from '../../src/daktronics';

const screen = blessed.screen({
    smartCSR: true,
    title: '[SCOREKEEPER] Live Monitor'
});

const table = blessed.box({
    parent: screen,
    width: '100%',
    height: '100%',
    scrollable: true,
    alwaysScroll: true,
    mouse: true,
    keys: true,
    vi: true,
    tags: true,
    border: {
        type: 'line'
    },
    scrollbar: {
        ch: ' ',
        track: { bg: 'gray' },
        style: { bg: 'white' }
    },
});

const controller = new Controller('COM3');
const basketball = new Basketball(controller);
controller.connect();

// Not dev-facing, so I'm okay with using any here
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function collectFields(obj: any, prefix = ""): any[] {
    const out = [];

    for (const key of Object.keys(obj)) {
        const value = obj[key];
        const path = prefix ? `${prefix}.${key}` : key;

        if (value instanceof Field || value instanceof BooleanField) {
            out.push({
                label: path,
                field: value,
                lastUpdated: '—'
            });
        } else if (typeof value === "object" && value !== null) {
            out.push(...collectFields(value, path));
        }
    }
    return out;
}

const fields = collectFields(basketball);

function render() {
    const rows: string[] = [];

    // Header row
    rows.push(
        `{bold}${'PROPERTY'.padEnd(40)}  ${'VALUE'.padEnd(20)}  LAST UPDATED{/}`
    );

    for (const entry of fields) {
        const label = entry.label.padEnd(40);
        const value = (entry.field.initialized ? String(entry.field.value) : '—').padEnd(20);
        const updated = entry.lastUpdated ?? '—';

        rows.push(`${label}  ${value}  ${updated}`);
    }

    table.setContent(rows.join("\n"));
    screen.render();
}

for (const entry of fields) {
    entry.field.on("update", () => {
        entry.lastUpdated = new Date().toLocaleTimeString();
        render();
    });
}

screen.key(['escape', 'q', 'C-c'], () => {
    screen.destroy();
    process.exit(0);
});

render();
