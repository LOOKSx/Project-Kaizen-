import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ArticleService } from './services/article.service';
import { Article, Category, AuthorProfile } from './models/article.model';
import { HeaderComponent } from './components/header/header.component';
import { HeroComponent } from './components/hero/hero.component';
import { ArticleCardComponent } from './components/article-card/article-card.component';
import { ArticleReaderComponent } from './components/article-reader/article-reader.component';
import { ArticleEditorComponent } from './components/article-editor/article-editor.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    HeroComponent,
    ArticleCardComponent,
    ArticleReaderComponent,
    ArticleEditorComponent,
  ],
  template: `
    <div class="app-wrapper">

      <!-- ===== NAVBAR ===== -->
      <app-header></app-header>

      <!-- ===== HOME PAGE ===== -->
      <ng-container *ngIf="currentPage === 'home' || currentPage === 'blog'">
        <app-hero [article]="featuredArticle"></app-hero>
        <main class="main-body" id="blog-section">
          <div class="container main-container">
            <div class="section-header">
              <h2 class="section-heading">BLOG POSTS</h2>
              <div class="filter-info" *ngIf="activeCategory || searchQuery">
                <span class="filter-pill">
                  {{ activeCategory || searchQuery }}
                  <button class="clear-filter" (click)="resetFilters()">×</button>
                </span>
              </div>
            </div>
            <div class="posts-grid" *ngIf="articles.length > 0">
              <app-article-card
                *ngFor="let item of articles"
                [article]="item"
                (onSelect)="openReader($event)"
              ></app-article-card>
            </div>
            <div class="empty-state" *ngIf="articles.length === 0">
              <i class="fa-solid fa-compass empty-icon"></i>
              <h3>No Articles Found</h3>
              <p>Try searching for a different keyword or browse another category.</p>
              <button class="btn btn-secondary" (click)="resetFilters()">View All Posts</button>
            </div>
            <div class="load-more-wrap" *ngIf="articles.length > 0">
              <button class="load-more-btn">LOAD MORE POSTS</button>
            </div>
          </div>
        </main>
      </ng-container>

      <!-- ===== DESTINATIONS PAGE ===== -->
      <ng-container *ngIf="currentPage === 'destinations'">
        <div class="page-hero" style="background-image:url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1400&q=80')">
          <div class="page-hero-overlay"></div>
          <div class="page-hero-content">
            <p class="page-hero-label">✈️ EXPLORE THE WORLD</p>
            <h1 class="page-hero-title">Destinations</h1>
            <p class="page-hero-sub">Handpicked travel guides from across the globe — from volcanic peaks to hidden seaside villages.</p>
          </div>
        </div>
        <main class="page-body">
          <div class="container">

            <!-- Region Filter Pills -->
            <div class="dest-filter-bar">
              <button class="dest-pill" [class.active]="destFilter==='All'" (click)="destFilter='All'">All</button>
              <button class="dest-pill" *ngFor="let r of regions" [class.active]="destFilter===r" (click)="destFilter=r">{{ r }}</button>
            </div>

            <!-- Destination Cards -->
            <div class="dest-grid">
              <div class="dest-card" *ngFor="let d of filteredDestinations" (click)="openDestArticle(d)">
                <div class="dest-img-wrap">
                  <img [src]="d.image" [alt]="d.name" class="dest-img" loading="lazy" />
                  <div class="dest-region-badge">{{ d.region }}</div>
                </div>
                <div class="dest-info">
                  <h3 class="dest-name">{{ d.name }}</h3>
                  <p class="dest-desc">{{ d.desc }}</p>
                  <div class="dest-meta">
                    <span><i class="fa-solid fa-camera"></i> {{ d.photos }}</span>
                    <span><i class="fa-solid fa-newspaper"></i> {{ d.articles }}</span>
                    <span class="dest-read">Explore →</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </ng-container>

      <!-- ===== GALLERY PAGE ===== -->
      <ng-container *ngIf="currentPage === 'gallery'">
        <div class="page-hero" style="background-image:url('https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=1400&q=80')">
          <div class="page-hero-overlay"></div>
          <div class="page-hero-content">
            <p class="page-hero-label">📷 VISUAL STORIES</p>
            <h1 class="page-hero-title">Photo Gallery</h1>
            <p class="page-hero-sub">A curated collection of travel photography from around the world — golden hours, ancient temples, and wild landscapes.</p>
          </div>
        </div>
        <main class="page-body">
          <div class="container">

            <!-- Gallery Filter -->
            <div class="dest-filter-bar">
              <button class="dest-pill" *ngFor="let g of galleryTags" [class.active]="galleryFilter===g" (click)="galleryFilter=g">{{ g }}</button>
            </div>

            <!-- Masonry Gallery -->
            <div class="gallery-grid">
              <div class="gallery-item" *ngFor="let p of filteredPhotos" [class.tall]="p.tall">
                <img [src]="p.url" [alt]="p.caption" class="gallery-img" loading="lazy" />
                <div class="gallery-overlay">
                  <p class="gallery-caption">{{ p.caption }}</p>
                  <span class="gallery-tag">{{ p.tag }}</span>
                </div>
              </div>
            </div>

          </div>
        </main>
      </ng-container>

      <!-- ===== ABOUT PAGE ===== -->
      <ng-container *ngIf="currentPage === 'about'">
        <div class="page-hero" style="background-image:url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80')">
          <div class="page-hero-overlay"></div>
          <div class="page-hero-content">
            <p class="page-hero-label">👋 HELLO THERE</p>
            <h1 class="page-hero-title">About Me</h1>
            <p class="page-hero-sub">The story behind Kaizen — the philosophy, the journey, and the human writing these words.</p>
          </div>
        </div>
        <main class="page-body">
          <div class="container">
            <div class="about-layout">

              <!-- Author Profile Card -->
              <aside class="about-sidebar">
                <div class="author-card">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" alt="Author" class="author-avatar-lg" />
                  <h2 class="author-name">Kaizen Explorer</h2>
                  <p class="author-title">World Traveler & Software Engineer</p>
                  <div class="author-stats">
                    <div class="stat">
                      <span class="stat-num">38</span>
                      <span class="stat-lbl">Countries</span>
                    </div>
                    <div class="stat">
                      <span class="stat-num">10</span>
                      <span class="stat-lbl">Articles</span>
                    </div>
                    <div class="stat">
                      <span class="stat-num">14K+</span>
                      <span class="stat-lbl">Photos</span>
                    </div>
                  </div>
                  <div class="author-socials">
                    <a href="#" title="Instagram"><i class="fa-brands fa-instagram"></i></a>
                    <a href="#" title="Twitter/X"><i class="fa-brands fa-x-twitter"></i></a>
                    <a href="#" title="YouTube"><i class="fa-brands fa-youtube"></i></a>
                    <a href="#" title="GitHub"><i class="fa-brands fa-github"></i></a>
                  </div>
                </div>
              </aside>

              <!-- About Content -->
              <div class="about-content">
                <div class="about-section">
                  <h2>The Kaizen Story</h2>
                  <p>
                    <strong>Kaizen (改善)</strong> is a Japanese word that means "continuous improvement." This blog was born from a simple belief: that small, deliberate improvements in every aspect of life — travel, work, health, relationships, learning — compound into something extraordinary over time.
                  </p>
                  <p>
                    I started writing here as a personal journal. It quickly became something more: a documentation of a life lived with curiosity, a place to share what I've learned from 38 countries, from engineering teams, from books, from long walks, and from failure.
                  </p>
                </div>

                <div class="about-section">
                  <h2>What I Write About</h2>
                  <div class="topics-grid">
                    <div class="topic-card" *ngFor="let t of topics">
                      <span class="topic-icon">{{ t.icon }}</span>
                      <h3>{{ t.name }}</h3>
                      <p>{{ t.desc }}</p>
                    </div>
                  </div>
                </div>

                <div class="about-section">
                  <h2>My Journey So Far</h2>
                  <div class="timeline">
                    <div class="timeline-item" *ngFor="let item of timeline">
                      <div class="timeline-year">{{ item.year }}</div>
                      <div class="timeline-body">
                        <h4>{{ item.title }}</h4>
                        <p>{{ item.desc }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>
      </ng-container>

      <!-- ===== CONTACT PAGE ===== -->
      <ng-container *ngIf="currentPage === 'contact'">
        <div class="page-hero" style="background-image:url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80')">
          <div class="page-hero-overlay"></div>
          <div class="page-hero-content">
            <p class="page-hero-label">💬 GET IN TOUCH</p>
            <h1 class="page-hero-title">Contact</h1>
            <p class="page-hero-sub">Have a question, collaboration idea, or just want to say hello? I'd love to hear from you.</p>
          </div>
        </div>
        <main class="page-body">
          <div class="container">
            <div class="contact-layout">

              <!-- Contact Info -->
              <div class="contact-info">
                <h2>Let's Connect</h2>
                <p>Whether you're a fellow traveler, a reader, a brand, or someone who just stumbled here — welcome. My inbox is always open.</p>

                <div class="contact-items">
                  <div class="contact-item" *ngFor="let ci of contactItems">
                    <div class="ci-icon"><i [class]="ci.icon"></i></div>
                    <div>
                      <h4>{{ ci.label }}</h4>
                      <p>{{ ci.value }}</p>
                    </div>
                  </div>
                </div>

                <div class="contact-socials">
                  <a href="#" class="social-link"><i class="fa-brands fa-instagram"></i> Instagram</a>
                  <a href="#" class="social-link"><i class="fa-brands fa-x-twitter"></i> Twitter</a>
                  <a href="#" class="social-link"><i class="fa-brands fa-youtube"></i> YouTube</a>
                  <a href="#" class="social-link"><i class="fa-brands fa-github"></i> GitHub</a>
                </div>
              </div>

              <!-- Contact Form -->
              <div class="contact-form-wrap">
                <div class="contact-card">
                  <h3>Send a Message</h3>
                  <form class="contact-form" (ngSubmit)="submitContact()" *ngIf="!contactSent">
                    <div class="cf-group">
                      <label>Your Name</label>
                      <input type="text" placeholder="Alex Rivera" [(ngModel)]="contactName" name="contactName" required />
                    </div>
                    <div class="cf-group">
                      <label>Email Address</label>
                      <input type="email" placeholder="alex@example.com" [(ngModel)]="contactEmail" name="contactEmail" required />
                    </div>
                    <div class="cf-group">
                      <label>Subject</label>
                      <select [(ngModel)]="contactSubject" name="contactSubject">
                        <option>Travel Collaboration</option>
                        <option>Blog Partnership</option>
                        <option>Photography Request</option>
                        <option>Just Saying Hello</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div class="cf-group">
                      <label>Message</label>
                      <textarea rows="5" placeholder="Tell me what's on your mind..." [(ngModel)]="contactMessage" name="contactMessage" required></textarea>
                    </div>
                    <button type="submit" class="cf-submit">
                      <i class="fa-solid fa-paper-plane"></i> Send Message
                    </button>
                  </form>
                  <div class="contact-success" *ngIf="contactSent">
                    <i class="fa-solid fa-circle-check"></i>
                    <h3>Message Sent!</h3>
                    <p>Thank you for reaching out. I'll get back to you within 24–48 hours.</p>
                    <button class="cf-submit" (click)="contactSent=false">Send Another</button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>
      </ng-container>

      <!-- ===== FOOTER (all pages) ===== -->
      <footer class="site-footer">
        <div class="container footer-inner">
          <div class="footer-logo-area">
            <span class="footer-logo">🌏 KAIZEN</span>
            <p class="footer-tagline">Explore. Dream. Discover.</p>
            <p class="footer-desc">
              A personal blog dedicated to continuous improvement,<br>
              world travel, technology, and life philosophy.
            </p>
            <div class="footer-social">
              <a href="#" title="Instagram"><i class="fa-brands fa-instagram"></i></a>
              <a href="#" title="Twitter/X"><i class="fa-brands fa-x-twitter"></i></a>
              <a href="#" title="YouTube"><i class="fa-brands fa-youtube"></i></a>
              <a href="#" title="Pinterest"><i class="fa-brands fa-pinterest"></i></a>
            </div>
          </div>
          <div class="footer-links-area">
            <div class="footer-col">
              <h4>DESTINATIONS</h4>
              <ul>
                <li><a href="#" (click)="goDestPage('Asia', $event)">Asia</a></li>
                <li><a href="#" (click)="goDestPage('Europe', $event)">Europe</a></li>
                <li><a href="#" (click)="goDestPage('Americas', $event)">Americas</a></li>
                <li><a href="#" (click)="goDestPage('Africa', $event)">Africa</a></li>
                <li><a href="#" (click)="goDestPage('Oceania', $event)">Oceania</a></li>
              </ul>
            </div>
            <div class="footer-col">
              <h4>CATEGORIES</h4>
              <ul>
                <li><a href="#" (click)="filterCat('Travel & Places', $event)">Travel & Places</a></li>
                <li><a href="#" (click)="filterCat('Personal Growth', $event)">Personal Growth</a></li>
                <li><a href="#" (click)="filterCat('Work & Career', $event)">Work & Career</a></li>
                <li><a href="#" (click)="filterCat('Photography / Snapshots', $event)">Photography</a></li>
              </ul>
            </div>
            <div class="footer-col">
              <h4>QUICK LINKS</h4>
              <ul>
                <li><a href="#" (click)="navTo('about', $event)">About</a></li>
                <li><a href="#" (click)="navTo('contact', $event)">Contact</a></li>
                <li><a href="#" (click)="navTo('gallery', $event)">Gallery</a></li>
                <li><a href="#">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© 2026 Kaizen Personal Blog — Powered by Golang + Angular</p>
        </div>
      </footer>

      <!-- ===== MODALS ===== -->
      <app-article-reader
        *ngIf="selectedArticle"
        [article]="selectedArticle"
        (onClose)="selectedArticle = null"
      ></app-article-reader>

      <app-article-editor
        *ngIf="showPublisherModal"
        (onClose)="showPublisherModal = false"
        (onArticlePublished)="handleArticlePublished($event)"
      ></app-article-editor>

    </div>
  `,
  styles: [`
    /* ===== LAYOUT ===== */
    .app-wrapper { min-height: 100vh; display: flex; flex-direction: column; }
    .main-body { flex: 1; background: #ffffff; padding: 48px 0 60px; }
    .page-body { flex: 1; background: #ffffff; padding: 56px 0 80px; }

    /* ===== PAGE HERO ===== */
    .page-hero {
      position: relative;
      height: 420px;
      background-size: cover;
      background-position: center;
      margin-top: 62px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .page-hero-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%);
    }
    .page-hero-content {
      position: relative;
      text-align: center;
      color: #fff;
      padding: 0 20px;
    }
    .page-hero-label {
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.75);
      margin-bottom: 12px;
    }
    .page-hero-title {
      font-family: 'Lato', sans-serif;
      font-size: clamp(36px, 6vw, 64px);
      font-weight: 900;
      letter-spacing: -1px;
      margin: 0 0 16px;
    }
    .page-hero-sub {
      font-size: 16px;
      color: rgba(255,255,255,0.85);
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.6;
    }

    /* ===== SECTION HEADING ===== */
    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 28px;
      flex-wrap: wrap;
      gap: 12px;
    }
    .section-heading {
      font-family: 'Lato', sans-serif;
      font-size: 15px;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: #111111;
      text-transform: uppercase;
      padding-bottom: 10px;
      border-bottom: 3px solid #111111;
      position: relative;
      margin: 0;
    }
    .section-heading::after {
      content: '';
      position: absolute;
      bottom: -3px; left: 0;
      width: 40px; height: 3px;
      background: #e8472a;
    }

    /* Filter pill */
    .filter-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #f5f5f5;
      border: 1px solid #e0e0e0;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      color: #555;
    }
    .clear-filter {
      background: none; border: none;
      cursor: pointer; font-size: 16px; color: #999; line-height: 1; padding: 0;
    }
    .clear-filter:hover { color: #e8472a; }

    /* Posts grid */
    .posts-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 28px;
    }

    /* Empty state */
    .empty-state {
      text-align: center;
      padding: 80px 20px;
    }
    .empty-icon { font-size: 52px; color: #cccccc; margin-bottom: 20px; }
    .empty-state h3 { font-size: 22px; color: #333; margin-bottom: 10px; }
    .empty-state p { color: #888; margin-bottom: 24px; }

    /* Load more */
    .load-more-wrap { text-align: center; margin-top: 48px; }
    .load-more-btn {
      display: inline-block;
      padding: 12px 36px;
      font-family: 'Nunito', sans-serif;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #333333;
      background: transparent;
      border: 2px solid #333333;
      cursor: pointer;
      transition: all 0.25s;
    }
    .load-more-btn:hover { background: #333333; color: #ffffff; }

    /* ===== DESTINATIONS PAGE ===== */
    .dest-filter-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 36px;
    }
    .dest-pill {
      padding: 8px 20px;
      border: 1.5px solid #ddd;
      border-radius: 30px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: #666;
      cursor: pointer;
      background: #fff;
      transition: all 0.2s;
    }
    .dest-pill:hover, .dest-pill.active {
      background: #111;
      color: #fff;
      border-color: #111;
    }

    .dest-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 28px;
    }
    .dest-card {
      border-radius: 10px;
      overflow: hidden;
      border: 1px solid #eeeeee;
      cursor: pointer;
      transition: transform 0.3s, box-shadow 0.3s;
    }
    .dest-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(0,0,0,0.12); }
    .dest-img-wrap { position: relative; aspect-ratio: 4/3; overflow: hidden; }
    .dest-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
    .dest-card:hover .dest-img { transform: scale(1.07); }
    .dest-region-badge {
      position: absolute;
      top: 12px; left: 12px;
      background: #e8472a;
      color: #fff;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 4px 10px;
      border-radius: 20px;
    }
    .dest-info { padding: 18px 20px 20px; }
    .dest-name {
      font-family: 'Lato', sans-serif;
      font-size: 18px;
      font-weight: 800;
      color: #111;
      margin: 0 0 8px;
    }
    .dest-desc {
      font-size: 13px;
      color: #777;
      line-height: 1.6;
      margin: 0 0 14px;
    }
    .dest-meta {
      display: flex;
      align-items: center;
      gap: 14px;
      font-size: 12px;
      color: #aaa;
    }
    .dest-meta i { margin-right: 4px; }
    .dest-read { margin-left: auto; color: #e8472a; font-weight: 700; font-size: 12px; }

    /* ===== GALLERY PAGE ===== */
    .gallery-grid {
      columns: 3;
      column-gap: 16px;
    }
    .gallery-item {
      position: relative;
      break-inside: avoid;
      margin-bottom: 16px;
      border-radius: 8px;
      overflow: hidden;
      cursor: pointer;
    }
    .gallery-img {
      width: 100%;
      display: block;
      transition: transform 0.4s;
    }
    .gallery-item:hover .gallery-img { transform: scale(1.04); }
    .gallery-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%);
      opacity: 0;
      transition: opacity 0.3s;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 16px;
    }
    .gallery-item:hover .gallery-overlay { opacity: 1; }
    .gallery-caption { color: #fff; font-size: 13px; font-weight: 600; margin: 0 0 4px; }
    .gallery-tag {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #e8472a;
      background: rgba(0,0,0,0.4);
      padding: 2px 8px;
      border-radius: 10px;
      align-self: flex-start;
    }

    /* ===== ABOUT PAGE ===== */
    .about-layout {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 60px;
      align-items: flex-start;
    }
    .author-card {
      background: #fff;
      border: 1px solid #eee;
      border-radius: 12px;
      padding: 28px 24px;
      text-align: center;
      position: sticky;
      top: 90px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    }
    .author-avatar-lg {
      width: 110px;
      height: 110px;
      border-radius: 50%;
      object-fit: cover;
      border: 4px solid #e8472a;
      margin-bottom: 14px;
    }
    .author-name {
      font-family: 'Lato', sans-serif;
      font-size: 20px;
      font-weight: 800;
      color: #111;
      margin: 0 0 4px;
    }
    .author-title { font-size: 13px; color: #888; margin: 0 0 20px; }
    .author-stats {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-bottom: 20px;
      padding: 16px 0;
      border-top: 1px solid #f0f0f0;
      border-bottom: 1px solid #f0f0f0;
    }
    .stat { text-align: center; }
    .stat-num { display: block; font-size: 22px; font-weight: 800; color: #e8472a; }
    .stat-lbl { font-size: 11px; color: #aaa; text-transform: uppercase; letter-spacing: 0.06em; }
    .author-socials { display: flex; justify-content: center; gap: 12px; }
    .author-socials a { font-size: 18px; color: #aaa; transition: color 0.2s; }
    .author-socials a:hover { color: #e8472a; }

    .about-content { }
    .about-section { margin-bottom: 48px; }
    .about-section h2 {
      font-family: 'Lato', sans-serif;
      font-size: 26px;
      font-weight: 800;
      color: #111;
      margin: 0 0 16px;
      padding-bottom: 12px;
      border-bottom: 2px solid #f0f0f0;
    }
    .about-section p { font-size: 15px; color: #555; line-height: 1.8; margin-bottom: 14px; }

    .topics-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin-top: 8px;
    }
    .topic-card {
      background: #f9f9f9;
      border: 1px solid #eee;
      border-radius: 10px;
      padding: 18px 20px;
      transition: border-color 0.2s;
    }
    .topic-card:hover { border-color: #e8472a; }
    .topic-icon { font-size: 24px; display: block; margin-bottom: 8px; }
    .topic-card h3 { font-size: 14px; font-weight: 700; color: #222; margin: 0 0 6px; }
    .topic-card p { font-size: 12px; color: #888; margin: 0; line-height: 1.5; }

    .timeline { display: flex; flex-direction: column; gap: 0; }
    .timeline-item {
      display: flex;
      gap: 20px;
      padding-bottom: 28px;
      border-left: 2px solid #eee;
      padding-left: 24px;
      position: relative;
    }
    .timeline-item::before {
      content: '';
      position: absolute;
      left: -7px;
      top: 4px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #e8472a;
      border: 2px solid #fff;
      box-shadow: 0 0 0 2px #e8472a;
    }
    .timeline-year {
      font-size: 13px;
      font-weight: 800;
      color: #e8472a;
      white-space: nowrap;
      min-width: 44px;
    }
    .timeline-body h4 { font-size: 15px; font-weight: 700; color: #222; margin: 0 0 6px; }
    .timeline-body p { font-size: 13px; color: #888; margin: 0; line-height: 1.6; }

    /* ===== CONTACT PAGE ===== */
    .contact-layout {
      display: grid;
      grid-template-columns: 1fr 1.3fr;
      gap: 60px;
      align-items: flex-start;
    }
    .contact-info h2 {
      font-family: 'Lato', sans-serif;
      font-size: 28px;
      font-weight: 800;
      color: #111;
      margin: 0 0 14px;
    }
    .contact-info > p { font-size: 15px; color: #666; line-height: 1.7; margin-bottom: 32px; }
    .contact-items { display: flex; flex-direction: column; gap: 20px; margin-bottom: 32px; }
    .contact-item { display: flex; align-items: flex-start; gap: 16px; }
    .ci-icon {
      width: 44px; height: 44px;
      background: linear-gradient(135deg, #e8472a, #f5782f);
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      color: #fff; font-size: 16px; flex-shrink: 0;
    }
    .contact-item h4 { font-size: 13px; font-weight: 700; color: #222; margin: 0 0 3px; }
    .contact-item p { font-size: 13px; color: #888; margin: 0; }
    .contact-socials { display: flex; flex-wrap: wrap; gap: 10px; }
    .social-link {
      display: flex; align-items: center; gap: 8px;
      padding: 8px 16px;
      border: 1.5px solid #e0e0e0;
      border-radius: 8px;
      font-size: 13px; font-weight: 600; color: #555;
      transition: all 0.2s;
    }
    .social-link:hover { border-color: #e8472a; color: #e8472a; }

    .contact-card {
      background: #fff;
      border: 1px solid #eee;
      border-radius: 14px;
      padding: 32px;
      box-shadow: 0 8px 30px rgba(0,0,0,0.07);
    }
    .contact-card h3 { font-size: 20px; font-weight: 800; color: #111; margin: 0 0 24px; }
    .contact-form { display: flex; flex-direction: column; gap: 16px; }
    .cf-group { display: flex; flex-direction: column; gap: 6px; }
    .cf-group label { font-size: 11.5px; font-weight: 700; color: #333; text-transform: uppercase; letter-spacing: 0.06em; }
    .cf-group input, .cf-group select, .cf-group textarea {
      padding: 10px 14px;
      border: 1.5px solid #e5e5e5;
      border-radius: 8px;
      font-size: 14px;
      font-family: inherit;
      background: #fafafa;
      color: #222;
      transition: border-color 0.2s;
    }
    .cf-group input:focus, .cf-group select:focus, .cf-group textarea:focus {
      outline: none; border-color: #e8472a; background: #fff;
    }
    .cf-group textarea { resize: vertical; min-height: 120px; line-height: 1.6; }
    .cf-submit {
      padding: 12px 28px;
      background: linear-gradient(135deg, #e8472a, #f5782f);
      color: #fff;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: opacity 0.2s, transform 0.15s;
    }
    .cf-submit:hover { opacity: 0.9; transform: translateY(-1px); }

    .contact-success {
      text-align: center;
      padding: 40px 20px;
    }
    .contact-success i { font-size: 56px; color: #27ae60; margin-bottom: 16px; display: block; }
    .contact-success h3 { font-size: 22px; font-weight: 800; color: #111; margin-bottom: 10px; }
    .contact-success p { color: #888; margin-bottom: 24px; }

    /* ===== FOOTER ===== */
    .site-footer { background: #111111; color: #aaaaaa; }
    .footer-inner {
      display: grid;
      grid-template-columns: 1.5fr 2fr;
      gap: 60px;
      padding: 60px 0 40px;
    }
    .footer-logo {
      font-family: 'Nunito', sans-serif;
      font-size: 22px;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: 2px;
      display: block;
      margin-bottom: 8px;
    }
    .footer-tagline { font-style: italic; color: #888888; font-size: 14px; margin-bottom: 14px; }
    .footer-desc { font-size: 13px; line-height: 1.7; color: #777777; margin-bottom: 20px; }
    .footer-social { display: flex; gap: 14px; }
    .footer-social a { font-size: 18px; color: #777777; transition: color 0.2s; }
    .footer-social a:hover { color: #e8472a; }
    .footer-links-area { display: flex; gap: 40px; justify-content: flex-end; }
    .footer-col h4 {
      font-family: 'Lato', sans-serif;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #ffffff;
      margin-bottom: 16px;
    }
    .footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 8px; }
    .footer-col ul a { font-size: 13px; color: #777777; transition: color 0.2s; }
    .footer-col ul a:hover { color: #e8472a; }
    .footer-bottom {
      border-top: 1px solid #222222;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #555555;
    }

    /* ===== RESPONSIVE ===== */
    @media (max-width: 960px) {
      .posts-grid { grid-template-columns: repeat(2, 1fr); }
      .dest-grid { grid-template-columns: repeat(2, 1fr); }
      .gallery-grid { columns: 2; }
      .about-layout { grid-template-columns: 1fr; }
      .author-card { position: static; }
      .contact-layout { grid-template-columns: 1fr; }
      .topics-grid { grid-template-columns: 1fr; }
      .footer-inner { grid-template-columns: 1fr; gap: 30px; }
      .footer-links-area { justify-content: flex-start; }
    }
    @media (max-width: 600px) {
      .posts-grid { grid-template-columns: 1fr; }
      .dest-grid { grid-template-columns: 1fr; }
      .gallery-grid { columns: 1; }
      .footer-links-area { flex-wrap: wrap; }
    }
  `]
})
export class AppComponent implements OnInit {
  articles: Article[] = [];
  featuredArticle: Article | null = null;
  categories: Category[] = [];

