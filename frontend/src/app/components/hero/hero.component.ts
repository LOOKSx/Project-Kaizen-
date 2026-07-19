import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Article } from '../../models/article.model';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="hero-section">
      <!-- Background image -->
      <div
        class="hero-bg"
        [style.backgroundImage]="bgImage"
      ></div>

      <!-- Gradient overlay -->
      <div class="hero-overlay"></div>

      <!-- Content -->
      <div class="hero-content">
        <h1 class="hero-tagline">EXPLORE. DREAM. DISCOVER.</h1>
        <p class="hero-subtitle">
          A personal blog featuring travel adventures, technology insights,<br>
          and the pursuit of continuous improvement.
        </p>
        <button class="hero-cta" (click)="scrollToBlog()">START EXPLORING</button>
      </div>

      <!-- Torn paper SVG edge -->
      <div class="torn-edge">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path fill="#ffffff" d="
            M0,60
            L0,30
            C20,22 40,42 60,35
            C80,28 100,15 120,20
            C140,25 160,45 180,40
            C200,35 220,18 240,22
            C260,26 280,44 300,38
            C320,32 340,14 360,18
            C380,22 400,42 420,37
            C440,32 460,16 480,21
            C500,26 520,46 540,41
            C560,36 580,19 600,23
            C620,27 640,43 660,37
            C680,31 700,13 720,17
            C740,21 760,41 780,36
            C800,31 820,15 840,19
            C860,23 880,43 900,38
            C920,33 940,17 960,21
            C980,25 1000,45 1020,40
            C1040,35 1060,18 1080,22
            C1100,26 1120,44 1140,39
            C1160,34 1180,17 1200,21
            C1220,25 1240,43 1260,38
            C1280,33 1300,16 1320,20
            C1340,24 1360,42 1380,37
            C1400,32 1420,16 1440,20
            L1440,60 Z
          "/>
        </svg>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }

    .hero-section {
      position: relative;
      width: 100%;
      height: 100vh;
      min-height: 500px;
      max-height: 820px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .hero-bg {
      position: absolute;
      inset: 0;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      transform: scale(1.04);
      transition: transform 8s ease;
      animation: heroZoom 10s ease-in-out infinite alternate;
    }

    @keyframes heroZoom {
      from { transform: scale(1.0); }
      to   { transform: scale(1.06); }
    }

    .hero-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        to bottom,
        rgba(0,0,0,0.25) 0%,
        rgba(0,0,0,0.50) 50%,
        rgba(0,0,0,0.72) 100%
      );
    }

    .hero-content {
      position: relative;
      z-index: 2;
      text-align: center;
      padding: 0 20px;
      color: #ffffff;
      max-width: 860px;
    }

    .hero-tagline {
      font-family: 'Open Sans Condensed', sans-serif;
      font-size: clamp(38px, 7vw, 80px);
      font-weight: 700;
      letter-spacing: 0.06em;
      line-height: 1.1;
      color: #ffffff;
      text-shadow: 0 2px 20px rgba(0,0,0,0.4);
      margin-bottom: 20px;
    }

    .hero-subtitle {
      font-family: 'Lato', sans-serif;
      font-size: clamp(14px, 2vw, 18px);
      font-weight: 300;
      color: rgba(255,255,255,0.90);
      line-height: 1.7;
      margin-bottom: 36px;
      text-shadow: 0 1px 8px rgba(0,0,0,0.4);
    }

    .hero-cta {
      display: inline-block;
      padding: 14px 40px;
      font-family: 'Nunito', sans-serif;
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #ffffff;
      background: transparent;
      border: 2px solid #ffffff;
      cursor: pointer;
      transition: all 0.25s ease;
    }
    .hero-cta:hover {
      background: #ffffff;
      color: #111111;
    }

    /* ---- Torn paper edge ---- */
    .torn-edge {
      position: absolute;
      bottom: -2px;
      left: 0;
      right: 0;
      z-index: 3;
      line-height: 0;
    }
    .torn-edge svg {
      display: block;
      width: 100%;
      height: 60px;
    }
  `]
})
export class HeroComponent implements OnInit {
  @Input() article: Article | null = null;
  @Output() onSelectArticle = new EventEmitter<Article>();

  bgImage: string = '';

  // Stunning landscape photos from Unsplash
  private heroImages = [
    'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80)',
    'url(https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80)',
    'url(https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&q=80)',
    'url(https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1600&q=80)',
  ];

  ngOnInit() {
    // Use article image if available, otherwise random landscape
    if (this.article?.cover_image) {
      this.bgImage = `url(${this.article.cover_image})`;
    } else {
      const idx = Math.floor(Math.random() * this.heroImages.length);
      this.bgImage = this.heroImages[idx];
    }
  }

  scrollToBlog() {
    document.getElementById('blog-section')?.scrollIntoView({ behavior: 'smooth' });
  }
}
