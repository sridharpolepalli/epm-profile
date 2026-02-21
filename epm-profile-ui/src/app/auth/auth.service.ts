import { Injectable } from '@angular/core';
import keycloak from '../keycloak';

const ACCESS_TOKEN_KEY = 'access_token';

@Injectable({ providedIn: 'root' })
export class AuthService {

  isAuthenticated(): boolean {
    return keycloak.authenticated === true;
  }

  /**
   * Returns the access token for API calls. Uses Keycloak's token (refreshes if needed) and persists to sessionStorage.
   */
  getAccessToken(): string | undefined {
    const token = keycloak.token;
    if (token) {
      sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
      return token;
    }
    return sessionStorage.getItem(ACCESS_TOKEN_KEY) ?? undefined;
  }

  /**
   * Ensures the token is valid (refreshes if expired) and returns the access token. Call before API requests.
   */
  getValidAccessToken(): Promise<string | undefined> {
    return new Promise((resolve) => {
      keycloak.updateToken(30).then((refreshed: boolean) => {
        if (refreshed && keycloak.token) {
          sessionStorage.setItem(ACCESS_TOKEN_KEY, keycloak.token);
        }
        resolve(keycloak.token ?? sessionStorage.getItem(ACCESS_TOKEN_KEY) ?? undefined);
      }).catch(() => {
        resolve(sessionStorage.getItem(ACCESS_TOKEN_KEY) ?? undefined);
      });
    });
  }

  getStoredAccessToken(): string | null {
    return sessionStorage.getItem(ACCESS_TOKEN_KEY);
  }

  logout(): void {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    keycloak.logout();
  }
}
