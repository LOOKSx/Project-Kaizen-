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
      setInterval(() => this.syncFromCloud(), 5000);
    }
  }

  syncFromCloud() {
    if (typeof localStorage === 'undefined') return;
    this.http.get<any>(`${this.syncApiUrl}?t=${Date.now()}`).pipe(
      catchError(() => of(null))
    ).subscribe(res => {
      if (res && res.success) {
        if (res.articles && Array.isArray(res.articles)) {
          const current = localStorage.getItem('kaizen_articles');
          const newStr = JSON.stringify(res.articles);
          if (current !== newStr) {
            localStorage.setItem('kaizen_articles', newStr);
            window.dispatchEvent(new CustomEvent('kaizen:articles-synced'));
          }
        }

        if (res.settings && Object.keys(res.settings).length > 0) {
          const lastModified = parseInt(localStorage.getItem('kaizen_settings_last_modified') || '0', 10);
          if (!lastModified || (res.timestamp && res.timestamp >= lastModified - 1000)) {
            const currentSetts = localStorage.getItem('kaizen_site_settings');
            const newSettsStr = JSON.stringify(res.settings);
            if (currentSetts !== newSettsStr) {
              localStorage.setItem('kaizen_site_settings', newSettsStr);
              window.dispatchEvent(new CustomEvent('kaizen:settings-synced'));
            }
          }
        }
      }
    });
  }

  syncToCloud(articles?: Article[], settings?: any) {
    if (typeof localStorage !== 'undefined' && settings) {
      localStorage.setItem('kaizen_settings_last_modified', Date.now().toString());
    }
    const list = articles !== undefined ? articles : this.getPersistedArticles('', '');
    let setts = settings;
    if (!setts && typeof localStorage !== 'undefined') {
      try {
        const saved = localStorage.getItem('kaizen_site_settings');
        if (saved) setts = JSON.parse(saved);
      } catch (e) {}
    }
    this.http.post<any>(this.syncApiUrl, { articles: list, settings: setts }).pipe(
      catchError(() => of(null))
    ).subscribe(res => {
      if (res && res.success) {
        if (res.timestamp && typeof localStorage !== 'undefined') {
          localStorage.setItem('kaizen_settings_last_modified', res.timestamp.toString());
        }
        window.dispatchEvent(new CustomEvent('kaizen:articles-synced'));
        window.dispatchEvent(new CustomEvent('kaizen:settings-synced'));
      }
    });
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
          likes: 0,
          liked: false,
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
    this.syncToCloud(list);
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
    if (typeof localStorage === 'undefined') return;
    const stored = localStorage.getItem('kaizen_articles');
    const initialized = localStorage.getItem('kaizen_articles_initialized');

    if (stored === null && !initialized) {
      const masterArticles: Article[] = [
        {
          id: 4,
          title: 'Serengeti Safari Diary: Witnessing the Great Wildlife Migration at Dawn',
          slug: 'serengeti-safari-diary',
          excerpt: 'Millions of wildebeest and zebras crossing golden savannah rivers under endless East African skies...',
          content: 'The Serengeti ecosystem in Tanzania hosts the greatest wildlife spectacle on Earth. Witnessing vast herds moving across golden grasslands in rhythmic harmony while apex predators track their movement is raw nature at its finest.',
          category: 'Travel & Places',
          country: 'Tanzania',
          cover_image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1000&q=80',
          read_time: '7 min read',
          views: 654,
          likes: 53,
          featured: true,
          author_name: 'Kaizen Creator',
          author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          tags: 'Serengeti, Africa, Safari, Travel',
          created_at: '2026-07-16T10:00:00.000Z',
          updated_at: '2026-07-16T10:00:00.000Z',
          comments: []
        },
        {
          id: 5,
          title: 'Long-Distance Friendships: How to Keep Bonds Strong Across Time Zones',
          slug: 'long-distance-friendships',
          excerpt: 'Moving across the world taught me which friendships were built to last — and exactly what habits keep them flourishing...',
          content: 'When you move continents, your social circle undergoes an involuntary filter. The casual coffee friends fade away. But the deep friendships require deliberate maintenance across time differences.',
          category: 'Relationships',
          cover_image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80',
          read_time: '5 min read',
          views: 410,
          likes: 24,
          featured: false,
          author_name: 'Kaizen Creator',
          author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          tags: 'Relationships, Friendship, Connection',
          created_at: '2026-07-17T10:00:00.000Z',
          updated_at: '2026-07-17T10:00:00.000Z',
          comments: []
        },
        {
          id: 6,
          title: 'Zone 2 Cardio: The Unsexy Workout Science Says is the Key to Longevity',
          slug: 'zone-2-cardio-longevity',
          excerpt: 'Elite endurance athletes spend 80% of their training at a deceptively low intensity. Here is why your heart and mitochondria need it...',
          content: 'We live in a culture obsessed with HIIT and sweat. But cellular biology tells a different story: metabolic health and mitochondrial density are built in Zone 2 — conversational pace endurance.',
          category: 'Health & Wellbeing',
          cover_image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1000&q=80',
          read_time: '6 min read',
          views: 523,
          likes: 45,
          featured: false,
          author_name: 'Kaizen Creator',
          author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          tags: 'Health, Exercise, Longevity, Science',
          created_at: '2026-07-15T10:00:00.000Z',
          updated_at: '2026-07-15T10:00:00.000Z',
          comments: []
        },
        {
          id: 7,
          title: 'Golang + Modern Frontend Architecture: Building High-Performance Web Apps',
          slug: 'golang-modern-frontend-architecture',
          excerpt: 'Exploring full-stack design patterns combining the raw execution speed of Go REST APIs with clean SPA frontends...',
          content: 'Building web software that feels instant requires rethinking data fetching, serverless functions, and client state caching.',
          category: 'Work & Career',
          cover_image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80',
          read_time: '7 min read',
          views: 940,
          likes: 76,
          featured: false,
          author_name: 'Kaizen Creator',
          author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          tags: 'Work, Golang, Angular, Architecture',
          created_at: '2026-07-13T10:00:00.000Z',
          updated_at: '2026-07-13T10:00:00.000Z',
          comments: []
        }
      ];
      localStorage.setItem('kaizen_articles', JSON.stringify(masterArticles));
      localStorage.setItem('kaizen_articles_initialized', 'true');
    }
  }

  public getPersistedArticles(category: string = '', search: string = ''): Article[] {
    const dataStr = typeof localStorage !== 'undefined' ? localStorage.getItem('kaizen_articles') : null;
    let list: Article[] = [];
    try {
      if (dataStr) list = JSON.parse(dataStr);
    } catch (e) {}

    return list.filter(a => {
      const matchCat = !category || a.category.toLowerCase() === category.toLowerCase();
      const matchSearch = !search || 
        a.title.toLowerCase().includes(search.toLowerCase()) || 
        a.excerpt.toLowerCase().includes(search.toLowerCase()) ||
        (a.tags && a.tags.toLowerCase().includes(search.toLowerCase()));
      return matchCat && matchSearch;
    });
  }

  updatePersistedArticle(updated: Article) {
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
