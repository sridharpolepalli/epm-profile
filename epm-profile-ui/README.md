# EPM Profile UI

Angular 16 SPA for the EPM Profile application. Secured with Keycloak (Authorization Code + PKCE); calls the .NET Web API for profile data.

**Full setup and run (Keycloak, API, and this UI):** see the root [README](../README.md).

---

## Prerequisites

- Node.js 18+ and npm
- Keycloak configured (local or enterprise); see root README.
- .NET API running (default: https://localhost:7095)

---

## Install and run

```bash
npm install
npm start
```

App is served at **https://localhost:7100** (port and SSL are set in `angular.json`).

---

## Development server

Run `ng serve` (or `npm start`). The app reloads when you change source files.

## Build

```bash
ng build
```

Artifacts are in `dist/`. Production build: `ng build --configuration production`.

## Running unit tests

```bash
ng test
```

## Code scaffolding

```bash
ng generate component component-name
ng generate directive|pipe|service|class|guard|interface|enum|module
```

## Further help

- [Angular CLI](https://angular.io/cli)
- Root [README](../README.md) for Keycloak scenarios and API setup
