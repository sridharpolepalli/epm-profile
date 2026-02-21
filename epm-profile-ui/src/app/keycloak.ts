import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:8080',
  realm: 'epm-realm',
  clientId: 'epm-hrms-profile'
});

export default keycloak;
