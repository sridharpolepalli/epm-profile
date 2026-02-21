import { Injectable } from '@angular/core';
import keycloak from '../keycloak';

const ACCESS_TOKEN_KEY = 'access_token';

@Injectable({ providedIn: 'root' })
export class AuthService {

  isAuthenticated(): boolean {
    return keycloak.authenticated === true;
  }

  /**
   * Returns the access token. Persists it to sessionStorage so the app can use it (e.g. for API calls).
   */
  getAccessToken(): string | undefined {
    const token = keycloak.token;
    if (token) {
      sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
      return token;
    }
    return sessionStorage.getItem(ACCESS_TOKEN_KEY) ?? undefined;
  }

  getStoredAccessToken(): string | null {
    return sessionStorage.getItem(ACCESS_TOKEN_KEY);
  }

  logout(): void {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    keycloak.logout();
  }
}