  activeCategory = '';
  searchQuery = '';
  selectedArticle: Article | null = null;
  showPublisherModal = false;

  currentPage = 'home';

  // Destinations page
  destFilter = 'All';
  regions = ['Asia', 'Europe', 'Americas', 'Africa', 'Oceania', 'Middle East'];
  allDestinations = [
    {
      name: 'Bali, Indonesia', region: 'Asia',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80',
      desc: 'Emerald rice terraces, ancient temples, and jungle waterfalls on the Island of the Gods.',
      photos: '240', articles: '3 guides'
    },
    {
      name: 'Kyoto, Japan', region: 'Asia',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
      desc: 'Zen gardens, bamboo forests, and thousand-year-old shrines in Japan\'s ancient imperial city.',
      photos: '380', articles: '4 guides'
    },
    {
      name: 'Chiang Mai, Thailand', region: 'Asia',
      image: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6?auto=format&fit=crop&w=600&q=80',
      desc: 'Mountain temples, night markets, and elephant sanctuaries in Northern Thailand\'s cultural heart.',
      photos: '185', articles: '2 guides'
    },
    {
      name: 'Santorini, Greece', region: 'Europe',
      image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=600&q=80',
      desc: 'Iconic white-washed cliffs, blue-domed churches, and legendary Aegean sunsets.',
      photos: '312', articles: '3 guides'
    },
    {
      name: 'Amalfi Coast, Italy', region: 'Europe',
      image: 'https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?auto=format&fit=crop&w=600&q=80',
      desc: 'Cliffside villages draped in bougainvillea above turquoise Mediterranean waters.',
      photos: '278', articles: '2 guides'
    },
    {
      name: 'Iceland Highlands', region: 'Europe',
      image: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=600&q=80',
      desc: 'Glaciers, geysers, and the ethereal northern lights under Arctic skies.',
      photos: '420', articles: '5 guides'
    },
    {
      name: 'Patagonia, Argentina', region: 'Americas',
      image: 'https://images.unsplash.com/photo-1531761535209-180857e963b9?auto=format&fit=crop&w=600&q=80',
      desc: 'Jagged granite towers, turquoise lakes, and raw Andean wilderness at the end of the earth.',
      photos: '195', articles: '2 guides'
    },
    {
      name: 'Machu Picchu, Peru', region: 'Americas',
      image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=600&q=80',
      desc: 'The lost city of the Incas, perched impossibly high in the Andean cloud forest.',
      photos: '267', articles: '3 guides'
    },
    {
      name: 'Serengeti, Tanzania', region: 'Africa',
      image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=600&q=80',
      desc: 'Witness the Great Migration — millions of wildebeest crossing golden savannah under vast African skies.',
      photos: '340', articles: '2 guides'
    },
  ];
  get filteredDestinations() {
    if (this.destFilter === 'All') return this.allDestinations;
    return this.allDestinations.filter(d => d.region === this.destFilter);
  }

