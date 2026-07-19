import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
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

  constructor(private http: HttpClient) {
    this.initLocalStorage();
  }

  getArticles(category: string = '', search: string = ''): Observable<Article[]> {
    let url = `${this.apiUrl}/articles?category=${encodeURIComponent(category)}&search=${encodeURIComponent(search)}`;
    return this.http.get<any>(url).pipe(
      map(res => res.data || []),
      catchError(() => of(this.getPersistedArticles(category, search)))
    );
  }

  getArticleBySlug(slug: string): Observable<Article | null> {
    return this.http.get<any>(`${this.apiUrl}/articles/${slug}`).pipe(
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
        { id: 1, name: 'Travel & Adventure', slug: 'travel', icon: 'fa-plane', count: 5 },
        { id: 2, name: 'Technology & Code', slug: 'tech', icon: 'fa-code', count: 3 },
        { id: 3, name: 'Lifestyle & Kaizen', slug: 'lifestyle', icon: 'fa-heart', count: 2 },
        { id: 4, name: 'Photography', slug: 'photography', icon: 'fa-camera', count: 2 }
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
    if (!localStorage.getItem('kaizen_articles')) {
      const defaultArticles: Article[] = [
        {
          id: 1,
          title: 'Bali Ultimate Travel Guide 2026: Hidden Waterfalls & Mist-Shrouded Temples',
          slug: 'bali-travel-guide-2026',
          excerpt: 'Explore the lush natural wonders of Bali, from the iconic Tegallalang rice terraces to Mount Batur sunrise hikes...',
          content: `Bali is far more than just surf breaks and beach clubs! For travelers captivated by tranquility and verdant tropical wilderness, the Island of the Gods offers breathtaking jungle waterfalls, ancient spiritual heritage, and serene volcanic highlands.

## 1. Tegallalang Rice Terraces
Early morning just before sunrise is the absolute best time to visit Tegallalang. Soft rays of sunlight filtering through palm trees and gentle morning mist creating ethereal rays over the emerald terraced valley is a sight you will never forget.

## 2. Sekumpul Waterfall: The King of Bali Cascades
Tucked away in the northern highlands, Sekumpul is a twin waterfall plunging over 80 meters down sheer cliff faces shrouded in rainforest foliage. The trek down takes about 45 minutes through bamboo groves, but standing in the mist at the base is an unforgettable experience.

## Essential Travel Tips
* **Transportation**: Rent a scooter for local exploring or hire a private driver (approx. $35/day).
* **Best Season**: May to October (Dry season with clear blue skies and cooler mountain breeze).
* **Footwear**: Bring sturdy waterproof hiking shoes for river crossings.`,
          category: 'Travel & Adventure',
          cover_image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=80',
          read_time: '7 min read',
          views: 1420,
          featured: true,
          author_name: 'Kaizen Creator',
          author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          tags: 'Bali, Travel, Indonesia',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          comments: [
            {
              id: 1,
              article_id: 1,
              author_name: 'Alex Rivera',
              author_avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
              content: 'Stunning photos and super detailed guide! Adding Sekumpul waterfall to my Bali itinerary next month.',
              created_at: new Date().toISOString()
            }
          ]
        },
        {
          id: 2,
          title: 'The Kaizen Philosophy: Improving 1% Every Day for Compound Growth',
          slug: 'kaizen-philosophy-1-percent-growth',
          excerpt: 'The Japanese concept of Kaizen teaches us that tiny, continuous daily improvements compound into life-changing mastery over time...',
          content: `The word **改善 (Kaizen)** is formed by two Japanese kanji characters: *Kai (改)* meaning change, and *Zen (善)* meaning good or better. Combined, it translates to "continuous improvement for the better."

## Why the 1% Principle Works
If you get 1% better each day for one year (365 days):
$$(1 + 0.01)^{365} = 37.78$$

You end up **37 times better** than when you started! Conversely, if you decline by 1% each day:
$$(1 - 0.01)^{365} = 0.03$$

## 3 Practical Steps to Implement Kaizen Today
1. **Shrink the Micro-Habit**: Instead of committing to read for 60 minutes, start by reading 2 pages every evening.
2. **Remove Environmental Friction**: Keep your workspace clean and prepare your tools the night before.
3. **Evening Reflection**: Spend 5 minutes asking yourself: "What is one small thing I can refine tomorrow?"`,
          category: 'Lifestyle & Kaizen',
          cover_image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1000&q=80',
          read_time: '5 min read',
          views: 980,
          featured: true,
          author_name: 'Kaizen Creator',
          author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          tags: 'Kaizen, Mindset',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          comments: []
        },
        {
          id: 3,
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
3. **Built-in Concurrency**: Goroutines handle thousands of concurrent API requests effortlessly.`,
          category: 'Technology & Code',
          cover_image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80',
          read_time: '8 min read',
          views: 2150,
          featured: true,
          author_name: 'Kaizen Creator',
          author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          tags: 'Golang, Angular, Architecture',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          comments: []
        },
        {
          id: 4,
          title: 'Natural Light Travel Photography: Capturing Depth, Texture, and Atmosphere',
          slug: 'natural-light-photography-guide',
          excerpt: 'Harness the power of Golden Hour and Blue Hour to transform everyday travel snapshots into magazine-worthy art...',
          content: `Light is the soul of photography. Whether you are using a flagship mirrorless camera or the smartphone in your pocket, mastering natural light transforms ordinary scenery into captivating visual stories.`,
          category: 'Photography',
          cover_image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=1000&q=80',
          read_time: '6 min read',
          views: 1120,
          featured: false,
          author_name: 'Kaizen Creator',
          author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          tags: 'Photography, GoldenHour',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
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
    }
  }

  private saveNewPersistedArticle(art: Article) {
    const list = this.getPersistedArticles('', '');
    list.unshift(art);
    localStorage.setItem('kaizen_articles', JSON.stringify(list));
  }

  private addPersistedComment(articleId: number, comment: Comment) {
    const list = this.getPersistedArticles('', '');
    const idx = list.findIndex(a => a.id === articleId);
    if (idx !== -1) {
      if (!list[idx].comments) list[idx].comments = [];
      list[idx].comments.push(comment);
      localStorage.setItem('kaizen_articles', JSON.stringify(list));
    }
  }
}
