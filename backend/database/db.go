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

const seedVersion = "v4" // bump this to force reseed

func InitDB() {
	dsn := "postgresql://cenbu20_gmail_com:45Ujo09vCW-YCOj8isvG8A@kaizen-18261.jxf.gcp-asia-southeast1.cockroachlabs.cloud:26257/defaultdb?sslmode=require"

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to CockroachDB: %v", err)
	}

	fmt.Println("✅ Successfully connected to CockroachDB Cloud!")

	// Migrate schemas
	err = DB.AutoMigrate(&models.Article{}, &models.Comment{}, &models.Category{}, &models.AuthorProfile{}, &models.SeedVersion{})
	if err != nil {
		log.Fatalf("Failed to auto-migrate schemas: %v", err)
	}

	// Check seed version
	var sv models.SeedVersion
	needReseed := false
	if DB.First(&sv).Error != nil || sv.Version != seedVersion {
		needReseed = true
		DB.Where("1 = 1").Delete(&models.SeedVersion{})
		DB.Create(&models.SeedVersion{Version: seedVersion})
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
			ArticlesCount:    10,
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

	// Seed Categories
	var catCount int64
	DB.Model(&models.Category{}).Count(&catCount)
	if catCount == 0 || needReseed {
		DB.Where("1 = 1").Delete(&models.Category{})
		DBCategories = []models.Category{
			{ID: 1, Name: "Daily Life / Musings", Slug: "daily-life", Icon: "pencil", Count: 1},
			{ID: 2, Name: "Personal Growth", Slug: "growth", Icon: "heart", Count: 1},
			{ID: 3, Name: "Travel & Places", Slug: "travel", Icon: "plane", Count: 1},
			{ID: 4, Name: "Relationships", Slug: "relationships", Icon: "users", Count: 1},
			{ID: 5, Name: "Health & Wellbeing", Slug: "health", Icon: "heartbeat", Count: 1},
			{ID: 6, Name: "Work & Career", Slug: "work", Icon: "briefcase", Count: 1},
			{ID: 7, Name: "Books & Learning", Slug: "books", Icon: "book", Count: 1},
			{ID: 8, Name: "Goals & Projects", Slug: "goals", Icon: "tasks", Count: 1},
			{ID: 9, Name: "Random Thoughts / Rants", Slug: "rants", Icon: "comment", Count: 1},
			{ID: 10, Name: "Photography / Snapshots", Slug: "photography", Icon: "camera", Count: 1},
		}
		DB.Create(&DBCategories)
	} else {
		DB.Find(&DBCategories)
	}

	// Seed Articles
	var artCount int64
	DB.Model(&models.Article{}).Count(&artCount)
	if artCount == 0 || needReseed {
		// Drop and reseed
		DB.Where("1 = 1").Delete(&models.Comment{})
		DB.Where("1 = 1").Delete(&models.Article{})

		seedArticles := []models.Article{
			// 1. Daily Life / Musings
			{
				Title:        "The Magic of Slow Mornings: How I Reclaimed My Day",
				Slug:         "the-magic-of-slow-mornings",
				Excerpt:      "I used to wake up and immediately reach for my phone. Now I spend the first 30 minutes in silence — and it changed everything about how my day unfolds.",
				Category:     "Daily Life / Musings",
				CoverImage:   "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=80",
				ReadTime:     "4 min read",
				Views:        743,
				Featured:     true,
				AuthorName:   "Kaizen Creator",
				AuthorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
				Tags:         "Lifestyle, Morning, Mindfulness, Daily",
				CreatedAt:    time.Now().AddDate(0, 0, -1),
				UpdatedAt:    time.Now().AddDate(0, 0, -1),
				Content: `For most of my adult life, I treated mornings as a launching pad — alarm, phone, emails, anxiety, go. It was efficient in a purely mechanical sense. But I was starting every single day already behind, already reactive.

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
				Comments: []models.Comment{
					{
						AuthorName:   "Nadia K.",
						AuthorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80",
						Content:      "This resonated so deeply. I've been doing the same for 3 weeks and it's genuinely transformative.",
						CreatedAt:    time.Now().AddDate(0, 0, -1),
					},
				},
			},
			// 2. Personal Growth
			{
				Title:        "The Kaizen Philosophy: Improving 1% Every Day for Compound Growth",
				Slug:         "kaizen-philosophy-1-percent-growth",
				Excerpt:      "The Japanese concept of Kaizen teaches us that tiny, continuous daily improvements compound into life-changing mastery over time.",
				Category:     "Personal Growth",
				CoverImage:   "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1000&q=80",
				ReadTime:     "5 min read",
				Views:        1980,
				Featured:     true,
				AuthorName:   "Kaizen Creator",
				AuthorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
				Tags:         "Kaizen, Mindset, Habits, Growth, Philosophy",
				CreatedAt:    time.Now().AddDate(0, 0, -3),
				UpdatedAt:    time.Now().AddDate(0, 0, -3),
				Content: `The word 改善 (Kaizen) is formed by two Japanese kanji characters: Kai (改) meaning change, and Zen (善) meaning good or better. Combined, it translates to "continuous improvement for the better."

## Why the 1% Principle Works
If you get just 1% better each day for one year (365 days), you end up 37 times better than when you started. Conversely, if you decline by 1% each day, you'll be nearly at zero by year's end.

## 3 Practical Steps to Implement Kaizen Today
1. **Shrink the Micro-Habit**: Instead of committing to read for 60 minutes, start by reading 2 pages every evening.
2. **Remove Environmental Friction**: Keep your workspace clean and prepare your tools the night before.
3. **Evening Reflection**: Spend 5 minutes asking yourself: "What is one small thing I can refine tomorrow?"

## The Compound Effect in Real Life
James Clear's Atomic Habits describes this beautifully: systems beat goals. You don't rise to the level of your goals — you fall to the level of your systems. Kaizen is about building those systems, brick by brick, day by day.`,
			},
			// 3. Travel & Places
			{
				Title:        "Bali Ultimate Travel Guide 2026: Hidden Waterfalls & Mist-Shrouded Temples",
				Slug:         "bali-travel-guide-2026",
				Excerpt:      "Explore the lush natural wonders of Bali, from the iconic Tegallalang rice terraces to Mount Batur sunrise hikes and secret jungle cascades.",
				Category:     "Travel & Places",
				CoverImage:   "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=80",
				ReadTime:     "7 min read",
				Views:        2420,
				Featured:     true,
				AuthorName:   "Kaizen Creator",
				AuthorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
				Tags:         "Bali, Travel, Indonesia, Waterfall, Adventure",
				CreatedAt:    time.Now().AddDate(0, 0, -5),
				UpdatedAt:    time.Now().AddDate(0, 0, -5),
				Content: `Bali is far more than just surf breaks and beach clubs! For travelers captivated by tranquility and verdant tropical wilderness, the Island of the Gods offers breathtaking jungle waterfalls, ancient spiritual heritage, and serene volcanic highlands.

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
				Comments: []models.Comment{
					{
						AuthorName:   "Alex Rivera",
						AuthorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80",
						Content:      "Stunning photos and super detailed guide! Adding Sekumpul waterfall to my Bali itinerary next month.",
						CreatedAt:    time.Now().AddDate(0, 0, -3),
					},
				},
			},
			// 4. Relationships
			{
				Title:        "Long-Distance Friendships: How to Keep Bonds Strong Across Time Zones",
				Slug:         "long-distance-friendships-guide",
				Excerpt:      "Moving across the world taught me which friendships were built to last — and exactly what habits keep them alive when geography separates you.",
				Category:     "Relationships",
				CoverImage:   "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80",
				ReadTime:     "5 min read",
				Views:        612,
				Featured:     false,
				AuthorName:   "Kaizen Creator",
				AuthorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
				Tags:         "Relationships, Friendship, Remote, Connection",
				CreatedAt:    time.Now().AddDate(0, 0, -7),
				UpdatedAt:    time.Now().AddDate(0, 0, -7),
				Content: `When I moved from Bangkok to Berlin for work, I naively thought the friendships I had would simply... continue. Of course they didn't. Not without deliberate effort.

## The Brutal Truth About Distance
Most friendships are proximity-dependent. We see friends because they live nearby, work in the same building, frequent the same coffee shop. Remove that infrastructure and the friendship requires active maintenance — which most people are too busy or too comfortable to provide.

## What Actually Works

### 1. Scheduled, Non-Negotiable Calls
Treat them like work meetings. My closest friends and I have a standing video call every third Sunday at 8 PM Bangkok time. It's been running for two years. The consistency is everything.

### 2. Async Voice Messages
Instead of text, send a 2-minute voice note describing your week. It feels warm and personal in a way text cannot replicate.

### 3. Share the Small Things
Don't save up for "big updates." Send a photo of the interesting cloud you saw today. The tiny mundane moments are what intimacy is actually made of.

## Who Stays vs. Who Fades
The people who stay are the ones who are also willing to reach out — not just respond. If you're always the one initiating, that's important data.`,
			},
			// 5. Health & Wellbeing
			{
				Title:        "Zone 2 Cardio: The Unsexy Workout Science Says is the Key to Longevity",
				Slug:         "zone-2-cardio-longevity",
				Excerpt:      "Elite endurance athletes spend 80% of their training at a deceptively low intensity. This is what Zone 2 training is and why everyone should be doing it.",
				Category:     "Health & Wellbeing",
				CoverImage:   "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1000&q=80",
				ReadTime:     "6 min read",
				Views:        1890,
				Featured:     false,
				AuthorName:   "Kaizen Creator",
				AuthorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
				Tags:         "Health, Fitness, Longevity, Cardio, Exercise",
				CreatedAt:    time.Now().AddDate(0, 0, -9),
				UpdatedAt:    time.Now().AddDate(0, 0, -9),
				Content: `If you've seen anyone running on a treadmill at a leisurely pace and wondered why they weren't pushing harder — they might actually be training smarter than the person sprinting next to them.

## What is Zone 2?
Zone 2 refers to an exercise intensity at approximately 60-70% of your maximum heart rate. At this intensity, you can hold a full conversation without gasping. It feels almost "too easy."

## Why it Matters (The Science)
At Zone 2 intensity, your body primarily burns fat for fuel and maximally stimulates mitochondrial biogenesis — the creation of new mitochondria in muscle cells. More mitochondria means more cellular energy capacity, better metabolic health, slower aging, and lower disease risk.

Peter Attia, a physician focused on longevity, argues that VO2 max (closely tied to Zone 2 training) is the single best predictor of long-term health and all-cause mortality — better than smoking status, blood pressure, or cholesterol.

## How to Apply It
* **Duration**: 3-4 sessions per week, 45-60 minutes each
* **Intensity Check**: You should be able to say a full sentence comfortably
* **Options**: Brisk walking, cycling, swimming, rowing — any sustained aerobic activity
* **The Hard Part**: Resisting the urge to go harder. Zone 2 requires patience.`,
			},
			// 6. Work & Career
			{
				Title:        "Golang + Modern Frontend Architecture: Building High-Performance Web Apps",
				Slug:         "golang-modern-frontend-architecture",
				Excerpt:      "Exploring full-stack design patterns combining the raw execution speed of Go REST APIs with clean SPA frontends.",
				Category:     "Work & Career",
				CoverImage:   "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80",
				ReadTime:     "8 min read",
				Views:        2150,
				Featured:     true,
				AuthorName:   "Kaizen Creator",
				AuthorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
				Tags:         "Golang, Angular, Architecture, WebDev, Software",
				CreatedAt:    time.Now().AddDate(0, 0, -11),
				UpdatedAt:    time.Now().AddDate(0, 0, -11),
				Content: `The Go (Golang) programming language has emerged as a powerhouse for modern backend microservices and APIs due to its blinding execution speed, low memory footprint, and elegant concurrency primitives.

## System Architecture Breakdown
In the Kaizen application, we decouple responsibilities cleanly:
* **Frontend Layer**: An Angular Single Page Application (SPA) delivering instant, dynamic UI transitions without page reloads.
* **Backend Layer**: A compiled Go RESTful API handling business logic, database queries, and high-throughput JSON endpoints.

## Core Advantages of Golang Backends
1. **Minimal Memory Usage**: Uses a fraction of the RAM required by Node.js or Python runtime servers.
2. **Instant Binary Boot**: Compiles directly to native machine code for lightning-fast deployments.
3. **Built-in Concurrency**: Goroutines handle thousands of concurrent API requests effortlessly.

## The SPA Advantage
Angular's component-based architecture delivers smooth, page-reload-free navigation that feels native. Combined with Go's sub-millisecond API responses, the user experience is exceptional.`,
			},
			// 7. Books & Learning
			{
				Title:        "5 Books That Genuinely Changed How I Think (And Why)",
				Slug:         "5-books-that-changed-how-i-think",
				Excerpt:      "Not a typical book list. These are the five books that left permanent marks on my mental models, decision-making, and the way I interpret the world.",
				Category:     "Books & Learning",
				CoverImage:   "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1000&q=80",
				ReadTime:     "7 min read",
				Views:        1340,
				Featured:     false,
				AuthorName:   "Kaizen Creator",
				AuthorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
				Tags:         "Books, Reading, Learning, Mindset, Review",
				CreatedAt:    time.Now().AddDate(0, 0, -13),
				UpdatedAt:    time.Now().AddDate(0, 0, -13),
				Content: `I've read probably 150+ books in the last decade. Most were forgettable. But a handful genuinely rewired how I think. Here they are, with brutal honesty about what they actually changed.

## 1. Thinking, Fast and Slow — Daniel Kahneman
This book destroyed my confidence in my own intuitions — and that turned out to be a gift. Kahneman's research on cognitive biases revealed how systematically wrong human judgment is under uncertainty. I now approach every important decision by asking: "Which cognitive bias might be distorting this?"

## 2. Antifragile — Nassim Nicholas Taleb
The central insight: some systems get stronger under stress and volatility. The opposite of fragile isn't robust — it's antifragile. I restructured my career, finances, and training around this concept.

## 3. The Power of Now — Eckhart Tolle
I was deeply skeptical. I was wrong. Tolle's core idea — that most suffering is generated by mental time travel (ruminating on the past, anxious about the future) — is both obvious and transformative when truly understood.

## 4. Sapiens — Yuval Noah Harari
Zoomed out my entire worldview. Understanding how Homo sapiens built civilizations through shared fictions (money, nations, corporations, religions) made me simultaneously more humble and more clear-eyed about human systems.

## 5. Atomic Habits — James Clear
The most practically useful book I've ever read. The four-step habit loop framework, the concept of identity-based habits, and the 1% improvement principle are things I use every single day.`,
			},
			// 8. Goals & Projects
			{
				Title:        "Building My Personal Knowledge System: Tools, Workflows & 2 Years of Lessons",
				Slug:         "personal-knowledge-system",
				Excerpt:      "After two years of experimenting with Obsidian, Notion, and physical notebooks, here is the system that actually stuck — and what I learned along the way.",
				Category:     "Goals & Projects",
				CoverImage:   "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1000&q=80",
				ReadTime:     "8 min read",
				Views:        892,
				Featured:     false,
				AuthorName:   "Kaizen Creator",
				AuthorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
				Tags:         "PKM, Obsidian, Productivity, Notes, System",
				CreatedAt:    time.Now().AddDate(0, 0, -15),
				UpdatedAt:    time.Now().AddDate(0, 0, -15),
				Content: `I've been obsessed with Personal Knowledge Management (PKM) for two years. I've tried Roam Research, Notion, Obsidian, Logseq, paper notebooks, index cards, and every hybrid imaginable.

Here's what I actually use now, and more importantly, why.

## The Core Problem with Most PKM Systems
They optimize for capturing information and completely fail at retrieving it when you actually need it. I had thousands of notes in Notion I never looked at again.

## My Current Stack

### Obsidian (Primary)
All long-form notes, permanent notes, and book summaries live here. The local markdown files mean I'm never locked in. The graph view is beautiful and occasionally actually useful.

### A Physical Notebook (Daily)
I write every morning — a mix of tasks, rough thinking, and whatever's on my mind. The act of writing by hand engages the brain differently. I don't transfer everything to digital. Some notes exist only in the notebook.

### Readwise + Reader
Highlights from every book, article, and paper I read get synced here and then resurface via spaced repetition. This is the highest-leverage tool in my stack.

## The Most Important Lesson
A PKM system is only as good as your review process. Capture without review is just digital hoarding.`,
			},
			// 9. Random Thoughts / Rants
			{
				Title:        "Hot Take: Productivity Culture Has Become Its Own Form of Procrastination",
				Slug:         "productivity-culture-procrastination",
				Excerpt:      "We optimize our morning routines, stack our apps, build our systems, follow our gurus... and somehow never actually do the work. Here's my unpopular opinion.",
				Category:     "Random Thoughts / Rants",
				CoverImage:   "https://images.unsplash.com/photo-1499750310107-5fef28a66936?auto=format&fit=crop&w=1000&q=80",
				ReadTime:     "4 min read",
				Views:        2810,
				Featured:     false,
				AuthorName:   "Kaizen Creator",
				AuthorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
				Tags:         "Productivity, Opinion, Meta, Rant, HotTake",
				CreatedAt:    time.Now().AddDate(0, 0, -2),
				UpdatedAt:    time.Now().AddDate(0, 0, -2),
				Content: `Okay, hot take incoming.

I've spent thousands of hours consuming content about productivity. Books, podcasts, YouTube channels, Substack newsletters — the whole ecosystem. And I've noticed something uncomfortable: the consumption of productivity content is itself a form of sophisticated procrastination.

## The Paradox
Reading about how to build a second brain feels productive. Watching a video about the perfect morning routine feels like investment. Setting up your Notion workspace for the fourth time feels like progress.

None of it is the actual work.

## The Algorithm Problem
Productivity content is algorithmically optimized for engagement, not for actually making you more productive. The creator who teaches you to do deep work in 30 minutes gets less watch time than the one who gives you a 47-step morning routine.

## What I've Actually Found Useful
* **Less planning, more starting.** The only system that works is: open the document, start typing.
* **Boredom is underrated.** The impulse to pick up your phone when bored is the enemy of creative work.
* **One thing.** Cal Newport's "Deep Work" is correct. Do one important thing per day. The rest is noise.

## My Point
I'm not anti-productivity. I'm pro-results. And the results come from doing the thing, not from reading about doing the thing.`,
				Comments: []models.Comment{
					{
						AuthorName:   "Mike T.",
						AuthorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80",
						Content:      "This is the most self-aware productivity post I've ever read. Following for more hot takes.",
						CreatedAt:    time.Now().AddDate(0, 0, -1),
					},
				},
			},
			// 10. Photography / Snapshots
			{
				Title:        "Natural Light Travel Photography: Capturing Depth, Texture, and Atmosphere",
				Slug:         "natural-light-photography-guide",
				Excerpt:      "Harness the power of Golden Hour and Blue Hour to transform everyday travel snapshots into magazine-worthy art.",
				Category:     "Photography / Snapshots",
				CoverImage:   "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=1000&q=80",
				ReadTime:     "6 min read",
				Views:        1120,
				Featured:     false,
				AuthorName:   "Kaizen Creator",
				AuthorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
				Tags:         "Photography, GoldenHour, Travel, Camera, Light",
				CreatedAt:    time.Now().AddDate(0, 0, -18),
				UpdatedAt:    time.Now().AddDate(0, 0, -18),
				Content: `Light is the soul of photography. Whether you are using a flagship mirrorless camera or the smartphone in your pocket, mastering natural light transforms ordinary scenery into captivating visual stories.

## The Golden Hour
The 60 minutes after sunrise and before sunset bathe everything in a warm, directional light that flatters nearly every subject. Shadows are long and dramatic. Colors are rich and saturated. The light is free and it's breathtaking — but only if you're there for it.

## The Blue Hour
Less discussed but equally magical: the 20-30 minutes before sunrise and after sunset when the sky turns a deep, saturated blue and city lights begin to glow. This is the best time to photograph urban landscapes.

## Composition Principles
1. **Rule of Thirds**: Place your subject on the intersecting lines, not dead center.
2. **Leading Lines**: Roads, rivers, fences — use them to pull the viewer's eye into the frame.
3. **Foreground Interest**: A strong foreground element creates depth and three-dimensionality.
4. **Negative Space**: Sometimes what you leave out is more powerful than what you include.

## Gear Recommendation
For travel, the best camera is the one you have with you. A Sony A7C II for serious work, a phone with ProRAW mode for everything else. Post-processing in Lightroom Mobile is free and powerful.`,
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
	DBArticles = articles
	return articles
}

func GetArticleBySlug(slug string) (models.Article, bool) {
	var article models.Article
	result := DB.Preload("Comments").Where("slug = ?", slug).First(&article)
	if result.Error != nil {
		return models.Article{}, false
	}
	DB.Model(&article).Update("views", article.Views+1)
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
	DB.Find(&DBArticles)

	var totalArticles int64
	DB.Model(&models.Article{}).Count(&totalArticles)
	DB.Model(&DBAuthor).Update("articles_count", int(totalArticles))
	DB.First(&DBAuthor)

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
