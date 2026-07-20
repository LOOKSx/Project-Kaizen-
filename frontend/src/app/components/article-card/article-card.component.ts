import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Article } from '../../models/article.model';

@Component({
  selector: 'app-article-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article class="post-card" (click)="onSelect.emit(article)" tabindex="0" (keyup.enter)="onSelect.emit(article)">
      <!-- Featured image -->
      <div class="post-img-wrap">
        <img
          [src]="article.cover_image || getDefaultImage()"
          [alt]="article.title"
          class="post-img"
          loading="lazy"
          (error)="onImgError($event)"
        />
        <div class="post-img-overlay"></div>
      </div>

      <!-- Card body -->
      <div class="post-body">
        <!-- Category tags row -->
        <div class="post-tags">
          <ng-container *ngFor="let tag of getTagList(); let last = last">
            <a class="post-tag" [class]="getTagClass(tag)" (click)="$event.stopPropagation()">
              {{ tag }}
            </a>
            <span class="tag-sep" *ngIf="!last"> • </span>
          </ng-container>
        </div>

        <!-- Title -->
        <h2 class="post-title">{{ article.title }}</h2>

        <!-- Excerpt -->
        <p class="post-excerpt">{{ article.excerpt }}</p>

        <!-- Footer: date + read more -->
        <div class="post-footer">
          <span class="post-meta">
            {{ article.created_at | date:'MMM d, yyyy' }}
          </span>
          <span class="post-read-more">READ MORE →</span>
        </div>

        <!-- Admin Quick Action Toolbar -->
        <div class="card-admin-actions" *ngIf="isAdmin" (click)="$event.stopPropagation()">
          <button class="btn-card-edit" (click)="onEdit.emit(article)" title="Edit Article">
            <i class="fa-solid fa-pen-to-square"></i> Edit
          </button>
          <button class="btn-card-delete" (click)="onDelete.emit(article)" title="Delete Article">
            <i class="fa-solid fa-trash-can"></i> Delete
          </button>
        </div>
      </div>
    </article>
  `,
  styles: [`
    :host { display: block; }

    .post-card {
      background: #fff;
      border: 1px solid #eeeeee;
      border-radius: 2px;
      overflow: hidden;
      cursor: pointer;
      transition: box-shadow 0.25s ease, transform 0.25s ease;
      display: flex;
      flex-direction: column;
    }
    .post-card:hover {
      box-shadow: 0 8px 30px rgba(0,0,0,0.12);
      transform: translateY(-4px);
    }

    /* Image */
    .post-img-wrap {
      position: relative;
      overflow: hidden;
      aspect-ratio: 4 / 3;
      background: #e8e8e8;
    }
    .post-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }
    .post-card:hover .post-img {
      transform: scale(1.06);
    }
    .post-img-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.08) 0%, transparent 50%);
      transition: opacity 0.3s;
    }
    .post-card:hover .post-img-overlay {
      opacity: 0.6;
    }

    /* Body */
    .post-body {
      padding: 16px 18px 18px;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    /* Tags */
    .post-tags {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 0;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.05em;
    }
    .post-tag {
      color: #e8472a;
      font-family: 'Lato', sans-serif;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      transition: color 0.2s;
    }
    .post-tag:hover { text-decoration: underline; }
    .post-tag.tag-tech   { color: #2d7dd2; }
    .post-tag.tag-life   { color: #3aaa57; }
    .post-tag.tag-photo  { color: #9b51e0; }
    .post-tag.tag-nature { color: #f0a500; }

    .tag-sep {
      color: #bbbbbb;
      font-size: 11px;
      padding: 0 3px;
    }

    /* Title */
    .post-title {
      font-family: 'Lato', sans-serif;
      font-size: 16px;
      font-weight: 700;
      line-height: 1.35;
      color: #222222;
      margin: 0;
      transition: color 0.2s;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .post-card:hover .post-title { color: #e8472a; }

    /* Excerpt */
    .post-excerpt {
      font-size: 13px;
      color: #777777;
      line-height: 1.6;
      flex: 1;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    /* Footer */
    .post-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 4px;
      padding-top: 12px;
      border-top: 1px solid #eeeeee;
    }
    .post-meta {
      font-size: 11px;
      color: #aaaaaa;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .post-read-more {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: #e8472a;
      transition: gap 0.2s;
    }
    .post-card:hover .post-read-more { letter-spacing: 0.12em; }
    /* ===== CARD ADMIN ACTIONS ===== */
    .card-admin-actions {
      display: flex;
      gap: 8px;
      margin-top: 12px;
      padding-top: 10px;
      border-top: 1px dashed #e5e5e5;
    }
    .btn-card-edit {
      flex: 1;
      background: #111;
      color: #fff;
      border: none;
      padding: 6px 10px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      transition: background 0.2s;
    }
    .btn-card-edit:hover { background: #333; }
    .btn-card-delete {
      background: rgba(232,71,42,0.1);
      color: #e8472a;
      border: 1px solid #e8472a;
      padding: 6px 10px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      transition: all 0.2s;
    }
    .btn-card-delete:hover { background: #e8472a; color: #fff; }
  `]
})
export class ArticleCardComponent {
  @Input() article!: Article;
  @Input() isAdmin: boolean = false;
  @Output() onSelect = new EventEmitter<Article>();
  @Output() onEdit = new EventEmitter<Article>();
  @Output() onDelete = new EventEmitter<Article>();

  private defaultImages = [
    'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80',
    'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=600&q=80',
    'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?w=600&q=80',
    'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&q=80',
  ];

  getDefaultImage(): string {
    const hash = this.article?.id || 0;
    return this.defaultImages[hash % this.defaultImages.length];
  }

  onImgError(e: Event) {
    (e.target as HTMLImageElement).src = this.getDefaultImage();
  }

  getTagList(): string[] {
    const tags = [this.article.category];
    if (this.article.tags) {
      const extra = this.article.tags.split(',').map(t => t.trim()).filter(Boolean).slice(0, 2);
      tags.push(...extra);
    }
    return tags.slice(0, 3);
  }

  getTagClass(tag: string): string {
    const t = tag.toLowerCase();
    if (t.includes('tech') || t.includes('code') || t.includes('software')) return 'tag-tech';
    if (t.includes('life') || t.includes('kaizen') || t.includes('mindset')) return 'tag-life';
    if (t.includes('photo') || t.includes('camera')) return 'tag-photo';
    if (t.includes('nature') || t.includes('volcano') || t.includes('forest')) return 'tag-nature';
    return '';
  }
}
