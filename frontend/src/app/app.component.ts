import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ArticleService } from './services/article.service';
import { Article, Category } from './models/article.model';
import { HeaderComponent } from './components/header/header.component';
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
    ArticleCardComponent,
    ArticleReaderComponent,
    ArticleEditorComponent,
  ],
  template: `
    <div class="app-wrapper">

      <!-- ===== NAVBAR ===== -->
      <app-header></app-header>

      <!-- ================================================ -->
      <!-- ===== HOME PAGE ================================= -->
      <!-- ================================================ -->
      <ng-container *ngIf="currentPage === 'home'">

        <!-- HERO SLIDESHOW -->
        <section class="hero-slideshow">
          <div class="hero-slide"
               *ngFor="let slide of heroSlides; let i = index"
               [class.active]="i === currentSlide"
               [style.background-image]="'url(' + slide.img + ')'">
          </div>
          <div class="hero-overlay"></div>
          <div class="hero-content">
            <p class="hero-eyebrow">🌏 A PERSONAL BLOG</p>
            <h1 class="hero-headline">EXPLORE.<br>DREAM.<br>DISCOVER.</h1>
            <p class="hero-sub">
              A journal of continuous growth — travel stories, life musings, photography,
              and the philosophy of becoming a little better every single day.
            </p>
            <div class="hero-btns">
              <button class="hero-btn-primary" (click)="navTo('blog')">Start Exploring</button>
              <button class="hero-btn-secondary" (click)="navTo('about')">About Me</button>
            </div>
          </div>
          <!-- Slide Dots -->
          <div class="hero-dots">
            <button *ngFor="let s of heroSlides; let i = index"
                    class="hero-dot"
                    [class.active]="i === currentSlide"
                    (click)="goToSlide(i)"></button>
          </div>
          <!-- Scroll indicator -->
          <div class="scroll-indicator">
            <span>SCROLL DOWN</span>
            <i class="fa-solid fa-chevron-down bounce"></i>
          </div>

          <!-- INK STROKE DIVIDER: hero → intro -->
          <div class="ink-divider ink-divider--hero">
            <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              <!-- Main ink brushstroke wave -->
              <path d="M0,52 C60,28 140,64 240,48 C320,36 380,58 460,44 C540,30 600,62 700,50 C800,38 860,60 960,46 C1060,32 1140,58 1240,44 C1320,34 1390,54 1440,48 L1440,80 L0,80 Z" fill="#ffffff"/>
              <!-- Ink drip accent left -->
              <ellipse cx="180" cy="64" rx="6" ry="10" fill="#ffffff" opacity="0.7"/>
              <!-- Ink drip accent center -->
              <ellipse cx="720" cy="58" rx="5" ry="8" fill="#ffffff" opacity="0.5"/>
              <!-- Ink drip accent right -->
              <ellipse cx="1260" cy="62" rx="4" ry="7" fill="#ffffff" opacity="0.6"/>
              <!-- Fine ink scratch lines -->
              <path d="M80,72 Q120,68 160,72" stroke="#ffffff" stroke-width="1.5" fill="none" opacity="0.4"/>
              <path d="M900,66 Q940,62 980,66" stroke="#ffffff" stroke-width="1.5" fill="none" opacity="0.4"/>
            </svg>
          </div>
        </section>

        <!-- WHAT THIS BLOG IS ABOUT -->
        <section class="home-intro">
          <div class="container">
            <div class="intro-layout">
              <div class="intro-text">
                <p class="intro-eyebrow">WELCOME TO KAIZEN</p>
                <h2 class="intro-heading">A Life Lived with Intention</h2>
                <p class="intro-body">
                  <strong>Kaizen (改善)</strong> is the Japanese philosophy of <em>continuous improvement</em> — the belief that small,
                  deliberate changes compound into extraordinary results over time.
                </p>
                <p class="intro-body">
                  This blog is my living journal. Here you'll find travel guides from 38+ countries, reflections on personal growth,
                  photography from the road, honest book reviews, career insights from a software engineer, and raw musings on life.
                  Everything written from direct personal experience. No fluff.
                </p>
                <div class="intro-stats">
                  <div class="istat"><span class="istat-num">38+</span><span class="istat-lbl">Countries Visited</span></div>
                  <div class="istat"><span class="istat-num">10</span><span class="istat-lbl">Blog Articles</span></div>
                  <div class="istat"><span class="istat-num">14K</span><span class="istat-lbl">Photos Taken</span></div>
                  <div class="istat"><span class="istat-num">6+</span><span class="istat-lbl">Years Writing</span></div>
                </div>
              </div>
              <div class="intro-author">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80" alt="Author" class="intro-author-img" />
                <div class="intro-author-card">
                  <h3>Kaizen Explorer</h3>
                  <p>World Traveler & Software Engineer, based in Bangkok & wherever the next flight takes me.</p>
                  <button class="intro-link" (click)="navTo('about')">Read Full Story →</button>
                </div>
              </div>
            </div>
          </div>

          <!-- INK RULED-LINE DIVIDER: intro → features -->
          <div class="ink-divider ink-divider--ruled">
            <svg viewBox="0 0 1200 32" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              <!-- Pencil/quill nib icon left -->
              <polygon points="8,16 20,10 20,22" fill="#e8472a" opacity="0.7"/>
              <line x1="0" y1="16" x2="22" y2="16" stroke="#e8472a" stroke-width="1.5" opacity="0.5"/>
              <!-- Ruled line 1 (solid) -->
              <line x1="32" y1="13" x2="1200" y2="13" stroke="#e0d8cc" stroke-width="1.5"/>
              <!-- Ruled line 2 (dashed, like notebook) -->
              <line x1="32" y1="20" x2="1200" y2="20" stroke="#e0d8cc" stroke-width="0.8" stroke-dasharray="4,8"/>
            </svg>
          </div>
        </section>

        <!-- WHAT YOU'LL FIND HERE — 3 Feature Sections -->
        <section class="home-features">
          <div class="container">
            <p class="section-eyebrow">EXPLORE THE BLOG</p>
            <h2 class="section-title">What You'll Find Here</h2>
            <div class="features-grid">
              <div class="feature-card" (click)="navTo('blog')">
                <div class="fc-img-wrap">
                  <img src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=700&q=80" alt="Blog" class="fc-img" />
                  <div class="fc-overlay">
                    <span class="fc-explore">READ ARTICLES →</span>
                  </div>
                </div>
                <div class="fc-body">
                  <span class="fc-tag">✏️ TRAVEL BLOG</span>
                  <h3>Stories & Insights</h3>
                  <p>Personal essays on travel, growth, health, books, work, and the tiny moments that make life rich. Written from direct experience.</p>
                </div>
              </div>
              <div class="feature-card" (click)="navTo('destinations')">
                <div class="fc-img-wrap">
                  <img src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=700&q=80" alt="Destinations" class="fc-img" />
                  <div class="fc-overlay">
                    <span class="fc-explore">EXPLORE PLACES →</span>
                  </div>
                </div>
                <div class="fc-body">
                  <span class="fc-tag">✈️ DESTINATIONS</span>
                  <h3>Around the World</h3>
                  <p>In-depth travel guides to 38+ countries — from Bali's jungle waterfalls and Japan's ancient temples to Patagonia's granite peaks.</p>
                </div>
              </div>
              <div class="feature-card" (click)="navTo('gallery')">
                <div class="fc-img-wrap">
                  <img src="https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=700&q=80" alt="Gallery" class="fc-img" />
                  <div class="fc-overlay">
                    <span class="fc-explore">VIEW PHOTOS →</span>
                  </div>
                </div>
                <div class="fc-body">
                  <span class="fc-tag">📷 PHOTOGRAPHY</span>
                  <h3>Visual Stories</h3>
                  <p>A curated collection of travel photography — golden hours, misty mountains, ancient streets, and fleeting moments captured on the road.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- INK WAVE DIVIDER: features → topics (dark bg) -->
          <div class="ink-divider ink-divider--dark">
            <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              <path d="M0,20 C200,0 300,40 500,24 C650,10 750,42 950,26 C1100,14 1250,38 1440,22 L1440,60 L0,60 Z" fill="#111111"/>
              <!-- Ink pen nib decorative mark -->
              <path d="M710,8 L720,28 L730,8 Z" fill="#e8472a" opacity="0.8"/>
              <line x1="700" y1="18" x2="740" y2="18" stroke="#e8472a" stroke-width="1" opacity="0.5"/>
            </svg>
          </div>
        </section>

        <!-- TOPICS COVERED -->
        <section class="home-topics">
          <div class="container">
            <p class="section-eyebrow">10 CATEGORIES</p>
            <h2 class="section-title">Topics I Write About</h2>
            <div class="topics-row">
              <div class="topic-chip" *ngFor="let t of topicChips" (click)="filterAndBlog(t.cat)">
                <span class="tc-icon">{{ t.icon }}</span>
                <span class="tc-name">{{ t.name }}</span>
              </div>
            </div>
          </div>

          <!-- INK WAVE DIVIDER: topics (dark) → latest (white) -->
          <div class="ink-divider ink-divider--light">
            <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              <path d="M0,40 C180,16 320,52 520,32 C680,16 820,50 1040,30 C1200,14 1340,44 1440,28 L1440,0 L0,0 Z" fill="#111111"/>
              <!-- Dotted ink accent -->
              <circle cx="360" cy="48" r="3" fill="#ffffff" opacity="0.3"/>
              <circle cx="720" cy="52" r="4" fill="#ffffff" opacity="0.25"/>
              <circle cx="1080" cy="46" r="3" fill="#ffffff" opacity="0.3"/>
            </svg>
          </div>
        </section>

        <!-- LATEST ARTICLES PREVIEW -->
        <section class="home-latest">
          <div class="container">
            <div class="home-latest-header">
              <div>
                <p class="section-eyebrow">FRESH FROM THE JOURNAL</p>
                <h2 class="section-title">Latest Articles</h2>
              </div>
              <button class="see-all-btn" (click)="navTo('blog')">View All Posts →</button>
            </div>
            <div class="latest-grid">
              <div class="latest-card" *ngFor="let a of articles.slice(0, 6)" (click)="openReader(a)">
                <div class="lc-img-wrap">
                  <img [src]="a.cover_image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80'" [alt]="a.title" class="lc-img" loading="lazy" />
                  <span class="lc-cat">{{ a.category }}</span>
                </div>
                <div class="lc-body">
                  <h3 class="lc-title">{{ a.title }}</h3>
                  <p class="lc-excerpt">{{ a.excerpt | slice:0:100 }}...</p>
                  <div class="lc-meta">
                    <span><i class="fa-regular fa-clock"></i> {{ a.read_time }}</span>
                    <span class="lc-read">Read More →</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="home-cta">
              <button class="load-more-btn" (click)="navTo('blog')">SEE ALL ARTICLES</button>
            </div>
          </div>
        </section>

        <!-- DESTINATION TEASER -->
        <section class="home-dest-teaser">
          <div class="dest-teaser-inner">
            <div class="dest-teaser-img-col">
              <div class="dest-teaser-imgs">
                <img src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=500&q=80" alt="Kyoto" class="dti-main" />
                <img src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=300&q=80" alt="Santorini" class="dti-s1" />
                <img src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=300&q=80" alt="Africa" class="dti-s2" />
              </div>
            </div>
            <div class="dest-teaser-text">
              <p class="section-eyebrow" style="color:#e8472a">TRAVEL DEEPER</p>
              <h2 style="font-family:'Lato',sans-serif;font-size:clamp(28px,4vw,44px);font-weight:900;color:#111;margin:0 0 20px;line-height:1.15">
                38 Countries.<br>Countless Stories.
              </h2>
              <p style="font-size:15px;color:#666;line-height:1.8;margin-bottom:28px">
                From the ancient temples of Kyoto and the blue domes of Santorini to the wild plains of the Serengeti — every destination has left its mark. Browse the full collection of travel guides, hidden gems, and practical tips.
              </p>
              <button class="hero-btn-primary" (click)="navTo('destinations')">Explore Destinations</button>
            </div>
          </div>
        </section>

      </ng-container>

      <!-- ================================================ -->
      <!-- ===== BLOG PAGE ================================= -->
      <!-- ================================================ -->
      <ng-container *ngIf="currentPage === 'blog'">
        <!-- Blog Page Hero -->
        <div class="page-hero" style="background-image:url('https://images.unsplash.com/photo-1499750310107-5fef28a66936?auto=format&fit=crop&w=1400&q=80')">
          <div class="page-hero-overlay"></div>
          <div class="page-hero-content">
            <p class="page-hero-label">✏️ THE JOURNAL</p>
            <h1 class="page-hero-title">Blog</h1>
            <p class="page-hero-sub">Travel stories, personal growth, photography, career musings, and everything in between — all written from direct experience.</p>
          </div>
        </div>
        <main class="page-body" id="blog-section">
          <div class="container">
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

      <!-- ================================================ -->
      <!-- ===== DESTINATIONS PAGE ======================== -->
      <!-- ================================================ -->
      <ng-container *ngIf="currentPage === 'destinations'">
        <div class="page-hero" style="background-image:url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1400&q=80')">
          <div class="page-hero-overlay"></div>
          <div class="page-hero-content">
            <p class="page-hero-label">✈️ EXPLORE THE WORLD</p>
            <h1 class="page-hero-title">Destinations</h1>
            <p class="page-hero-sub">Handpicked travel guides from across the globe — volcanic peaks, hidden waterfalls, ancient temples, and seaside villages.</p>
          </div>
        </div>
        <main class="page-body">
          <div class="container">
            <div class="dest-filter-bar">
              <button class="dest-pill" [class.active]="destFilter==='All'" (click)="destFilter='All'">All</button>
              <button class="dest-pill" *ngFor="let r of regions" [class.active]="destFilter===r" (click)="destFilter=r">{{ r }}</button>
            </div>
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

      <!-- ================================================ -->
      <!-- ===== GALLERY PAGE ============================= -->
      <!-- ================================================ -->
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
            <div class="dest-filter-bar">
              <button class="dest-pill" *ngFor="let g of galleryTags" [class.active]="galleryFilter===g" (click)="galleryFilter=g">{{ g }}</button>
            </div>
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

      <!-- ================================================ -->
      <!-- ===== ABOUT PAGE =============================== -->
      <!-- ================================================ -->
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
              <aside class="about-sidebar">
                <div class="author-card">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" alt="Author" class="author-avatar-lg" />
                  <h2 class="author-name">Kaizen Explorer</h2>
                  <p class="author-title">World Traveler & Software Engineer</p>
                  <div class="author-stats">
                    <div class="stat"><span class="stat-num">38</span><span class="stat-lbl">Countries</span></div>
                    <div class="stat"><span class="stat-num">10</span><span class="stat-lbl">Articles</span></div>
                    <div class="stat"><span class="stat-num">14K+</span><span class="stat-lbl">Photos</span></div>
                  </div>
                  <div class="author-socials">
                    <a href="#" title="Instagram"><i class="fa-brands fa-instagram"></i></a>
                    <a href="#" title="Twitter/X"><i class="fa-brands fa-x-twitter"></i></a>
                    <a href="#" title="YouTube"><i class="fa-brands fa-youtube"></i></a>
                    <a href="#" title="GitHub"><i class="fa-brands fa-github"></i></a>
                  </div>
                </div>
              </aside>
              <div class="about-content">
                <div class="about-section">
                  <h2>The Kaizen Story</h2>
                  <p><strong>Kaizen (改善)</strong> is a Japanese word meaning "continuous improvement." This blog was born from a simple belief: that small, deliberate improvements in every aspect of life compound into something extraordinary over time.</p>
                  <p>I started writing here as a personal journal. It quickly became something more: a documentation of a life lived with curiosity — 38 countries, countless engineering challenges, thousands of books, and an ongoing experiment in becoming a little better every day.</p>
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

      <!-- ================================================ -->
      <!-- ===== CONTACT PAGE ============================= -->
      <!-- ================================================ -->
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

      <!-- ===== FOOTER ===== -->
      <footer class="site-footer">
        <div class="container footer-inner">
          <div class="footer-logo-area">
            <span class="footer-logo">🌏 KAIZEN</span>
            <p class="footer-tagline">Explore. Dream. Discover.</p>
            <p class="footer-desc">A personal blog dedicated to continuous improvement,<br>world travel, technology, and life philosophy.</p>
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
                <li><a href="#" (click)="navTo('about'); $event.preventDefault()">About</a></li>
                <li><a href="#" (click)="navTo('contact'); $event.preventDefault()">Contact</a></li>
                <li><a href="#" (click)="navTo('gallery'); $event.preventDefault()">Gallery</a></li>
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
    /* ===== BASE ===== */
    .app-wrapper { min-height: 100vh; display: flex; flex-direction: column; }
    .page-body { flex: 1; background: #fff; padding: 56px 0 80px; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }

    /* ===== HERO SLIDESHOW ===== */
    .hero-slideshow {
      position: relative;
      height: 100vh;
      min-height: 600px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .hero-slide {
      position: absolute;
      inset: 0;
      background-size: cover;
      background-position: center;
      opacity: 0;
      transition: opacity 1.2s ease-in-out;
      transform: scale(1.05);
      animation: kenBurns 8s ease-in-out infinite alternate;
    }
    .hero-slide.active { opacity: 1; }
    @keyframes kenBurns {
      from { transform: scale(1.0); }
      to   { transform: scale(1.08); }
    }
    .hero-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        to bottom,
        rgba(0,0,0,0.25) 0%,
        rgba(0,0,0,0.55) 60%,
        rgba(0,0,0,0.75) 100%
      );
    }
    .hero-content {
      position: relative;
      text-align: center;
      color: #fff;
      padding: 0 20px;
      z-index: 2;
      animation: heroFadeIn 1s ease forwards;
    }
    @keyframes heroFadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .hero-eyebrow {
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.8);
      margin-bottom: 16px;
    }
    .hero-headline {
      font-family: 'Lato', sans-serif;
      font-size: clamp(44px, 8vw, 88px);
      font-weight: 900;
      letter-spacing: -2px;
      line-height: 0.95;
      margin: 0 0 24px;
      text-shadow: 0 4px 30px rgba(0,0,0,0.5);
    }
    .hero-sub {
      font-size: clamp(14px, 2vw, 17px);
      color: rgba(255,255,255,0.85);
      max-width: 580px;
      margin: 0 auto 36px;
      line-height: 1.7;
    }
    .hero-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
    .hero-btn-primary {
      padding: 14px 34px;
      background: #e8472a;
      color: #fff;
      border: 2px solid #e8472a;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.25s;
      border-radius: 2px;
    }
    .hero-btn-primary:hover { background: transparent; color: #fff; }
    .hero-btn-secondary {
      padding: 14px 34px;
      background: transparent;
      color: #fff;
      border: 2px solid rgba(255,255,255,0.7);
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.25s;
      border-radius: 2px;
    }
    .hero-btn-secondary:hover { background: rgba(255,255,255,0.15); }

    /* Slide Dots */
    .hero-dots {
      position: absolute;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 8px;
      z-index: 3;
    }
    .hero-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: rgba(255,255,255,0.4);
      border: none;
      cursor: pointer;
      transition: all 0.3s;
      padding: 0;
    }
    .hero-dot.active { background: #fff; width: 24px; border-radius: 4px; }

    /* Scroll indicator */
    .scroll-indicator {
      position: absolute;
      bottom: 28px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      color: rgba(255,255,255,0.6);
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.15em;
      z-index: 3;
    }
    .bounce {
      animation: bounceAnim 1.8s ease infinite;
    }
    @keyframes bounceAnim {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(6px); }
    }

    /* ===== HOME INTRO SECTION ===== */
    .home-intro {
      background: #fff;
      padding: 80px 0 0;
    }
    .intro-layout {
      display: grid;
      grid-template-columns: 1.4fr 1fr;
      gap: 60px;
      align-items: center;
    }
    .intro-eyebrow {
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #e8472a;
      margin-bottom: 12px;
    }
    .intro-heading {
      font-family: 'Lato', sans-serif;
      font-size: clamp(28px, 4vw, 42px);
      font-weight: 900;
      color: #111;
      margin: 0 0 20px;
      line-height: 1.15;
    }
    .intro-body { font-size: 15px; color: #555; line-height: 1.8; margin-bottom: 14px; }
    .intro-stats {
      display: flex;
      gap: 28px;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #f0f0f0;
      flex-wrap: wrap;
    }
    .istat { text-align: center; }
    .istat-num { display: block; font-size: 28px; font-weight: 900; color: #e8472a; font-family: 'Lato', sans-serif; }
    .istat-lbl { font-size: 11px; color: #aaa; text-transform: uppercase; letter-spacing: 0.08em; }

    .intro-author { position: relative; }
    .intro-author-img {
      width: 100%;
      aspect-ratio: 3/4;
      object-fit: cover;
      border-radius: 10px;
      box-shadow: 16px 16px 0 #e8472a22;
    }
    .intro-author-card {
      position: absolute;
      bottom: -20px;
      left: -20px;
      background: #111;
      color: #fff;
      padding: 20px 22px;
      border-radius: 8px;
      max-width: 240px;
      box-shadow: 0 12px 30px rgba(0,0,0,0.25);
    }
    .intro-author-card h3 { font-size: 15px; font-weight: 800; margin: 0 0 6px; }
    .intro-author-card p { font-size: 12px; color: #bbb; margin: 0 0 12px; line-height: 1.5; }
    .intro-link {
      background: none; border: none;
      color: #e8472a; font-weight: 700; font-size: 12px; cursor: pointer;
      padding: 0; text-transform: uppercase; letter-spacing: 0.06em;
    }
    .intro-link:hover { text-decoration: underline; }

    /* ===== HOME FEATURES ===== */
    .home-features {
      background: #f8f8f8;
      padding: 80px 0;
    }
    .section-eyebrow {
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #e8472a;
      margin-bottom: 10px;
      display: block;
    }
    .section-title {
      font-family: 'Lato', sans-serif;
      font-size: clamp(24px, 3.5vw, 36px);
      font-weight: 900;
      color: #111;
      margin: 0 0 40px;
      line-height: 1.15;
    }
    .features-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 28px;
    }
    .feature-card {
      background: #fff;
      border-radius: 10px;
      overflow: hidden;
      cursor: pointer;
      transition: transform 0.3s, box-shadow 0.3s;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    }
    .feature-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(0,0,0,0.12); }
    .fc-img-wrap { position: relative; aspect-ratio: 4/3; overflow: hidden; }
    .fc-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
    .feature-card:hover .fc-img { transform: scale(1.06); }
    .fc-overlay {
      position: absolute; inset: 0;
      background: rgba(0,0,0,0.4);
      display: flex; align-items: center; justify-content: center;
      opacity: 0; transition: opacity 0.3s;
    }
    .feature-card:hover .fc-overlay { opacity: 1; }
    .fc-explore { color: #fff; font-size: 13px; font-weight: 700; letter-spacing: 0.12em; }
    .fc-body { padding: 22px 24px 26px; }
    .fc-tag { font-size: 10px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: #e8472a; display: block; margin-bottom: 8px; }
    .fc-body h3 { font-size: 18px; font-weight: 800; color: #111; margin: 0 0 10px; font-family: 'Lato', sans-serif; }
    .fc-body p { font-size: 13px; color: #777; line-height: 1.7; margin: 0; }

    /* ===== HOME TOPICS ===== */
    .home-topics {
      background: #111;
      padding: 64px 0;
    }
    .home-topics .section-title { color: #fff; }
    .home-topics .section-eyebrow { color: #e8472a; }
    .topics-row { display: flex; flex-wrap: wrap; gap: 12px; }
    .topic-chip {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      border: 1.5px solid rgba(255,255,255,0.15);
      border-radius: 40px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .topic-chip:hover { border-color: #e8472a; background: rgba(232,71,42,0.1); }
    .tc-icon { font-size: 16px; }
    .tc-name { font-size: 12px; font-weight: 700; letter-spacing: 0.06em; color: #ccc; }
    .topic-chip:hover .tc-name { color: #fff; }

    /* ===== HOME LATEST ARTICLES ===== */
    .home-latest {
      background: #fff;
      padding: 80px 0;
    }
    .home-latest-header {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      margin-bottom: 36px;
      flex-wrap: wrap;
      gap: 16px;
    }
    .home-latest-header .section-title { margin-bottom: 0; }
    .see-all-btn {
      background: none; border: none;
      color: #e8472a; font-weight: 700; font-size: 13px;
      cursor: pointer; letter-spacing: 0.04em;
    }
    .see-all-btn:hover { text-decoration: underline; }
    .latest-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
    }
    .latest-card {
      border: 1px solid #eee;
      border-radius: 10px;
      overflow: hidden;
      cursor: pointer;
      transition: transform 0.25s, box-shadow 0.25s;
    }
    .latest-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.1); }
    .lc-img-wrap { position: relative; aspect-ratio: 16/10; overflow: hidden; }
    .lc-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
    .latest-card:hover .lc-img { transform: scale(1.04); }
    .lc-cat {
      position: absolute; top: 12px; left: 12px;
      background: #e8472a; color: #fff;
      font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
      padding: 3px 10px; border-radius: 20px;
    }
    .lc-body { padding: 18px 20px 20px; }
    .lc-title { font-size: 15px; font-weight: 800; color: #111; margin: 0 0 8px; line-height: 1.4; font-family: 'Lato', sans-serif; }
    .lc-excerpt { font-size: 12px; color: #888; line-height: 1.6; margin: 0 0 14px; }
    .lc-meta { display: flex; align-items: center; justify-content: space-between; font-size: 11px; color: #bbb; }
    .lc-meta i { margin-right: 4px; }
    .lc-read { color: #e8472a; font-weight: 700; font-size: 11px; }
    .home-cta { text-align: center; margin-top: 48px; }

    /* ===== DESTINATION TEASER ===== */
    .home-dest-teaser {
      background: #f4f1ec;
      padding: 80px 0;
    }
    .dest-teaser-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
      display: grid;
      grid-template-columns: 1.1fr 1fr;
      gap: 60px;
      align-items: center;
    }
    .dest-teaser-imgs {
      position: relative;
      height: 440px;
    }
    .dti-main {
      position: absolute;
      left: 0; top: 0;
      width: 75%;
      height: 100%;
      object-fit: cover;
      border-radius: 10px;
      box-shadow: 0 16px 40px rgba(0,0,0,0.15);
    }
    .dti-s1 {
      position: absolute;
      right: 0; top: 0;
      width: 45%;
      height: 48%;
      object-fit: cover;
      border-radius: 10px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    }
    .dti-s2 {
      position: absolute;
      right: 0; bottom: 0;
      width: 45%;
      height: 48%;
      object-fit: cover;
      border-radius: 10px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    }

    /* ===== PAGE HERO ===== */
    .page-hero {
      position: relative;
      height: 380px;
      background-size: cover;
      background-position: center;
      margin-top: 62px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .page-hero-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.7) 100%);
    }
    .page-hero-content { position: relative; text-align: center; color: #fff; padding: 0 20px; }
    .page-hero-label { font-size: 12px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.75); margin-bottom: 12px; }
    .page-hero-title { font-family: 'Lato', sans-serif; font-size: clamp(36px, 6vw, 64px); font-weight: 900; letter-spacing: -1px; margin: 0 0 16px; }
    .page-hero-sub { font-size: 16px; color: rgba(255,255,255,0.85); max-width: 600px; margin: 0 auto; line-height: 1.6; }

    /* ===== BLOG PAGE SPECIFICS ===== */
    .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; flex-wrap: wrap; gap: 12px; }
    .section-heading { font-family: 'Lato', sans-serif; font-size: 15px; font-weight: 700; letter-spacing: 0.08em; color: #111; text-transform: uppercase; padding-bottom: 10px; border-bottom: 3px solid #111; position: relative; margin: 0; }
    .section-heading::after { content: ''; position: absolute; bottom: -3px; left: 0; width: 40px; height: 3px; background: #e8472a; }
    .filter-pill { display: inline-flex; align-items: center; gap: 8px; background: #f5f5f5; border: 1px solid #e0e0e0; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; color: #555; }
    .clear-filter { background: none; border: none; cursor: pointer; font-size: 16px; color: #999; line-height: 1; padding: 0; }
    .clear-filter:hover { color: #e8472a; }
    .posts-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
    .empty-state { text-align: center; padding: 80px 20px; }
    .empty-icon { font-size: 52px; color: #ccc; margin-bottom: 20px; }
    .empty-state h3 { font-size: 22px; color: #333; margin-bottom: 10px; }
    .empty-state p { color: #888; margin-bottom: 24px; }
    .load-more-wrap { text-align: center; margin-top: 48px; }
    .load-more-btn { display: inline-block; padding: 12px 36px; font-family: 'Nunito', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #333; background: transparent; border: 2px solid #333; cursor: pointer; transition: all 0.25s; }
    .load-more-btn:hover { background: #333; color: #fff; }

    /* ===== DESTINATIONS ===== */
    .dest-filter-bar { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 36px; }
    .dest-pill { padding: 8px 20px; border: 1.5px solid #ddd; border-radius: 30px; font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #666; cursor: pointer; background: #fff; transition: all 0.2s; }
    .dest-pill:hover, .dest-pill.active { background: #111; color: #fff; border-color: #111; }
    .dest-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
    .dest-card { border-radius: 10px; overflow: hidden; border: 1px solid #eee; cursor: pointer; transition: transform 0.3s, box-shadow 0.3s; }
    .dest-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(0,0,0,0.12); }
    .dest-img-wrap { position: relative; aspect-ratio: 4/3; overflow: hidden; }
    .dest-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
    .dest-card:hover .dest-img { transform: scale(1.07); }
    .dest-region-badge { position: absolute; top: 12px; left: 12px; background: #e8472a; color: #fff; font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 4px 10px; border-radius: 20px; }
    .dest-info { padding: 18px 20px 20px; }
    .dest-name { font-family: 'Lato', sans-serif; font-size: 18px; font-weight: 800; color: #111; margin: 0 0 8px; }
    .dest-desc { font-size: 13px; color: #777; line-height: 1.6; margin: 0 0 14px; }
    .dest-meta { display: flex; align-items: center; gap: 14px; font-size: 12px; color: #aaa; }
    .dest-meta i { margin-right: 4px; }
    .dest-read { margin-left: auto; color: #e8472a; font-weight: 700; font-size: 12px; }

    /* ===== GALLERY ===== */
    .gallery-grid { columns: 3; column-gap: 16px; }
    .gallery-item { position: relative; break-inside: avoid; margin-bottom: 16px; border-radius: 8px; overflow: hidden; cursor: pointer; }
    .gallery-img { width: 100%; display: block; transition: transform 0.4s; }
    .gallery-item:hover .gallery-img { transform: scale(1.04); }
    .gallery-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%); opacity: 0; transition: opacity 0.3s; display: flex; flex-direction: column; justify-content: flex-end; padding: 16px; }
    .gallery-item:hover .gallery-overlay { opacity: 1; }
    .gallery-caption { color: #fff; font-size: 13px; font-weight: 600; margin: 0 0 4px; }
    .gallery-tag { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #e8472a; background: rgba(0,0,0,0.4); padding: 2px 8px; border-radius: 10px; align-self: flex-start; }

    /* ===== ABOUT ===== */
    .about-layout { display: grid; grid-template-columns: 300px 1fr; gap: 60px; align-items: flex-start; }
    .author-card { background: #fff; border: 1px solid #eee; border-radius: 12px; padding: 28px 24px; text-align: center; position: sticky; top: 90px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
    .author-avatar-lg { width: 110px; height: 110px; border-radius: 50%; object-fit: cover; border: 4px solid #e8472a; margin-bottom: 14px; }
    .author-name { font-family: 'Lato', sans-serif; font-size: 20px; font-weight: 800; color: #111; margin: 0 0 4px; }
    .author-title { font-size: 13px; color: #888; margin: 0 0 20px; }
    .author-stats { display: flex; justify-content: center; gap: 20px; margin-bottom: 20px; padding: 16px 0; border-top: 1px solid #f0f0f0; border-bottom: 1px solid #f0f0f0; }
    .stat { text-align: center; }
    .stat-num { display: block; font-size: 22px; font-weight: 800; color: #e8472a; }
    .stat-lbl { font-size: 11px; color: #aaa; text-transform: uppercase; letter-spacing: 0.06em; }
    .author-socials { display: flex; justify-content: center; gap: 12px; }
    .author-socials a { font-size: 18px; color: #aaa; transition: color 0.2s; }
    .author-socials a:hover { color: #e8472a; }
    .about-section { margin-bottom: 48px; }
    .about-section h2 { font-family: 'Lato', sans-serif; font-size: 26px; font-weight: 800; color: #111; margin: 0 0 16px; padding-bottom: 12px; border-bottom: 2px solid #f0f0f0; }
    .about-section p { font-size: 15px; color: #555; line-height: 1.8; margin-bottom: 14px; }
    .topics-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
    .topic-card { background: #f9f9f9; border: 1px solid #eee; border-radius: 10px; padding: 18px 20px; transition: border-color 0.2s; }
    .topic-card:hover { border-color: #e8472a; }
    .topic-icon { font-size: 24px; display: block; margin-bottom: 8px; }
    .topic-card h3 { font-size: 14px; font-weight: 700; color: #222; margin: 0 0 6px; }
    .topic-card p { font-size: 12px; color: #888; margin: 0; line-height: 1.5; }
    .timeline { display: flex; flex-direction: column; gap: 0; }
    .timeline-item { display: flex; gap: 20px; padding-bottom: 28px; border-left: 2px solid #eee; padding-left: 24px; position: relative; }
    .timeline-item::before { content: ''; position: absolute; left: -7px; top: 4px; width: 12px; height: 12px; border-radius: 50%; background: #e8472a; border: 2px solid #fff; box-shadow: 0 0 0 2px #e8472a; }
    .timeline-year { font-size: 13px; font-weight: 800; color: #e8472a; white-space: nowrap; min-width: 44px; }
    .timeline-body h4 { font-size: 15px; font-weight: 700; color: #222; margin: 0 0 6px; }
    .timeline-body p { font-size: 13px; color: #888; margin: 0; line-height: 1.6; }

    /* ===== CONTACT ===== */
    .contact-layout { display: grid; grid-template-columns: 1fr 1.3fr; gap: 60px; align-items: flex-start; }
    .contact-info h2 { font-family: 'Lato', sans-serif; font-size: 28px; font-weight: 800; color: #111; margin: 0 0 14px; }
    .contact-info > p { font-size: 15px; color: #666; line-height: 1.7; margin-bottom: 32px; }
    .contact-items { display: flex; flex-direction: column; gap: 20px; margin-bottom: 32px; }
    .contact-item { display: flex; align-items: flex-start; gap: 16px; }
    .ci-icon { width: 44px; height: 44px; background: linear-gradient(135deg, #e8472a, #f5782f); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 16px; flex-shrink: 0; }
    .contact-item h4 { font-size: 13px; font-weight: 700; color: #222; margin: 0 0 3px; }
    .contact-item p { font-size: 13px; color: #888; margin: 0; }
    .contact-socials { display: flex; flex-wrap: wrap; gap: 10px; }
    .social-link { display: flex; align-items: center; gap: 8px; padding: 8px 16px; border: 1.5px solid #e0e0e0; border-radius: 8px; font-size: 13px; font-weight: 600; color: #555; transition: all 0.2s; }
    .social-link:hover { border-color: #e8472a; color: #e8472a; }
    .contact-card { background: #fff; border: 1px solid #eee; border-radius: 14px; padding: 32px; box-shadow: 0 8px 30px rgba(0,0,0,0.07); }
    .contact-card h3 { font-size: 20px; font-weight: 800; color: #111; margin: 0 0 24px; }
    .contact-form { display: flex; flex-direction: column; gap: 16px; }
    .cf-group { display: flex; flex-direction: column; gap: 6px; }
    .cf-group label { font-size: 11.5px; font-weight: 700; color: #333; text-transform: uppercase; letter-spacing: 0.06em; }
    .cf-group input, .cf-group select, .cf-group textarea { padding: 10px 14px; border: 1.5px solid #e5e5e5; border-radius: 8px; font-size: 14px; font-family: inherit; background: #fafafa; color: #222; transition: border-color 0.2s; }
    .cf-group input:focus, .cf-group select:focus, .cf-group textarea:focus { outline: none; border-color: #e8472a; background: #fff; }
    .cf-group textarea { resize: vertical; min-height: 120px; line-height: 1.6; }
    .cf-submit { padding: 12px 28px; background: linear-gradient(135deg, #e8472a, #f5782f); color: #fff; border: none; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: opacity 0.2s, transform 0.15s; }
    .cf-submit:hover { opacity: 0.9; transform: translateY(-1px); }
    .contact-success { text-align: center; padding: 40px 20px; }
    .contact-success i { font-size: 56px; color: #27ae60; margin-bottom: 16px; display: block; }
    .contact-success h3 { font-size: 22px; font-weight: 800; color: #111; margin-bottom: 10px; }
    .contact-success p { color: #888; margin-bottom: 24px; }

    /* ===== FOOTER ===== */
    .site-footer { background: #111; color: #aaa; }
    .footer-inner { display: grid; grid-template-columns: 1.5fr 2fr; gap: 60px; padding: 60px 0 40px; }
    .footer-logo { font-family: 'Nunito', sans-serif; font-size: 22px; font-weight: 800; color: #fff; letter-spacing: 2px; display: block; margin-bottom: 8px; }
    .footer-tagline { font-style: italic; color: #888; font-size: 14px; margin-bottom: 14px; }
    .footer-desc { font-size: 13px; line-height: 1.7; color: #777; margin-bottom: 20px; }
    .footer-social { display: flex; gap: 14px; }
    .footer-social a { font-size: 18px; color: #777; transition: color 0.2s; }
    .footer-social a:hover { color: #e8472a; }
    .footer-links-area { display: flex; gap: 40px; justify-content: flex-end; }
    .footer-col h4 { font-family: 'Lato', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #fff; margin-bottom: 16px; }
    .footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 8px; }
    .footer-col ul a { font-size: 13px; color: #777; transition: color 0.2s; }
    .footer-col ul a:hover { color: #e8472a; }
    .footer-bottom { border-top: 1px solid #222; padding: 20px; text-align: center; font-size: 12px; color: #555; }

    /* ===== INK DIVIDERS (writing-themed section transitions) ===== */
    .ink-divider {
      width: 100%;
      overflow: hidden;
      line-height: 0;
      pointer-events: none;
    }
    .ink-divider svg {
      display: block;
      width: 100%;
    }

    /* Hero → Intro: white brushstroke on dark hero */
    .ink-divider--hero {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 80px;
      z-index: 3;
    }
    .ink-divider--hero svg { height: 80px; }

    /* Intro → Features: notebook ruled lines with quill nib */
    .ink-divider--ruled {
      padding: 4px 0;
      background: #fff;
      margin-top: 32px;
    }
    .ink-divider--ruled svg { height: 32px; }

    /* Features (white) → Topics (dark): wave transition into dark */
    .ink-divider--dark {
      background: #f8f8f8;
      height: 60px;
      margin-top: -1px;
    }
    .ink-divider--dark svg { height: 60px; }

    /* Topics (dark) → Latest (white): wave back to white */
    .ink-divider--light {
      background: #111;
      height: 60px;
      margin-bottom: -1px;
    }
    .ink-divider--light svg { height: 60px; }

    /* ===== RESPONSIVE ===== */

    @media (max-width: 960px) {
      .intro-layout { grid-template-columns: 1fr; }
      .intro-author-card { position: static; max-width: 100%; margin-top: 16px; }
      .features-grid { grid-template-columns: 1fr; }
      .latest-grid { grid-template-columns: repeat(2, 1fr); }
      .posts-grid { grid-template-columns: repeat(2, 1fr); }
      .dest-grid { grid-template-columns: repeat(2, 1fr); }
      .gallery-grid { columns: 2; }
      .about-layout { grid-template-columns: 1fr; }
      .author-card { position: static; }
      .contact-layout { grid-template-columns: 1fr; }
      .topics-grid { grid-template-columns: 1fr; }
      .footer-inner { grid-template-columns: 1fr; gap: 30px; }
      .footer-links-area { justify-content: flex-start; }
      .dest-teaser-inner { grid-template-columns: 1fr; }
      .dest-teaser-imgs { height: 300px; }
    }
    @media (max-width: 600px) {
      .features-grid { grid-template-columns: 1fr; }
      .latest-grid { grid-template-columns: 1fr; }
      .posts-grid { grid-template-columns: 1fr; }
      .dest-grid { grid-template-columns: 1fr; }
      .gallery-grid { columns: 1; }
      .footer-links-area { flex-wrap: wrap; }
      .hero-btns { flex-direction: column; align-items: center; }
      .intro-stats { gap: 16px; }
    }
  `]
})
export class AppComponent implements OnInit, OnDestroy {
  articles: Article[] = [];
  featuredArticle: Article | null = null;
  categories: Category[] = [];

