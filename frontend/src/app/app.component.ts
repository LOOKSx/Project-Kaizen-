import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
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
          <button class="hero-edit-img-btn" *ngIf="isAdmin" (click)="openImageEditor('currentSlideImg', 'Home Hero Slide #' + (currentSlide + 1))" title="Change slide image">
            <i class="fa-solid fa-camera"></i> Change Image
          </button>
          <div class="hero-content">
            <p class="hero-eyebrow">A PERSONAL JOURNAL</p>
            <h1 class="hero-headline">EXPLORE.<br>DREAM.<br>DISCOVER.</h1>
            <p class="hero-sub">
              A journal of continuous growth — travel stories, life musings, photography,
              and the philosophy of becoming a little better every single day.
            </p>
            <div class="hero-btns">
              <button class="hero-btn-primary" (click)="navTo('categories')">Browse Categories</button>
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
                <div class="section-title-wrap">
                  <div>
                    <p class="intro-eyebrow">WELCOME TO KAIZEN</p>
                    <h2 class="intro-heading" style="margin: 0;">{{ aboutTexts.storyTitle }}</h2>
                  </div>
                  <button class="hero-edit-img-btn" *ngIf="isAdmin" (click)="openAboutStoryEditor()" style="font-size: 11px; padding: 5px 12px; background: #2563eb; color: #ffffff; border: none; border-radius: 4px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;" title="Edit Story Text">
                    <i class="fa-solid fa-pen"></i> Edit Story Text
                  </button>
                </div>
                <p class="intro-body">
                  {{ aboutTexts.storyP1 }}
                </p>
                <p class="intro-body">
                  {{ aboutTexts.storyP2 }}
                </p>
                <div class="intro-stats">
                  <div class="istat"><span class="istat-num">{{ allDestinations.length }}</span><span class="istat-lbl">Destinations</span></div>
                  <div class="istat"><span class="istat-num">{{ articles.length }}</span><span class="istat-lbl">Blog Articles</span></div>
                  <div class="istat"><span class="istat-num">{{ photos.length }}</span><span class="istat-lbl">Photos Shared</span></div>
                  <div class="istat"><span class="istat-num">{{ categories.length || 10 }}</span><span class="istat-lbl">Categories</span></div>
                </div>
              </div>
              <div class="intro-author">
                <img [src]="authorAvatar" [alt]="authorName" class="intro-author-img" />
                <div class="intro-author-card">
                  <div class="section-title-wrap" style="margin-bottom: 8px;">
                    <div>
                      <h3 style="margin: 0;">{{ authorName }}</h3>
                      <p style="margin: 4px 0 0; font-size: 13px; color: #777;">{{ authorTitle }}</p>
                    </div>
                    <button class="hero-edit-img-btn" *ngIf="isAdmin" (click)="openProfileSettingsModal()" style="font-size: 10px; padding: 4px 10px; background: #2563eb; color: #ffffff; border: none; border-radius: 4px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;" title="Edit Profile &amp; Links">
                      <i class="fa-solid fa-user-gear"></i> Edit
                    </button>
                  </div>
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
              <div class="feature-card" (click)="navTo('categories')">
                <div class="fc-img-wrap">
                  <img src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=700&q=80" alt="Categories" class="fc-img" />
                  <div class="fc-overlay">
                    <span class="fc-explore">EXPLORE CATEGORIES →</span>
                  </div>
                </div>
                <div class="fc-body">
                  <span class="fc-tag">TRAVEL STORIES</span>
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
                  <span class="fc-tag">DESTINATIONS</span>
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
                  <span class="fc-tag">PHOTOGRAPHY</span>
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
              <button class="see-all-btn" (click)="navTo('categories')">View All Topics →</button>
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
                    <span><i class="fa-regular fa-calendar"></i> {{ a.created_at | date:'MMM d' }}</span>
                    <span class="lc-read">Read More →</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="home-cta">
              <button class="load-more-btn" (click)="navTo('categories')">BROWSE ALL CATEGORIES</button>
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
            <div class="dest-teaser-text" style="position: relative;">
              <button class="hero-edit-img-btn" *ngIf="isAdmin" (click)="openHomeTeaserEditor()" style="position: absolute; top: -10px; right: 0; font-size: 11px; padding: 4px 12px; background: #2563eb; color: #ffffff; border: none; border-radius: 4px; font-weight: 700; cursor: pointer;" title="Edit Teaser Text">
                <i class="fa-solid fa-pen-to-square"></i> Edit Teaser
              </button>
              <p class="section-eyebrow">{{ homeTexts.teaserEyebrow }}</p>
              <h2 class="dest-teaser-title">
                {{ homeTexts.teaserTitle }}
              </h2>
              <p class="dest-teaser-desc">
                {{ homeTexts.teaserDesc }}
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
        <div class="page-hero" [style.background-image]="'url(' + blogHeroImg + ')'">
          <div class="hero-admin-actions" *ngIf="isAdmin">
            <button class="hero-edit-img-btn" (click)="openImageEditor('blogHeroImg', 'Blog Hero Banner')" title="Change hero image">
              <i class="fa-solid fa-camera"></i> Change Image
            </button>
            <button class="hero-edit-img-btn hero-edit-text-btn" (click)="openHeroTextEditor('blog')" title="Edit Hero Text">
              <i class="fa-solid fa-pen-to-square"></i> Edit Text
            </button>
          </div>
          <div class="page-hero-overlay"></div>
          <div class="page-hero-content">
            <p class="page-hero-label">{{ pageHeroTexts.blog.label }}</p>
            <h1 class="page-hero-title">{{ pageHeroTexts.blog.title }}</h1>
            <p class="page-hero-sub">{{ pageHeroTexts.blog.sub }}</p>
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
            <div class="posts-grid" *ngIf="filteredBlogArticles.length > 0">
              <app-article-card
                *ngFor="let item of filteredBlogArticles"
                [article]="item"
                [isAdmin]="isAdmin"
                (onSelect)="openReader($event)"
                (onEdit)="openEditModal($event)"
                (onDelete)="deleteArticleFromReader($event)"
              ></app-article-card>
            </div>
            <div class="empty-state" *ngIf="filteredBlogArticles.length === 0">
              <i class="fa-solid fa-compass empty-icon"></i>
              <h3>No Articles Found</h3>
              <p>Try searching for a different keyword or browse another category.</p>
              <button class="btn btn-secondary" (click)="resetFilters()">View All Posts</button>
            </div>
            <div class="load-more-wrap" *ngIf="filteredBlogArticles.length > 0">
              <button class="load-more-btn">LOAD MORE POSTS</button>
            </div>
          </div>
        </main>
      </ng-container>

      <!-- ================================================ -->
      <!-- ===== CATEGORIES PAGE ========================== -->
      <!-- ================================================ -->
      <ng-container *ngIf="currentPage === 'categories'">
        <div class="page-hero" [style.background-image]="'url(' + catHeroImg + ')'">
          <div class="hero-admin-actions" *ngIf="isAdmin">
            <button class="hero-edit-img-btn" (click)="openImageEditor('catHeroImg', 'Categories Hero Banner')" title="Change hero image">
              <i class="fa-solid fa-camera"></i> Change Image
            </button>
            <button class="hero-edit-img-btn hero-edit-text-btn" (click)="openHeroTextEditor('categories')" title="Edit Hero Text">
              <i class="fa-solid fa-pen-to-square"></i> Edit Text
            </button>
          </div>
          <div class="page-hero-overlay"></div>
          <div class="page-hero-content">
            <p class="page-hero-label">{{ pageHeroTexts.categories.label }}</p>
            <h1 class="page-hero-title">{{ pageHeroTexts.categories.title }}</h1>
            <p class="page-hero-sub">{{ pageHeroTexts.categories.sub }}</p>
          </div>
        </div>
        <main class="page-body">
          <div class="container">
            <div class="categories-header-intro">
              <h2>10 Core Pillars of Knowledge</h2>
              <p>Click any category to browse all articles published under that topic.</p>
            </div>
            <div class="categories-full-grid">
              <div class="cat-full-card" *ngFor="let cat of categoryPageItems" (click)="openCategoryDetail(cat.name)">
                <div class="cat-full-img-wrap">
                  <img [src]="cat.image" [alt]="cat.name" class="cat-full-img" loading="lazy" />
                  <div class="cat-full-badge">{{ cat.name }}</div>
                  <div class="cat-card-admin-actions" *ngIf="isAdmin" (click)="$event.stopPropagation()">
                    <button class="cat-edit-img-btn edit-text" (click)="openCategoryEditor(cat)" title="Edit Category Details">
                      <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="cat-edit-img-btn edit-img" (click)="openImageEditorItem(cat, 'image', 'Category: ' + cat.name)" title="Change Image">
                      <i class="fa-solid fa-camera"></i>
                    </button>
                  </div>
                </div>
                <div class="cat-full-body">
                  <h3>{{ cat.name }}</h3>
                  <p>{{ cat.desc }}</p>
                  <div class="cat-full-footer">
                    <span class="cat-count-pill"><i class="fa-solid fa-file-lines"></i> {{ getCategoryArticleCount(cat.name) }} Articles</span>
                    <span class="cat-explore-btn">Browse Hub →</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </ng-container>

      <!-- ================================================ -->
      <!-- ===== DEDICATED SINGLE CATEGORY HUB PAGE ======= -->
      <!-- ================================================ -->
      <ng-container *ngIf="currentPage === 'category'">
        <!-- Hero for the specific category -->
        <div class="page-hero" [style.background-image]="'url(' + activeCategoryMeta.image + ')'">
          <div class="page-hero-overlay"></div>
          <div class="page-hero-content">
            <p class="page-hero-label">CATEGORY HUB</p>
            <h1 class="page-hero-title">{{ activeCategoryMeta.name }}</h1>
            <p class="page-hero-sub">{{ activeCategoryMeta.desc }}</p>
          </div>
        </div>

        <main class="page-body">
          <div class="container">

            <!-- Breadcrumbs & Category Bar -->
            <div class="cat-detail-bar">
              <div class="cat-breadcrumbs">
                <a href="#" (click)="navTo('home', $event)">Home</a>
                <span class="crumb-sep">/</span>
                <a href="#" (click)="navTo('categories', $event)">Categories</a>
                <span class="crumb-sep">/</span>
                <span class="active-crumb">{{ activeCategoryMeta.name }}</span>
              </div>
              <div class="cat-meta-stats">
                <span class="cms-pill"><i class="fa-solid fa-file-lines"></i> {{ categoryArticles.length }} Published Posts</span>
                <span class="cms-pill"><i class="fa-solid fa-pen-nib"></i> Curated Insights</span>
              </div>
            </div>

            <!-- Articles Grid for this specific Category -->
            <div class="category-posts-section">
              <div class="section-header">
                <h2 class="section-heading">ARTICLES IN {{ activeCategoryMeta.name | uppercase }}</h2>
              </div>

              <div class="posts-grid" *ngIf="categoryArticles.length > 0">
                <app-article-card
                  *ngFor="let item of categoryArticles"
                  [article]="item"
                  [isAdmin]="isAdmin"
                  (onSelect)="openReader($event)"
                  (onEdit)="openEditModal($event)"
                  (onDelete)="deleteArticleFromReader($event)"
                ></app-article-card>
              </div>

              <!-- Fallback if no specific articles exist yet -->
              <div class="empty-state" *ngIf="categoryArticles.length === 0">
                <i class="fa-solid fa-book-open empty-icon"></i>
                <h3>No Articles in {{ activeCategoryMeta.name }} Yet</h3>
                <p>Check back soon or explore other curated categories below.</p>
                <button class="btn btn-secondary" (click)="navTo('categories', $event)">Browse All Categories</button>
              </div>
            </div>

            <!-- Related Categories Switcher at Bottom -->
            <div class="other-categories-bar">
              <h3 class="other-cat-title">Explore Other Categories</h3>
              <div class="other-cat-chips">
                <button
                  *ngFor="let c of categoryPageItems"
                  class="other-cat-chip"
                  [class.active]="c.name === activeCategoryMeta.name"
                  (click)="openCategoryDetail(c.name)"
                >
                  <span>{{ c.name }}</span>
                </button>
              </div>
            </div>

          </div>
        </main>
      </ng-container>

      <!-- ================================================ -->
      <!-- ===== DESTINATIONS PAGE ======================== -->
      <!-- ================================================ -->
      <ng-container *ngIf="currentPage === 'destinations'">
        <div class="page-hero" [style.background-image]="'url(' + destHeroImg + ')'">
          <div class="hero-admin-actions" *ngIf="isAdmin">
            <button class="hero-edit-img-btn" (click)="openImageEditor('destHeroImg', 'Destinations Hero Banner')" title="Change hero image">
              <i class="fa-solid fa-camera"></i> Change Image
            </button>
            <button class="hero-edit-img-btn hero-edit-text-btn" (click)="openHeroTextEditor('destinations')" title="Edit Hero Text">
              <i class="fa-solid fa-pen-to-square"></i> Edit Text
            </button>
          </div>
          <div class="page-hero-overlay"></div>
          <div class="page-hero-content">
            <p class="page-hero-label">{{ pageHeroTexts.destinations.label }}</p>
            <h1 class="page-hero-title">{{ pageHeroTexts.destinations.title }}</h1>
            <p class="page-hero-sub">{{ pageHeroTexts.destinations.sub }}</p>
          </div>
        </div>
        <main class="page-body">
          <div class="container">
            <!-- 1. Continent Filter Bar -->
            <div class="dest-filter-bar">
              <button class="dest-pill" [class.active]="destFilter==='All'" (click)="setDestContinent('All')">All Continents</button>
              <button class="dest-pill" *ngFor="let r of regions" [class.active]="destFilter===r" (click)="setDestContinent(r)">{{ r }}</button>
            </div>

            <!-- 2. Country Subcategory Filters -->
            <div class="country-subfilter-bar" *ngIf="availableDestCountries.length > 0" style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 32px; padding: 14px 20px; background: var(--color-light); border-radius: 6px; border: 1px solid var(--color-border);">
              <span style="font-size: 11px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: var(--color-accent); margin-right: 6px; display: inline-flex; align-items: center; gap: 6px;">
                <i class="fa-solid fa-flag"></i> Country / หมวดหมู่ย่อย:
              </span>
              <button
                class="filter-pill"
                [class.active]="destCountryFilter === 'All'"
                (click)="destCountryFilter = 'All'"
                style="cursor: pointer;"
              >
                All Countries
              </button>
              <button
                class="filter-pill"
                *ngFor="let country of availableDestCountries"
                [class.active]="destCountryFilter === country"
                (click)="destCountryFilter = country"
                style="cursor: pointer;"
              >
                {{ country }}
              </button>
            </div>

            <!-- 3. Travel Stories & Country Guides Grid -->
            <div class="section-header">
              <div>
                <h2 class="section-heading">TRAVEL STORIES &amp; COUNTRY GUIDES</h2>
                <p style="font-size: 13px; color: var(--color-muted); margin: 6px 0 0;">
                  Explore travel guides for <strong>{{ destFilter === 'All' ? 'All Continents' : destFilter }}</strong>
                  <span *ngIf="destCountryFilter !== 'All'"> &rarr; <strong>{{ destCountryFilter }}</strong></span>
                </p>
              </div>
            </div>

            <div class="posts-grid" *ngIf="filteredDestTravelArticles.length > 0">
              <app-article-card
                *ngFor="let article of filteredDestTravelArticles"
                [article]="article"
                [isAdmin]="isAdmin"
                (onSelect)="openReader($event)"
                (onEdit)="openEditModal($event)"
                (onDelete)="promptDeleteArticle($event)"
              ></app-article-card>
            </div>

            <div class="empty-state" *ngIf="filteredDestTravelArticles.length === 0">
              <i class="fa-solid fa-compass empty-icon"></i>
              <h3>No Travel Stories Found for {{ destCountryFilter !== 'All' ? destCountryFilter : destFilter }}</h3>
              <p>Try selecting another continent or country, or write a new travel story!</p>
            </div>
          </div>
        </main>
      </ng-container>

      <!-- ================================================ -->
      <!-- ===== GALLERY PAGE ============================= -->
      <!-- ================================================ -->
      <ng-container *ngIf="currentPage === 'gallery'">
        <div class="page-hero" [style.background-image]="'url(' + galleryHeroImg + ')'">
          <div class="hero-admin-actions" *ngIf="isAdmin">
            <button class="hero-edit-img-btn" (click)="openImageEditor('galleryHeroImg', 'Gallery Hero Banner')" title="Change hero image">
              <i class="fa-solid fa-camera"></i> Change Image
            </button>
            <button class="hero-edit-img-btn hero-edit-text-btn" (click)="openHeroTextEditor('gallery')" title="Edit Hero Text">
              <i class="fa-solid fa-pen-to-square"></i> Edit Text
            </button>
          </div>
          <div class="page-hero-overlay"></div>
          <div class="page-hero-content">
            <p class="page-hero-label">{{ pageHeroTexts.gallery.label }}</p>
            <h1 class="page-hero-title">{{ pageHeroTexts.gallery.title }}</h1>
            <p class="page-hero-sub">{{ pageHeroTexts.gallery.sub }}</p>
          </div>
        </div>
        <main class="page-body">
          <div class="container">
            <div class="dest-filter-bar">
              <button class="dest-pill" *ngFor="let g of galleryTags" [class.active]="galleryFilter===g" (click)="galleryFilter=g">{{ g }}</button>
            </div>
            <div class="gallery-grid">
              <div class="gallery-item" *ngFor="let p of filteredPhotos; let idx = index" [class.tall]="p.tall" (click)="openLightbox(idx)" style="cursor: pointer;">
                <img [src]="p.url" [alt]="p.caption" class="gallery-img" loading="lazy" />
                <button class="cat-edit-img-btn" *ngIf="isAdmin" (click)="$event.stopPropagation(); openImageEditorItem(p, 'url', 'Gallery Photo: ' + p.caption)">
                  <i class="fa-solid fa-camera"></i>
                </button>
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
        <div class="page-hero" [style.background-image]="'url(' + aboutHeroImg + ')'">
          <div class="hero-admin-actions" *ngIf="isAdmin">
            <button class="hero-edit-img-btn" (click)="openImageEditor('aboutHeroImg', 'About Hero Banner')" title="Change hero image">
              <i class="fa-solid fa-camera"></i> Change Image
            </button>
            <button class="hero-edit-img-btn hero-edit-text-btn" (click)="openHeroTextEditor('about')" title="Edit Hero Text">
              <i class="fa-solid fa-pen-to-square"></i> Edit Text
            </button>
          </div>
          <div class="page-hero-overlay"></div>
          <div class="page-hero-content">
            <p class="page-hero-label">{{ pageHeroTexts.about.label }}</p>
            <h1 class="page-hero-title">{{ pageHeroTexts.about.title }}</h1>
            <p class="page-hero-sub">{{ pageHeroTexts.about.sub }}</p>
          </div>
        </div>
        <main class="page-body">
          <div class="container">
            <div class="about-layout">
              <aside class="about-sidebar">
                <div class="author-card">
                  <div style="display: flex; justify-content: flex-end; margin-bottom: 10px;" *ngIf="isAdmin">
                    <button class="hero-edit-img-btn" (click)="openProfileSettingsModal()" style="font-size: 11px; padding: 5px 12px; background: #2563eb; color: #fff; border: none; border-radius: 4px; font-weight: 700; cursor: pointer;" title="Edit Profile &amp; Links">
                      <i class="fa-solid fa-user-gear"></i> Edit Profile
                    </button>
                  </div>
                  <img [src]="authorAvatar" [alt]="authorName" class="author-avatar-lg" />
                  <h2 class="author-name">{{ authorName }}</h2>
                  <p class="author-title">{{ authorTitle }}</p>
                  <div class="author-stats">
                    <div class="stat"><span class="stat-num">{{ allDestinations.length }}</span><span class="stat-lbl">Destinations</span></div>
                    <div class="stat"><span class="stat-num">{{ articles.length }}</span><span class="stat-lbl">Articles</span></div>
                    <div class="stat"><span class="stat-num">{{ photos.length }}</span><span class="stat-lbl">Photos</span></div>
                  </div>
                  <div class="author-socials">
                    <a [href]="instagramUrl" target="_blank" title="Instagram" *ngIf="instagramUrl"><i class="fa-brands fa-instagram"></i></a>
                    <a [href]="twitterUrl" target="_blank" title="Twitter/X" *ngIf="twitterUrl"><i class="fa-brands fa-x-twitter"></i></a>
                    <a [href]="youtubeUrl" target="_blank" title="YouTube" *ngIf="youtubeUrl"><i class="fa-brands fa-youtube"></i></a>
                    <a [href]="githubUrl" target="_blank" title="GitHub" *ngIf="githubUrl"><i class="fa-brands fa-github"></i></a>
                  </div>
                </div>
              </aside>
              <div class="about-content">
                <div class="about-section">
                  <div class="section-title-wrap">
                    <h2 style="margin: 0; border: none; padding-bottom: 0;">{{ aboutTexts.storyTitle }}</h2>
                    <button class="hero-edit-img-btn" *ngIf="isAdmin" (click)="openAboutStoryEditor()" style="font-size: 11px; padding: 5px 12px; background: #2563eb; color: #ffffff; border: none; border-radius: 4px; font-weight: 700; cursor: pointer;" title="Edit Story Text">
                      <i class="fa-solid fa-pen"></i> Edit Story Text
                    </button>
                  </div>
                  <p>{{ aboutTexts.storyP1 }}</p>
                  <p>{{ aboutTexts.storyP2 }}</p>
                </div>
                <div class="about-section">
                  <h2>What I Write About</h2>
                  <div class="topics-grid">
                    <div class="topic-card" *ngFor="let t of topics">
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
                      <div class="timeline-body" style="flex: 1;">
                        <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
                          <h4 style="margin: 0;">{{ item.title }}</h4>
                          <button class="cat-edit-img-btn" *ngIf="isAdmin" (click)="openTimelineEditor(item)" style="position: static; font-size: 11px; background: #2563eb; padding: 3px 8px;" title="Edit Milestone">
                            <i class="fa-solid fa-pen"></i>
                          </button>
                        </div>
                        <p style="margin-top: 6px;">{{ item.desc }}</p>
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
        <div class="page-hero" [style.background-image]="'url(' + contactHeroImg + ')'">
          <div class="hero-admin-actions" *ngIf="isAdmin">
            <button class="hero-edit-img-btn" (click)="openImageEditor('contactHeroImg', 'Contact Hero Banner')" title="Change hero image">
              <i class="fa-solid fa-camera"></i> Change Image
            </button>
            <button class="hero-edit-img-btn hero-edit-text-btn" (click)="openHeroTextEditor('contact')" title="Edit Hero Text">
              <i class="fa-solid fa-pen-to-square"></i> Edit Text
            </button>
          </div>
          <div class="page-hero-overlay"></div>
          <div class="page-hero-content">
            <p class="page-hero-label">{{ pageHeroTexts.contact.label }}</p>
            <h1 class="page-hero-title">{{ pageHeroTexts.contact.title }}</h1>
            <p class="page-hero-sub">{{ pageHeroTexts.contact.sub }}</p>
          </div>
        </div>
        <main class="page-body">
          <div class="container">
            <div class="contact-layout">
              <div class="contact-info">
                <div class="section-title-wrap">
                  <h2 style="margin: 0; border: none; padding-bottom: 0;">Let's Connect</h2>
                  <button class="hero-edit-img-btn" *ngIf="isAdmin" (click)="openProfileSettingsModal()" style="font-size: 11px; padding: 5px 14px; background: #2563eb; color: #ffffff; border: none; border-radius: 4px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;" title="Edit Contact Info">
                    <i class="fa-solid fa-pen-to-square"></i> Edit Contact Details
                  </button>
                </div>
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
                  <a [href]="instagramUrl" target="_blank" class="social-link" *ngIf="instagramUrl"><i class="fa-brands fa-instagram"></i> Instagram</a>
                  <a [href]="twitterUrl" target="_blank" class="social-link" *ngIf="twitterUrl"><i class="fa-brands fa-x-twitter"></i> Twitter/X</a>
                  <a [href]="youtubeUrl" target="_blank" class="social-link" *ngIf="youtubeUrl"><i class="fa-brands fa-youtube"></i> YouTube</a>
                  <a [href]="githubUrl" target="_blank" class="social-link" *ngIf="githubUrl"><i class="fa-brands fa-github"></i> GitHub</a>
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
            <span class="footer-logo">KAIZEN</span>
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
        [isAdmin]="isAdmin"
        (onClose)="selectedArticle = null"
        (onDelete)="deleteArticleFromReader($event)"
      ></app-article-reader>

      <app-article-editor
        *ngIf="showPublisherModal"
        [articleToEdit]="editingArticle"
        (onClose)="closePublisherModal()"
        (onArticlePublished)="handleArticlePublished($event)"
      ></app-article-editor>

      <!-- Admin Access Modal (Minimal Editorial) -->
      <div class="admin-modal-backdrop" *ngIf="showAdminPassModal" (click)="showAdminPassModal = false">
        <div class="admin-modal-card" (click)="$event.stopPropagation()">

          <!-- Close button -->
          <button class="admin-modal-close" (click)="showAdminPassModal = false" aria-label="Close">
            <i class="fa-solid fa-xmark"></i>
          </button>

          <div class="admin-header">
            <span class="admin-eyebrow">KAIZEN &mdash; ADMIN</span>
            <h2>Admin Access</h2>
            <p>Enter your passcode to unlock editing tools.</p>
          </div>

          <form (ngSubmit)="unlockAdmin()">
            <div class="admin-form-group">
              <label>Passcode</label>
              <input
                type="password"
                class="admin-pass-input"
                placeholder="••••••••"
                [(ngModel)]="adminPassInput"
                name="adminPassInput"
                autofocus
                required
              />
              <div class="admin-error" *ngIf="adminPassError">
                <i class="fa-solid fa-circle-exclamation"></i> Incorrect passcode.
              </div>
            </div>
            <div class="admin-actions">
              <button type="button" class="btn-admin-cancel" (click)="showAdminPassModal = false">Cancel</button>
              <button type="submit" class="btn-admin-unlock">Unlock <i class="fa-solid fa-arrow-right"></i></button>
            </div>
          </form>

        </div>
      </div>

      <!-- Admin Image Uploader Modal -->
      <div class="admin-modal-backdrop" *ngIf="showImageEditorModal" (click)="showImageEditorModal = false">
        <div class="img-editor-card" (click)="$event.stopPropagation()">

          <div class="img-editor-header">
            <div>
              <div class="img-editor-label">ADMIN &mdash; CHANGE IMAGE</div>
              <h2>{{ imageEditorTitle }}</h2>
            </div>
            <button class="img-editor-close" (click)="showImageEditorModal = false" aria-label="Close">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div class="img-editor-preview" *ngIf="imageEditorPreview">
            <img [src]="imageEditorPreview" alt="Preview" class="img-preview-target" />
            <span class="img-editor-success-badge" *ngIf="imageUploadSuccess">
              <i class="fa-solid fa-check"></i> Uploaded
            </span>
          </div>

          <div class="img-editor-dropzone"
               [class.drag-over]="isImageDragging"
               [class.is-uploading]="imageUploading"
               (click)="adminFileInputHidden.click()"
               (dragover)="onImageDragOver($event)"
               (dragleave)="onImageDragLeave($event)"
               (drop)="onImageDrop($event)">

            <input type="file" #adminFileInputHidden accept="image/*" (change)="onAdminImageFileSelected($event)" style="display:none;" />

            <div class="dz-content" *ngIf="!imageUploading && !imageUploadSuccess">
              <i class="fa-solid fa-arrow-up-from-bracket dz-icon"></i>
              <p class="dz-title">Drag & Drop or Click</p>
              <p class="dz-sub">PNG, JPG, WEBP &mdash; auto optimised</p>
            </div>

            <div class="dz-content" *ngIf="imageUploading">
              <i class="fa-solid fa-circle-notch fa-spin dz-icon dz-icon--loading"></i>
              <p class="dz-title">Uploading...</p>
              <p class="dz-sub">Processing your image</p>
            </div>

            <div class="dz-content" *ngIf="imageUploadSuccess && !imageUploading">
              <i class="fa-solid fa-check dz-icon dz-icon--success"></i>
              <p class="dz-title">Upload Complete</p>
              <p class="dz-sub">Ready to save &mdash; click below</p>
            </div>
          </div>

          <div class="img-editor-divider">or paste URL</div>

          <input
            type="text"
            class="img-editor-url-input"
            placeholder="https://images.unsplash.com/..."
            [(ngModel)]="imageEditorUrlInput"
            (input)="onUrlInputChanged()"
          />

          <!-- Extra Photo Details (Caption & Tag) for Gallery Items -->
          <div *ngIf="imageEditorTargetItem && imageEditorTargetItem.caption !== undefined" style="margin-top: 15px; text-align: left; background: #f8fafc; padding: 12px 14px; border-radius: 6px; border: 1px solid #e2e8f0;">
            <div class="form-group" style="margin-bottom: 10px;">
              <label style="font-size: 11px; font-weight: 800; color: #e8472a; letter-spacing: 0.08em; display: block; margin-bottom: 4px;">PHOTO CAPTION / TITLE</label>
              <input type="text" class="profile-input" placeholder="e.g. Fushimi Inari, Kyoto" [(ngModel)]="tempPhotoCaption" />
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <label style="font-size: 11px; font-weight: 800; color: #e8472a; letter-spacing: 0.08em; display: block; margin-bottom: 4px;">PHOTO TAG / CATEGORY</label>
              <select class="profile-input" [(ngModel)]="tempPhotoTag">
                <option *ngFor="let tag of galleryTags.slice(1)" [value]="tag">{{ tag }}</option>
              </select>
            </div>
          </div>

          <div class="img-editor-actions">
            <button type="button" class="img-editor-btn-cancel" (click)="showImageEditorModal = false">Cancel</button>
            <button type="button" class="img-editor-btn-save" [disabled]="!imageEditorPreview || imageUploading" (click)="saveImageEditor()">
              <i class="fa-solid fa-check"></i> Save Image &amp; Caption
            </button>
          </div>
        </div>
      </div>

      <!-- Custom Delete Confirmation Modal -->
      <div class="admin-modal-backdrop" *ngIf="showDeleteModal" (click)="cancelDelete()">
        <div class="delete-modal-card" (click)="$event.stopPropagation()">

          <button class="admin-modal-close" (click)="cancelDelete()" aria-label="Close">
            <i class="fa-solid fa-xmark"></i>
          </button>

          <div class="delete-header">
            <div class="delete-icon-wrap">
              <i class="fa-solid fa-trash-can"></i>
            </div>
            <span class="delete-eyebrow">CONFIRM DELETION</span>
            <h2>Delete Article?</h2>
            <p *ngIf="articleToDelete">
              Are you sure you want to delete <strong>"{{ articleToDelete.title }}"</strong>? This action cannot be undone.
            </p>
          </div>

          <!-- Delete Progress Bar -->
          <div class="delete-progress-wrap" *ngIf="isDeleting" style="margin-bottom: 20px; padding: 12px 14px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px;">
            <div class="progress-info-row" style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 700; color: #dc2626; margin-bottom: 6px;">
              <span><i class="fa-solid fa-trash-can fa-bounce"></i> Deleting Article...</span>
              <span style="font-family: monospace; font-size: 13px;">{{ deleteProgress }}%</span>
            </div>
            <div class="progress-track" style="height: 6px; background: #fee2e2; border-radius: 3px; overflow: hidden;">
              <div class="progress-fill" [style.width.%]="deleteProgress" style="height: 100%; background: #dc2626; transition: width 0.15s ease;"></div>
            </div>
          </div>

          <div class="delete-actions" *ngIf="!isDeleting">
            <button type="button" class="btn-delete-cancel" (click)="cancelDelete()">Cancel</button>
            <button type="button" class="btn-delete-confirm" (click)="confirmDeleteArticle()">
              <i class="fa-solid fa-trash-can"></i> Delete Permanently
            </button>
          </div>

        </div>
      </div>

      <!-- Gallery Lightbox Fullscreen Image Modal -->
      <div class="lightbox-backdrop" *ngIf="showLightbox" (click)="closeLightbox()">
        <div class="lightbox-container" (click)="$event.stopPropagation()">
          
          <!-- Close Button -->
          <button class="lightbox-close-btn" (click)="closeLightbox()" title="Close (Esc)">
            <i class="fa-solid fa-xmark"></i>
          </button>

          <!-- Counter Badge -->
          <div class="lightbox-counter" *ngIf="filteredPhotos.length > 0">
            <span>Photo {{ activeLightboxIndex + 1 }} of {{ filteredPhotos.length }}</span>
          </div>

          <!-- Main Image View -->
          <div class="lightbox-media-wrap" *ngIf="activeLightboxPhoto">
            <img [src]="activeLightboxPhoto.url" [alt]="activeLightboxPhoto.caption" class="lightbox-img" />
          </div>

          <!-- Navigation Prev / Next Buttons -->
          <button class="lightbox-nav-btn prev-btn" (click)="prevLightboxPhoto()" title="Previous Photo (Left Arrow)">
            <i class="fa-solid fa-chevron-left"></i>
          </button>

          <button class="lightbox-nav-btn next-btn" (click)="nextLightboxPhoto()" title="Next Photo (Right Arrow)">
            <i class="fa-solid fa-chevron-right"></i>
          </button>

          <!-- Caption & Tag Footer -->
          <div class="lightbox-footer" *ngIf="activeLightboxPhoto">
            <div class="lightbox-caption-group" style="position: relative; padding-right: 70px;">
              <button class="hero-edit-img-btn" *ngIf="isAdmin" (click)="$event.stopPropagation(); openImageEditorItem(activeLightboxPhoto, 'url', 'Gallery Photo: ' + activeLightboxPhoto.caption)" style="position: absolute; right: 0; top: 50%; transform: translateY(-50%); font-size: 10px; padding: 4px 10px; background: #2563eb; color: #ffffff; border: none; border-radius: 4px; font-weight: 700; cursor: pointer;" title="Edit Photo &amp; Caption">
                <i class="fa-solid fa-pen"></i> Edit
              </button>
              <span class="lightbox-tag">{{ activeLightboxPhoto.tag }}</span>
              <h3 class="lightbox-caption">{{ activeLightboxPhoto.caption }}</h3>
            </div>
          </div>

        </div>
      </div>

      <!-- Universal Quick Text Editor Modal -->
      <div class="admin-modal-backdrop" *ngIf="showTextEditorModal" (click)="closeTextEditorModal()">
        <div class="profile-modal-card" (click)="$event.stopPropagation()" style="max-width: 580px;">
          <button class="admin-modal-close" (click)="closeTextEditorModal()" aria-label="Close">
            <i class="fa-solid fa-xmark"></i>
          </button>

          <div class="profile-modal-header">
            <div class="profile-modal-icon" style="background: rgba(37, 99, 235, 0.1); color: #2563eb;">
              <i class="fa-solid fa-pen-to-square"></i>
            </div>
            <h2>{{ textEditorModalTitle }}</h2>
            <p>Update section text, headings, and descriptions live on your website.</p>
          </div>

          <form (ngSubmit)="saveTextEditor()" class="profile-form">
            
            <div class="form-group" *ngIf="textEditorField1Label">
              <label>{{ textEditorField1Label }}</label>
              <input type="text" class="profile-input" [(ngModel)]="textEditorField1Value" name="field1" />
            </div>

            <div class="form-group" *ngIf="textEditorField2Label">
              <label>{{ textEditorField2Label }}</label>
              <input type="text" class="profile-input" [(ngModel)]="textEditorField2Value" name="field2" *ngIf="!textEditorIsField2Textarea" />
              <textarea class="profile-input" style="min-height: 90px; resize: vertical;" [(ngModel)]="textEditorField2Value" name="field2Text" *ngIf="textEditorIsField2Textarea"></textarea>
            </div>

            <div class="form-group" *ngIf="textEditorField3Label">
              <label>{{ textEditorField3Label }}</label>
              <textarea class="profile-input" style="min-height: 110px; resize: vertical;" [(ngModel)]="textEditorField3Value" name="field3Text"></textarea>
            </div>

            <div class="profile-modal-actions">
              <button type="button" class="btn-profile-cancel" (click)="closeTextEditorModal()">Cancel</button>
              <button type="submit" class="btn-profile-save" style="background: #2563eb;">
                <i class="fa-solid fa-check"></i> Save Text Changes
              </button>
            </div>

          </form>
        </div>
      </div>

      <!-- Profile & Social Links Settings Modal -->
      <div class="admin-modal-backdrop" *ngIf="showProfileSettingsModal" (click)="closeProfileSettingsModal()">
        <div class="profile-modal-card" (click)="$event.stopPropagation()">
          <button class="admin-modal-close" (click)="closeProfileSettingsModal()" aria-label="Close">
            <i class="fa-solid fa-xmark"></i>
          </button>

          <div class="profile-modal-header">
            <div class="profile-modal-icon">
              <i class="fa-solid fa-user-gear"></i>
            </div>
            <h2>Profile &amp; Social Links Settings</h2>
            <p>Customize your public author persona, contact email, and social media links.</p>
          </div>

          <form (ngSubmit)="saveProfileSettings()" class="profile-form">
            
            <!-- Avatar Upload & Preview -->
            <div class="form-group avatar-form-group">
              <label>PROFILE AVATAR PICTURE</label>
              <div class="avatar-edit-row">
                <img [src]="tempAuthorAvatar || authorAvatar" alt="Avatar Preview" class="avatar-preview-img" />
                <div class="avatar-actions-col">
                  <div class="drag-upload-box" 
                       [class.dragging]="isAvatarDragging"
                       (dragover)="onAvatarDragOver($event)"
                       (dragleave)="onAvatarDragLeave($event)"
                       (drop)="onAvatarDrop($event)"
                       (click)="avatarFileInput.click()">
                    <i class="fa-solid fa-cloud-arrow-up"></i>
                    <span>Drag &amp; Drop or Click to Upload Image</span>
                    <small>Compressed automatically to high-quality JPEG</small>
                    <input #avatarFileInput type="file" accept="image/*" (change)="onAvatarFileSelected($event)" hidden />
                  </div>
                  <div class="or-divider"><span>OR PASTE IMAGE URL</span></div>
                  <input type="text" class="profile-input" placeholder="https://images.unsplash.com/..." [(ngModel)]="tempAuthorAvatar" name="avatarUrl" />
                </div>
              </div>
            </div>

            <!-- Author Name & Title -->
            <div class="form-row-2">
              <div class="form-group">
                <label>AUTHOR NAME <span class="required">*</span></label>
                <input type="text" class="profile-input" [(ngModel)]="tempAuthorName" name="authorName" required placeholder="e.g. Kaizen Explorer" />
              </div>
              <div class="form-group">
                <label>TAGLINE / TITLE</label>
                <input type="text" class="profile-input" [(ngModel)]="tempAuthorTitle" name="authorTitle" placeholder="e.g. World Traveler &amp; Software Engineer" />
              </div>
            </div>

            <!-- Contact Details Section -->
            <div class="social-section-title">
              <i class="fa-solid fa-address-card"></i> CONTACT PAGE DETAILS (EMAIL, LOCATION &amp; RESPONSE TIME)
            </div>

            <div class="form-group">
              <label><i class="fa-solid fa-envelope"></i> CONTACT EMAIL ADDRESS</label>
              <input type="email" class="profile-input" [(ngModel)]="tempContactEmail" name="contactEmail" placeholder="hello@kaizen-blog.com" />
            </div>

            <div class="form-row-2">
              <div class="form-group">
                <label><i class="fa-solid fa-location-dot"></i> BASED IN / LOCATION</label>
                <input type="text" class="profile-input" [(ngModel)]="tempContactLocation" name="contactLocation" placeholder="Bangkok, Thailand &amp; Global" />
              </div>
              <div class="form-group">
                <label><i class="fa-solid fa-clock"></i> RESPONSE TIME</label>
                <input type="text" class="profile-input" [(ngModel)]="tempContactResponseTime" name="contactResponseTime" placeholder="Usually within 24–48 hours" />
              </div>
            </div>

            <!-- Social Links Section -->
            <div class="social-section-title">
              <i class="fa-solid fa-share-nodes"></i> SOCIAL MEDIA CONNECT LINKS
            </div>

            <div class="form-row-2">
              <div class="form-group">
                <label><i class="fa-brands fa-instagram instagram-col"></i> INSTAGRAM URL</label>
                <input type="url" class="profile-input" [(ngModel)]="tempInstagramUrl" name="instagramUrl" placeholder="https://instagram.com/yourhandle" />
              </div>
              <div class="form-group">
                <label><i class="fa-brands fa-x-twitter"></i> X / TWITTER URL</label>
                <input type="url" class="profile-input" [(ngModel)]="tempTwitterUrl" name="twitterUrl" placeholder="https://x.com/yourhandle" />
              </div>
            </div>

            <div class="form-row-2">
              <div class="form-group">
                <label><i class="fa-brands fa-youtube youtube-col"></i> YOUTUBE CHANNEL URL</label>
                <input type="url" class="profile-input" [(ngModel)]="tempYoutubeUrl" name="youtubeUrl" placeholder="https://youtube.com/@yourhandle" />
              </div>
              <div class="form-group">
                <label><i class="fa-brands fa-github"></i> GITHUB PROFILE URL</label>
                <input type="url" class="profile-input" [(ngModel)]="tempGithubUrl" name="githubUrl" placeholder="https://github.com/yourhandle" />
              </div>
            </div>

            <!-- Save Actions -->
            <div class="profile-modal-actions">
              <button type="button" class="btn-profile-cancel" (click)="closeProfileSettingsModal()">Cancel</button>
              <button type="submit" class="btn-profile-save">
                <i class="fa-solid fa-check"></i> Save Profile Settings
              </button>
            </div>

          </form>
        </div>
      </div>

      <!-- Toast Notification -->
      <div class="toast-notification" *ngIf="toastMsg">
        <i class="fa-solid fa-circle-check"></i> {{ toastMsg }}
      </div>

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
    .dest-teaser-title {
      font-family: 'Lato', sans-serif;
      font-size: clamp(28px, 4vw, 44px);
      font-weight: 900;
      color: #111111;
      margin: 0 0 20px;
      line-height: 1.15;
    }
    .dest-teaser-desc {
      font-size: 15px;
      color: #666666;
      line-height: 1.8;
      margin-bottom: 28px;
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
      height: 400px;
      background-size: cover;
      background-position: center;
      margin-top: 62px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .page-hero-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(160deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.82) 100%);
    }
    /* === Beautiful SVG Wave Bottom Divider (all pages, light mode) === */
    .page-hero::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      width: 100%;
      height: 80px;
      background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 80' preserveAspectRatio='none'%3E%3Cpath fill='%23ffffff' d='M0,56 C180,80 360,20 540,40 C720,60 900,80 1080,56 C1260,32 1380,48 1440,40 L1440,80 L0,80 Z'/%3E%3C/svg%3E") no-repeat bottom center;
      background-size: 100% 100%;
      z-index: 3;
      pointer-events: none;
    }
    .page-hero-content { position: relative; z-index: 2; text-align: center; color: #fff; padding: 0 20px; margin-bottom: 24px; }
    .page-hero-label {
      font-size: 11px; font-weight: 800; letter-spacing: 0.22em; text-transform: uppercase;
      color: rgba(255,255,255,0.65); margin-bottom: 14px;
      display: inline-flex; align-items: center; gap: 10px;
    }
    .page-hero-label::before,
    .page-hero-label::after {
      content: ''; display: inline-block; width: 28px; height: 1px; background: rgba(255,255,255,0.45);
    }
    .page-hero-title { font-family: 'Lato', sans-serif; font-size: clamp(36px, 6vw, 66px); font-weight: 900; letter-spacing: -1.5px; margin: 0 0 16px; text-shadow: 0 2px 20px rgba(0,0,0,0.35); }
    .page-hero-sub { font-size: 15.5px; color: rgba(255,255,255,0.82); max-width: 580px; margin: 0 auto; line-height: 1.65; }

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

    /* ===== CATEGORIES PAGE ===== */
    .categories-header-intro { text-align: center; margin-bottom: 40px; }
    .categories-header-intro h2 { font-family: 'Lato', sans-serif; font-size: 28px; font-weight: 800; color: #111; margin: 0 0 8px; }
    .categories-header-intro p { font-size: 15px; color: #777; margin: 0; }

    .categories-full-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 28px; }
    .cat-full-card { background: #fff; border: 1px solid #eee; border-radius: 12px; overflow: hidden; display: flex; cursor: pointer; transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s; }
    .cat-full-card:hover { transform: translateY(-5px); box-shadow: 0 16px 36px rgba(0,0,0,0.1); border-color: #e8472a; }
    .cat-full-img-wrap { width: 40%; position: relative; flex-shrink: 0; overflow: hidden; min-height: 180px; }
    .cat-full-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
    .cat-full-card:hover .cat-full-img { transform: scale(1.06); }
    .cat-full-badge { position: absolute; top: 12px; left: 12px; background: rgba(0,0,0,0.65); backdrop-filter: blur(4px); color: #fff; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 20px; }
    .cat-full-body { padding: 22px 24px; display: flex; flex-direction: column; justify-content: space-between; flex: 1; }
    .cat-full-body h3 { font-family: 'Lato', sans-serif; font-size: 19px; font-weight: 800; color: #111; margin: 0 0 8px; }
    .cat-full-body p { font-size: 13px; color: #666; line-height: 1.6; margin: 0 0 16px; }
    .cat-full-footer { display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #f2f2f2; padding-top: 14px; }
    .cat-count-pill { font-size: 12px; color: #888; font-weight: 600; }
    .cat-explore-btn { color: #e8472a; font-weight: 700; font-size: 12px; letter-spacing: 0.04em; }

    /* ===== DEDICATED CATEGORY HUB PAGE ===== */
    .cat-detail-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 24px;
      background: #f9f9f9;
      border: 1px solid #eee;
      border-radius: 10px;
      margin-bottom: 40px;
      flex-wrap: wrap;
      gap: 12px;
    }
    .cat-breadcrumbs {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      font-weight: 600;
      color: #666;
    }
    .cat-breadcrumbs a {
      color: #333;
      transition: color 0.2s;
    }
    .cat-breadcrumbs a:hover {
      color: #e8472a;
    }
    .crumb-sep {
      color: #ccc;
    }
    .active-crumb {
      color: #e8472a;
      font-weight: 700;
    }
    .cat-meta-stats {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .cms-pill {
      background: #fff;
      border: 1px solid #e0e0e0;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;
      color: #444;
    }
    .cms-pill i {
      color: #e8472a;
      margin-right: 4px;
    }
    .category-posts-section {
      margin-bottom: 60px;
    }
    .other-categories-bar {
      border-top: 2px solid #f0f0f0;
      padding-top: 40px;
      margin-top: 40px;
    }
    .other-cat-title {
      font-family: 'Lato', sans-serif;
      font-size: 20px;
      font-weight: 800;
      color: #111;
      margin: 0 0 20px;
    }
    .other-cat-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    .other-cat-chip {
      padding: 8px 18px;
      border: 1.5px solid #e0e0e0;
      border-radius: 30px;
      background: #fff;
      font-size: 13px;
      font-weight: 700;
      color: #555;
      cursor: pointer;
      transition: all 0.2s;
    }
    .other-cat-chip:hover,
    .other-cat-chip.active {
      background: #111;
      color: #fff;
      border-color: #111;
    }

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

    /* ===== STEALTH ADMIN MODAL ===== */
    .admin-modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.45);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    /* ===== ADMIN MODAL — MINIMAL EDITORIAL ===== */
    .admin-modal-card {
      background: #fff;
      border-top: 3px solid #e8472a;
      border-radius: 0 0 4px 4px;
      padding: 36px 36px 32px;
      width: 100%;
      max-width: 400px;
      box-shadow: 0 32px 80px rgba(0,0,0,0.22);
      position: relative;
      animation: adminSlideUp 0.28s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes adminSlideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .admin-modal-close {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: transparent;
      border: 1px solid #e8e8e8;
      color: #bbb;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      cursor: pointer;
      transition: all 0.15s;
    }
    .admin-modal-close:hover { background: #111; color: #fff; border-color: #111; }
    .admin-header { margin-bottom: 28px; }
    .admin-eyebrow {
      display: block;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #e8472a;
      margin-bottom: 10px;
    }
    .admin-header h2 {
      font-family: 'Lato', sans-serif;
      font-size: 26px;
      font-weight: 900;
      color: #111;
      margin: 0 0 8px;
      letter-spacing: -0.02em;
      line-height: 1.1;
    }
    .admin-header p { font-size: 13px; color: #999; margin: 0; line-height: 1.5; }
    .admin-form-group { margin-bottom: 24px; }
    .admin-form-group label {
      display: block;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #888;
      margin-bottom: 8px;
    }
    .admin-pass-input {
      width: 100%;
      background: #f8f8f8;
      border: 1.5px solid #ebebeb;
      border-radius: 3px;
      padding: 12px 14px;
      color: #111;
      font-size: 16px;
      letter-spacing: 0.08em;
      outline: none;
      box-sizing: border-box;
      font-family: inherit;
      transition: border-color 0.2s, background 0.2s;
    }
    .admin-pass-input::placeholder { color: #ccc; letter-spacing: 0.08em; }
    .admin-pass-input:focus { border-color: #111; background: #fff; }
    .admin-error {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #e8472a;
      font-size: 12px;
      font-weight: 600;
      margin: 8px 0 0;
    }
    .admin-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      padding-top: 8px;
    }
    .btn-admin-cancel {
      background: transparent;
      color: #999;
      border: 1.5px solid #e8e8e8;
      padding: 10px 20px;
      border-radius: 3px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.15s;
    }
    .btn-admin-cancel:hover { border-color: #bbb; color: #555; }
    .btn-admin-unlock {
      background: #111;
      color: #fff;
      border: none;
      padding: 10px 22px;
      border-radius: 3px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      font-family: inherit;
      display: flex;
      align-items: center;
      gap: 8px;
      letter-spacing: 0.02em;
      transition: background 0.15s;
    }
    .btn-admin-unlock:hover { background: #e8472a; }

    /* ===== TOAST ===== */
    .toast-notification {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #111;
      color: #fff;
      border-left: 4px solid #e8472a;
      padding: 14px 20px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 700;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      z-index: 10000;
      animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes slideInRight {
      from { transform: translateX(50px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    /* ===== HERO IMAGE EDIT BUTTON & ACTIONS ===== */
    .hero-admin-actions {
      position: absolute;
      top: 76px;
      right: 24px;
      z-index: 1000;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .hero-edit-img-btn {
      position: static;
      z-index: 1000;
      padding: 7px 14px;
      border-radius: 20px;
      background: rgba(0, 0, 0, 0.72);
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.35);
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      cursor: pointer;
      backdrop-filter: blur(6px);
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .hero-edit-text-btn {
      background: #2563eb !important;
      border-color: rgba(255, 255, 255, 0.4) !important;
    }
    .hero-edit-text-btn:hover {
      background: #1d4ed8 !important;
    }
    .hero-edit-img-btn:hover {
      background: #e8472a;
      color: #fff;
      border-color: #e8472a;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(232, 71, 42, 0.4);
    }
    .cat-edit-img-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      z-index: 10;
      background: rgba(0,0,0,0.75);
      color: #fff;
      border: 1px solid rgba(255,255,255,0.3);
      padding: 5px 10px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .cat-edit-img-btn:hover { background: #e8472a; }

    /* ===== IMAGE EDITOR MODAL (MINIMAL) ===== */
    .img-editor-card {
      background: #fff;
      width: 100%;
      max-width: 460px;
      border-radius: 4px;
      padding: 32px 32px 28px;
      box-shadow: 0 32px 80px rgba(0,0,0,0.35);
      animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .img-editor-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 22px;
      padding-bottom: 18px;
      border-bottom: 1px solid #f0f0f0;
    }
    .img-editor-label {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.14em;
      color: #e8472a;
      margin-bottom: 6px;
    }
    .img-editor-header h2 {
      font-family: 'Lato', sans-serif;
      font-size: 16px;
      font-weight: 800;
      color: #111;
      margin: 0;
      letter-spacing: -0.01em;
      line-height: 1.3;
    }
    .img-editor-close {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: transparent;
      color: #bbb;
      border: 1px solid #e8e8e8;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      cursor: pointer;
      flex-shrink: 0;
      transition: all 0.15s;
    }
    .img-editor-close:hover { background: #111; color: #fff; border-color: #111; }
    .img-editor-preview {
      width: 100%;
      height: 150px;
      border-radius: 3px;
      overflow: hidden;
      margin-bottom: 12px;
      background: #f5f5f5;
      position: relative;
    }
    .img-editor-preview .img-preview-target { width: 100%; height: 100%; object-fit: cover; display: block; }
    .img-editor-success-badge {
      position: absolute;
      bottom: 8px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0,0,0,0.72);
      color: #fff;
      padding: 3px 12px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 5px;
      backdrop-filter: blur(4px);
      white-space: nowrap;
    }
    .img-editor-dropzone {
      border: 1.5px dashed #e0e0e0;
      border-radius: 4px;
      padding: 22px 16px;
      text-align: center;
      background: #fafafa;
      cursor: pointer;
      transition: all 0.18s;
      position: relative;
      margin-bottom: 12px;
    }
    .img-editor-dropzone:hover,
    .img-editor-dropzone.drag-over { border-color: #111; background: #f5f5f5; }
    .img-editor-dropzone.is-uploading { border-color: #ccc; pointer-events: none; }
    .dz-content { pointer-events: none; }
    .dz-icon {
      font-size: 20px;
      color: #d5d5d5;
      display: block;
      margin-bottom: 8px;
      transition: color 0.18s;
    }
    .dz-icon--loading { color: #aaa; }
    .dz-icon--success { color: #22c55e; }
    .img-editor-dropzone:hover .dz-icon:not(.dz-icon--loading):not(.dz-icon--success) { color: #888; }
    .dz-title { font-size: 13px; font-weight: 600; color: #666; margin: 0 0 3px; }
    .dz-sub { font-size: 11px; color: #bbb; margin: 0; }
    .img-editor-divider {
      text-align: center;
      font-size: 11px;
      color: #bbb;
      letter-spacing: 0.06em;
      margin: 12px 0 10px;
    }
    .img-editor-url-input {
      width: 100%;
      box-sizing: border-box;
      padding: 10px 13px;
      border: 1px solid #e8e8e8;
      border-radius: 3px;
      font-size: 13px;
      color: #333;
      background: #fff;
      font-family: inherit;
      transition: border-color 0.15s;
    }
    .img-editor-url-input::placeholder { color: #ccc; }
    .img-editor-url-input:focus { outline: none; border-color: #111; }
    .img-editor-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      padding-top: 18px;
      border-top: 1px solid #f0f0f0;
      margin-top: 18px;
    }
    .img-editor-btn-cancel {
      padding: 9px 20px;
      border: 1px solid #e0e0e0;
      background: transparent;
      color: #999;
      border-radius: 3px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s;
    }
    .img-editor-btn-cancel:hover { border-color: #111; color: #111; }
    .img-editor-btn-save {
      padding: 9px 22px;
      background: #111;
      color: #fff;
      border: none;
      border-radius: 3px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 7px;
      transition: background 0.15s;
    }
    .img-editor-btn-save:hover:not(:disabled) { background: #e8472a; }
    .img-editor-btn-save:disabled { opacity: 0.35; cursor: not-allowed; }

    /* ===== SECTION TITLE FLEX WRAP & ADMIN BTNS ===== */
    .section-title-wrap {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 16px;
    }
    .cat-card-admin-actions {
      position: absolute;
      top: 8px;
      right: 8px;
      z-index: 10;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    @media (max-width: 960px) {
      .categories-full-grid { grid-template-columns: 1fr; }
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
      .dest-teaser-imgs { height: 260px; }
    }
    @media (max-width: 600px) {
      html, body { max-width: 100vw; overflow-x: hidden; }
      .container { padding: 0 14px; }
      .page-hero { height: 280px; margin-top: 62px; }
      .page-hero-title { font-size: 28px; letter-spacing: -0.5px; }
      .page-hero-sub { font-size: 13px; line-height: 1.5; }
      .hero-admin-actions { top: 10px; right: 10px; gap: 6px; }
      .hero-edit-img-btn { padding: 5px 10px; font-size: 10px; }
      .cat-full-card { flex-direction: column; }
      .cat-full-img-wrap { width: 100%; height: 160px; }
      .cat-full-body { padding: 16px; }
      .features-grid { grid-template-columns: 1fr; }
      .latest-grid { grid-template-columns: 1fr; }
      .posts-grid { grid-template-columns: 1fr; }
      .dest-grid { grid-template-columns: 1fr; }
      .gallery-grid { columns: 1; }
      .footer-links-area { flex-wrap: wrap; gap: 24px; }
      .hero-btns { flex-direction: column; align-items: stretch; width: 100%; }
      .hero-btn-primary, .hero-btn-secondary { width: 100%; box-sizing: border-box; text-align: center; justify-content: center; }
      .intro-stats { grid-template-columns: repeat(2, 1fr); gap: 12px; }
      .profile-modal-card, .img-editor-card, .admin-modal-card { width: 94vw; padding: 20px 14px; max-height: 86vh; box-sizing: border-box; }
      .profile-input, .img-editor-url-input { font-size: 15px; }
      .dest-filter-bar, .country-subfilter-bar { overflow-x: auto; -webkit-overflow-scrolling: touch; padding-bottom: 8px; scrollbar-width: none; flex-wrap: nowrap !important; }
      .dest-filter-bar::-webkit-scrollbar, .country-subfilter-bar::-webkit-scrollbar { display: none; }
      .country-subfilter-bar { padding: 10px 14px !important; margin-bottom: 20px !important; }
      .contact-layout { grid-template-columns: 1fr; gap: 32px; }
      .contact-card { padding: 20px 16px; }
      .author-card { padding: 20px 16px; }
      .timeline-item { gap: 12px; padding-left: 18px; }
      .timeline-year { min-width: 38px; font-size: 12px; }
    }

    /* ===== GALLERY LIGHTBOX MODAL ===== */
    .lightbox-backdrop {
      position: fixed;
      inset: 0;
      z-index: 2000;
      background: rgba(0, 0, 0, 0.92);
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.25s ease;
    }
    .lightbox-container {
      position: relative;
      width: 92vw;
      height: 90vh;
      max-width: 1300px;
      max-height: 850px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .lightbox-close-btn {
      position: absolute;
      top: 15px;
      right: 15px;
      z-index: 2010;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.25);
      color: #ffffff;
      font-size: 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .lightbox-close-btn:hover {
      background: #e8472a;
      border-color: #e8472a;
      transform: scale(1.1);
    }
    .lightbox-counter {
      position: absolute;
      top: 20px;
      left: 20px;
      z-index: 2010;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #ffffff;
      background: rgba(0, 0, 0, 0.6);
      padding: 6px 14px;
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .lightbox-media-wrap {
      width: 100%;
      height: calc(100% - 70px);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .lightbox-img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      border-radius: 4px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.6);
      animation: zoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes zoomIn {
      from { opacity: 0; transform: scale(0.92); }
      to { opacity: 1; transform: scale(1); }
    }
    .lightbox-nav-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      z-index: 2010;
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: #ffffff;
      font-size: 18px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      backdrop-filter: blur(4px);
    }
    .lightbox-nav-btn:hover {
      background: #e8472a;
      border-color: #e8472a;
      transform: translateY(-50%) scale(1.12);
    }
    .lightbox-nav-btn.prev-btn { left: 20px; }
    .lightbox-nav-btn.next-btn { right: 20px; }

    @media (max-width: 768px) {
      .lightbox-nav-btn.prev-btn { left: 5px; width: 42px; height: 42px; font-size: 15px; }
      .lightbox-nav-btn.next-btn { right: 5px; width: 42px; height: 42px; font-size: 15px; }
    }

    .lightbox-footer {
      position: absolute;
      bottom: 15px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 2010;
      text-align: center;
      background: rgba(0, 0, 0, 0.75);
      padding: 10px 24px;
      border-radius: 30px;
      border: 1px solid rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(6px);
      max-width: 80%;
    }
    .lightbox-tag {
      display: inline-block;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #e8472a;
      margin-bottom: 2px;
    }
    .lightbox-caption {
      font-size: 14px;
      font-weight: 700;
      color: #ffffff;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* ===== PROFILE SETTINGS MODAL ===== */
    .profile-modal-card {
      background: #ffffff;
      color: #0f172a;
      width: 100%;
      max-width: 640px;
      border-radius: 8px;
      padding: 28px 30px;
      position: relative;
      box-shadow: 0 20px 50px rgba(0,0,0,0.3);
      max-height: 90vh;
      overflow-y: auto;
      animation: modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    body.dark-theme .profile-modal-card {
      background: #181818;
      color: #f8fafc;
      border: 1px solid #2e2e2e;
    }
    .profile-modal-header {
      text-align: center;
      margin-bottom: 22px;
    }
    .profile-modal-icon {
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: rgba(232, 71, 42, 0.1);
      color: #e8472a;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      margin-bottom: 10px;
    }
    .profile-modal-header h2 {
      font-size: 20px;
      font-weight: 800;
      margin: 0 0 6px;
    }
    .profile-modal-header p {
      font-size: 13px;
      color: #64748b;
      margin: 0;
    }
    body.dark-theme .profile-modal-header p { color: #94a3b8; }
    
    .profile-form { display: flex; flex-direction: column; gap: 16px; }
    .form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    @media (max-width: 580px) { .form-row-2 { grid-template-columns: 1fr; } }
    
    .profile-input {
      width: 100%;
      padding: 10px 14px;
      border: 1.5px solid #cbd5e1;
      border-radius: 5px;
      font-size: 13.5px;
      font-weight: 600;
      color: #1e293b;
      background: #ffffff;
      box-sizing: border-box;
      transition: all 0.2s;
    }
    .profile-input:focus {
      border-color: #e8472a;
      box-shadow: 0 0 0 3px rgba(232, 71, 42, 0.12);
      outline: none;
    }
    body.dark-theme .profile-input {
      background: #222222;
      border-color: #383838;
      color: #f8fafc;
    }
    
    .avatar-edit-row { display: flex; gap: 16px; align-items: center; margin-top: 6px; }
    .avatar-preview-img {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid #e8472a;
      flex-shrink: 0;
    }
    .avatar-actions-col { flex: 1; display: flex; flex-direction: column; gap: 8px; }
    .drag-upload-box {
      border: 2px dashed #cbd5e1;
      border-radius: 6px;
      padding: 12px;
      text-align: center;
      cursor: pointer;
      background: #f8fafc;
      transition: all 0.2s;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }
    .drag-upload-box:hover, .drag-upload-box.dragging {
      border-color: #e8472a;
      background: rgba(232, 71, 42, 0.05);
    }
    .drag-upload-box i { font-size: 18px; color: #e8472a; }
    .drag-upload-box span { font-size: 12px; font-weight: 700; color: #334155; }
    .drag-upload-box small { font-size: 10px; color: #64748b; }
    body.dark-theme .drag-upload-box { background: #222222; border-color: #383838; }
    body.dark-theme .drag-upload-box span { color: #cbd5e1; }

    .or-divider { text-align: center; font-size: 10px; font-weight: 800; color: #94a3b8; letter-spacing: 0.1em; }

    .input-with-icon { position: relative; }
    .input-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #e8472a; font-size: 14px; }
    .icon-padded { padding-left: 38px !important; }

    .social-section-title {
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.1em;
      color: #e8472a;
      margin-top: 10px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .instagram-col { color: #e1306c; }
    .youtube-col { color: #ff0000; }

    .profile-modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 14px;
      padding-top: 14px;
      border-top: 1px solid #e2e8f0;
    }
    body.dark-theme .profile-modal-actions { border-color: #2e2e2e; }

    .btn-profile-cancel {
      background: #f1f5f9;
      color: #475569;
      border: 1px solid #cbd5e1;
      padding: 10px 18px;
      border-radius: 4px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
    }
    .btn-profile-save {
      background: #e8472a;
      color: #ffffff;
      border: none;
      padding: 10px 22px;
      border-radius: 4px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: background 0.2s;
    }
    .btn-profile-save:hover { background: #d03b20; }
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
    { name: 'Daily Life', cat: 'Daily Life / Musings' },
    { name: 'Personal Growth', cat: 'Personal Growth' },
    { name: 'Travel & Places', cat: 'Travel & Places' },
    { name: 'Relationships', cat: 'Relationships' },
    { name: 'Health', cat: 'Health & Wellbeing' },
    { name: 'Work & Career', cat: 'Work & Career' },
    { name: 'Books & Learning', cat: 'Books & Learning' },
    { name: 'Goals & Projects', cat: 'Goals & Projects' },
    { name: 'Random Thoughts', cat: 'Random Thoughts / Rants' },
    { name: 'Photography', cat: 'Photography / Snapshots' },
  ];

  // Category Page Items
  categoryPageItems = [
    {
      name: 'Daily Life / Musings',
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80',
      desc: 'Reflections on daily routines, slow mornings, coffee rituals, and mindful living in a fast-paced world.'
    },
    {
      name: 'Personal Growth',
      image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=600&q=80',
      desc: 'The 1% Kaizen philosophy, micro-habits, mindset shifts, and the compound effect of daily practice.'
    },
    {
      name: 'Travel & Places',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80',
      desc: 'Journeys through 38+ countries — hidden waterfalls, ancient temples, cloud forests, and vibrant cities.'
    },
    {
      name: 'Relationships',
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80',
      desc: 'Long-distance friendships, meaningful connections, empathy, and building human bonds across borders.'
    },
    {
      name: 'Health & Wellbeing',
      image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=600&q=80',
      desc: 'Zone 2 aerobic cardio, endurance science, mental health, sleep optimization, and longevity practices.'
    },
    {
      name: 'Work & Career',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
      desc: 'Golang, modern software architecture, SPA engineering, remote work patterns, and technical leadership.'
    },
    {
      name: 'Books & Learning',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=600&q=80',
      desc: 'Mental models, book summaries, and transformative insights from reading 150+ books over a decade.'
    },
    {
      name: 'Goals & Projects',
      image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=600&q=80',
      desc: 'Personal Knowledge Management (PKM), Obsidian workflows, project tracking, and building side hustles.'
    },
    {
      name: 'Random Thoughts / Rants',
      image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66936?auto=format&fit=crop&w=600&q=80',
      desc: 'Unfiltered observations, hot takes on productivity culture, tech trends, and honest opinion pieces.'
    },
    {
      name: 'Photography / Snapshots',
      image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=600&q=80',
      desc: 'Natural light photography, golden hour captures, camera gear tips, and visual storytelling from the road.'
    }
  ];

  getCategoryArticleCount(catName: string): number {
    return this.articles.filter(a => a.category === catName).length || 1;
  }


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

  // Gallery Lightbox State & Navigation
  showLightbox = false;
  activeLightboxIndex = 0;

  get activeLightboxPhoto() {
    if (!this.filteredPhotos || this.filteredPhotos.length === 0) return null;
    const index = Math.max(0, Math.min(this.activeLightboxIndex, this.filteredPhotos.length - 1));
    return this.filteredPhotos[index];
  }

  openLightbox(index: number) {
    this.activeLightboxIndex = index;
    this.showLightbox = true;
  }

  closeLightbox() {
    this.showLightbox = false;
  }

  nextLightboxPhoto() {
    if (!this.filteredPhotos.length) return;
    this.activeLightboxIndex = (this.activeLightboxIndex + 1) % this.filteredPhotos.length;
  }

  prevLightboxPhoto() {
    if (!this.filteredPhotos.length) return;
    this.activeLightboxIndex = (this.activeLightboxIndex - 1 + this.filteredPhotos.length) % this.filteredPhotos.length;
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.showLightbox) return;
    if (event.key === 'ArrowRight') {
      this.nextLightboxPhoto();
    } else if (event.key === 'ArrowLeft') {
      this.prevLightboxPhoto();
    } else if (event.key === 'Escape') {
      this.closeLightbox();
    }
  }

  // About
  topics = [
    { name: 'Travel & Places', desc: 'In-depth guides to destinations across 38 countries.' },
    { name: 'Personal Growth', desc: 'The philosophy and practice of continuous improvement.' },
    { name: 'Work & Career', desc: 'Engineering, software architecture, and the modern workplace.' },
    { name: 'Photography', desc: 'Visual storytelling through natural light and composition.' },
    { name: 'Books & Learning', desc: 'Reviews and lessons from 150+ books read over a decade.' },
    { name: 'Life & Musings', desc: 'Honest reflections on daily life, relationships, and ideas.' },
  ];
  timeline = [
    { year: '2016', title: 'First Backpacking Trip', desc: 'Three months solo through Southeast Asia changed everything about how I see the world.' },
    { year: '2018', title: 'Started Engineering Career', desc: 'Joined a Bangkok startup building software. Discovered a love for architecture and clean code.' },
    { year: '2020', title: 'Discovered the Kaizen Philosophy', desc: 'Began applying the 1% daily improvement principle. Created this blog to document the journey.' },
    { year: '2022', title: 'Country #30: Iceland', desc: 'Watched the Northern Lights above a glacier. Decided that a life well-traveled is a life well-lived.' },
    { year: '2024', title: 'Built Full-Stack Blog Platform', desc: 'Created this blog from scratch with Golang, Angular, and CockroachDB.' },
    { year: '2026', title: 'Still Going', desc: '38 countries, 10+ articles, and a growing conviction that the best stories are still ahead.' },
  ];

  // Author & Contact Profile Settings
  authorName = 'Kaizen Explorer';
  authorTitle = 'World Traveler & Software Engineer';
  authorAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
  authorBio = 'World Traveler & Software Engineer, based in Bangkok & wherever the next flight takes me.';
  contactEmailValue = 'hello@kaizen-blog.com';
  contactLocationValue = 'Bangkok, Thailand & Global';
  contactResponseTimeValue = 'Usually within 24–48 hours';
  instagramUrl = 'https://instagram.com/kaizen_explorer';
  twitterUrl = 'https://x.com/kaizen_explorer';
  youtubeUrl = 'https://youtube.com/@kaizen_explorer';
  githubUrl = 'https://github.com/kaizen_explorer';

  // Contact
  contactName = '';
  contactEmail = '';
  contactSubject = 'Just Saying Hello';
  contactMessage = '';
  contactSent = false;
  get contactItems() {
    return [
      { icon: 'fa-solid fa-envelope', label: 'Email', value: this.contactEmailValue },
      { icon: 'fa-solid fa-location-dot', label: 'Based In', value: this.contactLocationValue },
      { icon: 'fa-solid fa-clock', label: 'Response Time', value: this.contactResponseTimeValue },
    ];
  }

  isAdmin = false;
  showAdminPassModal = false;
  adminPassInput = '';
  adminPassError = false;
  toastMsg = '';

  constructor(private articleService: ArticleService) {}

  ngOnInit() {
    this.initTheme();
    this.checkAdminStatus();
    this.checkSecretRoute();
    this.loadSiteSettings();
    this.loadData();
    this.restoreActivePageState();

    this.articleService.selectedCategory$.subscribe(cat => {
      this.activeCategory = cat;
      this.loadArticles();
    });
    this.articleService.searchQuery$.subscribe(q => {
      this.searchQuery = q;
      this.loadArticles();
    });

    window.addEventListener('kaizen:articles-synced', () => {
      this.loadArticles();
    });
    window.addEventListener('kaizen:settings-synced', () => {
      this.loadSiteSettings();
    });

    window.addEventListener('kaizen:open-publisher', () => {
      this.showPublisherModal = true;
    });
    window.addEventListener('kaizen:open-profile-settings', () => {
      this.openProfileSettingsModal();
    });
    window.addEventListener('kaizen:open-admin-passcode', () => {
      this.adminPassInput = '';
      this.adminPassError = false;
      this.showAdminPassModal = true;
    });
    window.addEventListener('kaizen:navigate', (e: any) => {
      const page = e.detail?.page || 'home';
      if (page === 'blog' && !e.detail?.cat) {
        this.resetFilters();
      } else if (e.detail?.cat) {
        this.selectedCatName = e.detail.cat;
        this.articleService.setCategory(e.detail.cat);
      }
      this.navigateTo(page, e.detail?.cat);
      if (e.detail?.dest) this.destFilter = e.detail.dest;
      if (e.detail?.country) this.destCountryFilter = e.detail.country;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Handle Browser Back & Forward Buttons
    window.addEventListener('popstate', (e: PopStateEvent) => {
      if (e.state && e.state.page) {
        if (e.state.catName) {
          this.selectedCatName = e.state.catName;
          this.articleService.setCategory(e.state.catName);
        }
        if (e.state.destFilter) this.destFilter = e.state.destFilter;
        if (e.state.articleId && this.articles.length > 0) {
          const found = this.articles.find(a => a.id === e.state.articleId);
          if (found) this.selectedArticle = found;
        } else {
          this.selectedArticle = null;
        }
        this.navigateTo(e.state.page, undefined, false);
      } else {
        this.restoreActivePageState();
      }
    });

    window.addEventListener('hashchange', () => {
      this.restoreActivePageState();
    });

    // Preload hero slide images for instant 0ms slide transitions
    this.preloadImages();
    // Start hero auto-slide
    this.startSlideshow();
  }

  preloadImages() {
    if (typeof window === 'undefined') return;
    this.heroSlides.forEach(slide => {
      const img = new Image();
      img.src = slide.img;
    });
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

  private updateUrlAndHistory(page: string, catName?: string, dest?: string, push: boolean = true) {
    if (typeof window === 'undefined') return;

    let hash = '#' + page;
    if (page === 'category' && catName) {
      hash += '?cat=' + encodeURIComponent(catName);
    } else if (page === 'destinations' && dest && dest !== 'All') {
      hash += '?dest=' + encodeURIComponent(dest);
    }

    const stateObj = { page, catName: catName || this.selectedCatName, destFilter: dest || this.destFilter };
    
    try {
      sessionStorage.setItem('kaizen_active_state', JSON.stringify(stateObj));
    } catch (e) {}

    if (push && window.location.hash !== hash) {
      window.history.pushState(stateObj, '', hash);
    }
  }

  private restoreActivePageState() {
    if (typeof window === 'undefined') return;

    const hash = window.location.hash;
    if (hash && hash.length > 1) {
      const cleanHash = hash.substring(1);
      const parts = cleanHash.split('?');
      const page = parts[0];
      
      if (['home', 'blog', 'destinations', 'categories', 'category', 'gallery', 'about', 'contact'].includes(page)) {
        if (page === 'category' && parts[1] && parts[1].includes('cat=')) {
          const params = new URLSearchParams(parts[1]);
          const cat = params.get('cat');
          if (cat) {
            this.selectedCatName = cat;
            this.articleService.setCategory(cat);
          }
        }
        if (page === 'destinations' && parts[1] && parts[1].includes('dest=')) {
          const params = new URLSearchParams(parts[1]);
          const dest = params.get('dest');
          if (dest) this.destFilter = dest;
        }
        this.navigateTo(page, undefined, false);
        return;
      }
    }

    try {
      const saved = sessionStorage.getItem('kaizen_active_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.page && ['home', 'blog', 'destinations', 'categories', 'category', 'gallery', 'about', 'contact'].includes(parsed.page)) {
          if (parsed.catName) {
            this.selectedCatName = parsed.catName;
            this.articleService.setCategory(parsed.catName);
          }
          if (parsed.destFilter) this.destFilter = parsed.destFilter;
          this.navigateTo(parsed.page, undefined, false);
          return;
        }
      }
    } catch (e) {}
  }

  navigateTo(page: string, catName?: string, pushState: boolean = true) {
    if (page === 'blog') {
      this.resetFilters();
    }
    this.currentPage = page;
    if (catName) {
      this.selectedCatName = catName;
    }
    this.updateUrlAndHistory(page, catName, this.destFilter, pushState);
    window.dispatchEvent(new CustomEvent('kaizen:page-changed', { detail: { page } }));
  }

  navTo(page: string, e?: Event) {
    if (e) e.preventDefault();
    this.navigateTo(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  get filteredBlogArticles(): Article[] {
    let list = this.articles || [];
    if (this.activeCategory) {
      const catLower = this.activeCategory.toLowerCase();
      list = list.filter(a => a.category.toLowerCase().includes(catLower));
    }
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(a => 
        (a.title && a.title.toLowerCase().includes(q)) || 
        (a.excerpt && a.excerpt.toLowerCase().includes(q)) || 
        (a.content && a.content.toLowerCase().includes(q)) ||
        (a.tags && a.tags.toLowerCase().includes(q))
      );
    }
    return list;
  }

  loadData() {
    this.articleService.getArticles('', '').subscribe(data => {
      this.articles = data;
      this.featuredArticle = data.find(a => a.featured) || data[0] || null;
    });
    this.articleService.getCategories().subscribe(cats => this.categories = cats);
  }

  loadArticles() {
    this.articleService.getArticles('', '').subscribe(data => {
      this.articles = data;
      if (!this.featuredArticle && data.length > 0) {
        this.featuredArticle = data.find(a => a.featured) || data[0];
      }
    });
  }

  openReader(article: Article) {
    this.selectedArticle = article;
  }

  destCountryFilter: string = 'All';

  setDestContinent(r: string) {
    this.destFilter = r;
    this.destCountryFilter = 'All';
  }

  get availableDestCountries(): string[] {
    const list = this.destTravelArticles;
    const countries = new Set<string>();
    list.forEach(a => {
      if (a.country) {
        countries.add(a.country);
      } else {
        const text = (a.title + ' ' + a.tags).toLowerCase();
        if (text.includes('indonesia') || text.includes('bali')) countries.add('Indonesia');
        if (text.includes('japan') || text.includes('kyoto')) countries.add('Japan');
        if (text.includes('thailand') || text.includes('chiang mai')) countries.add('Thailand');
        if (text.includes('greece') || text.includes('santorini')) countries.add('Greece');
        if (text.includes('italy') || text.includes('amalfi')) countries.add('Italy');
        if (text.includes('iceland')) countries.add('Iceland');
        if (text.includes('argentina') || text.includes('patagonia')) countries.add('Argentina');
        if (text.includes('peru') || text.includes('machu picchu')) countries.add('Peru');
        if (text.includes('tanzania') || text.includes('serengeti')) countries.add('Tanzania');
      }
    });
    return Array.from(countries);
  }

  get filteredDestTravelArticles(): Article[] {
    const list = this.destTravelArticles;
    if (this.destCountryFilter === 'All') return list;
    return list.filter(a => {
      const c = a.country || '';
      const text = (a.title + ' ' + a.excerpt + ' ' + a.tags + ' ' + a.content).toLowerCase();
      return c.toLowerCase() === this.destCountryFilter.toLowerCase() || text.includes(this.destCountryFilter.toLowerCase());
    });
  }

  get destTravelArticles(): Article[] {
    const travelCats = ['travel & places', 'travel & adventure', 'travel'];
    const travelList = this.articles.filter(a => 
      travelCats.some(tc => a.category.toLowerCase().includes(tc)) || 
      (a.tags && a.tags.toLowerCase().includes('travel'))
    );
    if (this.destFilter === 'All') return travelList;
    
    const regionLower = this.destFilter.toLowerCase();
    return travelList.filter(a => {
      const text = (a.title + ' ' + a.excerpt + ' ' + a.tags + ' ' + a.content + ' ' + (a.country || '')).toLowerCase();
      if (regionLower === 'asia') return text.includes('bali') || text.includes('japan') || text.includes('kyoto') || text.includes('thailand') || text.includes('chiang mai') || text.includes('asia') || text.includes('indonesia') || text.includes('vietnam') || text.includes('singapore');
      if (regionLower === 'europe') return text.includes('greece') || text.includes('santorini') || text.includes('italy') || text.includes('amalfi') || text.includes('iceland') || text.includes('europe') || text.includes('france') || text.includes('spain');
      if (regionLower === 'americas') return text.includes('patagonia') || text.includes('argentina') || text.includes('peru') || text.includes('machu picchu') || text.includes('americas') || text.includes('united states');
      if (regionLower === 'africa') return text.includes('serengeti') || text.includes('tanzania') || text.includes('africa') || text.includes('egypt');
      return text.includes(regionLower);
    });
  }

  openDestArticle(dest: any) {
    if (dest && dest.region) {
      this.destFilter = dest.region;
    }
    setTimeout(() => {
      const el = document.getElementById('dest-stories-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }

  selectedCatName = 'Personal Growth';

  get activeCategoryMeta() {
    return this.categoryPageItems.find(c => c.name.toLowerCase() === this.selectedCatName.toLowerCase()) 
      || this.categoryPageItems[1];
  }

  get categoryArticles() {
    return this.articles.filter(a => a.category.toLowerCase() === this.selectedCatName.toLowerCase());
  }

  openCategoryDetail(catName: string, e?: Event) {
    if (e) e.preventDefault();
    this.selectedCatName = catName;
    this.articleService.setCategory(catName);
    this.navigateTo('category', catName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  filterAndBlog(cat: string) {
    this.openCategoryDetail(cat);
  }

  filterCat(cat: string, e: Event) {
    this.openCategoryDetail(cat, e);
  }

  goDestPage(region: string, e: Event) {
    e.preventDefault();
    this.destFilter = region;
    this.navigateTo('destinations');
  }

  resetFilters() {
    this.activeCategory = '';
    this.searchQuery = '';
    this.articleService.setCategory('');
    this.articleService.setSearchQuery('');
    this.loadArticles();
  }

  editingArticle: Article | null = null;

  openEditModal(article: Article) {
    this.editingArticle = article;
    this.showPublisherModal = true;
  }

  closePublisherModal() {
    this.showPublisherModal = false;
    this.editingArticle = null;
  }

  handleArticlePublished(newArticle: Article) {
    const idx = this.articles.findIndex(a => a.id === newArticle.id);
    if (idx !== -1) {
      this.articles[idx] = newArticle;
      this.showToast('Article updated successfully');
    } else {
      this.articles.unshift(newArticle);
      this.showToast('New article created successfully');
    }
    this.editingArticle = null;
    this.openReader(newArticle);
  }

  initTheme() {
    if (typeof localStorage !== 'undefined') {
      const savedTheme = localStorage.getItem('kaizen_theme');
      if (savedTheme === 'dark' || (!savedTheme && typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        if (typeof document !== 'undefined') document.body.classList.add('dark-theme');
      } else {
        if (typeof document !== 'undefined') document.body.classList.remove('dark-theme');
      }
    }
  }

  checkAdminStatus() {
    if (typeof sessionStorage !== 'undefined') {
      this.isAdmin = sessionStorage.getItem('kaizen_admin_session') === 'true';
    } else {
      this.isAdmin = false;
    }
  }

  checkSecretRoute() {
    if (typeof window !== 'undefined') {
      const url = window.location.href.toLowerCase();
      if (url.includes('admin')) {
        this.showAdminPassModal = true;
        try {
          history.replaceState(null, '', window.location.pathname);
        } catch (e) {}
      }
    }
  }

  // Dynamic Hero Banners
  blogHeroImg = 'https://images.unsplash.com/photo-1499750310107-5fef28a66936?auto=format&fit=crop&w=1400&q=80';
  destHeroImg = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1400&q=80';
  catHeroImg = 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1400&q=80';
  galleryHeroImg = 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=1400&q=80';
  aboutHeroImg = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80';
  contactHeroImg = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80';

  // Image Editor Modal State
  showImageEditorModal = false;
  imageEditorTitle = 'Change Image';
  imageEditorTargetKey = '';
  imageEditorTargetItem: any = null;
  imageEditorTargetProp = 'image';
  imageEditorPreview = '';
  imageEditorUrlInput = '';
  isImageDragging = false;
  imageUploading = false;
  imageUploadSuccess = false;

  openImageEditor(key: string, title: string) {
    this.imageEditorTargetKey = key;
    this.imageEditorTargetItem = null;
    this.imageEditorTitle = title;
    this.imageEditorUrlInput = '';
    this.imageUploading = false;
    this.imageUploadSuccess = false;
    this.isImageDragging = false;
    if (key === 'currentSlideImg') {
      this.imageEditorPreview = this.heroSlides[this.currentSlide].img;
    } else {
      this.imageEditorPreview = (this as any)[key] || '';
    }
    this.showImageEditorModal = true;
  }

  tempPhotoCaption = '';
  tempPhotoTag = '';

  openImageEditorItem(item: any, propName: string, title: string) {
    this.imageEditorTargetKey = 'item';
    this.imageEditorTargetItem = item;
    this.imageEditorTargetProp = propName;
    this.imageEditorTitle = title;
    this.imageEditorPreview = item[propName] || '';
    this.tempPhotoCaption = item.caption || '';
    this.tempPhotoTag = item.tag || 'Travel';
    this.imageEditorUrlInput = '';
    this.imageUploading = false;
    this.imageUploadSuccess = false;
    this.isImageDragging = false;
    this.showImageEditorModal = true;
  }

  onImageDragOver(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.isImageDragging = true;
  }

  onImageDragLeave(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.isImageDragging = false;
  }

  onImageDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.isImageDragging = false;
    const files = e.dataTransfer?.files;
    if (files && files[0] && files[0].type.startsWith('image/')) {
      this.processImageFile(files[0]);
    }
  }

  onAdminImageFileSelected(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.processImageFile(input.files[0]);
    }
  }

  compressImage(file: File, maxDim = 1200, quality = 0.82): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', quality));
          } else {
            resolve(e.target?.result as string);
          }
        };
        img.onerror = () => resolve(e.target?.result as string);
        img.src = e.target?.result as string;
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  }

  processImageFile(file: File) {
    this.imageUploading = true;
    this.imageUploadSuccess = false;

    this.compressImage(file, 1200, 0.82).then((compressed) => {
      this.imageEditorPreview = compressed;
      this.imageUploading = false;
      this.imageUploadSuccess = true;
    }).catch(() => {
      this.imageUploading = false;
      this.showToast('Error opening image file');
    });
  }

  onUrlInputChanged() {
    if (this.imageEditorUrlInput) {
      this.imageEditorPreview = this.imageEditorUrlInput;
      this.imageUploadSuccess = true;
    }
  }

  // Universal Text Customization State
  pageHeroTexts = {
    blog: { label: 'THE JOURNAL', title: 'Blog', sub: 'Travel stories, personal growth, photography, career musings, and everything in between — all written from direct experience.' },
    destinations: { label: 'TRAVEL DEEPER', title: 'Destinations', sub: 'A curated index of travel guides, cultural deep-dives, and practical tips across 38+ countries.' },
    categories: { label: 'EXPLORE BY TOPIC', title: 'Categories', sub: 'Curated collections of articles grouped by core themes — from travel & philosophy to software engineering.' },
    gallery: { label: 'VISUAL STORIES', title: 'Photo Gallery', sub: 'A curated collection of travel photography from around the world — golden hours, ancient temples, and wild landscapes.' },
    about: { label: 'HELLO THERE', title: 'About Me', sub: 'The story behind Kaizen — the philosophy, the journey, and the human writing these words.' },
    contact: { label: 'GET IN TOUCH', title: 'Contact', sub: "Have a question, collaboration idea, or just want to say hello? I'd love to hear from you." }
  };

  aboutTexts = {
    storyTitle: 'The Kaizen Story',
    storyP1: 'Kaizen (改善) is a Japanese word meaning "continuous improvement." This blog was born from a simple belief: that small, deliberate improvements in every aspect of life compound into something extraordinary over time.',
    storyP2: 'I started writing here as a personal journal. It quickly became something more: a documentation of a life lived with curiosity — destinations, countless engineering challenges, thousands of books, and an ongoing experiment in becoming a little better every day.'
  };

  contactTexts = {
    title: "Let's Connect",
    desc: "Whether you're a fellow traveler, a reader, a brand, or someone who just stumbled here — welcome. My inbox is always open."
  };

  homeTexts = {
    teaserEyebrow: 'TRAVEL DEEPER',
    teaserTitle: 'Destinations. Countless Stories.',
    teaserDesc: 'From the ancient temples of Kyoto and the blue domes of Santorini to the wild plains of the Serengeti — every destination has left its mark. Browse the full collection of travel guides, hidden gems, and practical tips.'
  };

  // Quick Text Editor Modal State
  showTextEditorModal = false;
  textEditorModalTitle = '';
  textEditorTargetType = '';
  textEditorTargetItem: any = null;
  textEditorField1Label = '';
  textEditorField1Value = '';
  textEditorField2Label = '';
  textEditorField2Value = '';
  textEditorIsField2Textarea = false;
  textEditorField3Label = '';
  textEditorField3Value = '';

  openHeroTextEditor(heroKey: string) {
    const hero = (this.pageHeroTexts as any)[heroKey];
    if (!hero) return;
    this.textEditorTargetType = 'hero:' + heroKey;
    this.textEditorModalTitle = 'Edit ' + heroKey.toUpperCase() + ' Hero Banner Text';
    this.textEditorField1Label = 'EYEBROW LABEL';
    this.textEditorField1Value = hero.label;
    this.textEditorField2Label = 'MAIN TITLE';
    this.textEditorField2Value = hero.title;
    this.textEditorIsField2Textarea = false;
    this.textEditorField3Label = 'SUBTITLE / DESCRIPTION';
    this.textEditorField3Value = hero.sub;
    this.showTextEditorModal = true;
  }

  openAboutStoryEditor() {
    this.textEditorTargetType = 'aboutStory';
    this.textEditorModalTitle = 'Edit About Story Content';
    this.textEditorField1Label = 'STORY SECTION TITLE';
    this.textEditorField1Value = this.aboutTexts.storyTitle;
    this.textEditorField2Label = 'PARAGRAPH 1';
    this.textEditorField2Value = this.aboutTexts.storyP1;
    this.textEditorIsField2Textarea = true;
    this.textEditorField3Label = 'PARAGRAPH 2';
    this.textEditorField3Value = this.aboutTexts.storyP2;
    this.showTextEditorModal = true;
  }

  openTimelineEditor(item: any) {
    this.textEditorTargetType = 'timeline';
    this.textEditorTargetItem = item;
    this.textEditorModalTitle = 'Edit Timeline Milestone: ' + item.year;
    this.textEditorField1Label = 'YEAR';
    this.textEditorField1Value = item.year;
    this.textEditorField2Label = 'MILESTONE TITLE';
    this.textEditorField2Value = item.title;
    this.textEditorIsField2Textarea = false;
    this.textEditorField3Label = 'MILESTONE DESCRIPTION';
    this.textEditorField3Value = item.desc;
    this.showTextEditorModal = true;
  }

  openHomeTeaserEditor() {
    this.textEditorTargetType = 'homeTeaser';
    this.textEditorModalTitle = 'Edit Home Destination Teaser Text';
    this.textEditorField1Label = 'EYEBROW LABEL';
    this.textEditorField1Value = this.homeTexts.teaserEyebrow;
    this.textEditorField2Label = 'TEASER TITLE';
    this.textEditorField2Value = this.homeTexts.teaserTitle;
    this.textEditorIsField2Textarea = false;
    this.textEditorField3Label = 'TEASER DESCRIPTION';
    this.textEditorField3Value = this.homeTexts.teaserDesc;
    this.showTextEditorModal = true;
  }

  openCategoryEditor(cat: any) {
    this.textEditorTargetType = 'category';
    this.textEditorTargetItem = cat;
    this.textEditorModalTitle = 'Edit Category Hub: ' + cat.name;
    this.textEditorField1Label = 'CATEGORY NAME';
    this.textEditorField1Value = cat.name;
    this.textEditorField2Label = 'CATEGORY DESCRIPTION';
    this.textEditorField2Value = cat.desc;
    this.textEditorIsField2Textarea = true;
    this.textEditorField3Label = '';
    this.textEditorField3Value = '';
    this.showTextEditorModal = true;
  }

  closeTextEditorModal() {
    this.showTextEditorModal = false;
  }

  saveTextEditor() {
    if (this.textEditorTargetType.startsWith('hero:')) {
      const key = this.textEditorTargetType.split(':')[1];
      if ((this.pageHeroTexts as any)[key]) {
        (this.pageHeroTexts as any)[key] = {
          label: this.textEditorField1Value,
          title: this.textEditorField2Value,
          sub: this.textEditorField3Value
        };
      }
    } else if (this.textEditorTargetType === 'aboutStory') {
      this.aboutTexts.storyTitle = this.textEditorField1Value;
      this.aboutTexts.storyP1 = this.textEditorField2Value;
      this.aboutTexts.storyP2 = this.textEditorField3Value;
    } else if (this.textEditorTargetType === 'timeline' && this.textEditorTargetItem) {
      this.textEditorTargetItem.year = this.textEditorField1Value;
      this.textEditorTargetItem.title = this.textEditorField2Value;
      this.textEditorTargetItem.desc = this.textEditorField3Value;
    } else if (this.textEditorTargetType === 'category' && this.textEditorTargetItem) {
      this.textEditorTargetItem.name = this.textEditorField1Value;
      this.textEditorTargetItem.desc = this.textEditorField2Value;
    } else if (this.textEditorTargetType === 'homeTeaser') {
      this.homeTexts.teaserEyebrow = this.textEditorField1Value;
      this.homeTexts.teaserTitle = this.textEditorField2Value;
      this.homeTexts.teaserDesc = this.textEditorField3Value;
    }

    this.saveSiteSettings();
    this.showTextEditorModal = false;
    this.showToast('Text content saved successfully!');
  }

  saveSiteSettings() {
    if (typeof localStorage === 'undefined') return;
    try {
      const settings = {
        blogHeroImg: this.blogHeroImg,
        destHeroImg: this.destHeroImg,
        catHeroImg: this.catHeroImg,
        galleryHeroImg: this.galleryHeroImg,
        aboutHeroImg: this.aboutHeroImg,
        contactHeroImg: this.contactHeroImg,
        heroSlides: this.heroSlides,
        categoryPageItems: this.categoryPageItems,
        allDestinations: this.allDestinations,
        photos: this.photos,
        authorName: this.authorName,
        authorTitle: this.authorTitle,
        authorAvatar: this.authorAvatar,
        authorBio: this.authorBio,
        contactEmailValue: this.contactEmailValue,
        contactLocationValue: this.contactLocationValue,
        contactResponseTimeValue: this.contactResponseTimeValue,
        instagramUrl: this.instagramUrl,
        twitterUrl: this.twitterUrl,
        youtubeUrl: this.youtubeUrl,
        githubUrl: this.githubUrl,
        pageHeroTexts: this.pageHeroTexts,
        aboutTexts: this.aboutTexts,
        contactTexts: this.contactTexts,
        homeTexts: this.homeTexts,
        timeline: this.timeline
      };
      localStorage.setItem('kaizen_site_settings', JSON.stringify(settings));
      this.articleService.syncToCloud(this.articles, settings);
    } catch (e) {
      console.warn('LocalStorage save warning:', e);
    }
  }

  loadSiteSettings() {
    if (typeof localStorage === 'undefined') return;
    try {
      const saved = localStorage.getItem('kaizen_site_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.blogHeroImg) this.blogHeroImg = parsed.blogHeroImg;
        if (parsed.destHeroImg) this.destHeroImg = parsed.destHeroImg;
        if (parsed.catHeroImg) this.catHeroImg = parsed.catHeroImg;
        if (parsed.galleryHeroImg) this.galleryHeroImg = parsed.galleryHeroImg;
        if (parsed.aboutHeroImg) this.aboutHeroImg = parsed.aboutHeroImg;
        if (parsed.contactHeroImg) this.contactHeroImg = parsed.contactHeroImg;
        if (parsed.heroSlides && parsed.heroSlides.length) this.heroSlides = parsed.heroSlides;
        if (parsed.categoryPageItems && parsed.categoryPageItems.length) this.categoryPageItems = parsed.categoryPageItems;
        if (parsed.allDestinations && parsed.allDestinations.length) this.allDestinations = parsed.allDestinations;
        if (parsed.photos && parsed.photos.length) this.photos = parsed.photos;
        if (parsed.authorName) this.authorName = parsed.authorName;
        if (parsed.authorTitle) this.authorTitle = parsed.authorTitle;
        if (parsed.authorAvatar) this.authorAvatar = parsed.authorAvatar;
        if (parsed.authorBio) this.authorBio = parsed.authorBio;
        if (parsed.contactEmailValue) this.contactEmailValue = parsed.contactEmailValue;
        if (parsed.contactLocationValue) this.contactLocationValue = parsed.contactLocationValue;
        if (parsed.contactResponseTimeValue) this.contactResponseTimeValue = parsed.contactResponseTimeValue;
        if (parsed.instagramUrl !== undefined) this.instagramUrl = parsed.instagramUrl;
        if (parsed.twitterUrl !== undefined) this.twitterUrl = parsed.twitterUrl;
        if (parsed.youtubeUrl !== undefined) this.youtubeUrl = parsed.youtubeUrl;
        if (parsed.githubUrl !== undefined) this.githubUrl = parsed.githubUrl;
        if (parsed.pageHeroTexts) this.pageHeroTexts = parsed.pageHeroTexts;
        if (parsed.aboutTexts) this.aboutTexts = parsed.aboutTexts;
        if (parsed.contactTexts) this.contactTexts = parsed.contactTexts;
        if (parsed.homeTexts) this.homeTexts = parsed.homeTexts;
        if (parsed.timeline && parsed.timeline.length) this.timeline = parsed.timeline;
      }
    } catch (e) {}
  }

  // Profile Settings Modal logic
  showProfileSettingsModal = false;
  tempAuthorName = '';
  tempAuthorTitle = '';
  tempAuthorAvatar = '';
  tempContactEmail = '';
  tempContactLocation = '';
  tempContactResponseTime = '';
  tempInstagramUrl = '';
  tempTwitterUrl = '';
  tempYoutubeUrl = '';
  tempGithubUrl = '';
  isAvatarDragging = false;

  openProfileSettingsModal() {
    this.tempAuthorName = this.authorName;
    this.tempAuthorTitle = this.authorTitle;
    this.tempAuthorAvatar = this.authorAvatar;
    this.tempContactEmail = this.contactEmailValue;
    this.tempContactLocation = this.contactLocationValue;
    this.tempContactResponseTime = this.contactResponseTimeValue;
    this.tempInstagramUrl = this.instagramUrl;
    this.tempTwitterUrl = this.twitterUrl;
    this.tempYoutubeUrl = this.youtubeUrl;
    this.tempGithubUrl = this.githubUrl;
    this.showProfileSettingsModal = true;
  }

  closeProfileSettingsModal() {
    this.showProfileSettingsModal = false;
  }

  saveProfileSettings() {
    if (this.tempAuthorName) this.authorName = this.tempAuthorName;
    if (this.tempAuthorTitle) this.authorTitle = this.tempAuthorTitle;
    if (this.tempAuthorAvatar) this.authorAvatar = this.tempAuthorAvatar;
    if (this.tempContactEmail) this.contactEmailValue = this.tempContactEmail;
    if (this.tempContactLocation) this.contactLocationValue = this.tempContactLocation;
    if (this.tempContactResponseTime) this.contactResponseTimeValue = this.tempContactResponseTime;
    this.instagramUrl = this.tempInstagramUrl;
    this.twitterUrl = this.tempTwitterUrl;
    this.youtubeUrl = this.tempYoutubeUrl;
    this.githubUrl = this.tempGithubUrl;

    this.saveSiteSettings();
    this.showProfileSettingsModal = false;
    this.showToast('Profile & Contact Details updated successfully!');
  }

  onAvatarDragOver(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.isAvatarDragging = true;
  }

  onAvatarDragLeave(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.isAvatarDragging = false;
  }

  onAvatarDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.isAvatarDragging = false;
    const files = e.dataTransfer?.files;
    if (files && files[0] && files[0].type.startsWith('image/')) {
      this.processAvatarFile(files[0]);
    }
  }

  onAvatarFileSelected(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.processAvatarFile(input.files[0]);
    }
  }

  processAvatarFile(file: File) {
    this.compressImage(file, 600, 0.85).then(compressed => {
      this.tempAuthorAvatar = compressed;
    });
  }

  saveImageEditor() {
    if (!this.imageEditorPreview) return;

    if (this.imageEditorTargetKey === 'item' && this.imageEditorTargetItem) {
      this.imageEditorTargetItem[this.imageEditorTargetProp] = this.imageEditorPreview;
      if (this.imageEditorTargetItem.caption !== undefined) {
        this.imageEditorTargetItem.caption = this.tempPhotoCaption;
      }
      if (this.imageEditorTargetItem.tag !== undefined) {
        this.imageEditorTargetItem.tag = this.tempPhotoTag;
      }
    } else if (this.imageEditorTargetKey === 'currentSlideImg') {
      this.heroSlides[this.currentSlide].img = this.imageEditorPreview;
    } else if (this.imageEditorTargetKey) {
      (this as any)[this.imageEditorTargetKey] = this.imageEditorPreview;
    }

    this.saveSiteSettings();
    this.showImageEditorModal = false;
    this.imageUploading = false;
    this.imageUploadSuccess = false;
    this.showToast('Image updated and saved successfully');
  }

  unlockAdmin() {
    if (this.adminPassInput.trim() === 'kaizen2026') {
      this.isAdmin = true;
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('kaizen_admin_session', 'true');
      }
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('kaizen_admin_active');
      }
      window.dispatchEvent(new CustomEvent('kaizen:admin-status', { detail: { isAdmin: true } }));
      this.showAdminPassModal = false;
      this.adminPassInput = '';
      this.adminPassError = false;
      this.showToast('Stealth Admin Mode Unlocked! You have full Write & Edit access.');
    } else {
      this.adminPassError = true;
    }
  }

  showDeleteModal = false;
  articleToDelete: Article | null = null;
  isDeleting = false;
  deleteProgress = 0;

  promptDeleteArticle(article: Article) {
    this.articleToDelete = article;
    this.showDeleteModal = true;
    this.isDeleting = false;
    this.deleteProgress = 0;
  }

  cancelDelete() {
    if (this.isDeleting) return;
    this.showDeleteModal = false;
    this.articleToDelete = null;
  }

  confirmDeleteArticle() {
    if (!this.articleToDelete || this.isDeleting) return;
    const target = this.articleToDelete;
    this.isDeleting = true;
    this.deleteProgress = 25;

    // Step 1: Optimistic Instant UI Deletion (0ms latency for user)
    this.articles = this.articles.filter(a => a.id !== target.id);
    if (this.selectedArticle && this.selectedArticle.id === target.id) {
      this.selectedArticle = null;
    }

    setTimeout(() => { this.deleteProgress = 65; }, 100);
    setTimeout(() => { this.deleteProgress = 90; }, 200);

    // Step 2: Persistent Storage & Cloud Deletion
    this.articleService.deleteArticle(target.id).subscribe(() => {
      this.deleteProgress = 100;
      setTimeout(() => {
        this.showDeleteModal = false;
        this.articleToDelete = null;
        this.isDeleting = false;
        this.deleteProgress = 0;
        this.showToast(`"${target.title}" was deleted permanently.`);
      }, 150);
    });
  }

  deleteArticleFromReader(article: Article) {
    this.promptDeleteArticle(article);
  }

  showToast(msg: string) {
    this.toastMsg = msg;
    setTimeout(() => {
      this.toastMsg = '';
    }, 4000);
  }

  submitContact() {
    if (this.contactName && this.contactEmail && this.contactMessage) {
      this.contactSent = true;
    }
  }
}
