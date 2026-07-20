import { Component, Input, Output, EventEmitter } from '@angular/core';
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
          <div class="editor-header-label">{{ articleToEdit ? 'EDIT ARTICLE' : 'NEW ARTICLE' }}</div>
          <h2>{{ articleToEdit ? 'Edit Article' : 'Write New Article' }}</h2>
          <p>{{ articleToEdit ? 'Customize article details and content freely.' : 'Share your stories and insights with readers.' }}</p>
        </div>

        <form class="editor-form" (ngSubmit)="publishArticle()">

          <!-- Cover Image Upload Area -->
          <div class="form-group">
            <label>COVER IMAGE</label>
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
                <i class="fa-solid fa-arrow-up-from-bracket upload-icon"></i>
                <p class="upload-title">Drag & Drop or Click to Upload</p>
                <p class="upload-hint">PNG, JPG, WEBP &mdash; auto compressed</p>
              </div>

              <!-- Uploading Spinner -->
              <div class="upload-prompt" *ngIf="uploading">
                <i class="fa-solid fa-circle-notch fa-spin upload-icon loading"></i>
                <p class="upload-title">Processing image...</p>
                <p class="upload-hint">Compressing & optimising</p>
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
              <span class="url-label">or URL</span>
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
            <label>ARTICLE TITLE <span class="required">*</span></label>
            <input
              type="text"
              placeholder="e.g. Hiking Doi Luang Chiang Dao: An Unforgettable Summit..."
              [(ngModel)]="title"
              name="title"
              required
            />
          </div>

          <!-- Category -->
          <div class="form-group">
            <label>CATEGORY</label>
            <select [(ngModel)]="category" name="category">
              <option value="Daily Life / Musings">Daily Life / Musings</option>
              <option value="Personal Growth">Personal Growth</option>
              <option value="Travel &amp; Places">Travel &amp; Places</option>
              <option value="Relationships">Relationships</option>
              <option value="Health &amp; Wellbeing">Health &amp; Wellbeing</option>
              <option value="Work &amp; Career">Work &amp; Career</option>
              <option value="Books &amp; Learning">Books &amp; Learning</option>
              <option value="Goals &amp; Projects">Goals &amp; Projects</option>
              <option value="Random Thoughts / Rants">Random Thoughts / Rants</option>
              <option value="Photography / Snapshots">Photography / Snapshots</option>
            </select>
          </div>

          <!-- Excerpt -->
          <div class="form-group">
            <label>EXCERPT <span class="required">*</span></label>
            <textarea
              rows="2"
              placeholder="A brief, compelling summary of this article..."
              [(ngModel)]="excerpt"
              name="excerpt"
              required
            ></textarea>
          </div>

          <!-- Content -->
          <div class="form-group">
            <label>CONTENT <span class="required">*</span></label>
            <div class="content-hint">
              <code>## Heading</code> &nbsp;for sections&nbsp;&nbsp;<code>**bold**</code>&nbsp;for emphasis
            </div>
            <textarea
              rows="9"
              placeholder="Write your article content here..."
              [(ngModel)]="content"
              name="content"
              required
            ></textarea>
          </div>

          <!-- Tags -->
          <div class="form-group">
            <label>TAGS <span class="optional">(comma-separated)</span></label>
            <input
              type="text"
              placeholder="Travel, ChiangMai, Hiking"
              [(ngModel)]="tags"
              name="tags"
            />
          </div>

          <!-- Actions -->
          <div class="editor-actions">
            <button type="button" class="btn-cancel" (click)="onClose.emit()">Cancel</button>
            <button type="submit" class="btn-publish" [disabled]="!title || !excerpt || !content || publishing || uploading">
              <i class="fa-solid" [class.fa-paper-plane]="!publishing" [class.fa-spinner]="publishing" [class.fa-spin]="publishing"></i>
              <span>{{ publishing ? 'Saving...' : (articleToEdit ? 'Save Changes' : 'Publish Article') }}</span>
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
      background: rgba(10, 10, 10, 0.75);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      z-index: 1000;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      animation: fadeIn 0.2s ease;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    /* ===== CARD ===== */
    .editor-modal-card {
      background: #ffffff;
      width: 100%;
      max-width: 640px;
      border-radius: 4px;
      padding: 40px 40px 32px;
      position: relative;
      box-shadow: 0 32px 80px rgba(0,0,0,0.35);
      max-height: 92vh;
      overflow-y: auto;
      animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      scrollbar-width: thin;
      scrollbar-color: #eee transparent;
    }
    .editor-modal-card::-webkit-scrollbar { width: 4px; }
    .editor-modal-card::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 2px; }
    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    /* ===== CLOSE BTN ===== */
    .close-btn {
      position: absolute;
      top: 20px;
      right: 20px;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: transparent;
      color: #bbb;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      border: 1px solid #e8e8e8;
      cursor: pointer;
      transition: all 0.15s;
    }
    .close-btn:hover { background: #111; color: #fff; border-color: #111; }

    /* ===== HEADER ===== */
    .editor-header {
      margin-bottom: 32px;
      padding-bottom: 24px;
      border-bottom: 1px solid #f0f0f0;
    }
    .editor-header-label {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.14em;
      color: #e8472a;
      margin-bottom: 8px;
    }
    .editor-header h2 {
      font-family: 'Lato', sans-serif;
      font-size: 24px;
      font-weight: 800;
      color: #111;
      margin: 0 0 6px;
      letter-spacing: -0.02em;
      line-height: 1.2;
    }
    .editor-header p {
      font-size: 13px;
      color: #aaa;
      margin: 0;
      font-weight: 400;
    }

    /* ===== FORM ===== */
    .editor-form {
      display: flex;
      flex-direction: column;
      gap: 22px;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .form-row {
      display: flex;
      gap: 16px;
    }
    .form-group.half { flex: 1; }
    .form-group label {
      font-size: 10px;
      font-weight: 700;
      color: #999;
      text-transform: uppercase;
      letter-spacing: 0.10em;
    }
    .required { color: #e8472a; }
    .optional { font-weight: 400; text-transform: none; color: #ccc; font-size: 10px; }
    .form-group input,
    .form-group select,
    .form-group textarea {
      padding: 11px 14px;
      border: 1px solid #e8e8e8;
      border-radius: 3px;
      background: #fff;
      color: #111;
      font-size: 14px;
      width: 100%;
      box-sizing: border-box;
      font-family: inherit;
      transition: border-color 0.15s;
      -webkit-appearance: none;
      appearance: none;
    }
    .form-group input::placeholder,
    .form-group textarea::placeholder { color: #ccc; }
    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #111;
    }
    .form-group select {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 12px center;
      padding-right: 36px;
      cursor: pointer;
    }
    .form-group textarea {
      resize: vertical;
      min-height: 80px;
      line-height: 1.65;
    }

    /* ===== IMAGE UPLOAD AREA ===== */
    .image-upload-area {
      border: 1.5px dashed #ddd;
      border-radius: 4px;
      min-height: 140px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: border-color 0.2s, background 0.2s;
      background: #fafafa;
    }
    .image-upload-area:hover,
    .image-upload-area.drag-over {
      border-color: #111;
      background: #f7f7f7;
    }
    .image-upload-area.has-image {
      border-style: solid;
      border-color: #eee;
      min-height: 200px;
    }

    /* Upload prompt */
    .upload-prompt {
      text-align: center;
      padding: 24px 20px;
      pointer-events: none;
    }
    .upload-icon {
      font-size: 24px;
      color: #ddd;
      display: block;
      margin-bottom: 10px;
      transition: color 0.2s;
    }
    .upload-icon.loading { color: #aaa; }
    .image-upload-area:hover .upload-icon:not(.loading),
    .image-upload-area.drag-over .upload-icon:not(.loading) { color: #888; }
    .upload-title {
      font-size: 13px;
      font-weight: 600;
      color: #888;
      margin: 0 0 4px;
      letter-spacing: 0.01em;
    }
    .upload-hint {
      font-size: 11px;
      color: #ccc;
      margin: 0;
      letter-spacing: 0.02em;
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
    }
    .img-remove-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: rgba(255,255,255,0.9);
      color: #333;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.15s;
      backdrop-filter: blur(4px);
    }
    .img-remove-btn:hover { background: #111; color: #fff; }

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
      gap: 12px;
      margin-top: 4px;
    }
    .url-label {
      font-size: 11px;
      color: #bbb;
      white-space: nowrap;
      font-weight: 500;
      letter-spacing: 0.03em;
    }
    .url-input {
      flex: 1;
      padding: 9px 13px;
      border: 1px solid #e8e8e8;
      border-radius: 3px;
      font-size: 13px;
      background: #fff;
      color: #333;
      transition: border-color 0.15s;
      font-family: inherit;
    }
    .url-input:focus {
      outline: none;
      border-color: #111;
    }

    /* Content hint */
    .content-hint {
      font-size: 11.5px;
      color: #bbb;
      margin-bottom: 2px;
      letter-spacing: 0.01em;
    }
    .content-hint code {
      background: #f3f3f3;
      padding: 1px 6px;
      border-radius: 2px;
      font-size: 11px;
      color: #666;
      font-family: 'SF Mono', 'Fira Code', monospace;
    }

    /* ===== ACTIONS ===== */
    .editor-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      padding-top: 20px;
      border-top: 1px solid #f0f0f0;
      margin-top: 4px;
    }
    .btn-cancel {
      padding: 10px 22px;
      border: 1px solid #e0e0e0;
      background: transparent;
      color: #999;
      border-radius: 3px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s;
      letter-spacing: 0.01em;
    }
    .btn-cancel:hover { border-color: #111; color: #111; }
    .btn-publish {
      padding: 10px 26px;
      background: #111111;
      color: #fff;
      border: none;
      border-radius: 3px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.15s;
      letter-spacing: 0.02em;
    }
    .btn-publish:hover:not(:disabled) { background: #e8472a; }
    .btn-publish:disabled { opacity: 0.35; cursor: not-allowed; }

    @media (max-width: 600px) {
      .editor-modal-card { padding: 28px 20px 22px; }
      .form-row { flex-direction: column; }
    }
  `]
})
export class ArticleEditorComponent {
  @Input() articleToEdit: Article | null = null;
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

  ngOnInit() {
    if (this.articleToEdit) {
      this.title = this.articleToEdit.title || '';
      this.category = this.articleToEdit.category || 'Daily Life / Musings';
      this.readTime = this.articleToEdit.read_time || '5 min read';
      this.coverImage = this.articleToEdit.cover_image || '';
      this.coverImagePreview = this.articleToEdit.cover_image || '';
      this.excerpt = this.articleToEdit.excerpt || '';
      this.content = this.articleToEdit.content || '';
      this.tags = this.articleToEdit.tags || '';
    }
  }

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

  private compressFile(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          const maxDim = 1200;
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
            resolve(canvas.toDataURL('image/jpeg', 0.82));
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

  private handleFileUpload(file: File) {
    this.uploading = true;
    this.compressFile(file).then(compressed => {
      this.coverImage = compressed;
      this.coverImagePreview = compressed;
      this.coverImageUrl = '';
      this.uploading = false;
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
      if (this.articleToEdit) {
        const updated: Article = {
          ...this.articleToEdit,
          title: this.title,
          category: this.category,
          read_time: this.readTime,
          cover_image: this.coverImage || this.articleToEdit.cover_image,
          excerpt: this.excerpt,
          content: this.content,
          tags: this.tags
        };
        this.articleService.updateArticle(updated).subscribe(res => {
          this.publishing = false;
          this.onArticlePublished.emit(res);
          this.onClose.emit();
        });
      } else {
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
}
