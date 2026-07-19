import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../models/article.model';

@Component({
  selector: 'app-article-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="editor-modal-backdrop" (click)="onClose.emit()">
      <div class="editor-modal-card" (click)="$event.stopPropagation()">
        <!-- Close Button -->
        <button class="close-btn" (click)="onClose.emit()">
          <i class="fa-solid fa-xmark"></i>
        </button>

        <div class="editor-header">
          <h2><i class="fa-solid fa-feather-pointed"></i> Write New Article (Kaizen Publisher)</h2>
          <p>Share your travel adventures, code insights, and life philosophy with the world.</p>
        </div>

        <form class="editor-form" (ngSubmit)="publishArticle()">
          <div class="form-group">
            <label>Article Title *</label>
            <input 
              type="text" 
              placeholder="e.g. Hiking Doi Luang Chiang Dao 2026: An Unforgettable Summit..." 
              [(ngModel)]="title" 
              name="title" 
              required 
            />
          </div>

          <div class="form-row">
            <div class="form-group half">
              <label>Category</label>
              <select [(ngModel)]="category" name="category">
                <option value="Travel & Adventure">Travel & Adventure</option>
                <option value="Technology & Code">Technology & Code</option>
                <option value="Lifestyle & Kaizen">Lifestyle & Kaizen</option>
                <option value="Photography">Photography</option>
              </select>
            </div>

            <div class="form-group half">
              <label>Estimated Read Time</label>
              <input type="text" placeholder="e.g. 5 min read" [(ngModel)]="readTime" name="readTime" />
            </div>
          </div>

          <div class="form-group">
            <label>Cover Image URL</label>
            <input 
              type="url" 
              placeholder="https://images.unsplash.com/..." 
              [(ngModel)]="coverImage" 
              name="coverImage" 
            />
            <span class="field-hint">If left empty, a beautiful high-res Unsplash image will be randomly assigned.</span>
          </div>

          <div class="form-group">
            <label>Excerpt / Summary *</label>
            <textarea 
              rows="2" 
              placeholder="Brief summary of what readers will learn in this post..." 
              [(ngModel)]="excerpt" 
              name="excerpt" 
              required
            ></textarea>
          </div>

          <div class="form-group">
            <label>Full Article Content *</label>
            <textarea 
              rows="8" 
              placeholder="Write your article content here (use ## for section headings)..." 
              [(ngModel)]="content" 
              name="content" 
              required
            ></textarea>
          </div>

          <div class="form-group">
            <label>Tags (Comma-separated)</label>
            <input 
              type="text" 
              placeholder="Travel, ChiangMai, Thailand, Hiking" 
              [(ngModel)]="tags" 
              name="tags" 
            />
          </div>

          <div class="editor-actions">
            <button type="button" class="btn btn-secondary" (click)="onClose.emit()">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="publishing">
              <span *ngIf="!publishing"><i class="fa-solid fa-paper-plane"></i> Publish Article</span>
              <span *ngIf="!publishing"><i class="fa-solid fa-spinner fa-spin"></i> Publishing...</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .editor-modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0,0,0,0.65);
      backdrop-filter: blur(4px);
      z-index: 1000;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }
    .editor-modal-card {
      background-color: #ffffff;
      color: #333333;
      width: 100%;
      max-width: 700px;
      border-radius: 4px;
      padding: 30px;
      position: relative;
      box-shadow: 0 10px 40px rgba(0,0,0,0.35);
      max-height: 90vh;
      overflow-y: auto;
      border: 1px solid #e0e0e0;
    }
    .close-btn {
      position: absolute;
      top: 20px;
      right: 20px;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: #f5f5f5;
      color: #777777;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      transition: all 0.2s;
    }
    .close-btn:hover {
      background-color: #e8472a;
      color: #ffffff;
    }
    .editor-header {
      margin-bottom: 24px;
      border-bottom: 1px solid #eeeeee;
      padding-bottom: 12px;
    }
    .editor-header h2 {
      font-family: 'Lato', sans-serif;
      font-size: 20px;
      font-weight: 700;
      color: #111111;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .editor-header p {
      font-size: 13px;
      color: #666666;
    }
    .editor-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .form-row {
      display: flex;
      gap: 16px;
    }
    .form-group.half {
      flex: 1;
    }
    .form-group label {
      font-size: 12px;
      font-weight: 700;
      color: #222222;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .form-group input, .form-group select, .form-group textarea {
      padding: 10px 12px;
      border: 1px solid #cccccc;
      border-radius: 3px;
      background-color: #ffffff;
      color: #222222;
      font-size: 14px;
      width: 100%;
      box-sizing: border-box;
      transition: border-color 0.2s;
    }
    .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
      outline: none;
      border-color: #e8472a;
    }
    .field-hint {
      font-size: 11px;
      color: #777777;
      margin-top: 2px;
    }
    .editor-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 15px;
      border-top: 1px solid #eeeeee;
      padding-top: 15px;
    }
  `]
})
export class ArticleEditorComponent {
  @Output() onClose = new EventEmitter<void>();
  @Output() onArticlePublished = new EventEmitter<Article>();

  title: string = '';
  category: string = 'Travel & Adventure';
  readTime: string = '5 min read';
  coverImage: string = '';
  excerpt: string = '';
  content: string = '';
  tags: string = '';
  publishing: boolean = false;

  constructor(private articleService: ArticleService) {}

  publishArticle() {
    if (this.title && this.excerpt && this.content) {
      this.publishing = true;
      this.articleService.createArticle({
        title: this.title,
        category: this.category,
        read_time: this.readTime,
        cover_image: this.coverImage,
        excerpt: this.excerpt,
        content: this.content,
        tags: this.tags
      }).subscribe(created => {
        this.publishing = false;
        this.onArticlePublished.emit(created);
        this.onClose.emit();
      });
    }
  }
}
