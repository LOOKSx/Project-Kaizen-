import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ArticleService } from '../../services/article.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <header class="site-header" [class.scrolled]="scrolled">
      <div class="navbar-inner">

        <!-- Logo -->
        <a class="site-logo" href="#" (click)="navigate('home', $event)">
          <span class="logo-text">KAIZEN</span>
        </a>

        <!-- Primary Navigation -->
        <nav class="primary-nav" [class.open]="mobileOpen">
          <ul class="nav-list">
            <li class="nav-item">
              <a href="#" class="nav-link" [class.active]="activePage==='home'" (click)="navigate('home', $event)">HOME</a>
            </li>
            <li class="nav-item">
              <a href="#" class="nav-link" [class.active]="activePage==='blog'" (click)="navigate('blog', $event)">BLOG</a>
            </li>

            <!-- DESTINATIONS 2-Level Megamenu (Ultra-Clean, Emojis Removed, Dynamic Only) -->
            <li class="nav-item has-dropdown" (mouseenter)="openMenu('dest')" (mouseleave)="closeMenu()">
              <a href="#" class="nav-link" [class.active]="activePage==='destinations'" (click)="navigate('destinations', $event)">
                DESTINATIONS <span class="caret">›</span>
              </a>
              <div class="dest-mega-dropdown" [class.visible]="activeMenu === 'dest'">
                <div class="dest-mega-layout">
                  
                  <!-- Left Column: Continents List -->
                  <div class="dest-continents-col">
                    <a href="#" (click)="navigateDest('All', $event)" class="dest-mega-all-btn">
                      <span>ALL DESTINATIONS</span>
                      <span class="mega-arrow">›</span>
                    </a>
                    <div class="dest-divider"></div>
                    <ul class="dest-continent-list">
                      <li *ngFor="let c of continents"
                          [class.active]="hoveredContinent === c"
                          (mouseenter)="hoveredContinent = c">
                        <a href="#" (click)="navigateDest(c, $event)">
                          <span class="continent-name">{{ c | uppercase }}</span>
                          <span class="mega-arrow">›</span>
                        </a>
                      </li>
                    </ul>
                  </div>

                  <!-- Right Column: Subcategory Countries List (ONLY Published Countries) -->
                  <div class="dest-countries-col">
                    <div class="dest-countries-header">
                      <span class="countries-header-title">{{ hoveredContinent | uppercase }} DESTINATIONS</span>
                      <span class="count-badge" *ngIf="activeContinentCountries.length > 0">
                        {{ activeContinentCountries.length }} {{ activeContinentCountries.length === 1 ? 'Country' : 'Countries' }}
                      </span>
                    </div>
                    <div class="dest-countries-divider"></div>
                    
                    <!-- Published Countries with written guides -->
                    <ul class="dest-countries-list" *ngIf="activeContinentCountries.length > 0">
                      <li *ngFor="let c of activeContinentCountries">
                        <a href="#" (click)="navigateCountry(hoveredContinent, c.tag, $event)">
                          <span class="country-item-name">{{ c.name | uppercase }}</span>
                          <span class="country-arrow">&rarr;</span>
                        </a>
                      </li>
                    </ul>

                    <!-- Empty State (Shown when no articles exist yet for this region) -->
                    <div class="no-countries-box" *ngIf="activeContinentCountries.length === 0">
                      <i class="fa-solid fa-compass"></i>
                      <p class="no-countries-title">No Guides Published Yet</p>
                      <p class="no-countries-sub">New destination guides will automatically appear here once published by authors.</p>
                    </div>

                  </div>

                </div>
              </div>
            </li>

            <!-- CATEGORIES rich mega dropdown -->
            <li class="nav-item has-dropdown" (mouseenter)="openMenu('cat')" (mouseleave)="closeMenu()">
              <a href="#" class="nav-link" [class.active]="activePage==='categories'" (click)="navigate('categories', $event)">
                CATEGORIES <span class="caret">›</span>
              </a>
              <div class="categories-mega-dropdown" [class.visible]="activeMenu === 'cat'">
                <div class="cat-mega-layout">
                  <!-- Left: Categories List -->
                  <div class="cat-mega-list-col">
                    <a href="#" (click)="navigate('categories', $event)" class="cat-mega-all-btn">
                      <span>ALL CATEGORIES PAGE</span>
                      <span class="mega-arrow">›</span>
                    </a>
                    <div class="cat-divider"></div>
                    <ul class="cat-mega-list">
                      <li *ngFor="let c of navCategories" (mouseenter)="setPreview(c.label)">
                        <a href="#" (click)="filterByCategory(c.label, $event)">
                          <span class="cat-item-label">{{ c.label }}</span>
                          <span class="mega-arrow">›</span>
                        </a>
                      </li>
                    </ul>
                  </div>

                  <!-- Right: Live Working Article Sample Preview -->
                  <div class="cat-mega-preview-col" *ngIf="activeCatPreview">
                    <div class="cat-preview-card" (click)="openPreviewCategory(activeCatPreview.catName, $event)">
                      <div class="cat-preview-img-wrap">
                        <img [src]="activeCatPreview.image" [alt]="activeCatPreview.title" class="cat-preview-img" (error)="onImgError($event)" />
                        <span class="cat-preview-badge">ARTICLE PREVIEW</span>
                      </div>
                      <div class="cat-preview-body">
                        <h4 class="cat-preview-title">{{ activeCatPreview.title }}</h4>
                        <p class="cat-preview-excerpt">{{ activeCatPreview.excerpt }}</p>
                        <div class="cat-preview-meta">
                          <span class="cat-preview-link">Read Articles →</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>

            <li class="nav-item">
              <a href="#" class="nav-link" [class.active]="activePage==='gallery'" (click)="navigate('gallery', $event)">GALLERY</a>
            </li>
            <li class="nav-item">
              <a href="#" class="nav-link" [class.active]="activePage==='about'" (click)="navigate('about', $event)">ABOUT</a>
            </li>
            <li class="nav-item">
              <a href="#" class="nav-link" [class.active]="activePage==='contact'" (click)="navigate('contact', $event)">CONTACT</a>
            </li>
          </ul>
        </nav>

        <!-- Right side: search + write -->
        <div class="nav-right">
          <div class="search-wrap" [class.active]="searchOpen">
            <input
              *ngIf="searchOpen"
              type="text"
              class="search-input"
              placeholder="Search articles..."
              [(ngModel)]="searchQuery"
              (keyup.enter)="doSearch()"
              (blur)="searchOpen = false"
              #searchInput
            />
            <button class="icon-btn search-icon" (click)="toggleSearch()" title="Search">
              <i class="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
          <!-- Dark / Light Theme Toggle -->
          <button class="icon-btn theme-btn" (click)="toggleTheme()" [title]="isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
            <i class="fa-solid" [class.fa-sun]="isDarkMode" [class.fa-moon]="!isDarkMode"></i>
          </button>
          <button class="write-btn" *ngIf="isAdmin" (click)="openPublisherEvent()">
            <i class="fa-solid fa-pen"></i> Write
          </button>
          <button class="write-btn profile-btn" *ngIf="isAdmin" (click)="openProfileSettingsEvent()" style="background: #2563eb;" title="Edit Author Profile &amp; Social Links">
            <i class="fa-solid fa-user-gear"></i> Profile
          </button>
          <button class="admin-logout-btn" *ngIf="isAdmin" (click)="logoutAdmin()" title="Exit Admin Mode">
            <i class="fa-solid fa-lock"></i> Exit Admin
          </button>
          <!-- Mobile hamburger -->
          <button class="hamburger" (click)="mobileOpen = !mobileOpen">
            <i class="fa-solid" [class.fa-bars]="!mobileOpen" [class.fa-xmark]="mobileOpen"></i>
          </button>
        </div>

      </div>
    </header>
  `,
  styles: [`
    :host { display: block; }

    .site-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 999;
      background: #111111;
      transition: box-shadow 0.3s;
    }
    .site-header.scrolled {
      box-shadow: 0 2px 20px rgba(0,0,0,0.5);
    }

    .navbar-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      height: 62px;
      display: flex;
      align-items: center;
      gap: 0;
    }

    /* ---- Logo ---- */
    .site-logo {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
      margin-right: 24px;
    }
    .logo-globe { font-size: 22px; }
    .logo-text {
      font-family: 'Nunito', sans-serif;
      font-size: 20px;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: 3px;
    }

    /* ---- Primary Nav ---- */
    .primary-nav { flex: 1; }
    .nav-list {
      display: flex;
      align-items: center;
      list-style: none;
      gap: 0;
    }
    .nav-item { position: relative; }
    .nav-link {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 0 14px;
      height: 62px;
      font-family: 'Nunito', sans-serif;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #cccccc;
      white-space: nowrap;
      transition: color 0.2s;
      cursor: pointer;
    }
    .nav-link:hover { color: #ffffff; }
    .nav-link.active { color: #e8472a; }
    .caret {
      font-size: 14px;
      font-weight: 400;
      transition: transform 0.2s;
      display: inline-block;
    }
    .has-dropdown:hover .caret { transform: rotate(90deg); }

    /* ---- Dropdowns ---- */
    .mega-dropdown {
      position: absolute;
      top: 62px;
      left: 0;
      background: #1a1a1a;
      min-width: 210px;
      border-top: 3px solid #e8472a;
      box-shadow: 0 8px 30px rgba(0,0,0,0.5);
      opacity: 0;
      visibility: hidden;
      transform: translateY(-8px);
      transition: all 0.2s ease;
      z-index: 1000;
    }
    .mega-dropdown.visible {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
    .mega-list {
      list-style: none;
      padding: 8px 0;
    }
    .mega-list li a {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 20px;
      font-family: 'Nunito', sans-serif;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #bbbbbb;
      transition: all 0.15s;
    }
    .mega-list li a:hover {
      color: #ffffff;
      background: rgba(255,255,255,0.05);
      padding-left: 24px;
    }
    .mega-icon { font-size: 14px; }
    .mega-arrow { margin-left: auto; font-size: 12px; opacity: 0.5; }

    /* ---- CATEGORIES RICH MEGA DROPDOWN ---- */
    .categories-mega-dropdown {
      position: absolute;
      top: 62px;
      left: -80px;
      background: #181818;
      width: 580px;
      border-top: 3px solid #e8472a;
      box-shadow: 0 16px 40px rgba(0,0,0,0.65);
      border-radius: 0 0 8px 8px;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-8px);
      transition: all 0.22s ease;
      z-index: 1000;
    }
    .categories-mega-dropdown.visible {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
    .cat-mega-layout {
      display: grid;
      grid-template-columns: 1.1fr 1fr;
      padding: 12px;
      gap: 12px;
    }
    .cat-mega-list-col {
      display: flex;
      flex-direction: column;
    }
    .cat-mega-all-btn {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      background: rgba(232,71,42,0.12);
      border-radius: 6px;
      color: #e8472a;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      transition: all 0.2s;
      margin-bottom: 6px;
    }
    .cat-mega-all-btn:hover {
      background: #e8472a;
      color: #fff;
    }
    .cat-divider {
      height: 1px;
      background: rgba(255,255,255,0.08);
      margin: 4px 0 6px;
    }
    .cat-mega-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
      max-height: 320px;
      overflow-y: auto;
    }
    .cat-mega-list li a {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 7px 12px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 700;
      color: #bbb;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      transition: all 0.15s;
    }
    .cat-mega-list li:hover a {
      color: #fff;
      background: rgba(255,255,255,0.08);
      padding-left: 16px;
    }
    .cat-item-label {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Right Preview Card */
    .cat-mega-preview-col {
      background: #222222;
      border-radius: 8px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      border: 1px solid rgba(255,255,255,0.06);
    }
    .cat-preview-card {
      cursor: pointer;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .cat-preview-img-wrap {
      position: relative;
      width: 100%;
      height: 130px;
      border-radius: 6px;
      overflow: hidden;
    }
    .cat-preview-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s;
    }
    .cat-preview-card:hover .cat-preview-img {
      transform: scale(1.05);
    }
    .cat-preview-badge {
      position: absolute;
      top: 8px;
      left: 8px;
      background: #e8472a;
      color: #fff;
      font-size: 9px;
      font-weight: 800;
      letter-spacing: 0.08em;
      padding: 3px 8px;
      border-radius: 4px;
    }
    .cat-preview-body {
      padding-top: 10px;
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    .cat-preview-title {
      font-family: 'Lato', sans-serif;
      font-size: 13px;
      font-weight: 800;
      color: #fff;
      margin: 0 0 6px;
      line-height: 1.35;
    }
    .cat-preview-excerpt {
      font-size: 11px;
      color: #aaa;
      line-height: 1.5;
      margin: 0 0 10px;
      flex: 1;
    }
    .cat-preview-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 10px;
      color: #888;
      border-top: 1px solid rgba(255,255,255,0.08);
      padding-top: 8px;
    }
    .cat-preview-link {
      color: #e8472a;
      font-weight: 700;
    }

    /* ---- Right side ---- */
    .nav-right {
      display: flex;
      align-items: center;
      gap: 4px;
      flex-shrink: 0;
      margin-left: auto;
    }
    .icon-btn {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #cccccc;
      font-size: 14px;
      transition: all 0.2s;
    }
    .icon-btn:hover { color: #ffffff; background: rgba(255,255,255,0.1); }
    .theme-btn { font-size: 15px; }
    .theme-btn .fa-sun { color: #f59e0b; }
    .theme-btn .fa-moon { color: #94a3b8; }

    .search-wrap {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .search-input {
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,255,255,0.2);
      color: #fff;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 13px;
      width: 180px;
      outline: none;
      transition: all 0.3s;
    }
    .search-input::placeholder { color: #aaa; }
    .search-input:focus {
      border-color: rgba(255,255,255,0.5);
      background: rgba(255,255,255,0.15);
    }

    .write-btn {
      padding: 6px 14px;
      font-family: 'Nunito', sans-serif;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #ffffff;
      border: 1px solid rgba(255,255,255,0.3);
      border-radius: 20px;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .write-btn:hover {
      background: #e8472a;
      border-color: #e8472a;
    }

    .hamburger {
      display: none;
      color: #ffffff;
      font-size: 18px;
      padding: 8px;
    }

    /* ---- Mobile ---- */
    @media (max-width: 900px) {
      .primary-nav {
        display: none;
        position: absolute;
        top: 62px;
        left: 0; right: 0;
        background: #111;
        padding: 10px 0 20px;
      }
      .primary-nav.open { display: block; }
      .nav-list { flex-direction: column; align-items: flex-start; }
      .nav-link { padding: 12px 24px; height: auto; }
      .mega-dropdown, .categories-mega-dropdown { position: static; opacity: 1; visibility: visible; transform: none; box-shadow: none; border: none; background: #1e1e1e; width: 100%; }
      .cat-mega-layout { grid-template-columns: 1fr; }
      .cat-mega-preview-col { display: none; }
      .hamburger { display: flex; }
    }

    /* ===== DESTINATIONS 2-LEVEL MEGAMENU ===== */
    .dest-mega-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      width: 480px;
      background: #111111;
      border: 1px solid #282828;
      border-top: 2px solid #e8472a;
      box-shadow: 0 16px 40px rgba(0,0,0,0.5);
      display: none;
      z-index: 1000;
      animation: fadeIn 0.2s ease;
    }
    .dest-mega-dropdown.visible { display: block; }

    .dest-mega-layout {
      display: flex;
      min-height: 280px;
    }

    /* Left Column: Continents */
    .dest-continents-col {
      width: 210px;
      background: #111111;
      border-right: 1px solid #222222;
      padding: 12px 0;
    }
    .dest-mega-all-btn {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 18px;
      font-size: 11.5px;
      font-weight: 800;
      letter-spacing: 0.12em;
      color: #e8472a;
      text-decoration: none;
      transition: background 0.15s;
    }
    .dest-mega-all-btn:hover { background: #1a1a1a; }
    .dest-divider {
      height: 1px;
      background: #222222;
      margin: 4px 18px 8px;
    }
    .dest-continent-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .dest-continent-list li a {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 9px 18px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: #cccccc;
      text-decoration: none;
      transition: all 0.15s;
    }
    .dest-continent-list li.active a,
    .dest-continent-list li a:hover {
      background: #1c1c1c;
      color: #e8472a;
    }
    .continent-name {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .continent-icon { font-size: 13px; }
    .mega-arrow {
      font-size: 14px;
      color: #666;
    }
    .dest-continent-list li.active .mega-arrow,
    .dest-continent-list li a:hover .mega-arrow {
      color: #e8472a;
    }

    /* Right Column: Subcategory Countries */
    .dest-countries-col {
      flex: 1;
      background: #161616;
      padding: 16px 20px;
    }
    .dest-countries-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .countries-header-title {
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.12em;
      color: #e8472a;
    }
    .count-badge {
      font-size: 10px;
      font-weight: 700;
      background: #262626;
      color: #888888;
      padding: 2px 8px;
      border-radius: 10px;
    }
    .dest-countries-divider {
      height: 1px;
      background: #262626;
      margin-bottom: 12px;
    }
    .dest-countries-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .dest-countries-list li a {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 10px;
      border-radius: 3px;
      font-size: 11.5px;
      font-weight: 700;
      letter-spacing: 0.06em;
      color: #dddddd;
      text-decoration: none;
      transition: all 0.15s ease;
    }
    .dest-countries-list li a:hover {
      background: #242424;
      color: #ffffff;
      padding-left: 14px;
    }
    .country-arrow {
      font-size: 12px;
      color: #666;
      transition: transform 0.15s;
    }
    .dest-countries-list li a:hover .country-arrow {
      color: #e8472a;
      transform: translateX(3px);
    }

    .no-countries-box {
      padding: 35px 15px;
      text-align: center;
      color: #666666;
    }
    .no-countries-box i {
      font-size: 22px;
      color: #444444;
      margin-bottom: 8px;
    }
    .no-countries-title {
      font-size: 12px;
      font-weight: 700;
      color: #888888;
      margin: 0 0 4px;
      letter-spacing: 0.05em;
    }
    .no-countries-sub {
      font-size: 11px;
      color: #555555;
      margin: 0;
      line-height: 1.4;
    }

    .admin-logout-btn {
      background: rgba(255,255,255,0.1);
      color: #aaa;
      border: 1px solid rgba(255,255,255,0.2);
      padding: 6px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      margin-left: 8px;
      transition: all 0.2s;
    }
    .admin-logout-btn:hover { background: #e8472a; color: #fff; border-color: #e8472a; }
  `],
  host: { '(document:click)': 'onDocClick($event)' }
})
export class HeaderComponent implements OnInit {
  scrolled = false;
  mobileOpen = false;
  searchOpen = false;
  searchQuery = '';
  activeMenu: string | null = null;
  activePage = 'home';
  isAdmin = false;
  isDarkMode = false;

  continents = ['Africa', 'Americas', 'Asia', 'Caribbean', 'Europe', 'Middle East', 'Oceania'];
  hoveredContinent: string = 'Asia';

  getContinentCountries(continent: string): { name: string; tag: string }[] {
    const allArticles = this.articleService.getPersistedArticles('', '');
    const continentLower = continent.toLowerCase();

    const travelCats = ['travel & places', 'travel & adventure', 'travel'];
    const matchingArticles = allArticles.filter(a => {
      const isTravel = travelCats.some(tc => a.category.toLowerCase().includes(tc)) || 
                       (a.tags && a.tags.toLowerCase().includes('travel'));
      if (!isTravel) return false;

      const text = (a.title + ' ' + a.excerpt + ' ' + a.tags + ' ' + a.content + ' ' + (a.country || '')).toLowerCase();

      if (continentLower === 'asia') {
        return text.includes('asia') || text.includes('bali') || text.includes('indonesia') || text.includes('kyoto') || text.includes('japan') || text.includes('thailand') || text.includes('chiang mai') || text.includes('vietnam') || text.includes('singapore') || text.includes('korea');
      }
      if (continentLower === 'europe') {
        return text.includes('europe') || text.includes('greece') || text.includes('santorini') || text.includes('italy') || text.includes('amalfi') || text.includes('iceland') || text.includes('france') || text.includes('spain') || text.includes('switzerland');
      }
      if (continentLower === 'americas') {
        return text.includes('americas') || text.includes('argentina') || text.includes('patagonia') || text.includes('peru') || text.includes('machu picchu') || text.includes('united states') || text.includes('mexico') || text.includes('brazil');
      }
      if (continentLower === 'africa') {
        return text.includes('africa') || text.includes('tanzania') || text.includes('serengeti') || text.includes('egypt') || text.includes('morocco') || text.includes('south africa') || text.includes('kenya');
      }
      if (continentLower === 'caribbean') {
        return text.includes('caribbean') || text.includes('bahamas') || text.includes('jamaica');
      }
      if (continentLower === 'middle east') {
        return text.includes('middle east') || text.includes('dubai') || text.includes('uae') || text.includes('turkey') || text.includes('jordan');
      }
      if (continentLower === 'oceania') {
        return text.includes('oceania') || text.includes('australia') || text.includes('new zealand') || text.includes('fiji');
      }
      return text.includes(continentLower);
    });

    const countryMap = new Map<string, string>();
    matchingArticles.forEach(a => {
      let countryName = '';
      if (a.country && a.country.trim()) {
        countryName = a.country.trim();
      } else {
        const text = (a.title + ' ' + a.tags).toLowerCase();
        if (text.includes('indonesia') || text.includes('bali')) countryName = 'Indonesia';
        else if (text.includes('japan') || text.includes('kyoto')) countryName = 'Japan';
        else if (text.includes('thailand') || text.includes('chiang mai')) countryName = 'Thailand';
        else if (text.includes('greece') || text.includes('santorini')) countryName = 'Greece';
        else if (text.includes('italy') || text.includes('amalfi')) countryName = 'Italy';
        else if (text.includes('iceland')) countryName = 'Iceland';
        else if (text.includes('argentina') || text.includes('patagonia')) countryName = 'Argentina';
        else if (text.includes('peru') || text.includes('machu picchu')) countryName = 'Peru';
        else if (text.includes('tanzania') || text.includes('serengeti')) countryName = 'Tanzania';
      }

      if (countryName && !countryMap.has(countryName.toLowerCase())) {
        countryMap.set(countryName.toLowerCase(), countryName);
      }
    });

    return Array.from(countryMap.values()).map(c => ({ name: c, tag: c }));
  }

  get activeContinentCountries() {
    return this.getContinentCountries(this.hoveredContinent);
  }

  navCategories = [
    { label: 'Daily Life / Musings' },
    { label: 'Personal Growth' },
    { label: 'Travel & Places' },
    { label: 'Relationships' },
    { label: 'Health & Wellbeing' },
    { label: 'Work & Career' },
    { label: 'Books & Learning' },
    { label: 'Goals & Projects' },
    { label: 'Random Thoughts / Rants' },
    { label: 'Photography / Snapshots' },
  ];

  samplePreviews: { [key: string]: { catName: string; title: string; image: string; excerpt: string; readTime: string } } = {
    'Daily Life / Musings': {
      catName: 'Daily Life / Musings',
      title: 'The Magic of Slow Mornings: Reclaiming My Day',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
      excerpt: 'I spend the first 30 minutes of every day in screen-free silence. Here is what changed...',
      readTime: '4 min read'
    },
    'Personal Growth': {
      catName: 'Personal Growth',
      title: 'The Kaizen Philosophy: 1% Daily Improvement',
      image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=600&q=80',
      excerpt: 'Japanese methodology teaches us that tiny daily habits compound into mastery over time...',
      readTime: '5 min read'
    },
    'Travel & Places': {
      catName: 'Travel & Places',
      title: 'Bali Travel Guide 2026: Hidden Cascades & Temples',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80',
      excerpt: 'Explore Tegallalang rice terraces, Mount Batur sunrise treks, and secret jungle waterfalls...',
      readTime: '7 min read'
    },
    'Relationships': {
      catName: 'Relationships',
      title: 'Long-Distance Friendships: Keeping Bonds Strong',
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80',
      excerpt: 'What 2 years of living abroad taught me about non-negotiable calls and async voice notes...',
      readTime: '5 min read'
    },
    'Health & Wellbeing': {
      catName: 'Health & Wellbeing',
      title: 'Zone 2 Cardio: The Unsexy Key to Longevity',
      image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=600&q=80',
      excerpt: 'Why elite endurance athletes train at low intensity 80% of the time for cellular health...',
      readTime: '6 min read'
    },
    'Work & Career': {
      catName: 'Work & Career',
      title: 'Golang + Modern Frontend Architecture',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
      excerpt: 'Building high-throughput REST APIs in Go combined with reactive Angular SPAs...',
      readTime: '8 min read'
    },
    'Books & Learning': {
      catName: 'Books & Learning',
      title: '5 Books That Genuinely Changed How I Think',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=600&q=80',
      excerpt: 'Permanent mental models from Thinking Fast & Slow, Antifragile, and Atomic Habits...',
      readTime: '7 min read'
    },
    'Goals & Projects': {
      catName: 'Goals & Projects',
      title: 'Building My Personal Knowledge System (PKM)',
      image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=600&q=80',
      excerpt: 'Two years of experimenting with Obsidian, Readwise, and physical notebooks...',
      readTime: '8 min read'
    },
    'Random Thoughts / Rants': {
      catName: 'Random Thoughts / Rants',
      title: 'Hot Take: Productivity Culture is Procrastination',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80',
      excerpt: 'Why optimizing your morning routine and Notion system often stops you from doing real work...',
      readTime: '4 min read'
    },
    'Photography / Snapshots': {
      catName: 'Photography / Snapshots',
      title: 'Natural Light Travel Photography Guide',
      image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=600&q=80',
      excerpt: 'Harness Golden Hour and Blue Hour to capture depth, atmosphere, and raw texture...',
      readTime: '6 min read'
    }
  };

  activeCatPreview = this.samplePreviews['Personal Growth'];

  constructor(private articleService: ArticleService) {}

  ngOnInit() {
    this.checkAdmin();
    this.initTheme();
    window.addEventListener('kaizen:admin-status', (e: any) => {
      this.isAdmin = !!e.detail?.isAdmin;
    });
    window.addEventListener('kaizen:page-changed', (e: any) => {
      this.activePage = e.detail?.page || 'home';
    });
  }

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled = window.scrollY > 10;
  }

  openMenu(key: string) { this.activeMenu = key; }
  closeMenu() { this.activeMenu = null; }

  setPreview(catLabel: string) {
    const realArticle = this.articleService.getPersistedArticles(catLabel, '')[0];
    if (realArticle && realArticle.cover_image) {
      this.activeCatPreview = {
        catName: realArticle.category,
        title: realArticle.title,
        image: realArticle.cover_image,
        excerpt: realArticle.excerpt,
        readTime: 'Published Article'
      };
      return;
    }

    if (this.samplePreviews[catLabel]) {
      this.activeCatPreview = this.samplePreviews[catLabel];
    }
  }

  onImgError(event: any) {
    event.target.src = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80';
  }

  navigate(page: string, e: Event) {
    e.preventDefault();
    this.activeMenu = null;
    this.mobileOpen = false;
    window.dispatchEvent(new CustomEvent('kaizen:navigate', { detail: { page } }));
  }

  navigateDest(dest: string, e: Event) {
    e.preventDefault();
    this.activeMenu = null;
    this.mobileOpen = false;
    window.dispatchEvent(new CustomEvent('kaizen:navigate', { detail: { page: 'destinations', dest, country: 'All' } }));
  }

  navigateCountry(continent: string, countryTag: string, e: Event) {
    e.preventDefault();
    this.activeMenu = null;
    this.mobileOpen = false;
    window.dispatchEvent(new CustomEvent('kaizen:navigate', { detail: { page: 'destinations', dest: continent, country: countryTag } }));
  }

  toggleSearch() {
    this.searchOpen = !this.searchOpen;
    if (!this.searchOpen) {
      this.searchQuery = '';
      this.articleService.setSearchQuery('');
    }
  }

  doSearch() {
    this.articleService.setSearchQuery(this.searchQuery);
    this.searchOpen = false;
    window.dispatchEvent(new CustomEvent('kaizen:navigate', { detail: { page: 'blog' } }));
  }

  filterByCategory(cat: string, e: Event) {
    e.preventDefault();
    this.articleService.setCategory(cat);
    this.activeMenu = null;
    this.mobileOpen = false;
    window.dispatchEvent(new CustomEvent('kaizen:navigate', { detail: { page: 'category', cat } }));
  }

  openPreviewCategory(catName: string, e: Event) {
    e.preventDefault();
    this.filterByCategory(catName, e);
  }

  scrollToBlog() {
    document.getElementById('blog-section')?.scrollIntoView({ behavior: 'smooth' });
  }

  checkAdmin() {
    if (typeof sessionStorage !== 'undefined') {
      this.isAdmin = sessionStorage.getItem('kaizen_admin_session') === 'true';
    } else {
      this.isAdmin = false;
    }
  }

  logoutAdmin() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('kaizen_admin_active');
    }
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem('kaizen_admin_session');
    }
    this.isAdmin = false;
    window.dispatchEvent(new CustomEvent('kaizen:admin-status', { detail: { isAdmin: false } }));
  }

  openPublisherEvent() {
    window.dispatchEvent(new CustomEvent('kaizen:open-publisher'));
  }

  openProfileSettingsEvent() {
    window.dispatchEvent(new CustomEvent('kaizen:open-profile-settings'));
  }

  initTheme() {
    if (typeof localStorage !== 'undefined') {
      const savedTheme = localStorage.getItem('kaizen_theme');
      if (savedTheme === 'dark') {
        this.isDarkMode = true;
      } else if (savedTheme === 'light') {
        this.isDarkMode = false;
      } else if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        this.isDarkMode = true;
      }
    }
    this.applyTheme();
  }

  applyTheme() {
    if (typeof document !== 'undefined') {
      if (this.isDarkMode) {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('kaizen_theme', this.isDarkMode ? 'dark' : 'light');
    }
  }

  onDocClick(e: MouseEvent) {}
}
