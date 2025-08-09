<h1 align="center">
Scorekeeper
</h1>

<p align="center">A TypeScript module for interfacing with Daktronics scoreboard controllers (and possibly more in the future).</p>

<p align="center">
    <img src="https://img.shields.io/github/v/release/cxgdev/scorekeeper?include_prereleases&logo=github" align="center">
    <img src="https://img.shields.io/npm/v/%40cxgdev%2Fscorekeeper?logo=npm" align="center">
    <img src="https://img.shields.io/github/actions/workflow/status/cxgdev/scorekeeper/ci.yml?logo=github" align="center">
    <img src="https://img.shields.io/github/last-commit/cxgdev/scorekeeper?logo=github" align="center">
    <img src="https://img.shields.io/github/contributors/cxgdev/scorekeeper?logo=github" align="center">
</p>

---

> ✏️ **NOTE** - Scorekeeper is in active development. Any contributions are appreciated!

## Features

- Volleyball integration for Daktronics All Sport 5000
- Type-safe, event-driven API
- Easily extendable to other sports
- Works with Node.js + TypeScript out of the box

## Supported Sports

- All Sport 5000
    - 🏐 Volleyball

While Scorekeeper only supports volleyball at the moment, more sports are planned and will be added in the very near future.

## Installation

### Using NPM

`npm install @cxgdev/scorekeeper@alpha`

### Using pnpm

`pnpm add @cxgdev/scorekeeper@alpha`

## Connecting a Console

Consoles are connected with a Serial to USB cable.

**Daktronics All Sport 5000** - Connect to the port labeled I/O Port (J6) with a DB25 to DB9 serial connector.

## Usage

```ts
import Controller, { Volleyball } from '@cxgdev/scorekeeper/daktronics';

// Use the COM port the controller is connected to
const controller = new Controller('COM1');
controller.connect();

const volleyball = new Volleyball(controller);

volleyball.homeTeam.score.on('change', (score) => {
    console.log(`The home team's score is now ${score}`);
});
```

## API

While Scorekeeper gives you APIs to read sport-specific data, you can also parse the packets yourself by listening to the `packet` event:

```ts
const controller = new Controller('COM1');
controller.connect();

// Executes when a full packet is received from the controller
controller.on('packet', (packet) => {
    // Read data from the packet here
});
```

Alternatively, you can use some of the lower-level events the `Controller` class has to offer, such as `connect`, `chunk`, or `raw`. Documentation for these events are available in your IDE.