  activeCategory = '';
  searchQuery = '';
  selectedArticle: Article | null = null;
  showPublisherModal = false;
  currentPage = 'home';

  // Hero slideshow
  heroSlides = [
    { img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=80' },
    { img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80' },
    { img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1600&q=80' },
    { img: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1600&q=80' },
    { img: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1600&q=80' },
  ];
  currentSlide = 0;
  private slideInterval: any;

  // Topics for home page chips
  topicChips = [
    { icon: '✏️', name: 'Daily Life', cat: 'Daily Life / Musings' },
    { icon: '🌱', name: 'Personal Growth', cat: 'Personal Growth' },
    { icon: '✈️', name: 'Travel & Places', cat: 'Travel & Places' },
    { icon: '❤️', name: 'Relationships', cat: 'Relationships' },
    { icon: '💪', name: 'Health', cat: 'Health & Wellbeing' },
    { icon: '💼', name: 'Work & Career', cat: 'Work & Career' },
    { icon: '📚', name: 'Books & Learning', cat: 'Books & Learning' },
    { icon: '🎯', name: 'Goals & Projects', cat: 'Goals & Projects' },
    { icon: '💬', name: 'Random Thoughts', cat: 'Random Thoughts / Rants' },
    { icon: '📷', name: 'Photography', cat: 'Photography / Snapshots' },
  ];

  // Destinations
  destFilter = 'All';
  regions = ['Asia', 'Europe', 'Americas', 'Africa', 'Oceania', 'Middle East'];
  allDestinations = [
    { name: 'Bali, Indonesia', region: 'Asia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80', desc: 'Emerald rice terraces, ancient temples, and jungle waterfalls on the Island of the Gods.', photos: '240', articles: '3 guides' },
    { name: 'Kyoto, Japan', region: 'Asia', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80', desc: 'Zen gardens, bamboo forests, and thousand-year-old shrines in Japan\'s ancient imperial city.', photos: '380', articles: '4 guides' },
    { name: 'Chiang Mai, Thailand', region: 'Asia', image: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6?auto=format&fit=crop&w=600&q=80', desc: 'Mountain temples, night markets, and elephant sanctuaries in Northern Thailand\'s cultural heart.', photos: '185', articles: '2 guides' },
    { name: 'Santorini, Greece', region: 'Europe', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=600&q=80', desc: 'Iconic white-washed cliffs, blue-domed churches, and legendary Aegean sunsets.', photos: '312', articles: '3 guides' },
    { name: 'Amalfi Coast, Italy', region: 'Europe', image: 'https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?auto=format&fit=crop&w=600&q=80', desc: 'Cliffside villages draped in bougainvillea above turquoise Mediterranean waters.', photos: '278', articles: '2 guides' },
    { name: 'Iceland Highlands', region: 'Europe', image: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=600&q=80', desc: 'Glaciers, geysers, and the ethereal northern lights under Arctic skies.', photos: '420', articles: '5 guides' },
    { name: 'Patagonia, Argentina', region: 'Americas', image: 'https://images.unsplash.com/photo-1531761535209-180857e963b9?auto=format&fit=crop&w=600&q=80', desc: 'Jagged granite towers, turquoise lakes, and raw Andean wilderness at the end of the earth.', photos: '195', articles: '2 guides' },
    { name: 'Machu Picchu, Peru', region: 'Americas', image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=600&q=80', desc: 'The lost city of the Incas, perched impossibly high in the Andean cloud forest.', photos: '267', articles: '3 guides' },
    { name: 'Serengeti, Tanzania', region: 'Africa', image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=600&q=80', desc: 'Witness the Great Migration — millions of wildebeest crossing golden savannah under vast African skies.', photos: '340', articles: '2 guides' },
  ];
  get filteredDestinations() {
    if (this.destFilter === 'All') return this.allDestinations;
    return this.allDestinations.filter(d => d.region === this.destFilter);
  }

  // Gallery
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

  // About
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
    { year: '2024', title: 'Built Full-Stack Blog Platform', desc: 'Created this blog from scratch with Golang, Angular, and CockroachDB.' },
    { year: '2026', title: 'Still Going', desc: '38 countries, 10+ articles, and a growing conviction that the best stories are still ahead.' },
  ];

  // Contact
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
      if (e.detail?.dest) this.destFilter = e.detail.dest;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Start hero auto-slide
    this.startSlideshow();
  }

  ngOnDestroy() {
    if (this.slideInterval) clearInterval(this.slideInterval);
  }

  startSlideshow() {
    this.slideInterval = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.heroSlides.length;
    }, 5000);
  }

  goToSlide(i: number) {
    this.currentSlide = i;
    clearInterval(this.slideInterval);
    this.startSlideshow();
  }

  navigateTo(page: string) {
    this.currentPage = page;
    window.dispatchEvent(new CustomEvent('kaizen:page-changed', { detail: { page } }));
  }

  navTo(page: string, e?: Event) {
    if (e) e.preventDefault();
    this.navigateTo(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  filterAndBlog(cat: string) {
    this.articleService.setCategory(cat);
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
