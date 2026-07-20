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
        <button class="close-btn" (click)="onClose.emit()" aria-label="Close">
          <i class="fa-solid fa-xmark"></i>
        </button>

        <!-- Header -->
        <div class="editor-header">
          <div class="editor-header-icon">
            <i class="fa-solid fa-feather-pointed"></i>
          </div>
          <div>
            <h2>New Article</h2>
            <p>Share your thoughts, stories, and discoveries with the world.</p>
          </div>
        </div>

        <form class="editor-form" (ngSubmit)="publishArticle()">

          <!-- Cover Image Upload Area -->
          <div class="form-group">
            <label>Cover Image</label>
            <div class="image-upload-area"
                 [class.has-image]="coverImagePreview"
                 (click)="triggerFileInput()"
                 (dragover)="onDragOver($event)"
                 (dragleave)="onDragLeave($event)"
                 (drop)="onDrop($event)"
                 [class.drag-over]="isDragging">

              <!-- Preview -->
              <div class="img-preview-wrap" *ngIf="coverImagePreview">
                <img [src]="coverImagePreview" alt="Cover preview" class="img-preview" />
                <button type="button" class="img-remove-btn" (click)="removeImage($event)">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>

              <!-- Upload Prompt (shown when no image) -->
              <div class="upload-prompt" *ngIf="!coverImagePreview && !uploading">
                <i class="fa-solid fa-cloud-arrow-up upload-icon"></i>
                <p class="upload-title">Drag & Drop or Click to Upload</p>
                <p class="upload-hint">PNG, JPG, WEBP up to 10MB</p>
              </div>

              <!-- Uploading Spinner -->
              <div class="upload-prompt" *ngIf="uploading">
                <i class="fa-solid fa-spinner fa-spin upload-icon" style="color:#e8472a"></i>
                <p class="upload-title">Uploading image...</p>
                <p class="upload-hint">Please wait</p>
              </div>

              <input
                #fileInput
                type="file"
                accept="image/*"
                class="file-input-hidden"
                (change)="onFileSelected($event)"
              />
            </div>

            <!-- OR: paste URL -->
            <div class="url-input-row">
              <span class="url-label">or paste URL</span>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                [(ngModel)]="coverImageUrl"
                name="coverImageUrl"
                class="url-input"
                (input)="onUrlInput()"
              />
            </div>
          </div>

          <!-- Title -->
          <div class="form-group">
            <label>Article Title <span class="required">*</span></label>
            <input
              type="text"
              placeholder="e.g. Hiking Doi Luang Chiang Dao: An Unforgettable Summit..."
              [(ngModel)]="title"
              name="title"
              required
            />
          </div>

          <!-- Category + Read Time -->
          <div class="form-row">
            <div class="form-group half">
              <label>Category</label>
              <select [(ngModel)]="category" name="category">
                <option value="Daily Life / Musings">✏️ Daily Life / Musings</option>
                <option value="Personal Growth">🌱 Personal Growth</option>
                <option value="Travel & Places">✈️ Travel & Places</option>
                <option value="Relationships">❤️ Relationships</option>
                <option value="Health & Wellbeing">💪 Health & Wellbeing</option>
                <option value="Work & Career">💼 Work & Career</option>
                <option value="Books & Learning">📚 Books & Learning</option>
                <option value="Goals & Projects">🎯 Goals & Projects</option>
                <option value="Random Thoughts / Rants">💬 Random Thoughts / Rants</option>
                <option value="Photography / Snapshots">📷 Photography / Snapshots</option>
              </select>
            </div>

            <div class="form-group half">
              <label>Estimated Read Time</label>
              <input type="text" placeholder="e.g. 5 min read" [(ngModel)]="readTime" name="readTime" />
            </div>
          </div>

          <!-- Excerpt -->
          <div class="form-group">
            <label>Excerpt / Summary <span class="required">*</span></label>
            <textarea
              rows="2"
              placeholder="Brief summary of what readers will learn in this post..."
              [(ngModel)]="excerpt"
              name="excerpt"
              required
            ></textarea>
          </div>

          <!-- Content -->
          <div class="form-group">
            <label>Full Article Content <span class="required">*</span></label>
            <div class="content-hint">
              <i class="fa-solid fa-circle-info"></i>
              Use <code>## Heading</code> for section headings, <code>**bold**</code> for bold text
            </div>
            <textarea
              rows="9"
              placeholder="Write your article content here...

## Introduction
Start with a compelling hook.

