package database

import (
	"fmt"
	"log"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"kaizen-backend/models"
)

var (
	DB           *gorm.DB
	DBArticles   []models.Article
	DBAuthor     models.AuthorProfile
	DBCategories []models.Category
)

func InitDB() {
	// Connection string with new user credentials for CockroachDB Cloud
	dsn := "postgresql://cenbu20_gmail_com:45Ujo09vCW-YCOj8isvG8A@kaizen-18261.jxf.gcp-asia-southeast1.cockroachlabs.cloud:26257/defaultdb?sslmode=require"
	
	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to CockroachDB: %v", err)
	}

	fmt.Println("✅ Successfully connected to CockroachDB Cloud!")

	// Migrate schemas automatically
	err = DB.AutoMigrate(&models.Article{}, &models.Comment{}, &models.Category{}, &models.AuthorProfile{})
	if err != nil {
		log.Fatalf("Failed to auto-migrate schemas: %v", err)
	}

	// Seed / Load Author Profile
	var authorCount int64
	DB.Model(&models.AuthorProfile{}).Count(&authorCount)
	if authorCount == 0 {
		DBAuthor = models.AuthorProfile{
			ID:               1,
			Name:             "Kaizen Explorer & Architect",
			Title:            "World Traveler & Software Engineer",
			Bio:              "Welcome to Kaizen — a personal blog and knowledge hub documenting world travels, modern engineering, photography, and the philosophy of continuous self-improvement every day.",
			Avatar:           "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
			CoverImage:       "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80",
			ArticlesCount:    3,
			CountriesVisited: 38,
			PhotosTaken:      14500,
			Location:         "Bangkok & Global",
			Instagram:        "https://instagram.com",
			Youtube:          "https://youtube.com",
			Facebook:         "https://facebook.com",
			Github:           "https://github.com",
		}
		DB.Create(&DBAuthor)
	} else {
		DB.First(&DBAuthor)
	}

	// Seed / Load Categories
	var catCount int64
	DB.Model(&models.Category{}).Count(&catCount)
	if catCount == 0 {
		DBCategories = []models.Category{
			{ID: 1, Name: "Daily Life / Musings", Slug: "daily-life", Icon: "pencil", Count: 1},
			{ID: 2, Name: "Personal Growth", Slug: "growth", Icon: "heart", Count: 1},
			{ID: 3, Name: "Travel & Places", Slug: "travel", Icon: "plane", Count: 1},
			{ID: 4, Name: "Relationships", Slug: "relationships", Icon: "users", Count: 0},
			{ID: 5, Name: "Health & Wellbeing", Slug: "health", Icon: "heartbeat", Count: 0},
			{ID: 6, Name: "Work & Career", Slug: "work", Icon: "briefcase", Count: 1},
			{ID: 7, Name: "Books & Learning", Slug: "books", Icon: "book", Count: 0},
			{ID: 8, Name: "Goals & Projects", Slug: "goals", Icon: "tasks", Count: 0},
			{ID: 9, Name: "Random Thoughts / Rants", Slug: "rants", Icon: "comment", Count: 0},
			{ID: 10, Name: "Photography / Snapshots", Slug: "photography", Icon: "camera", Count: 1},
		}
		DB.Create(&DBCategories)
	} else {
		DB.Find(&DBCategories)
	}

	// Seed Articles if empty
	var artCount int64
	DB.Model(&models.Article{}).Count(&artCount)
	if artCount == 0 {
		seedArticles := []models.Article{
			{
				Title:        "Bali Ultimate Travel Guide 2026: Hidden Waterfalls & Mist-Shrouded Temples",
				Slug:         "bali-travel-guide-2026",
				Excerpt:      "Explore the lush natural wonders of Bali, from the iconic Tegallalang rice terraces to Mount Batur sunrise hikes and secret jungle cascades...",
				Category:     "Travel & Places",
				CoverImage:   "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=80",
				ReadTime:     "7 min read",
				Views:        1420,
				Featured:     true,
				AuthorName:   "Kaizen Creator",
				AuthorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
				Tags:         "Bali, Travel, Indonesia, Waterfalls, Adventure",
				CreatedAt:    time.Now().AddDate(0, 0, -5),
				UpdatedAt:    time.Now().AddDate(0, 0, -5),
				Content: `Bali is far more than just surf breaks and beach clubs! For travelers captivated by tranquility and verdant tropical wilderness, the Island of the Gods offers breathtaking jungle waterfalls, ancient spiritual heritage, and serene volcanic highlands.

## 1. Tegallalang Rice Terraces
Early morning just before sunrise is the absolute best time to visit Tegallalang. Soft rays of sunlight filtering through palm trees and gentle morning mist creating ethereal rays over the emerald terraced valley is a sight you will never forget.

## 2. Sekumpul Waterfall: The King of Bali Cascades
Tucked away in the northern highlands, Sekumpul is a twin waterfall plunging over 80 meters down sheer cliff faces shrouded in rainforest foliage. The trek down takes about 45 minutes through bamboo groves, but standing in the mist at the base is an unforgettable experience.

## Essential Travel Tips
* **Transportation**: Rent a scooter for local exploring or hire a private driver (approx. $35/day).
* **Best Season**: May to October (Dry season with clear blue skies and cooler mountain breeze).
* **Footwear**: Bring sturdy waterproof hiking shoes for river crossings.`,
				Comments: []models.Comment{
					{
						AuthorName:   "Alex Rivera",
						AuthorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80",
						Content:      "Stunning photos and super detailed guide! Adding Sekumpul waterfall to my Bali itinerary next month.",
						CreatedAt:    time.Now().AddDate(0, 0, -3),
					},
				},
			},
			{
				Title:        "The Kaizen Philosophy: Improving 1% Every Day for Compound Growth",
				Slug:         "kaizen-philosophy-1-percent-growth",
				Excerpt:      "The Japanese concept of Kaizen teaches us that tiny, continuous daily improvements compound into life-changing mastery over time...",
				Category:     "Personal Growth",
				CoverImage:   "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1000&q=80",
				ReadTime:     "5 min read",
				Views:        980,
				Featured:     true,
				AuthorName:   "Kaizen Creator",
				AuthorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
				Tags:         "Kaizen, Productivity, Mindset, Growth, Philosophy",
				CreatedAt:    time.Now().AddDate(0, 0, -10),
				UpdatedAt:    time.Now().AddDate(0, 0, -10),
				Content: `The word **改善 (Kaizen)** is formed by two Japanese kanji characters: *Kai (改)* meaning change, and *Zen (善)* meaning good or better. Combined, it translates to "continuous improvement for the better."

## Why the 1% Principle Works
If you get 1% better each day for one year (365 days):
$$(1 + 0.01)^{365} = 37.78$$

You end up **37 times better** than when you started! Conversely, if you decline by 1% each day:
$$(1 - 0.01)^{365} = 0.03$$

## 3 Practical Steps to Implement Kaizen Today
1. **Shrink the Micro-Habit**: Instead of committing to read for 60 minutes, start by reading 2 pages every evening.
2. **Remove Environmental Friction**: Keep your workspace clean and prepare your tools the night before.
3. **Evening Reflection**: Spend 5 minutes asking yourself: "What is one small thing I can refine tomorrow?"`,
			},
			{
				Title:        "Golang + Modern Frontend Architecture: Building High-Performance Web Apps",
				Slug:         "golang-modern-frontend-architecture",
				Excerpt:      "Exploring full-stack design patterns combining the raw execution speed of Go REST APIs with clean SPA frontends...",
				Category:     "Work & Career",
				CoverImage:   "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80",
				ReadTime:     "8 min read",
				Views:        2150,
				Featured:     true,
				AuthorName:   "Kaizen Creator",
				AuthorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
				Tags:         "Golang, Angular, Architecture, WebDev, Software",
				CreatedAt:    time.Now().AddDate(0, 0, -15),
				UpdatedAt:    time.Now().AddDate(0, 0, -15),
				Content: `The **Go (Golang)** programming language has emerged as a powerhouse for modern backend microservices and APIs due to its blinding execution speed, low memory footprint, and elegant concurrency primitives.

## System Architecture Breakdown
In the Kaizen application, we decouple responsibilities cleanly:
* **Frontend Layer**: An Angular Single Page Application (SPA) delivering instant, dynamic UI transitions without page reloads.
* **Backend Layer**: A compiled Go RESTful API handling business logic, database queries, and high-throughput JSON endpoints.

## Core Advantages of Golang Backends
1. **Minimal Memory Usage**: Uses a fraction of the RAM required by Node.js or Python runtime servers.
2. **Instant Binary Boot**: Compiles directly to native machine code for lightning-fast deployments.
3. **Built-in Concurrency**: Goroutines handle thousands of concurrent API requests effortlessly.`,
			},
		}
		DB.Create(&seedArticles)
	}

	// Fetch cached items
	DB.Find(&DBArticles)
}

