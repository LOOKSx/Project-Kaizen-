import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorProfile } from '../../models/article.model';

@Component({
  selector: 'app-author-bio',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="author-bio-card" *ngIf="author">
      <div class="bio-banner" [style.backgroundImage]="'url(' + author.cover_image + ')'"></div>
      <div class="bio-body">
        <div class="avatar-wrapper">
          <img [src]="author.avatar" [alt]="author.name" class="bio-avatar">
          <span class="online-badge" title="Ready to connect"></span>
        </div>

        <div class="bio-info">
          <h3 class="author-name">{{ author.name }}</h3>
          <p class="author-title"><i class="fa-solid fa-location-dot"></i> {{ author.location }} • {{ author.title }}</p>
          <p class="author-desc">{{ author.bio }}</p>

          <!-- Quick Stats Counter -->
          <div class="bio-stats">
            <div class="stat-item">
              <span class="stat-num">{{ author.articles_count }}</span>
              <span class="stat-label">Articles Published</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-num">{{ author.countries_visited }}</span>
              <span class="stat-label">Countries Visited</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-num">{{ author.photos_taken | number }}</span>
              <span class="stat-label">Photos Captured</span>
            </div>
          </div>

          <!-- Social Media Links -->
          <div class="social-links">
            <a [href]="author.instagram" target="_blank" class="social-btn instagram"><i class="fa-brands fa-instagram"></i></a>
            <a [href]="author.youtube" target="_blank" class="social-btn youtube"><i class="fa-brands fa-youtube"></i></a>
            <a [href]="author.facebook" target="_blank" class="social-btn facebook"><i class="fa-brands fa-facebook-f"></i></a>
            <a [href]="author.github" target="_blank" class="social-btn github"><i class="fa-brands fa-github"></i></a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .author-bio-card {
      background-color: var(--bg-card);
      border-radius: var(--radius-md);
      overflow: hidden;
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border-color);
      margin-bottom: 30px;
    }
    .bio-banner {
      height: 120px;
      background-size: cover;
      background-position: center;
      position: relative;
    }
    .bio-body {
      padding: 0 24px 24px 24px;
      position: relative;
      margin-top: -50px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    .avatar-wrapper {
      position: relative;
      margin-bottom: 16px;
    }
    .bio-avatar {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      border: 4px solid var(--bg-card);
      object-fit: cover;
      box-shadow: var(--shadow-md);
    }
    .online-badge {
      position: absolute;
      bottom: 6px;
      right: 6px;
      width: 16px;
      height: 16px;
      background-color: #22c55e;
      border: 3px solid var(--bg-card);
      border-radius: 50%;
    }
    .author-name {
      font-size: 22px;
      font-weight: 700;
      color: var(--text-dark);
      margin-bottom: 4px;
    }
    .author-title {
      font-size: 13px;
      color: var(--primary-accent);
      font-weight: 600;
      margin-bottom: 12px;
    }
    .author-desc {
      font-size: 14px;
      color: var(--text-muted);
      max-width: 650px;
      margin-bottom: 20px;
      line-height: 1.6;
    }
    .bio-stats {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 24px;
      padding: 16px 28px;
      background-color: var(--bg-main);
      border-radius: 30px;
      margin-bottom: 20px;
    }
    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .stat-num {
      font-family: var(--font-heading);
      font-size: 20px;
      font-weight: 800;
      color: var(--text-dark);
    }
    .stat-label {
      font-size: 12px;
      color: var(--text-muted);
    }
    .stat-divider {
      width: 1px;
      height: 24px;
      background-color: var(--border-color);
    }
    .social-links {
      display: flex;
      gap: 12px;
    }
    .social-btn {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background-color: var(--bg-main);
      color: var(--text-muted);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 15px;
      transition: all 0.2s ease;
    }
    .social-btn:hover {
      color: #ffffff;
      transform: translateY(-2px);
    }
    .social-btn.instagram:hover { background-color: #e1306c; }
    .social-btn.youtube:hover { background-color: #ff0000; }
    .social-btn.facebook:hover { background-color: #1877f2; }
    .social-btn.github:hover { background-color: #333333; }
  `]
})
export class AuthorBioComponent {
  @Input() author: AuthorProfile | null = null;
}
