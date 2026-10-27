# FRAS — Facial Recognition Attendance System

An interactive, **front-end-only prototype** of the attendance system designed for the CPEN 491 Senior Design project at Universidad Ana G. Méndez, Gurabo.

**[Open the live demo](https://pologram1.github.io/FRAS-Demo/)**

## Quick start

1. Clone or download this repository.
2. Open `index.html` in a modern browser (no installation or build step).
3. Enter any demo email/password and select **Professor** or **Administrator**. The login is a role selector, **not authentication**.
4. As Professor, open **Sessions**, start a session, simulate recognition or flag a student, then open **Review attendance**.

## Project structure

```text
FRAS-Demo/
├── index.html            # Semantic page shell, login and app containers
├── css/
│   └── styles.css        # Layout, responsive styles, cards and tables
├── js/
│   └── app.js            # State, rendering, navigation and demo actions
├── docs/
│   └── ARCHITECTURE.md   # UI flow, implementation notes and limitations
└── README.md             # Project overview and local setup
```

## Features

| Professor | Administrator |
| --- | --- |
| My Sections / Dashboard | System dashboard |
| Start and close attendance sessions | Simulated facial-data enrollment |
| Simulated recognition and flagged matches | Fictional course roster and sync |
| Session Overview and Review Attendance tabs | Simulated user account management |
| Manual corrections and attendance reports | Local demo backup snapshots |
| CSV export and print-to-PDF | Backup download and restore |

## Important limitations

- **No real facial recognition or camera capture.** Student portraits are generated illustrations, not photographs.
- **No backend or database.** Attendance and account changes reset when the page reloads.
- **No real security.** The demo login does not validate credentials or enforce server-side authorization.
- **No university integration.** Course data, students, sync operations, and administrative tools are simulations.
- Reports can be exported as CSV; PDF output uses the browser's print/save-as-PDF function.
- The prototype is **not suitable for real student attendance or biometric processing**.

## Contributors

Ricardo J. Lopez Ortiz and Miguel A. de Jesus Rosa — CPEN 491, Universidad Ana G. Méndez, Gurabo.

## Contributing

For a change, open an issue describing the proposed improvement. Keep demo data fictional, preserve both user roles, and verify the navigation and review workflows in a browser before opening a pull request.
