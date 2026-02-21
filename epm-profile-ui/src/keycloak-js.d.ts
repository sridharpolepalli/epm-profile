/**
 * Type declaration for keycloak-js so TypeScript resolves the module.
 * The package uses "exports" in package.json which classic moduleResolution doesn't use.
 */
declare module 'keycloak-js' {
  interface KeycloakConfig {
    url: string;
    realm: string;
    clientId: string;
  }

  interface KeycloakInstance {
    init(options?: { onLoad?: string; redirectUri?: string; pkceMethod?: string }): Promise<boolean>;
    updateToken(minValidity?: number): Promise<boolean>;
    token?: string;
    authenticated?: boolean;
    logout(options?: object): void;
  }

  interface KeycloakConstructor {
    new (config: KeycloakConfig): KeycloakInstance;
  }

  const Keycloak: KeycloakConstructor;
  export default Keycloak;
}
