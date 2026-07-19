import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
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

      <!-- ===== HERO ===== -->
      <app-hero [article]="featuredArticle"></app-hero>

      <!-- ===== MAIN CONTENT ===== -->
      <main class="main-body" id="blog-section">
        <div class="container main-container">

          <!-- Section heading "BLOG POSTS" style -->
          <div class="section-header">
            <h2 class="section-heading">
              BLOG POSTS
            </h2>
            <div class="filter-info" *ngIf="activeCategory || searchQuery">
              <span class="filter-pill">
                {{ activeCategory || searchQuery }}
                <button class="clear-filter" (click)="resetFilters()">×</button>
              </span>
            </div>
          </div>

          <!-- 3-column article grid -->
          <div class="posts-grid" *ngIf="articles.length > 0">
            <app-article-card
              *ngFor="let item of articles"
              [article]="item"
              (onSelect)="openReader($event)"
            ></app-article-card>
          </div>

          <!-- Empty state -->
          <div class="empty-state" *ngIf="articles.length === 0">
            <i class="fa-solid fa-compass empty-icon"></i>
            <h3>No Articles Found</h3>
            <p>Try searching for a different keyword or browse another category.</p>
            <button class="btn btn-secondary" (click)="resetFilters()">View All Posts</button>
          </div>

          <!-- Load more button -->
          <div class="load-more-wrap" *ngIf="articles.length > 0">
            <button class="load-more-btn">LOAD MORE POSTS</button>
          </div>

        </div>
      </main>

      <!-- ===== FOOTER ===== -->
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
                <li><a href="#">Asia</a></li>
                <li><a href="#">Europe</a></li>
                <li><a href="#">Americas</a></li>
                <li><a href="#">Africa</a></li>
                <li><a href="#">Oceania</a></li>
              </ul>
            </div>
            <div class="footer-col">
              <h4>CATEGORIES</h4>
              <ul>
                <li><a href="#" (click)="filterCat('Travel & Adventure', $event)">Travel & Adventure</a></li>
                <li><a href="#" (click)="filterCat('Technology & Code', $event)">Technology & Code</a></li>
                <li><a href="#" (click)="filterCat('Lifestyle & Kaizen', $event)">Lifestyle & Kaizen</a></li>
                <li><a href="#" (click)="filterCat('Photography', $event)">Photography</a></li>
              </ul>
            </div>
            <div class="footer-col">
              <h4>QUICK LINKS</h4>
              <ul>
                <li><a href="#">About</a></li>
                <li><a href="#">Contact</a></li>
                <li><a href="#">Gallery</a></li>
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
    /* ===== MAIN BODY ===== */
    .app-wrapper { min-height: 100vh; display: flex; flex-direction: column; }

    .main-body {
      flex: 1;
      background: #ffffff;
      padding: 48px 0 60px;
    }

    .main-container { }

    /* Section heading — matches "BLOG POSTS" style */
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
      bottom: -3px;
      left: 0;
      width: 40px;
      height: 3px;
      background: #e8472a;
    }

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
      background: none;
      border: none;
      cursor: pointer;
      font-size: 16px;
      color: #999;
      line-height: 1;
      padding: 0;
    }
    .clear-filter:hover { color: #e8472a; }

    /* 3-column article grid */
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
    .empty-icon {
      font-size: 52px;
      color: #cccccc;
      margin-bottom: 20px;
    }
    .empty-state h3 {
      font-size: 22px;
      color: #333;
      margin-bottom: 10px;
    }
    .empty-state p {
      color: #888;
      margin-bottom: 24px;
    }

    /* Load more */
    .load-more-wrap {
      text-align: center;
      margin-top: 48px;
    }
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
    .load-more-btn:hover {
      background: #333333;
      color: #ffffff;
    }

    /* ===== FOOTER ===== */
    .site-footer {
      background: #111111;
      color: #aaaaaa;
    }
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
    .footer-tagline {
      font-style: italic;
      color: #888888;
      font-size: 14px;
      margin-bottom: 14px;
    }
    .footer-desc {
      font-size: 13px;
      line-height: 1.7;
      color: #777777;
      margin-bottom: 20px;
    }
    .footer-social {
      display: flex;
      gap: 14px;
    }
    .footer-social a {
      font-size: 18px;
      color: #777777;
      transition: color 0.2s;
    }
    .footer-social a:hover { color: #e8472a; }

    .footer-links-area {
      display: flex;
      gap: 40px;
      justify-content: flex-end;
    }
    .footer-col h4 {
      font-family: 'Lato', sans-serif;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #ffffff;
      margin-bottom: 16px;
    }
    .footer-col ul {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .footer-col ul a {
      font-size: 13px;
      color: #777777;
      transition: color 0.2s;
    }
    .footer-col ul a:hover { color: #e8472a; }

    .footer-bottom {
      border-top: 1px solid #222222;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #555555;
    }

    /* Responsive */
    @media (max-width: 960px) {
      .posts-grid { grid-template-columns: repeat(2, 1fr); }
      .footer-inner { grid-template-columns: 1fr; gap: 30px; }
      .footer-links-area { justify-content: flex-start; }
    }
    @media (max-width: 600px) {
      .posts-grid { grid-template-columns: 1fr; }
      .footer-links-area { flex-wrap: wrap; }
    }
  `]
})
export class AppComponent implements OnInit {
  articles: Article[] = [];
  featuredArticle: Article | null = null;
  categories: Category[] = [];
  authorProfile: AuthorProfile | null = null;

  activeCategory = '';
  searchQuery = '';
  selectedArticle: Article | null = null;
  showPublisherModal = false;

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

    // Listen for publisher modal open event from header
    window.addEventListener('kaizen:open-publisher', () => {
      this.showPublisherModal = true;
    });
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

  filterCat(cat: string, e: Event) {
    e.preventDefault();
    this.articleService.setCategory(cat);
  }

  resetFilters() {
    this.articleService.setCategory('');
    this.articleService.setSearchQuery('');
  }

  handleArticlePublished(newArticle: Article) {
    this.articles.unshift(newArticle);
    this.openReader(newArticle);
  }
}
