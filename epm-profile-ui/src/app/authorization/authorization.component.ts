import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Handles the Keycloak redirect after login (https://localhost:7100/authorization?code=...).
 * Keycloak-js exchanges the code for tokens in main.ts before Angular bootstraps.
 * This component just redirects to dashboard.
 */
@Component({
  selector: 'app-authorization',
  template: '<p>Completing sign-in...</p>',
  styles: ['p { padding: 2rem; text-align: center; }']
})
export class AuthorizationComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.navigate(['/dashboard'], { replaceUrl: true });
  }
}
