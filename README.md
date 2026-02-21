# EPM Profile

Angular UI and .NET Web API secured with **Keycloak** (OAuth 2.0 / OpenID Connect, Authorization Code flow with PKCE). Users sign in via Keycloak; the UI calls the API with an access token; the API validates the token and fetches profile from Keycloak UserInfo.

| Component   | Tech           | Default URL (dev)     |
|------------|----------------|------------------------|
| **UI**     | Angular 16     | https://localhost:7100 |
| **API**    | .NET 9 Web API | https://localhost:7095 |
| **Keycloak** | —            | http://localhost:8080  |

---

## Prerequisites

- **Node.js** 18+ and **npm**
- **.NET 9 SDK**
- **Keycloak** (see scenarios below)

---

## Setup and Run

Two scenarios are supported:

1. **Keycloak installed locally** – you run Keycloak (e.g. via Docker) and create the realm/client/user yourself.
2. **Keycloak owned by enterprise security** – you request a client from the security team using the details in [Scenario 2: Enterprise Keycloak](#scenario-2-keycloak-owned-by-enterprise-security-team).

---

### Scenario 1: Keycloak Installed Locally

Use this when you run Keycloak on your machine (e.g. for development).

#### 1.1 Run Keycloak

With Docker:

```bash
docker run -d --name keycloak -p 8080:8080 \
  -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin \
  quay.io/keycloak/keycloak:latest start-dev
```

Open http://localhost:8080 and log in to the admin console (`admin` / `admin`).

#### 1.2 Create realm, client, and user in Keycloak

| Step | Action |
|------|--------|
| Realm | Create realm **`epm-realm`** |
| Client | Create client **`epm-hrms-profile`** (public, no client secret). Enable **Standard flow**. Set **Valid redirect URIs**: `https://localhost:7100/authorization`. Set **Web origins**: `https://localhost:7100` |
| User | Create a user (e.g. `testuser`) and set a password |

Detailed steps are in [docs/END_TO_END_SETUP.md](docs/END_TO_END_SETUP.md).

#### 1.3 Configure and run the application

- **API** – Uses Keycloak at `http://localhost:8080/realms/epm-realm` by default (see [API configuration](#api-configuration)).
- **UI** – Uses Keycloak at `http://localhost:8080`, realm `epm-realm`, client `epm-hrms-profile` (see [UI configuration](#ui-configuration)).

Then:

```bash
# Terminal 1 – API
cd Epm.Profile.Api/Epm.Profile.Api
dotnet run

# Terminal 2 – UI
cd epm-profile-ui
npm install
npm start
```

Open **https://localhost:7100** and sign in with your Keycloak user.

---

### Scenario 2: Keycloak Owned by Enterprise Security Team

Use this when Keycloak is managed by your organization and you need a client created for this app.

#### 2.1 Request a client from the security team

Send the following to the team that manages Keycloak. They will create the realm (if needed), client, and optionally a test user.

---

**Subject:** Request to create Keycloak client for EPM Profile application

**Application:** EPM Profile (Angular SPA + .NET Web API)

**Required client registration details:**

| Item | Value | Notes |
|------|--------|------|
| **Realm** | `epm-realm` | Or the realm name assigned by the team |
| **Client ID** | `epm-hrms-profile` | Or the client id they assign |
| **Client type** | **Public** | No client secret; SPA + Authorization Code with PKCE |
| **Access type** | **public** | Not confidential |
| **Standard flow (Authorization Code)** | **Enabled** | Required |
| **Valid redirect URIs** | `https://localhost:7100/authorization` | For local dev. Add production URL when deployed (e.g. `https://epm-profile.mycompany.com/authorization`) |
| **Base URL** (optional) | `https://localhost:7100` | For dev; update for production |
| **Web origins** | `https://localhost:7100` | For dev. Add production origin when deployed (e.g. `https://epm-profile.mycompany.com`) |
| **Valid post logout redirect URIs** (optional) | `https://localhost:7100` | For dev; add production URL when deployed |

**Additional information:**

- The application uses **Authorization Code flow with PKCE** (no client secret).
- After client creation, we need:
  - **Keycloak base URL** (e.g. `https://keycloak.mycompany.com` or `http://localhost:8080` for dev)
  - **Realm name** (e.g. `epm-realm`)
  - **Client ID** (e.g. `epm-hrms-profile`)
- The .NET API will validate JWTs issued by this realm and call the Keycloak **UserInfo** endpoint to fetch the user profile.

Please confirm once the client is created and share the **Keycloak URL**, **realm name**, and **client ID** so we can configure the application.

---

#### 2.2 After the client is created

When the security team confirms and provides:

- Keycloak base URL (e.g. `https://keycloak.mycompany.com`)
- Realm name (e.g. `epm-realm`)
- Client ID (e.g. `epm-hrms-profile`)
- Valid redirect URI they configured (must include where your app will redirect after login, e.g. `https://localhost:7100/authorization` for dev)

Update the application as follows.

**UI** – Edit `epm-profile-ui/src/app/keycloak.ts`:

```typescript
const keycloak = new Keycloak({
  url: 'https://keycloak.mycompany.com',   // Keycloak base URL from security team
  realm: 'epm-realm',                       // Realm name
  clientId: 'epm-hrms-profile'              // Client ID
});
```

Update `epm-profile-ui/src/main.ts` so `redirectUri` matches the **exact** redirect URI registered in Keycloak (e.g. `https://localhost:7100/authorization` for dev).

**API** – Edit `Epm.Profile.Api/Epm.Profile.Api/Program.cs` and set `keycloakAuthority` to the realm URL:

```csharp
// Example: https://keycloak.mycompany.com/realms/epm-realm
const string keycloakAuthority = "https://keycloak.mycompany.com/realms/epm-realm";
```

If Keycloak uses HTTPS, keep `RequireHttpsMetadata = true` (or remove it, as `true` is the default). For local HTTP Keycloak, `RequireHttpsMetadata = false` is acceptable in development.

Then run the API and UI as in [Run](#run).

---

## Configuration

### API configuration

| What | Where | Default |
|------|--------|---------|
| Keycloak realm URL | `Epm.Profile.Api/Epm.Profile.Api/Program.cs` → `keycloakAuthority` | `http://localhost:8080/realms/epm-realm` |
| CORS allowed origin | Same file → `WithOrigins(...)` | `https://localhost:7100` |
| HTTPS port | `Epm.Profile.Api/Epm.Profile.Api/Properties/launchSettings.json` | `7095` |

### UI configuration

| What | Where | Default |
|------|--------|---------|
| Keycloak URL | `epm-profile-ui/src/app/keycloak.ts` → `url` | `http://localhost:8080` |
| Realm | Same file → `realm` | `epm-realm` |
| Client ID | Same file → `clientId` | `epm-hrms-profile` |
| Redirect URI (after login) | `epm-profile-ui/src/main.ts` → `redirectUri` | `https://localhost:7100/authorization` |
| API base URL | `epm-profile-ui/src/app/profile/profile.service.ts` → `API_BASE` | `https://localhost:7095/api` |
| Dev server port / SSL | `epm-profile-ui/angular.json` → `serve.options` | port `7100`, `ssl: true` |

For **enterprise Keycloak**, change the Keycloak base URL, realm, and client ID in both the UI and the API as shown in [2.2 After the client is created](#22-after-the-client-is-created).

---

## Run

1. **Keycloak** – Running and reachable (local or enterprise URL).
2. **API** – From repo root:
   ```bash
   cd Epm.Profile.Api/Epm.Profile.Api
   dotnet run
   ```
   Use the profile that serves HTTPS (e.g. https://localhost:7095).
3. **UI** – From repo root:
   ```bash
   cd epm-profile-ui
   npm install
   npm start
   ```
4. Open **https://localhost:7100** in the browser (accept the dev certificate warning if prompted). You will be redirected to Keycloak to sign in; after login you land on the dashboard and the app calls the API to show your profile.

---

## Project structure

```
epm-profile/
├── README.md                    # This file
├── docs/
│   └── END_TO_END_SETUP.md      # Detailed setup and FAQ
├── Epm.Profile.Api/             # .NET 9 Web API
│   └── Epm.Profile.Api/
│       ├── Program.cs
│       └── Controllers/
│           └── ProfileController.cs
└── epm-profile-ui/              # Angular 16 SPA
    ├── src/
    │   ├── main.ts
    │   ├── app/
    │   │   ├── keycloak.ts
    │   │   ├── auth/
    │   │   ├── profile/
    │   │   ├── dashboard/
    │   │   └── authorization/
    │   └── keycloak-js.d.ts
    └── angular.json
```

---

## More information

- **End-to-end setup (local Keycloak, Docker, code walkthrough, FAQ):** [docs/END_TO_END_SETUP.md](docs/END_TO_END_SETUP.md)
