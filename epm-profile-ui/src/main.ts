import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import keycloak from './app/keycloak';

keycloak.init({
  onLoad: 'login-required',
  redirectUri: 'http://localhost:4200/authorization',
  pkceMethod: 'S256'
}).then((authenticated: boolean) => {
  if (authenticated) {
    platformBrowserDynamic().bootstrapModule(AppModule)
      .catch(err => console.error(err));
  }
});
