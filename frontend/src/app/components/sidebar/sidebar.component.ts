import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Article, Category } from '../../models/article.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <aside class="sidebar-container">
      <!-- Categories Widget -->
      <div class="widget">
        <h4 class="widget-title">
          <span class="title-text">Categories</span>
          <span class="title-line"></span>
        </h4>
        <ul class="categories-list">
          <li 
            *ngFor="let cat of categories" 
            class="category-item"
            [class.active]="activeCategory === cat.name"
            (click)="onSelectCategory.emit(cat.name)"
          >
            <span class="cat-name">
              <i class="fa-solid" [ngClass]="getCategoryIcon(cat.slug)"></i> {{ cat.name }}
            </span>
            <span class="cat-count">{{ cat.count }}</span>
          </li>
        </ul>
      </div>

      <!-- Popular Trending Articles Widget -->
      <div class="widget">
        <h4 class="widget-title">
          <span class="title-text">Popular Articles</span>
          <span class="title-line"></span>
        </h4>
        <div class="popular-posts-list">
          <div 
            *ngFor="let post of popularArticles; let i = index" 
            class="popular-post-item"
            (click)="onSelectArticle.emit(post)"
          >
            <span class="post-rank">{{ i + 1 }}</span>
            <div class="post-thumb">
              <img [src]="post.cover_image" [alt]="post.title">
            </div>
            <div class="post-info">
              <h5 class="post-title">{{ post.title }}</h5>
              <span class="post-views"><i class="fa-regular fa-eye"></i> {{ post.views }} views</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Newsletter Subscription Widget -->
      <div class="widget newsletter-widget">
        <div class="newsletter-icon">
          <i class="fa-solid fa-paper-plane"></i>
        </div>
        <h4 class="newsletter-title">Stay Updated with Kaizen</h4>
        <p class="newsletter-desc">Get the latest travel, technology, and lifestyle guides delivered straight to your inbox.</p>
        
        <form class="newsletter-form" (ngSubmit)="subscribeNewsletter()">
          <input 
            type="email" 
            placeholder="Enter your email address..." 
            [(ngModel)]="emailInput"
            name="email"
            required
          />
          <button type="submit" class="btn btn-primary subscribe-btn">
            <span *ngIf="!subscribed">Subscribe Now</span>
            <span *ngIf="subscribed"><i class="fa-solid fa-check"></i> Subscribed!</span>
          </button>
        </form>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar-container {
      display: flex;
      flex-direction: column;
      gap: 30px;
    }
    .widget {
      background-color: var(--bg-card);
      border-radius: var(--radius-md);
      padding: 24px;
      border: 1px solid var(--border-color);
      box-shadow: var(--shadow-sm);
    }
    .widget-title {
      position: relative;
      font-size: 16px;
      font-weight: 700;
      color: var(--text-dark);
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .title-line {
      flex-grow: 1;
      height: 2px;
      background-color: var(--border-color);
      position: relative;
    }
    .title-line::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 40px;
      height: 2px;
      background-color: var(--primary-accent);
    }
    .categories-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .category-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 14px;
      border-radius: var(--radius-sm);
      cursor: pointer;
      font-size: 14px;
      color: var(--text-main);
      transition: all 0.2s ease;
      background-color: var(--bg-main);
    }
    .category-item:hover, .category-item.active {
      background-color: var(--primary-light);
      color: var(--primary-accent);
      font-weight: 700;
    }
    .cat-name i {
      margin-right: 8px;
      width: 18px;
    }
    .cat-count {
      font-size: 12px;
      background: var(--bg-card);
      padding: 2px 8px;
      border-radius: 10px;
      color: var(--text-muted);
    }
    .popular-posts-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .popular-post-item {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      transition: transform 0.2s ease;
    }
    .popular-post-item:hover {
      transform: translateX(4px);
    }
    .post-rank {
      font-family: var(--font-heading);
      font-size: 18px;
      font-weight: 800;
      color: var(--primary-accent);
      width: 24px;
      text-align: center;
    }
    .post-thumb {
      width: 60px;
      height: 60px;
      border-radius: var(--radius-sm);
      overflow: hidden;
      flex-shrink: 0;
    }
    .post-thumb img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .post-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .post-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-dark);
      line-height: 1.3;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .popular-post-item:hover .post-title {
      color: var(--primary-accent);
    }
    .post-views {
      font-size: 12px;
      color: var(--text-muted);
    }
    .newsletter-widget {
      background: linear-gradient(135deg, var(--bg-dark) 0%, #1e293b 100%);
      color: #ffffff;
      text-align: center;
    }
    .newsletter-icon {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background-color: var(--primary-accent);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      margin: 0 auto 16px auto;
      box-shadow: 0 4px 15px rgba(255, 138, 101, 0.4);
    }
    .newsletter-title {
      color: #ffffff;
      font-size: 18px;
      margin-bottom: 8px;
    }
    .newsletter-desc {
      font-size: 13px;
      color: #94a3b8;
      margin-bottom: 18px;
    }
    .newsletter-form {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .newsletter-form input {
      padding: 10px 16px;
      border-radius: 30px;
      border: 1px solid #334155;
      background-color: #0f172a;
      color: #ffffff;
      font-size: 13px;
      text-align: center;
    }
    .subscribe-btn {
      justify-content: center;
      width: 100%;
    }
  `]
})
export class SidebarComponent {
  @Input() categories: Category[] = [];
  @Input() popularArticles: Article[] = [];
  @Input() activeCategory: string = '';
  @Output() onSelectCategory = new EventEmitter<string>();
  @Output() onSelectArticle = new EventEmitter<Article>();

  emailInput: string = '';
  subscribed: boolean = false;

  subscribeNewsletter() {
    if (this.emailInput) {
      this.subscribed = true;
      setTimeout(() => {
        this.subscribed = false;
        this.emailInput = '';
      }, 3000);
    }
  }

  getCategoryIcon(slug: string): string {
    switch(slug) {
      case 'travel': return 'fa-plane';
      case 'tech': return 'fa-code';
      case 'lifestyle': return 'fa-heart';
      case 'photography': return 'fa-camera';
      default: return 'fa-folder';
    }
  }
}
