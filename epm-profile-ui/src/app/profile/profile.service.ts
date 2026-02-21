import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Profile } from './profile.model';

const API_BASE = 'https://localhost:7095/api';

@Injectable({ providedIn: 'root' })
export class ProfileService {

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  getProfile(): Observable<Profile | null> {
    return from(this.auth.getValidAccessToken()).pipe(
      switchMap((token) => {
        if (!token) {
          return of(null);
        }
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`
        });
        return this.http.get<Profile>(`${API_BASE}/profile`, { headers }).pipe(
          catchError(() => of(null))
        );
      })
    );
  }
}
