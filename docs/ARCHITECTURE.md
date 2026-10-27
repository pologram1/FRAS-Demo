# FRAS demo architecture

## Design reference

The interface is based on the **FRAS Presentation #2** wireframes (pages 9–18). The main workflows are: login → sections → session → simulated capture/recognition → review/correction → reports. The administrator can inspect simulated enrollment, courses, accounts, and backups.

## Files and responsibilities

- `index.html`: HTML document, header, login form, navigation container, and main content container. Loads styles and script using relative paths compatible with GitHub Pages.
- `css/styles.css`: Shared visual language: charcoal header/navigation, white panels, orange accents, responsive layout.
- `js/app.js`: State variables, render function, role-specific page templates, session/review actions, CSV export, and admin simulations.

## UI state

The demo uses in-memory JavaScript variables for `role`, `page`, `session`, `records`, `flagged`, `preview`, `users`, and `backups`. `render()` rebuilds the current page. `nav()` and `sessionTab()` switch views.

### Professor

1. Select Professor on the demo login.
2. Start the sample CPEN 491-001 session.
3. Simulate recognition or flag a low-confidence match.
4. Open **Review attendance** from within **Sessions** to confirm/reject flags and correct statuses.
5. Close the session to mark unseen students absent; export reports as CSV.

### Administrator

1. Select Administrator on the demo login.
2. Explore the dashboard and simulated facial-data enrollment (consent checkbox + three illustrated reference-image slots).
3. View fictional course data, manage demo accounts, and create/download/restore in-memory backup snapshots.

## What is NOT implemented

No secure authentication, real-time camera stream, actual face detection/recognition, student biometric storage, university APIs, persistent database, or production-grade backups. The UI is for demonstrating interaction flows only.

## Maintenance guidelines

- Keep visual styles in `css/styles.css` and behavior in `js/app.js`.
- Use fictional data and clearly label simulated behavior.
- Do not claim real biometric accuracy or university connectivity.
- Verify both roles, tab navigation, flagged portraits, manual review, export, and mobile layout after changes.
