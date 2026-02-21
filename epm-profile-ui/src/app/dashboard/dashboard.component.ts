import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { ProfileService } from '../profile/profile.service';
import { Profile } from '../profile/profile.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  profile: Profile | null = null;
  profileError: string | null = null;
  loading = true;

  constructor(
    public auth: AuthService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.auth.getAccessToken();
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.profileError = null;
    this.profileService.getProfile().subscribe({
      next: (p) => {
        this.profile = p;
        this.loading = false;
      },
      error: () => {
        this.profileError = 'Failed to load profile';
        this.loading = false;
      }
    });
  }
}
