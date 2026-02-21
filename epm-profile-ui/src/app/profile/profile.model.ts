/** Profile from Keycloak UserInfo (returned by .NET API) */
export interface Profile {
  sub?: string;
  name?: string | null;
  preferred_username?: string | null;
  given_name?: string | null;
  family_name?: string | null;
  email?: string | null;
  email_verified?: boolean;
}
