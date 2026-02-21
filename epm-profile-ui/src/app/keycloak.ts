import Keycloak from 'keycloak-js';

/**
 * Keycloak client. In Keycloak Admin, client epm-hrms-profile must have
 * Valid Redirect URI: https://localhost:7100/authorization
 */
const keycloak = new Keycloak({
  url: 'http://localhost:8080',
  realm: 'epm-realm',
  clientId: 'epm-hrms-profile'
});

export default keycloak;