  // Gallery page
  galleryFilter = 'All';
  galleryTags = ['All', 'Travel', 'Nature', 'Architecture', 'Street', 'Golden Hour'];
  photos = [
    { url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80', caption: 'Tegallalang Rice Terraces, Bali', tag: 'Travel', tall: true },
    { url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80', caption: 'Fushimi Inari, Kyoto', tag: 'Travel', tall: false },
    { url: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=600&q=80', caption: 'Vatnajökull Glacier, Iceland', tag: 'Nature', tall: false },
    { url: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=600&q=80', caption: 'Golden Hour, Santorini', tag: 'Golden Hour', tall: true },
    { url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=600&q=80', caption: 'Oia Village, Santorini', tag: 'Architecture', tall: false },
    { url: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6?auto=format&fit=crop&w=600&q=80', caption: 'Doi Suthep Temple, Chiang Mai', tag: 'Travel', tall: false },
    { url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=600&q=80', caption: 'Serengeti Sunrise, Tanzania', tag: 'Golden Hour', tall: true },
    { url: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=600&q=80', caption: 'Machu Picchu at Dawn, Peru', tag: 'Travel', tall: false },
    { url: 'https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?auto=format&fit=crop&w=600&q=80', caption: 'Positano, Amalfi Coast', tag: 'Architecture', tall: false },
    { url: 'https://images.unsplash.com/photo-1531761535209-180857e963b9?auto=format&fit=crop&w=600&q=80', caption: 'Torres del Paine, Patagonia', tag: 'Nature', tall: true },
    { url: 'https://images.unsplash.com/photo-1499678329028-101435549a4e?auto=format&fit=crop&w=600&q=80', caption: 'Street Life, Bangkok', tag: 'Street', tall: false },
    { url: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=600&q=80', caption: 'Morning Run, Singapore', tag: 'Street', tall: false },
  ];
  get filteredPhotos() {
    if (this.galleryFilter === 'All') return this.photos;
    return this.photos.filter(p => p.tag === this.galleryFilter);
  }

  // About page
  topics = [
    { icon: '✈️', name: 'Travel & Places', desc: 'In-depth guides to destinations across 38 countries.' },
    { icon: '🌱', name: 'Personal Growth', desc: 'The philosophy and practice of continuous improvement.' },
    { icon: '💻', name: 'Work & Career', desc: 'Engineering, software architecture, and the modern workplace.' },
    { icon: '📷', name: 'Photography', desc: 'Visual storytelling through natural light and composition.' },
    { icon: '📚', name: 'Books & Learning', desc: 'Reviews and lessons from 150+ books read over a decade.' },
    { icon: '💬', name: 'Life & Musings', desc: 'Honest reflections on daily life, relationships, and ideas.' },
  ];
  timeline = [
    { year: '2016', title: 'First Backpacking Trip', desc: 'Three months solo through Southeast Asia changed everything about how I see the world.' },
    { year: '2018', title: 'Started Engineering Career', desc: 'Joined a Bangkok startup building software. Discovered a love for architecture and clean code.' },
    { year: '2020', title: 'Discovered the Kaizen Philosophy', desc: 'Began applying the 1% daily improvement principle. Created this blog to document the journey.' },
    { year: '2022', title: 'Country #30: Iceland', desc: 'Watched the Northern Lights above a glacier. Decided that a life well-traveled is a life well-lived.' },
    { year: '2024', title: 'Built Full-Stack Blog Platform', desc: 'Created this blog from scratch with Golang, Angular, and CockroachDB — eating my own cooking.' },
    { year: '2026', title: 'Still Going', desc: '38 countries, 10+ articles, and a growing conviction that the best stories are still ahead.' },
  ];

  // Contact page
  contactName = '';
  contactEmail = '';
  contactSubject = 'Just Saying Hello';
  contactMessage = '';
  contactSent = false;
  contactItems = [
    { icon: 'fa-solid fa-envelope', label: 'Email', value: 'hello@kaizen-blog.com' },
    { icon: 'fa-solid fa-location-dot', label: 'Based In', value: 'Bangkok, Thailand & Global' },
    { icon: 'fa-solid fa-clock', label: 'Response Time', value: 'Usually within 24–48 hours' },
  ];

  constructor(private articleService: ArticleService) {}

  ngOnInit() {
    this.loadData();

    this.articleService.selectedCategory$.subscribe(cat => {
      this.activeCategory = cat;
      this.loadArticles();
    });

    this.articleService.searchQuery$.subscribe(q => {
      this.searchQuery = q;
      this.loadArticles();
    });

    window.addEventListener('kaizen:open-publisher', () => {
      this.showPublisherModal = true;
    });

    window.addEventListener('kaizen:navigate', (e: any) => {
      const page = e.detail?.page || 'home';
      this.navigateTo(page);
      if (e.detail?.dest) {
        this.destFilter = e.detail.dest;
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  navigateTo(page: string) {
    this.currentPage = page;
    window.dispatchEvent(new CustomEvent('kaizen:page-changed', { detail: { page } }));
  }

  loadData() {
    this.articleService.getArticles().subscribe(data => {
      this.articles = data;
      this.featuredArticle = data.find(a => a.featured) || data[0] || null;
    });
    this.articleService.getCategories().subscribe(cats => this.categories = cats);
  }

  loadArticles() {
    this.articleService.getArticles(this.activeCategory, this.searchQuery).subscribe(data => {
      this.articles = data;
    });
  }

  openReader(article: Article) {
    this.selectedArticle = article;
  }

  openDestArticle(dest: any) {
    this.articleService.setSearchQuery(dest.name.split(',')[0]);
    this.navigateTo('blog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  filterCat(cat: string, e: Event) {
    e.preventDefault();
    this.articleService.setCategory(cat);
    this.navigateTo('blog');
  }

  goDestPage(region: string, e: Event) {
    e.preventDefault();
    this.destFilter = region;
    this.navigateTo('destinations');
  }

  navTo(page: string, e: Event) {
    e.preventDefault();
    this.navigateTo(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  resetFilters() {
    this.articleService.setCategory('');
    this.articleService.setSearchQuery('');
  }

  handleArticlePublished(newArticle: Article) {
    this.articles.unshift(newArticle);
    this.openReader(newArticle);
  }

  submitContact() {
    if (this.contactName && this.contactEmail && this.contactMessage) {
      this.contactSent = true;
    }
  }
}
