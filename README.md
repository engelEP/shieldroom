# Radiation Shielding Calculator (desktop)

Desktop estimator of structural shielding for medical imaging rooms. You choose a modality, then enter workload, distances, occupancy, and barrier material. The app returns the barrier thickness and the intermediate values from NCRP 147 and AAPM TG-108.

It covers diagnostic x-ray rooms (radiographic, fluoroscopy, mammography, and dental), CT (DLP method), PET (F-18), and SPECT (Tc-99m). The result is a preliminary planning aid. A qualified medical physicist still has to check it.

This is an Electron + React + Vite + TypeScript rewrite of [https://shielding.radiologyphys.com/](https://shielding.radiologyphys.com/).

## Local setup

Node 26 is pinned in `.nvmrc` (`engines` allows `>=26 <27`). The package manager is pnpm 10.27.0 (`packageManager` in `package.json`). There is no environment file.

```bash
nvm use
corepack enable
pnpm install
pnpm dev
```

`pnpm dev` opens the Electron window with hot reload.

## Scripts

```bash
pnpm test          # parity tests; they still load the removed reference page
pnpm typecheck     # main, renderer and tests
pnpm lint
pnpm build         # typecheck + production bundle in out/
pnpm dist          # build + installers (electron-builder)
```

## Windows build

`pnpm build:win` produces one portable executable, `dist/Radiation Shielding Calculator <version>.exe`. That file contains the app and can be copied to another 64-bit Windows PC and run without installing. The same command also writes `dist/win-unpacked/`; the single `.exe` does not depend on that folder.

It builds from Linux/WSL without Wine. Builds are unsigned, so Windows SmartScreen asks for confirmation on first run.

## Layout

```
src/main/                 Electron main process (sandboxed window, external links open in the browser)
src/preload/              Empty; the renderer needs no privileged APIs
src/renderer/src/
  physics/                Pure TypeScript engine, no DOM access
    data/                 NCRP 147, TG-108, Oumano 2025 and Kusano & Caldwell 2014 tables
    math.ts               Archer transmission/thickness, TVL, lead sheet lookup
    diagnostic.ts         Radiographic, fluoroscopy, mammography, dental rooms
    ct.ts                 CT (DLP method)
    pet.ts                PET (F-18)
    spect.ts              SPECT (Tc-99m)
    index.ts              calculateShielding(input) dispatcher
  hooks/
    formState.ts          Pure form reducer: defaults per modality, presets, visibility
    useShieldingForm.ts   React binding of the reducer and the engine
  components/
    form/                 FormField, SelectField, NumberField and modality sections
    results/              ResultsCard, ResultRow, panels and one component per result type
    reference/            NCRP reference tables
    layout/               Navbar
  styles/app.css          Custom styles (no Bootstrap)
tests/
  legacyHarness.ts        Loads the reference index.html in jsdom (read-only)
  parity.test.ts          Compares tables, math, form behaviour and results with the original
```

## Parity tests

Each test case applies the same sequence of form edits to the original page (via DOM
`change` events) and to `formReducer`, then checks that:

- every form value matches (modality defaults, CBCT and SPECT presets, x_pre defaults),
- field visibility and material availability match,
- `runCalculation` returns exactly the object (or error message) that the original
  `calculate()` produces.

The data tables and math helpers are also compared verbatim. The suite reads
`original/index.html` at the project root (`tests/legacyHarness.ts`). That copy
is no longer in the repo, so `pnpm test` fails until the file is restored.

The engine reproduces the original behaviour exactly, including its quirks (for example,
steel and gypsum primary barriers use secondary-barrier fits, and a custom use factor
selects the wall K1 value). Change the engine only together with the corresponding test
expectations.