func GetAllArticles(category string, search string) []models.Article {
	var articles []models.Article
	query := DB.Preload("Comments").Order("created_at desc")

	if category != "" {
		query = query.Where("category = ?", category)
	}

	if search != "" {
		likePattern := "%" + search + "%"
		query = query.Where("title ILIKE ? OR excerpt ILIKE ? OR content ILIKE ? OR tags ILIKE ?", likePattern, likePattern, likePattern, likePattern)
	}

	query.Find(&articles)
	DBArticles = articles // update cache
	return articles
}

func GetArticleBySlug(slug string) (models.Article, bool) {
	var article models.Article
	result := DB.Preload("Comments").Where("slug = ?", slug).First(&article)
	if result.Error != nil {
		return models.Article{}, false
	}

	// Increment views
	DB.Model(&article).Update("views", article.Views+1)
	
	// Reload to get updated view count
	DB.Preload("Comments").First(&article, article.ID)
	return article, true
}

func CreateArticle(art models.Article) models.Article {
	if art.AuthorName == "" {
		art.AuthorName = DBAuthor.Name
	}
	if art.AuthorAvatar == "" {
		art.AuthorAvatar = DBAuthor.Avatar
	}
	if art.ReadTime == "" {
		art.ReadTime = "5 min read"
	}
	if art.CoverImage == "" {
		art.CoverImage = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1000&q=80"
	}
	
	// Create Slug
	var run []rune
	for _, r := range toLower(art.Title) {
		if (r >= 'a' && r <= 'z') || (r >= '0' && r <= '9') {
			run = append(run, r)
		} else if r == ' ' || r == '-' {
			run = append(run, '-')
		}
	}
	art.Slug = string(run)

	DB.Create(&art)

	// Update cached articles list
	DB.Find(&DBArticles)

	// Update author profile stats count
	var totalArticles int64
	DB.Model(&models.Article{}).Count(&totalArticles)
	DB.Model(&DBAuthor).Update("articles_count", int(totalArticles))
	DB.First(&DBAuthor) // Reload cache

	return art
}

func AddComment(articleID uint, comment models.Comment) (models.Comment, bool) {
	var article models.Article
	if err := DB.First(&article, articleID).Error; err != nil {
		return models.Comment{}, false
	}

	comment.ArticleID = articleID
	comment.CreatedAt = time.Now()
	if comment.AuthorAvatar == "" {
		comment.AuthorAvatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"
	}

	DB.Create(&comment)

	// Reload cache
	DB.Find(&DBArticles)

	return comment, true
}

func toLower(s string) string {
	b := []byte(s)
	for i, c := range b {
		if c >= 'A' && c <= 'Z' {
			b[i] = c + ('a' - 'A')
		}
	}
	return string(b)
}
