import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, map, tap, timeout } from 'rxjs/operators';
import { Article, Category, AuthorProfile, Comment } from '../models/article.model';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private apiUrl = 'http://localhost:8080/api';

  private selectedCategorySubject = new BehaviorSubject<string>('');
  selectedCategory$ = this.selectedCategorySubject.asObservable();

  private searchQuerySubject = new BehaviorSubject<string>('');
  searchQuery$ = this.searchQuerySubject.asObservable();

  private syncApiUrl = '/api/sync';

  constructor(private http: HttpClient) {
    this.initLocalStorage();
    this.syncFromCloud();
    if (typeof window !== 'undefined') {
      setInterval(() => this.syncFromCloud(), 15000);
    }
  }

  syncFromCloud() {
    if (typeof localStorage === 'undefined') return;
    this.http.get<any>(`${this.syncApiUrl}?t=${Date.now()}`).pipe(
      catchError(() => of(null))
    ).subscribe(res => {
      if (res && res.success) {
        if (res.articles && Array.isArray(res.articles) && res.articles.length > 0) {
          localStorage.setItem('kaizen_articles', JSON.stringify(res.articles));
          window.dispatchEvent(new CustomEvent('kaizen:articles-synced'));
        }
        if (res.settings) {
          localStorage.setItem('kaizen_site_settings', JSON.stringify(res.settings));
          window.dispatchEvent(new CustomEvent('kaizen:settings-synced'));
        }
      }
    });
  }

  syncToCloud(articles?: Article[], settings?: any) {
    const list = articles || this.getPersistedArticles('', '');
    let setts = settings;
    if (!setts && typeof localStorage !== 'undefined') {
      try {
        const saved = localStorage.getItem('kaizen_site_settings');
        if (saved) setts = JSON.parse(saved);
      } catch (e) {}
    }
    this.http.post<any>(this.syncApiUrl, { articles: list, settings: setts }).pipe(
      catchError(() => of(null))
    ).subscribe();
  }

  getArticles(category: string = '', search: string = ''): Observable<Article[]> {
    const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    if (!isLocalhost) {
      return of(this.getPersistedArticles(category, search));
    }

    let url = `${this.apiUrl}/articles?category=${encodeURIComponent(category)}&search=${encodeURIComponent(search)}`;
    return this.http.get<any>(url).pipe(
      timeout(400),
      map(res => res.data || []),
      catchError(() => of(this.getPersistedArticles(category, search)))
    );
  }

  getArticleBySlug(slug: string): Observable<Article | null> {
    const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    if (!isLocalhost) {
      const mock = this.getPersistedArticles('', '').find(a => a.slug === slug);
      if (mock) {
        mock.views++;
        this.updatePersistedArticle(mock);
      }
      return of(mock || null);
    }

    return this.http.get<any>(`${this.apiUrl}/articles/${slug}`).pipe(
      timeout(400),
      map(res => res.data),
      catchError(() => {
        const mock = this.getPersistedArticles('', '').find(a => a.slug === slug);
        if (mock) {
          mock.views++;
          this.updatePersistedArticle(mock);
        }
        return of(mock || null);
      })
    );
  }

  createArticle(article: Partial<Article>): Observable<Article> {
    return this.http.post<any>(`${this.apiUrl}/articles`, article).pipe(
      map(res => res.data),
      catchError(() => {
        const newArt: Article = {
          id: Date.now(),
          title: article.title || 'Untitled Article',
          slug: (article.title || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          excerpt: article.excerpt || '',
          content: article.content || '',
          category: article.category || 'General',
          cover_image: article.cover_image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1000&q=80',
          read_time: article.read_time || '5 min read',
          views: 1,
          featured: false,
          author_name: 'Kaizen Creator',
          author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          tags: article.tags || 'Kaizen, Personal',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          comments: []
        };
        this.saveNewPersistedArticle(newArt);
        return of(newArt);
      })
    );
  }

  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<any>(`${this.apiUrl}/upload`, formData).pipe(
      map(res => res.url as string),
      catchError(() => {
        // Fallback: convert to base64 data URL for offline use
        return new Observable<string>(observer => {
          const reader = new FileReader();
          reader.onload = (e) => {
            observer.next(e.target?.result as string);
            observer.complete();
          };
          reader.onerror = () => observer.error('Failed to read file');
          reader.readAsDataURL(file);
        });
      })
    );
  }

  addComment(articleId: number, comment: Partial<Comment>): Observable<Comment> {
    return this.http.post<any>(`${this.apiUrl}/articles/${articleId}/comments`, comment).pipe(
      map(res => res.data),
      catchError(() => {
        const newComment: Comment = {
          id: Date.now(),
          article_id: articleId,
          author_name: comment.author_name || 'Anonymous',
          author_avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
          content: comment.content || '',
          created_at: new Date().toISOString()
        };
        this.addPersistedComment(articleId, newComment);
        return of(newComment);
      })
    );
  }

  deleteArticle(id: number): Observable<boolean> {
    return this.http.delete<any>(`${this.apiUrl}/articles/${id}`).pipe(
      map(() => {
        this.removePersistedArticle(id);
        return true;
      }),
      catchError(() => {
        this.removePersistedArticle(id);
        return of(true);
      })
    );
  }

  updateArticle(article: Article): Observable<Article> {
    return this.http.put<any>(`${this.apiUrl}/articles/${article.id}`, article).pipe(
      map(res => res.data || article),
      catchError(() => {
        this.updatePersistedArticle(article);
        return of(article);
      })
    );
  }

  private removePersistedArticle(id: number) {
    const list = this.getPersistedArticles('', '').filter(a => a.id !== id);
    localStorage.setItem('kaizen_articles', JSON.stringify(list));
  }

  getAuthorProfile(): Observable<AuthorProfile> {
    return this.http.get<any>(`${this.apiUrl}/author`).pipe(
      map(res => res.data),
      catchError(() => {
        const localArticles = this.getPersistedArticles('', '');
        return of({
          name: 'Kaizen Explorer & Architect',
          title: 'World Traveler & Software Engineer',
          bio: 'Welcome to Kaizen — a personal blog and knowledge hub documenting world travels, modern engineering, photography, and the philosophy of continuous self-improvement every day.',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
          cover_image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
          articles_count: localArticles.length,
          countries_visited: 38,
          photos_taken: 14500,
          location: 'Bangkok & Global',
          instagram: 'https://instagram.com',
          youtube: 'https://youtube.com',
          facebook: 'https://facebook.com',
          github: 'https://github.com'
        });
      })
    );
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<any>(`${this.apiUrl}/categories`).pipe(
      map(res => res.data),
      catchError(() => of([
        { id: 1, name: 'Daily Life / Musings', slug: 'daily-life', icon: 'fa-pencil', count: 1 },
        { id: 2, name: 'Personal Growth', slug: 'growth', icon: 'fa-heart', count: 1 },
        { id: 3, name: 'Travel & Places', slug: 'travel', icon: 'fa-plane', count: 1 },
        { id: 4, name: 'Relationships', slug: 'relationships', icon: 'fa-users', count: 0 },
        { id: 5, name: 'Health & Wellbeing', slug: 'health', icon: 'fa-heartbeat', count: 0 },
        { id: 6, name: 'Work & Career', slug: 'work', icon: 'fa-briefcase', count: 1 },
        { id: 7, name: 'Books & Learning', slug: 'books', icon: 'fa-book', count: 0 },
        { id: 8, name: 'Goals & Projects', slug: 'goals', icon: 'fa-tasks', count: 0 },
        { id: 9, name: 'Random Thoughts / Rants', slug: 'rants', icon: 'fa-comment', count: 0 },
        { id: 10, name: 'Photography / Snapshots', slug: 'photography', icon: 'fa-camera', count: 1 }
      ]))
    );
  }

  setCategory(category: string) {
    this.selectedCategorySubject.next(category);
  }

  setSearchQuery(query: string) {
    this.searchQuerySubject.next(query);
  }

  // ===== LocalStorage Persistence Helpers =====
  private initLocalStorage() {
    // Always reset if version tag is outdated
    const stored = localStorage.getItem('kaizen_articles');
    const version = localStorage.getItem('kaizen_articles_version');
    if (!stored || version !== 'v3') {
      localStorage.removeItem('kaizen_articles');
      localStorage.setItem('kaizen_articles_version', 'v3');
    }

    if (!localStorage.getItem('kaizen_articles')) {
      const defaultArticles: Article[] = [
        // 1. Daily Life / Musings
        {
          id: 1,
          title: 'The Magic of Slow Mornings: How I Reclaimed My Day by Waking Up Differently',
          slug: 'slow-morning-ritual',
          excerpt: 'I used to wake up and immediately reach for my phone. Now I spend the first 30 minutes in silence — and it changed everything about how my day unfolds...',
          content: `For most of my adult life, I treated mornings as a launching pad — alarm, phone, emails, anxiety, go. It was efficient in a purely mechanical sense. But I was starting every single day already behind, already reactive.

So I made one change: no phone for the first 30 minutes.

## What Replaced the Scroll
I started making coffee slowly. Grinding the beans. Watching steam rise from the cup. Just... existing for a moment before the world demanded anything from me.

Some mornings I write three pages in a notebook — stream of consciousness, uncensored. Some mornings I just sit on the balcony and watch the street below. Pigeons. A woman walking her dog. A motorbike weaving through traffic.

## What Changed
After two months of this practice, I noticed I was calmer in difficult meetings. I wasn't carrying the accumulated tension of a hurried morning into my work. I was arriving at my desk with something rare: a sense of having already had a moment that was entirely mine.

## Try This Tomorrow
1. Put your phone in another room before bed
2. Keep a small notebook on your nightstand
3. Give yourself just 20 minutes of screen-free morning

You might be surprised how much clarity fits into that small window of quiet.`,
          category: 'Daily Life / Musings',
          cover_image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=80',
          read_time: '4 min read',
          views: 743,
          featured: true,
          author_name: 'Kaizen Creator',
          author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          tags: 'Lifestyle, Morning, Mindfulness',
          created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
          updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
          comments: [
            {
              id: 101,
              article_id: 1,
              author_name: 'Nadia K.',
              author_avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80',
              content: 'This resonated so deeply. I\'ve been doing the same for 3 weeks and it\'s genuinely transformative.',
              created_at: new Date().toISOString()
            }
          ]
        },
        // 2. Personal Growth
        {
          id: 2,
          title: 'The Kaizen Philosophy: Improving 1% Every Day for Compound Growth',
          slug: 'kaizen-philosophy-1-percent-growth',
          excerpt: 'The Japanese concept of Kaizen teaches us that tiny, continuous daily improvements compound into life-changing mastery over time...',
          content: `The word **改善 (Kaizen)** is formed by two Japanese kanji characters: *Kai (改)* meaning change, and *Zen (善)* meaning good or better. Combined, it translates to "continuous improvement for the better."

## Why the 1% Principle Works
If you get just 1% better each day for one year (365 days):

1.01 ^ 365 = 37.78x better

You end up **37 times better** than when you started! Conversely, if you decline by 1% each day, you\'ll be nearly at zero by year\'s end.

## 3 Practical Steps to Implement Kaizen Today
1. **Shrink the Micro-Habit**: Instead of committing to read for 60 minutes, start by reading 2 pages every evening.
2. **Remove Environmental Friction**: Keep your workspace clean and prepare your tools the night before.
3. **Evening Reflection**: Spend 5 minutes asking yourself: "What is one small thing I can refine tomorrow?"

## The Compound Effect in Real Life
James Clear\'s Atomic Habits describes this beautifully: systems beat goals. You don\'t rise to the level of your goals — you fall to the level of your systems. Kaizen is about building those systems, brick by brick, day by day.`,
          category: 'Personal Growth',
          cover_image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1000&q=80',
          read_time: '5 min read',
          views: 1980,
          featured: true,
          author_name: 'Kaizen Creator',
          author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          tags: 'Kaizen, Mindset, Habits',
          created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
          updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
          comments: []
        },
        // 3. Travel & Places
        {
          id: 3,
          title: 'Bali Ultimate Travel Guide 2026: Hidden Waterfalls & Mist-Shrouded Temples',
          slug: 'bali-travel-guide-2026',
          excerpt: 'Explore the lush natural wonders of Bali, from the iconic Tegallalang rice terraces to Mount Batur sunrise hikes and hidden jungle waterfalls...',
          content: `Bali is far more than just surf breaks and beach clubs! For travelers captivated by tranquility and verdant tropical wilderness, the Island of the Gods offers breathtaking jungle waterfalls, ancient spiritual heritage, and serene volcanic highlands.

## 1. Tegallalang Rice Terraces
Early morning just before sunrise is the absolute best time to visit Tegallalang. Soft rays of sunlight filtering through palm trees and gentle morning mist creating ethereal rays over the emerald terraced valley is a sight you will never forget.

## 2. Sekumpul Waterfall: The King of Bali Cascades
Tucked away in the northern highlands, Sekumpul is a twin waterfall plunging over 80 meters down sheer cliff faces shrouded in rainforest foliage. The trek down takes about 45 minutes through bamboo groves, but standing in the mist at the base is an unforgettable experience.

## 3. Mount Batur Sunrise Trek
Wake at 2:00 AM, reach the summit by 5:30 AM, and witness one of the most spectacular sunrises in Southeast Asia above a sea of clouds. The active volcano view is utterly otherworldly.

## Essential Travel Tips
* **Transportation**: Rent a scooter for local exploring or hire a private driver (approx. $35/day).
* **Best Season**: May to October (Dry season with clear blue skies and cooler mountain breeze).
* **Footwear**: Bring sturdy waterproof hiking shoes for river crossings.`,
          category: 'Travel & Places',
          cover_image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=80',
          read_time: '7 min read',
          views: 2420,
          featured: true,
          author_name: 'Kaizen Creator',
          author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          tags: 'Bali, Travel, Indonesia, Waterfall',
          created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
          updated_at: new Date(Date.now() - 86400000 * 5).toISOString(),
          comments: [
            {
              id: 102,
              article_id: 3,
              author_name: 'Alex Rivera',
              author_avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
              content: 'Stunning photos and super detailed guide! Adding Sekumpul waterfall to my Bali itinerary next month.',
              created_at: new Date().toISOString()
            }
          ]
        },
        // 4. Relationships
        {
          id: 4,
          title: 'Long-Distance Friendships: How to Keep Bonds Strong Across Time Zones',
          slug: 'long-distance-friendships-guide',
          excerpt: 'Moving across the world taught me which friendships were built to last — and exactly what habits keep them alive when geography separates you...',
          content: `When I moved from Bangkok to Berlin for work, I naively thought the friendships I had would simply... continue. Of course they didn\'t. Not without deliberate effort.

## The Brutal Truth About Distance
Most friendships are proximity-dependent. We see friends because they live nearby, work in the same building, frequent the same coffee shop. Remove that infrastructure and the friendship requires *active maintenance* — which most people are too busy or too comfortable to provide.

## What Actually Works

### 1. Scheduled, Non-Negotiable Calls
Treat them like work meetings. My closest friends and I have a standing video call every third Sunday at 8 PM Bangkok time. It\'s been running for two years. The consistency is everything.

### 2. Async Voice Messages
Instead of text, send a 2-minute voice note describing your week. It feels warm and personal in a way text cannot replicate.

### 3. Share the Small Things
Don\'t save up for "big updates." Send a photo of the interesting cloud you saw today. The tiny mundane moments are what intimacy is actually made of.

## Who Stays vs. Who Fades
The people who stay are the ones who are also willing to reach out — not just respond. If you\'re always the one initiating, that\'s important data.`,
          category: 'Relationships',
          cover_image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80',
          read_time: '5 min read',
          views: 612,
          featured: false,
          author_name: 'Kaizen Creator',
          author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          tags: 'Relationships, Friendship, Remote',
          created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
          updated_at: new Date(Date.now() - 86400000 * 7).toISOString(),
          comments: []
        },
        // 5. Health & Wellbeing
        {
          id: 5,
          title: 'Zone 2 Cardio: The Unsexy Workout Science Says is the Key to Longevity',
          slug: 'zone-2-cardio-longevity',
          excerpt: 'Elite endurance athletes spend 80% of their training at a deceptively low intensity. This is what Zone 2 training is and why everyone should be doing it...',
          content: `If you\'ve seen anyone running on a treadmill at a leisurely pace and wondered why they weren\'t pushing harder — they might actually be training smarter than the person sprinting next to them.

## What is Zone 2?
Zone 2 refers to an exercise intensity at approximately 60–70% of your maximum heart rate. At this intensity, you can hold a full conversation without gasping. It feels almost "too easy."

## Why it Matters (The Science)
At Zone 2 intensity, your body primarily burns fat for fuel and maximally stimulates mitochondrial biogenesis — the creation of new mitochondria in muscle cells. More mitochondria = more cellular energy capacity = better metabolic health, slower aging, lower disease risk.

Peter Attia, a physician focused on longevity, argues that VO2 max (closely tied to Zone 2 training) is the single best predictor of long-term health and all-cause mortality — better than smoking status, blood pressure, or cholesterol.

## How to Apply It
* **Duration**: 3–4 sessions per week, 45–60 minutes each
* **Intensity Check**: You should be able to say a full sentence comfortably
* **Options**: Brisk walking, cycling, swimming, rowing — any sustained aerobic activity
* **The Hard Part**: Resisting the urge to go harder. Zone 2 requires patience.`,
          category: 'Health & Wellbeing',
          cover_image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1000&q=80',
          read_time: '6 min read',
          views: 1890,
          featured: false,
          author_name: 'Kaizen Creator',
          author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          tags: 'Health, Fitness, Longevity',
          created_at: new Date(Date.now() - 86400000 * 9).toISOString(),
          updated_at: new Date(Date.now() - 86400000 * 9).toISOString(),
          comments: []
        },
        // 6. Work & Career
        {
          id: 6,
          title: 'Golang + Modern Frontend Architecture: Building High-Performance Web Apps',
          slug: 'golang-modern-frontend-architecture',
          excerpt: 'Exploring full-stack design patterns combining the raw execution speed of Go REST APIs with clean SPA frontends...',
          content: `The **Go (Golang)** programming language has emerged as a powerhouse for modern backend microservices and APIs due to its blinding execution speed, low memory footprint, and elegant concurrency primitives.

## System Architecture Breakdown
In the Kaizen application, we decouple responsibilities cleanly:
* **Frontend Layer**: An Angular Single Page Application (SPA) delivering instant, dynamic UI transitions without page reloads.
* **Backend Layer**: A compiled Go RESTful API handling business logic, database queries, and high-throughput JSON endpoints.

## Core Advantages of Golang Backends
1. **Minimal Memory Usage**: Uses a fraction of the RAM required by Node.js or Python runtime servers.
2. **Instant Binary Boot**: Compiles directly to native machine code for lightning-fast deployments.
3. **Built-in Concurrency**: Goroutines handle thousands of concurrent API requests effortlessly.

## The SPA Advantage
Angular\'s component-based architecture delivers smooth, page-reload-free navigation that feels native. Combined with Go\'s sub-millisecond API responses, the user experience is exceptional.`,
          category: 'Work & Career',
          cover_image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80',
          read_time: '8 min read',
          views: 2150,
          featured: true,
          author_name: 'Kaizen Creator',
          author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          tags: 'Golang, Angular, Architecture',
          created_at: new Date(Date.now() - 86400000 * 11).toISOString(),
          updated_at: new Date(Date.now() - 86400000 * 11).toISOString(),
          comments: []
        },
        // 7. Books & Learning
        {
          id: 7,
          title: '5 Books That Genuinely Changed How I Think (And Why)',
          slug: '5-books-that-changed-how-i-think',
          excerpt: 'Not a typical book list. These are the five books that left permanent marks on my mental models, decision-making, and the way I interpret the world...',
          content: `I\'ve read probably 150+ books in the last decade. Most were forgettable. But a handful genuinely rewired how I think. Here they are, with brutal honesty about what they actually changed.

## 1. Thinking, Fast and Slow — Daniel Kahneman
This book destroyed my confidence in my own intuitions — and that turned out to be a gift. Kahneman\'s research on cognitive biases revealed how systematically wrong human judgment is under uncertainty. I now approach every important decision by asking: "Which cognitive bias might be distorting this?"

## 2. Antifragile — Nassim Nicholas Taleb
The central insight: some systems get stronger under stress and volatility. The opposite of fragile isn\'t robust — it\'s antifragile. I restructured my career, finances, and training around this concept.

## 3. The Power of Now — Eckhart Tolle
I was deeply skeptical. I was wrong. Tolle\'s core idea — that most suffering is generated by mental time travel (ruminating on the past, anxious about the future) — is both obvious and transformative when truly understood.

## 4. Sapiens — Yuval Noah Harari
Zoomed out my entire worldview. Understanding how Homo sapiens built civilizations through shared fictions (money, nations, corporations, religions) made me simultaneously more humble and more clear-eyed about human systems.

## 5. Atomic Habits — James Clear
The most practically useful book I\'ve ever read. The four-step habit loop framework, the concept of identity-based habits, and the 1% improvement principle are things I use every single day.`,
          category: 'Books & Learning',
          cover_image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1000&q=80',
          read_time: '7 min read',
          views: 1340,
          featured: false,
          author_name: 'Kaizen Creator',
          author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          tags: 'Books, Reading, Learning',
          created_at: new Date(Date.now() - 86400000 * 13).toISOString(),
          updated_at: new Date(Date.now() - 86400000 * 13).toISOString(),
          comments: []
        },
        // 8. Goals & Projects
        {
          id: 8,
          title: 'Building My Personal Knowledge System: Tools, Workflows & Lessons from 2 Years',
          slug: 'personal-knowledge-system-2024',
          excerpt: 'After two years of experimenting with Obsidian, Notion, and physical notebooks, here is the system that actually stuck — and what I learned along the way...',
          content: `I\'ve been obsessed with Personal Knowledge Management (PKM) for two years. I\'ve tried Roam Research, Notion, Obsidian, Logseq, paper notebooks, index cards, and every hybrid imaginable.

Here\'s what I actually use now, and more importantly, *why*.

## The Core Problem with Most PKM Systems
They optimize for *capturing* information and completely fail at *retrieving* it when you actually need it. I had thousands of notes in Notion I never looked at again.

## My Current Stack

### Obsidian (Primary)
All long-form notes, permanent notes, and book summaries live here. The local markdown files mean I\'m never locked in. The graph view is beautiful and occasionally actually useful.

### A Physical Notebook (Daily)
I write every morning — a mix of tasks, rough thinking, and whatever\'s on my mind. The act of writing by hand engages the brain differently. I don\'t transfer everything to digital. Some notes exist only in the notebook.

### Readwise + Reader
Highlights from every book, article, and paper I read get synced here and then resurface via spaced repetition. This is the highest-leverage tool in my stack.

## The Most Important Lesson
A PKM system is only as good as your review process. Capture without review is just digital hoarding.`,
          category: 'Goals & Projects',
          cover_image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1000&q=80',
          read_time: '8 min read',
          views: 892,
          featured: false,
          author_name: 'Kaizen Creator',
          author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          tags: 'PKM, Obsidian, Productivity',
          created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
          updated_at: new Date(Date.now() - 86400000 * 15).toISOString(),
          comments: []
        },
        // 9. Random Thoughts / Rants
        {
          id: 9,
          title: 'Hot Take: Productivity Culture Has Become Its Own Form of Procrastination',
          slug: 'productivity-culture-procrastination',
          excerpt: 'We optimize our morning routines, stack our apps, build our systems, follow our gurus... and somehow never actually do the work. Here\'s my unpopular opinion...',
          content: `Okay, hot take incoming.

I\'ve spent thousands of hours consuming content about productivity. Books, podcasts, YouTube channels, Substack newsletters — the whole ecosystem. And I\'ve noticed something uncomfortable: *the consumption of productivity content is itself a form of sophisticated procrastination.*

## The Paradox
Reading about how to build a second brain feels productive. Watching a video about the perfect morning routine feels like investment. Setting up your Notion workspace for the fourth time feels like progress.

None of it is the actual work.

## The Algorithm Problem
Productivity content is algorithmically optimized for *engagement*, not for actually making you more productive. The creator who teaches you to do deep work in 30 minutes gets less watch time than the one who gives you a 47-step morning routine.

## What I\'ve Actually Found Useful
* **Less planning, more starting.** The only system that works is: open the document, start typing.
* **Boredom is underrated.** The impulse to pick up your phone when bored is the enemy of creative work.
* **One thing.** Cal Newport\'s "Deep Work" is correct. Do one important thing per day. The rest is noise.

## My Point
I\'m not anti-productivity. I\'m pro-*results*. And the results come from doing the thing, not from reading about doing the thing.`,
          category: 'Random Thoughts / Rants',
          cover_image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66936?auto=format&fit=crop&w=1000&q=80',
          read_time: '4 min read',
          views: 2810,
          featured: false,
          author_name: 'Kaizen Creator',
          author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          tags: 'Productivity, Opinion, Meta',
          created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
          updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
          comments: [
            {
              id: 103,
              article_id: 9,
              author_name: 'Mike T.',
              author_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80',
              content: 'This is the most self-aware productivity post I\'ve ever read. Following for more hot takes.',
              created_at: new Date().toISOString()
            }
          ]
        },
        // 10. Photography / Snapshots
        {
          id: 10,
          title: 'Natural Light Travel Photography: Capturing Depth, Texture, and Atmosphere',
          slug: 'natural-light-photography-guide',
          excerpt: 'Harness the power of Golden Hour and Blue Hour to transform everyday travel snapshots into magazine-worthy art...',
          content: `Light is the soul of photography. Whether you are using a flagship mirrorless camera or the smartphone in your pocket, mastering natural light transforms ordinary scenery into captivating visual stories.

## The Golden Hour
The 60 minutes after sunrise and before sunset bathe everything in a warm, directional light that flatters nearly every subject. Shadows are long and dramatic. Colors are rich and saturated. The light is *free* and it\'s breathtaking — but only if you\'re there for it.

## The Blue Hour
Less discussed but equally magical: the 20–30 minutes before sunrise and after sunset when the sky turns a deep, saturated blue and city lights begin to glow. This is the best time to photograph urban landscapes.

## Composition Principles
1. **Rule of Thirds**: Place your subject on the intersecting lines, not dead center.
2. **Leading Lines**: Roads, rivers, fences — use them to pull the viewer\'s eye into the frame.
3. **Foreground Interest**: A strong foreground element creates depth and three-dimensionality.
4. **Negative Space**: Sometimes what you leave out is more powerful than what you include.

## Gear Recommendation
For travel, the best camera is the one you have with you. A Sony A7C II for serious work, a phone with ProRAW mode for everything else. Post-processing in Lightroom Mobile is free and powerful.`,
          category: 'Photography / Snapshots',
          cover_image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=1000&q=80',
          read_time: '6 min read',
          views: 1120,
          featured: false,
          author_name: 'Kaizen Creator',
          author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          tags: 'Photography, GoldenHour, Travel',
          created_at: new Date(Date.now() - 86400000 * 18).toISOString(),
          updated_at: new Date(Date.now() - 86400000 * 18).toISOString(),
          comments: []
        }
      ];
      localStorage.setItem('kaizen_articles', JSON.stringify(defaultArticles));
    }
  }

  private getPersistedArticles(category: string, search: string): Article[] {
    const dataStr = localStorage.getItem('kaizen_articles') || '[]';
    const list: Article[] = JSON.parse(dataStr);
    return list.filter(a => {
      const matchCat = !category || a.category.toLowerCase() === category.toLowerCase();
      const matchSearch = !search || 
        a.title.toLowerCase().includes(search.toLowerCase()) || 
        a.excerpt.toLowerCase().includes(search.toLowerCase()) ||
        (a.tags && a.tags.toLowerCase().includes(search.toLowerCase()));
      return matchCat && matchSearch;
    });
  }

  private updatePersistedArticle(updated: Article) {
    const list = this.getPersistedArticles('', '');
    const idx = list.findIndex(a => a.id === updated.id);
    if (idx !== -1) {
      list[idx] = updated;
      localStorage.setItem('kaizen_articles', JSON.stringify(list));
      this.syncToCloud(list);
    }
  }

  private saveNewPersistedArticle(art: Article) {
    const list = this.getPersistedArticles('', '');
    list.unshift(art);
    localStorage.setItem('kaizen_articles', JSON.stringify(list));
    this.syncToCloud(list);
  }

  private addPersistedComment(articleId: number, comment: Comment) {
    const list = this.getPersistedArticles('', '');
    const idx = list.findIndex(a => a.id === articleId);
    if (idx !== -1) {
      const comments = list[idx].comments || [];
      comments.push(comment);
      list[idx].comments = comments;
      localStorage.setItem('kaizen_articles', JSON.stringify(list));
      this.syncToCloud(list);
    }
  }
}
