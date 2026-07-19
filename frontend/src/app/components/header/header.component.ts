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
        <a class="site-logo" href="#">
          <span class="logo-globe">🌏</span>
          <span class="logo-text">KAIZEN</span>
        </a>

        <!-- Primary Navigation -->
        <nav class="primary-nav" [class.open]="mobileOpen">
          <ul class="nav-list">
            <li class="nav-item"><a href="#" class="nav-link active">HOME</a></li>
            <li class="nav-item"><a href="#" class="nav-link" (click)="scrollToBlog()">BLOG</a></li>

            <!-- DESTINATIONS megamenu -->
            <li class="nav-item has-dropdown" (mouseenter)="openMenu('dest')" (mouseleave)="closeMenu()">
              <a href="#" class="nav-link">DESTINATIONS <span class="caret">›</span></a>
              <div class="mega-dropdown" [class.visible]="activeMenu === 'dest'">
                <ul class="mega-list">
                  <li *ngFor="let d of destinations">
                    <a href="#" (click)="filterByTag(d.label, $event)">
                      <span class="mega-icon">{{ d.icon }}</span>
                      {{ d.label }}
                      <span class="mega-arrow">›</span>
                    </a>
                  </li>
                </ul>
              </div>
            </li>

            <!-- CATEGORIES dropdown -->
            <li class="nav-item has-dropdown" (mouseenter)="openMenu('cat')" (mouseleave)="closeMenu()">
              <a href="#" class="nav-link">CATEGORIES <span class="caret">›</span></a>
              <div class="simple-dropdown" [class.visible]="activeMenu === 'cat'">
                <ul>
                  <li *ngFor="let c of navCategories">
                    <a href="#" (click)="filterByCategory(c, $event)">{{ c }}</a>
                  </li>
                </ul>
              </div>
            </li>

            <li class="nav-item"><a href="#" class="nav-link">GALLERY</a></li>
            <li class="nav-item"><a href="#" class="nav-link">ABOUT</a></li>
            <li class="nav-item"><a href="#" class="nav-link">CONTACT</a></li>
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
          <button class="write-btn" (click)="openPublisherEvent()">
            <i class="fa-solid fa-pen"></i> Write
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
    }
    .nav-link:hover,
    .nav-link.active { color: #ffffff; }
    .nav-link.active { color: #e8472a; }
    .caret {
      font-size: 14px;
      font-weight: 400;
      transition: transform 0.2s;
      display: inline-block;
    }
    .has-dropdown:hover .caret { transform: rotate(90deg); }

    /* ---- Mega Dropdown (DESTINATIONS) ---- */
    .mega-dropdown,
    .simple-dropdown {
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
    .mega-dropdown.visible,
    .simple-dropdown.visible {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
    .mega-list, .simple-dropdown ul {
      list-style: none;
      padding: 8px 0;
    }
    .mega-list li a,
    .simple-dropdown ul li a {
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
    .mega-list li a:hover,
    .simple-dropdown ul li a:hover {
      color: #ffffff;
      background: rgba(255,255,255,0.05);
      padding-left: 24px;
    }
    .mega-icon { font-size: 14px; }
    .mega-arrow { margin-left: auto; font-size: 12px; opacity: 0.5; }

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
      .mega-dropdown, .simple-dropdown { position: static; opacity: 1; visibility: visible; transform: none; box-shadow: none; border: none; background: #1e1e1e; }
      .hamburger { display: flex; }
      .write-btn span { display: none; }
    }
  `],
  host: { '(document:click)': 'onDocClick($event)' }
})
export class HeaderComponent implements OnInit {
  scrolled = false;
  mobileOpen = false;
  searchOpen = false;
  searchQuery = '';
  activeMenu: string | null = null;

  destinations = [
    { icon: '🌍', label: 'Africa' },
    { icon: '🌎', label: 'Americas' },
    { icon: '🌏', label: 'Asia' },
    { icon: '🌎', label: 'Caribbean' },
    { icon: '🌍', label: 'Europe' },
    { icon: '🌍', label: 'Middle East' },
    { icon: '🌏', label: 'Oceania' },
  ];

  navCategories = [
    'Daily Life / Musings',
    'Personal Growth',
    'Travel & Places',
    'Relationships',
    'Health & Wellbeing',
    'Work & Career',
    'Books & Learning',
    'Goals & Projects',
    'Random Thoughts / Rants',
    'Photography / Snapshots',
  ];

  // We use EventEmitter output via a custom event on window
  constructor(private articleService: ArticleService) {}

  ngOnInit() {}

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled = window.scrollY > 10;
  }

  openMenu(key: string) { this.activeMenu = key; }
  closeMenu() { this.activeMenu = null; }

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
  }

  filterByCategory(cat: string, e: Event) {
    e.preventDefault();
    this.articleService.setCategory(cat);
    this.activeMenu = null;
  }

  filterByTag(tag: string, e: Event) {
    e.preventDefault();
    this.articleService.setSearchQuery(tag);
    this.activeMenu = null;
  }

  scrollToBlog() {
    document.getElementById('blog-section')?.scrollIntoView({ behavior: 'smooth' });
  }

  openPublisherEvent() {
    window.dispatchEvent(new CustomEvent('kaizen:open-publisher'));
  }

  onDocClick(e: MouseEvent) {
    // close mobile menu on outside click handled by hamburger button
  }
}
