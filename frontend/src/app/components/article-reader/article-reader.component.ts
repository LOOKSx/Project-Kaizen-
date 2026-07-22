import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Article, Comment } from '../../models/article.model';
import { ArticleService } from '../../services/article.service';

@Component({
  selector: 'app-article-reader',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="reader-modal-backdrop" *ngIf="article" (click)="onClose.emit()">
      <!-- Fixed Floating Close Button: ALWAYS Visible at top-right of viewport, 100% unscrollable -->
      <button class="fixed-screen-close-btn" (click)="onClose.emit(); $event.stopPropagation()" aria-label="Close Article">
        <i class="fa-solid fa-xmark"></i>
      </button>

      <div class="reader-modal-card" (click)="$event.stopPropagation()">
        <!-- Close Button -->
        <button class="close-btn" (click)="onClose.emit()">
          <i class="fa-solid fa-xmark"></i>
        </button>

        <!-- Admin Bar inside Reader -->
        <div class="admin-reader-bar" *ngIf="isAdmin">
          <span class="arb-badge"><i class="fa-solid fa-user-shield"></i> Stealth Admin</span>
          <button class="arb-delete-btn" (click)="onDelete.emit(article)">
            <i class="fa-solid fa-trash-can"></i> Delete Article
          </button>
        </div>

        <!-- Article Header Banner -->
        <div class="reader-hero">
          <img [src]="article.cover_image" [alt]="article.title" class="reader-cover">
          <div class="reader-hero-overlay"></div>
          <div class="reader-header-content">
            <span class="badge">{{ article.category }}</span>
            <h1 class="reader-title">{{ article.title }}</h1>

            <div class="reader-meta">
              <div class="author-meta">
                <img [src]="article.author_avatar" [alt]="article.author_name" class="author-avatar-lg">
                <div>
                  <span class="author-name-lg">{{ article.author_name }}</span>
                  <span class="meta-sub">{{ article.created_at | date:'MMM d, yyyy' }}</span>
                </div>
              </div>
              <button class="reader-like-btn" [class.liked]="article.liked" (click)="toggleLike()" title="Like this article">
                <i class="fa-solid fa-heart" *ngIf="article.liked"></i>
                <i class="fa-regular fa-heart" *ngIf="!article.liked"></i>
                <span>{{ article.likes || 0 }} Likes</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Article Body & Comments Container -->
        <div class="reader-body container">
          <!-- Article Content -->
          <div class="article-text-content" [innerHTML]="formatContent(article.content)"></div>

          <!-- Tags List -->
          <div class="article-tags" *ngIf="article.tags">
            <span class="tags-label"><i class="fa-solid fa-tags"></i> Tags:</span>
            <span class="tag-chip" *ngFor="let tag of getTagsList(article.tags)">#{{ tag }}</span>
          </div>

          <!-- Like Appreciation Bar -->
          <div class="reader-like-bar">
            <button class="like-main-btn" [class.liked]="article.liked" (click)="toggleLike()">
              <i class="fa-solid fa-heart" *ngIf="article.liked"></i>
              <i class="fa-regular fa-heart" *ngIf="!article.liked"></i>
              <span>{{ article.liked ? 'Thank you for liking!' : 'Like this article' }}</span>
              <span class="like-badge">{{ article.likes || 0 }}</span>
            </button>
          </div>

          <hr class="reader-divider">

          <!-- Comments Section -->
          <div class="comments-section">
            <h3 class="comments-title">
              <i class="fa-solid fa-comments"></i> Discussion ({{ article.comments?.length || 0 }})
            </h3>

            <!-- Comments List -->
            <div class="comments-list" *ngIf="article.comments && article.comments.length > 0">
              <div class="comment-item" *ngFor="let comment of article.comments; let i = index">
                <div class="comment-avatar-grey" [title]="comment.author_name">
                  <i class="fa-solid fa-user"></i>
                </div>
                <div class="comment-content">
                  <div class="comment-header">
                    <span class="comment-author">{{ comment.author_name }}</span>
                    <span class="comment-time">{{ comment.created_at | date:'short' }}</span>
                    <button class="btn-delete-comment" *ngIf="isAdmin" (click)="deleteComment(i)" title="Delete comment">
                      <i class="fa-solid fa-trash-can"></i> Delete Comment
                    </button>
                  </div>
                  <p class="comment-text">{{ comment.content }}</p>
                </div>
              </div>
            </div>

            <!-- Empty Comments Message -->
            <p *ngIf="!article.comments || article.comments.length === 0" class="no-comments">
              No comments yet. Be the first to share your thoughts on this article!
            </p>

            <!-- Add Comment Form -->
            <form class="add-comment-form" (ngSubmit)="submitComment()">
              <h4>Leave a Comment</h4>

              <!-- Honeypot Field (Invisible bot trap) -->
              <input
                type="text"
                [(ngModel)]="honeypotWebsite"
                name="website_hp"
                class="honeypot-field"
                tabindex="-1"
                autocomplete="off"
              />

              <!-- Anti-Spam / Validation Alert -->
              <div class="comment-error-alert" *ngIf="commentError">
                <i class="fa-solid fa-circle-exclamation"></i> {{ commentError }}
              </div>

              <!-- Comment Success Alert -->
              <div class="comment-success-alert" *ngIf="commentSuccess">
                <i class="fa-solid fa-circle-check"></i> {{ commentSuccess }}
              </div>

              <div class="form-row">
                <input 
                  type="text" 
                  placeholder="Your Name..." 
                  [(ngModel)]="newCommentAuthor" 
                  name="author" 
                  required
                />
              </div>
              <div class="form-row">
                <textarea 
                  rows="3" 
                  placeholder="Write your comment here (5 - 1,000 characters)..." 
                  [(ngModel)]="newCommentText" 
                  name="content" 
                  maxlength="1000"
                  required
                ></textarea>
                <div class="char-counter" [class.near-limit]="newCommentText.length > 900">
                  {{ newCommentText.length }}/1000
                </div>
              </div>
              <button type="submit" class="btn btn-primary" [disabled]="!newCommentAuthor || !newCommentText">
                Post Comment <i class="fa-solid fa-paper-plane"></i>
              </button>
            </form>
          </div>

          <!-- Bottom Exit Button -->
          <div class="reader-bottom-exit-wrap">
            <button class="btn-bottom-exit" (click)="onClose.emit()">
              <i class="fa-solid fa-xmark"></i> Close Article & Return
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .fixed-screen-close-btn {
      position: fixed;
      top: 72px;
      right: 18px;
      z-index: 20000;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background-color: #e8472a;
      color: #ffffff;
      border: 2px solid #ffffff;
      box-shadow: 0 8px 24px rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      animation: popIn 0.3s ease;
    }
    .fixed-screen-close-btn:hover {
      background-color: #111111;
      transform: scale(1.12);
    }
    @keyframes popIn {
      from { transform: scale(0); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }

    .reader-modal-backdrop {
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
      align-items: flex-start;
      overflow-y: auto;
      padding: 40px 20px;
    }

    /* Anti-Spam & Moderation Styles */
    .honeypot-field {
      display: none !important;
      visibility: hidden !important;
      position: absolute !important;
      left: -9999px !important;
      width: 0 !important;
      height: 0 !important;
      opacity: 0 !important;
    }
    .comment-error-alert {
      background: #fef2f2;
      color: #dc2626;
      border: 1px solid #fecaca;
      padding: 10px 14px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
      animation: shake 0.3s ease;
    }
    .comment-success-alert {
      background: #f0fdf4;
      color: #166534;
      border: 1px solid #bbf7d0;
      padding: 10px 14px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
      animation: fadeIn 0.25s ease;
    }
    .comment-avatar-grey {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: #f1f5f9;
      color: #94a3b8;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      flex-shrink: 0;
      border: 1px solid #cbd5e1;
    }
    body.dark-theme .comment-avatar-grey {
      background: #282828 !important;
      color: #64748b !important;
      border-color: #383838 !important;
    }
    body.dark-theme .comment-success-alert {
      background: #14532d !important;
      color: #dcfce7 !important;
      border-color: #15803d !important;
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-4px); }
      75% { transform: translateX(4px); }
    }
    .char-counter {
      text-align: right;
      font-size: 11px;
      color: #aaa;
      margin-top: 4px;
    }
    .char-counter.near-limit {
      color: #e8472a;
    }
    .reader-modal-card {
      background-color: #ffffff;
      color: #333333;
      width: 100%;
      max-width: 850px;
      max-height: 90vh;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      border-radius: 8px;
      position: relative;
      margin: auto;
      box-shadow: 0 15px 50px rgba(0,0,0,0.3);
      animation: modalSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes modalSlideUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .close-btn {
      position: sticky;
      top: 14px;
      float: right;
      margin-right: 14px;
      margin-top: 14px;
      margin-bottom: -50px;
      z-index: 1000;
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background-color: #111111;
      color: #ffffff;
      border: 2px solid #ffffff;
      box-shadow: 0 6px 20px rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .close-btn:hover {
      background-color: #e8472a;
      border-color: #e8472a;
      transform: scale(1.1);
    }

    .reader-bottom-exit-wrap {
      margin-top: 32px;
      padding-top: 20px;
      border-top: 1px solid #e8e8e8;
      text-align: center;
    }
    .btn-bottom-exit {
      background: #111111;
      color: #ffffff;
      border: none;
      padding: 12px 28px;
      border-radius: 30px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.2);
      transition: all 0.2s;
    }
    .btn-bottom-exit:hover {
      background: #e8472a;
      transform: translateY(-2px);
    }
    .reader-hero {
      position: relative;
      min-height: 380px;
      display: flex;
      align-items: flex-end;
    }
    .reader-cover {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .reader-hero-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.85) 95%);
    }
    .reader-header-content {
      position: relative;
      z-index: 2;
      padding: 30px;
      color: #ffffff;
      width: 100%;
    }
    .badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      background-color: #e8472a;
      color: #ffffff;
      padding: 3px 8px;
      border-radius: 2px;
    }
    .reader-title {
      font-family: 'Lato', sans-serif;
      font-size: 28px;
      font-weight: 700;
      color: #ffffff;
      margin: 12px 0 16px;
      line-height: 1.35;
      text-shadow: 0 1px 8px rgba(0,0,0,0.5);
    }
    .reader-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
    }
    .author-meta {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .author-avatar-lg {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 2px solid #e8472a;
      object-fit: cover;
    }
    .author-name-lg {
      display: block;
      font-weight: 700;
      font-size: 14px;
    }
    .meta-sub {
      font-size: 13px;
      color: rgba(255,255,255,0.7);
    }
    .reader-like-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 18px;
      border-radius: 30px;
      font-size: 13px;
      font-weight: 700;
      color: #ffffff;
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.3);
      cursor: pointer;
      backdrop-filter: blur(8px);
      transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .reader-like-btn:hover {
      background: rgba(232, 71, 42, 0.9);
      border-color: #e8472a;
      transform: scale(1.05);
    }
    .reader-like-btn.liked {
      background: #e8472a;
      border-color: #e8472a;
      box-shadow: 0 4px 15px rgba(232, 71, 42, 0.4);
    }
    .reader-like-btn i {
      font-size: 14px;
    }

    .reader-like-bar {
      display: flex;
      justify-content: center;
      margin: 36px 0 24px;
    }
    .like-main-btn {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 12px 28px;
      border-radius: 40px;
      font-size: 14px;
      font-weight: 700;
      color: #444444;
      background: #f8f8f8;
      border: 1.5px solid #e0e0e0;
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      box-shadow: 0 4px 15px rgba(0,0,0,0.04);
    }
    .like-main-btn:hover {
      color: #e8472a;
      background: #fff5f3;
      border-color: #ffd4cc;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(232, 71, 42, 0.15);
    }
    .like-main-btn.liked {
      color: #ffffff;
      background: linear-gradient(135deg, #e8472a, #f5782f);
      border-color: #e8472a;
      box-shadow: 0 8px 24px rgba(232, 71, 42, 0.35);
    }
    .like-badge {
      background: rgba(0,0,0,0.08);
      padding: 2px 10px;
      border-radius: 12px;
      font-size: 12px;
    }
    .like-main-btn.liked .like-badge {
      background: rgba(255,255,255,0.25);
    }
    .stats-meta {
      display: flex;
      gap: 16px;
      font-size: 12px;
      color: #dddddd;
    }
    .reader-body {
      padding: 35px 30px;
      max-width: 100%;
      box-sizing: border-box;
    }
    .article-text-content {
      font-size: 16px;
      line-height: 1.8;
      color: #333333;
      margin-bottom: 30px;
    }
    .article-text-content ::ng-deep h1 {
      font-family: 'Lato', sans-serif;
      font-size: 24px;
      font-weight: 900;
      margin: 30px 0 14px;
      color: #111111;
      border-left: 4px solid #e8472a;
      padding-left: 14px;
      line-height: 1.3;
    }
    .article-text-content ::ng-deep h2 {
      font-family: 'Lato', sans-serif;
      font-size: 21px;
      font-weight: 700;
      margin: 26px 0 12px;
      color: #111111;
      border-left: 4px solid #e8472a;
      padding-left: 12px;
      line-height: 1.3;
    }
    .article-text-content ::ng-deep h3 {
      font-family: 'Lato', sans-serif;
      font-size: 18px;
      font-weight: 700;
      margin: 22px 0 10px;
      color: #222222;
      border-left: 3px solid #ff6b4a;
      padding-left: 10px;
      line-height: 1.3;
    }
    .article-text-content ::ng-deep strong,
    .article-text-content ::ng-deep b {
      font-weight: 900;
      color: #0f172a;
    }
    .article-text-content ::ng-deep em,
    .article-text-content ::ng-deep i {
      font-style: italic;
      color: #334155;
    }
    .article-text-content ::ng-deep blockquote {
      border-left: 4px solid #cbd5e1;
      margin: 18px 0;
      padding: 10px 18px;
      background: #f8fafc;
      color: #475569;
      font-style: italic;
      border-radius: 0 4px 4px 0;
    }
    .article-text-content ::ng-deep code {
      font-family: monospace;
      background: #f1f5f9;
      color: #e8472a;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 14px;
    }
    .article-text-content ::ng-deep p {
      margin-bottom: 18px;
    }
    .article-text-content ::ng-deep ul {
      margin: 14px 0 20px 20px;
    }
    .article-text-content ::ng-deep li {
      margin-bottom: 6px;
    }

    body.dark-theme .article-text-content ::ng-deep h1,
    body.dark-theme .article-text-content ::ng-deep h2,
    body.dark-theme .article-text-content ::ng-deep h3 {
      color: #f8fafc !important;
    }
    body.dark-theme .article-text-content ::ng-deep strong,
    body.dark-theme .article-text-content ::ng-deep b {
      color: #ffffff !important;
    }
    body.dark-theme .article-text-content ::ng-deep em,
    body.dark-theme .article-text-content ::ng-deep i {
      color: #cbd5e1 !important;
    }
    body.dark-theme .article-text-content ::ng-deep blockquote {
      background: #1e1e1e !important;
      border-color: #475569 !important;
      color: #94a3b8 !important;
    }
    body.dark-theme .article-text-content ::ng-deep code {
      background: #282828 !important;
      color: #ff6b4a !important;
    }
    .article-tags {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 24px;
    }
    .tags-label {
      font-size: 13px;
      font-weight: 700;
      color: #555555;
    }
    .tag-chip {
      background-color: #f5f5f5;
      padding: 3px 10px;
      border-radius: 12px;
      font-size: 12px;
      color: #e8472a;
      font-weight: 600;
    }
    .reader-divider {
      border: 0;
      height: 1px;
      background-color: #eeeeee;
      margin: 24px 0;
    }
    .comments-section {
      margin-top: 10px;
    }
    .comments-title {
      font-family: 'Lato', sans-serif;
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 18px;
      color: #111111;
    }
    .comments-list {
      display: flex;
      flex-direction: column;
      gap: 14px;
      margin-bottom: 24px;
    }
    .comment-item {
      display: flex;
      gap: 12px;
      padding: 14px;
      background-color: #fafafa;
      border: 1px solid #eeeeee;
      border-radius: 3px;
    }
    .comment-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      object-fit: cover;
    }
    .comment-content {
      flex: 1;
    }
    .comment-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 4px;
    }
    .comment-author {
      font-weight: 700;
      font-size: 13px;
      color: #222222;
    }
    .comment-time {
      font-size: 11px;
      color: #888888;
    }
    .comment-text {
      font-size: 13.5px;
      color: #333333;
      margin: 0;
      line-height: 1.6;
    }
    .no-comments {
      font-size: 13px;
      color: #777777;
      font-style: italic;
      margin-bottom: 24px;
    }
    .add-comment-form {
      background-color: #fafafa;
      border: 1px solid #eeeeee;
      padding: 20px;
      border-radius: 3px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .add-comment-form h4 {
      font-family: 'Lato', sans-serif;
      font-size: 14px;
      font-weight: 700;
      color: #111111;
      margin: 0 0 4px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .form-row input, .form-row textarea {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #cccccc;
      border-radius: 3px;
      background-color: #ffffff;
      color: #333333;
      font-size: 13.5px;
      box-sizing: border-box;
    }
    /* ===== ADMIN BAR ===== */
    .admin-reader-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 20px;
      background: #181818;
      color: #fff;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    .arb-badge { font-size: 12px; font-weight: 700; color: #e8472a; }
    .arb-delete-btn {
      background: rgba(232,71,42,0.15);
      color: #e8472a;
      border: 1px solid #e8472a;
      padding: 5px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }
    .arb-delete-btn:hover { background: #e8472a; color: #fff; }

    /* ===== DELETE COMMENT BTN ===== */
    .btn-delete-comment {
      margin-left: auto;
      background: rgba(232,71,42,0.1);
      color: #e8472a;
      border: 1px solid #e8472a;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-delete-comment:hover { background: #e8472a; color: #fff; }

    @media (max-width: 600px) {
      .fixed-screen-close-btn {
        top: 68px;
        right: 12px;
        width: 46px;
        height: 46px;
        font-size: 24px;
        background-color: #e8472a;
        color: #ffffff;
        border: 2.5px solid #ffffff;
        box-shadow: 0 8px 28px rgba(0,0,0,0.65);
      }
      .reader-modal-backdrop { padding: 10px 6px; }
      .reader-modal-card {
        width: 96vw;
        max-height: 92vh;
        overflow-y: auto !important;
        -webkit-overflow-scrolling: touch !important;
        border-radius: 8px;
      }
      .reader-hero { min-height: 240px; }
      .reader-header-content { padding: 18px 16px; }
      .reader-title { font-size: 20px; line-height: 1.35; }
      .reader-body { padding: 18px 16px; }
      .close-btn {
        position: sticky;
        top: 10px;
        float: right;
        margin-right: 10px;
        margin-top: 10px;
        margin-bottom: -50px;
        z-index: 1000;
        width: 42px;
        height: 42px;
        font-size: 20px;
        background: #111111;
        color: #ffffff;
        border: 2px solid #ffffff;
        box-shadow: 0 6px 20px rgba(0,0,0,0.5);
      }
    }
  `]
})
export class ArticleReaderComponent {
  @Input() article: Article | null = null;
  @Input() isAdmin: boolean = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onDelete = new EventEmitter<Article>();

  newCommentAuthor: string = '';
  newCommentText: string = '';
  honeypotWebsite: string = '';
  commentError: string = '';
  commentSuccess: string = '';

  private readonly profanityList: string[] = [
    // Thai profanity & slurs
    'ควย', 'ส้นตีน', 'เหี้ย', 'เชี่ย', 'เย็ด', 'มึง', 'กู', 'สัส', 'ชิปหาย', 'ชิบหาย',
    'ไอ้สัส', 'ไอ้เหี้ย', 'ไอ้ควย', 'แม่ง', 'ดอกทอง', 'แครอท', 'เฬว', 'อีควาย', 'อีเหี้ย',
    'อีสัตว์', 'หน้าหี', 'หี', 'แตด', 'อีดอก', 'กะหรี่', 'กะหรี่เฒ่า',
    // English profanity & slurs
    'fuck', 'fucking', 'fucked', 'fucker', 'shit', 'shitty', 'bitch', 'bitches',
    'asshole', 'cunt', 'dick', 'pussy', 'bastard', 'slut', 'whore', 'nigger',
    'nigga', 'motherfucker', 'cock', 'jackass', 'prick', 'bullshit', 'twat'
  ];

  constructor(private articleService: ArticleService) {}

  formatContent(rawText: string): string {
    if (!rawText) return '';

    const lines = rawText.split(/\r\n|\r|\n/);
    const result: string[] = [];

    for (let line of lines) {
      const trimmed = line.trim();

      if (/^#{1,3}\s*\S+/i.test(trimmed)) {
        if (trimmed.startsWith('###')) {
          const content = this.applyInlineMarkdown(trimmed.replace(/^###\s*/, ''));
          result.push(`<h3>${content}</h3>`);
        } else if (trimmed.startsWith('##')) {
          const content = this.applyInlineMarkdown(trimmed.replace(/^##\s*/, ''));
          result.push(`<h2>${content}</h2>`);
        } else if (trimmed.startsWith('#')) {
          const content = this.applyInlineMarkdown(trimmed.replace(/^#\s*/, ''));
          result.push(`<h1>${content}</h1>`);
        }
      } else if (trimmed.startsWith('>')) {
        const content = this.applyInlineMarkdown(trimmed.replace(/^>\s*/, ''));
        result.push(`<blockquote>${content}</blockquote>`);
      } else if (trimmed.length > 0) {
        const content = this.applyInlineMarkdown(line);
        result.push(content);
      } else {
        result.push('<br>');
      }
    }

    let out = result.join('<br>');
    out = out.replace(/(<\/h[1-3]>)\s*<br>/g, '$1');
    out = out.replace(/(<\/blockquote>)\s*<br>/g, '$1');
    return out;
  }

  private applyInlineMarkdown(text: string): string {
    if (!text) return '';
    let out = text;

    // Bold (**text** or ** text ** or __text__)
    out = out.replace(/\*\*\s*(.*?)\s*\*\*/g, '<strong>$1</strong>');
    out = out.replace(/__\s*(.*?)\s*__/g, '<strong>$1</strong>');

    // Italics (*text* or _text_)
    out = out.replace(/\*\s*(.*?)\s*\*/g, '<em>$1</em>');
    out = out.replace(/_\s*(.*?)\s*_/g, '<em>$1</em>');

    // Inline code (`code`)
    out = out.replace(/`([^`]+)`/g, '<code>$1</code>');

    return out;
  }

  getTagsList(tags: string): string[] {
    return tags ? tags.split(',').map(t => t.trim()) : [];
  }

  toggleLike() {
    if (!this.article) return;
    if (this.article.liked) {
      this.article.liked = false;
      this.article.likes = Math.max(0, (this.article.likes || 1) - 1);
    } else {
      this.article.liked = true;
      this.article.likes = (this.article.likes || 0) + 1;
    }
    this.articleService.updatePersistedArticle(this.article);
  }

  deleteComment(index: number) {
    if (this.article && this.article.comments) {
      this.article.comments.splice(index, 1);
      this.articleService.updatePersistedArticle(this.article);
    }
  }

  private containsProfanity(text: string): boolean {
    if (!text) return false;
    const normalized = text.toLowerCase()
      .replace(/[\*\_\.\-\s\d]/g, '')
      .replace(/0/g, 'o').replace(/1/g, 'i').replace(/3/g, 'e').replace(/4/g, 'a').replace(/5/g, 's').replace(/7/g, 't');
    
    const words = text.toLowerCase().split(/\s+/);

    return this.profanityList.some(badWord => {
      return words.some(w => w.replace(/[^a-z\u0E00-\u0E7F]/gi, '') === badWord) ||
             normalized.includes(badWord);
    });
  }

  private containsURL(text: string): boolean {
    if (!text) return false;
    const urlPattern = /(https?:\/\/|ftp:\/\/|www\.|[a-zA-Z0-9-]+\.(com|net|org|io|co|th|xyz|info|biz|link|site|online|club|top|ru|cn|cc)\b)/i;
    return urlPattern.test(text);
  }

  submitComment() {
    this.commentError = '';

    // 1. Honeypot Check (Invisible bot trap)
    if (this.honeypotWebsite && this.honeypotWebsite.trim().length > 0) {
      this.commentError = 'Spam detected. Submission rejected.';
      return;
    }

    const trimmedAuthor = this.newCommentAuthor.trim();
    const trimmedContent = this.newCommentText.trim();

    if (!trimmedAuthor || !trimmedContent) {
      this.commentError = 'Please fill out both your name and comment.';
      return;
    }

    // 2. Character Length Check (Min 5, Max 1000)
    if (trimmedContent.length < 5) {
      this.commentError = 'Comment must be at least 5 characters long.';
      return;
    }
    if (trimmedContent.length > 1000) {
      this.commentError = 'Comment cannot exceed 1,000 characters.';
      return;
    }

    // 3. Block URL / Link Check
    if (this.containsURL(trimmedContent) || this.containsURL(trimmedAuthor)) {
      this.commentError = 'Links or URLs are not allowed in comments to prevent spam.';
      return;
    }

    // 4. Duplicate Comment Check
    if (this.article && this.article.comments) {
      const isDuplicate = this.article.comments.some(c => 
        c.content.trim().toLowerCase() === trimmedContent.toLowerCase()
      );
      if (isDuplicate) {
        this.commentError = 'Duplicate comment detected. Please write a unique comment.';
        return;
      }
    }

    // 5. Profanity / Offensive Language Check
    if (this.containsProfanity(trimmedContent) || this.containsProfanity(trimmedAuthor)) {
      this.commentError = 'Inappropriate or offensive language is not allowed.';
      return;
    }

    // All checks passed -> Submit comment with Instant Optimistic UI Update & Success Banner
    if (this.article) {
      const newComment = {
        id: Date.now(),
        article_id: this.article.id,
        author_name: trimmedAuthor,
        author_avatar: '',
        content: trimmedContent,
        created_at: new Date().toISOString()
      };

      if (!this.article.comments) this.article.comments = [];
      this.article.comments.push(newComment);
      this.articleService.updatePersistedArticle(this.article);

      this.newCommentText = '';
      this.commentError = '';
      this.commentSuccess = 'ส่งความคิดเห็นเรียบร้อยแล้ว (Comment posted successfully!)';
      
      setTimeout(() => {
        this.commentSuccess = '';
      }, 4000);
    }
  }
}