## Section 1
Your content here..."
              [(ngModel)]="content"
              name="content"
              required
            ></textarea>
          </div>

          <!-- Tags -->
          <div class="form-group">
            <label>Tags <span class="optional">(optional, comma-separated)</span></label>
            <input
              type="text"
              placeholder="Travel, ChiangMai, Thailand, Hiking"
              [(ngModel)]="tags"
              name="tags"
            />
          </div>

          <!-- Actions -->
          <div class="editor-actions">
            <button type="button" class="btn-cancel" (click)="onClose.emit()">
              Cancel
            </button>
            <button type="submit" class="btn-publish" [disabled]="publishing || !title || !excerpt || !content">
              <span *ngIf="!publishing">
                <i class="fa-solid fa-paper-plane"></i> Publish Article
              </span>
              <span *ngIf="publishing">
                <i class="fa-solid fa-spinner fa-spin"></i> Publishing...
              </span>
            </button>
          </div>

        </form>
      </div>
    </div>
  `,
  styles: [`
    /* ===== BACKDROP ===== */
    .editor-modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.70);
      backdrop-filter: blur(6px);
      z-index: 1000;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      animation: fadeIn 0.18s ease;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    /* ===== CARD ===== */
    .editor-modal-card {
      background: #ffffff;
      width: 100%;
      max-width: 680px;
      border-radius: 12px;
      padding: 32px 32px 24px;
      position: relative;
      box-shadow: 0 24px 80px rgba(0,0,0,0.4);
      max-height: 92vh;
      overflow-y: auto;
      animation: slideUp 0.22s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes slideUp {
      from { transform: translateY(24px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    /* ===== CLOSE BTN ===== */
    .close-btn {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: #f5f5f5;
      color: #666;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }
    .close-btn:hover { background: #e8472a; color: #fff; }

    /* ===== HEADER ===== */
    .editor-header {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      margin-bottom: 24px;
      padding-bottom: 20px;
      border-bottom: 1px solid #f0f0f0;
    }
    .editor-header-icon {
      width: 44px;
      height: 44px;
      background: linear-gradient(135deg, #e8472a, #f5782f);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 18px;
      flex-shrink: 0;
    }
    .editor-header h2 {
      font-family: 'Lato', sans-serif;
      font-size: 20px;
      font-weight: 800;
      color: #111;
      margin: 0 0 4px 0;
    }
    .editor-header p {
      font-size: 13px;
      color: #888;
      margin: 0;
    }

    /* ===== FORM ===== */
    .editor-form {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 7px;
    }
    .form-row {
      display: flex;
      gap: 14px;
    }
    .form-group.half { flex: 1; }
    .form-group label {
      font-size: 11.5px;
      font-weight: 700;
      color: #333;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }
    .required { color: #e8472a; }
    .optional { font-weight: 400; text-transform: none; color: #aaa; font-size: 11px; }
    .form-group input,
    .form-group select,
    .form-group textarea {
      padding: 10px 13px;
      border: 1.5px solid #e5e5e5;
      border-radius: 8px;
      background: #fafafa;
      color: #222;
      font-size: 14px;
      width: 100%;
      box-sizing: border-box;
      font-family: inherit;
      transition: border-color 0.2s, background 0.2s;
    }
    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #e8472a;
      background: #fff;
    }
    .form-group textarea {
      resize: vertical;
      min-height: 80px;
      line-height: 1.6;
    }

    /* ===== IMAGE UPLOAD AREA ===== */
    .image-upload-area {
      border: 2px dashed #d0d0d0;
      border-radius: 10px;
      min-height: 160px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: border-color 0.25s, background 0.25s;
      background: #fafafa;
    }
    .image-upload-area:hover,
    .image-upload-area.drag-over {
      border-color: #e8472a;
      background: #fff5f3;
    }
    .image-upload-area.has-image {
      border-style: solid;
      border-color: #e0e0e0;
      min-height: 200px;
    }

    /* Upload prompt */
    .upload-prompt {
      text-align: center;
      padding: 20px;
      pointer-events: none;
    }
    .upload-icon {
      font-size: 36px;
      color: #ccc;
      display: block;
      margin-bottom: 10px;
      transition: color 0.2s;
    }
    .image-upload-area:hover .upload-icon,
    .image-upload-area.drag-over .upload-icon { color: #e8472a; }
    .upload-title {
      font-size: 14px;
      font-weight: 600;
      color: #555;
      margin: 0 0 4px;
    }
    .upload-hint {
      font-size: 12px;
      color: #bbb;
      margin: 0;
    }

    /* Image preview */
    .img-preview-wrap {
      width: 100%;
      height: 100%;
      position: relative;
    }
    .img-preview {
      width: 100%;
      height: 200px;
      object-fit: cover;
      display: block;
      border-radius: 8px;
    }
    .img-remove-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: rgba(0,0,0,0.6);
      color: #fff;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      cursor: pointer;
      transition: background 0.2s;
    }
    .img-remove-btn:hover { background: #e8472a; }

    .file-input-hidden {
      position: absolute;
      inset: 0;
      opacity: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
      display: none;
    }

    /* URL row */
    .url-input-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 2px;
    }
    .url-label {
      font-size: 12px;
      color: #aaa;
      white-space: nowrap;
      font-weight: 600;
    }
    .url-input {
      flex: 1;
      padding: 8px 12px;
      border: 1.5px solid #e5e5e5;
      border-radius: 8px;
      font-size: 13px;
      background: #fafafa;
      color: #333;
      transition: border-color 0.2s;
    }
    .url-input:focus {
      outline: none;
      border-color: #e8472a;
    }

    /* Content hint */
    .content-hint {
      display: flex;
      align-items: center;
      gap: 7px;
      font-size: 12px;
      color: #999;
      background: #f8f8f8;
      border-radius: 6px;
      padding: 8px 12px;
      margin-bottom: 2px;
    }
    .content-hint i { color: #bbb; }
    .content-hint code {
      background: #eeeeee;
      padding: 1px 5px;
      border-radius: 3px;
      font-size: 11.5px;
      color: #555;
    }

    /* ===== ACTIONS ===== */
    .editor-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding-top: 16px;
      border-top: 1px solid #f0f0f0;
      margin-top: 4px;
    }
    .btn-cancel {
      padding: 10px 22px;
      border: 1.5px solid #ddd;
      background: transparent;
      color: #666;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-cancel:hover { border-color: #bbb; color: #333; }
    .btn-publish {
      padding: 10px 26px;
      background: linear-gradient(135deg, #e8472a, #f5782f);
      color: #fff;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: opacity 0.2s, transform 0.15s;
    }
    .btn-publish:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
    .btn-publish:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

    @media (max-width: 600px) {
      .editor-modal-card { padding: 22px 18px 18px; }
      .form-row { flex-direction: column; }
    }
  `]
})
export class ArticleEditorComponent {
  @Output() onClose = new EventEmitter<void>();
  @Output() onArticlePublished = new EventEmitter<Article>();

  title: string = '';
  category: string = 'Daily Life / Musings';
  readTime: string = '5 min read';
  coverImage: string = '';
  coverImageUrl: string = '';
  coverImagePreview: string = '';
  excerpt: string = '';
  content: string = '';
  tags: string = '';
  publishing: boolean = false;
  uploading: boolean = false;
  isDragging: boolean = false;

  private pendingFile: File | null = null;

  constructor(private articleService: ArticleService) {}

  triggerFileInput() {
    const input = document.querySelector('.file-input-hidden') as HTMLInputElement;
    if (input) input.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.handleFileUpload(input.files[0]);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    const files = event.dataTransfer?.files;
    if (files && files[0] && files[0].type.startsWith('image/')) {
      this.handleFileUpload(files[0]);
    }
  }

  private handleFileUpload(file: File) {
    // First show local preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      this.coverImagePreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);

    // Upload to server
    this.uploading = true;
    this.coverImage = ''; // clear until upload done
    this.articleService.uploadImage(file).subscribe({
      next: (url: string) => {
        this.coverImage = url;
        this.coverImagePreview = url; // use the hosted URL as preview
        this.coverImageUrl = '';
        this.uploading = false;
      },
      error: () => {
        // fallback: use base64
        const reader2 = new FileReader();
        reader2.onload = (e) => {
          const base64 = e.target?.result as string;
          this.coverImage = base64;
          this.coverImagePreview = base64;
        };
        reader2.readAsDataURL(file);
        this.uploading = false;
      }
    });
  }

  onUrlInput() {
    if (this.coverImageUrl) {
      this.coverImagePreview = this.coverImageUrl;
      this.coverImage = this.coverImageUrl;
      this.uploading = false;
    }
  }

  removeImage(event: Event) {
    event.stopPropagation();
    this.coverImagePreview = '';
    this.coverImage = '';
    this.coverImageUrl = '';
    this.uploading = false;
    this.pendingFile = null;
  }

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
