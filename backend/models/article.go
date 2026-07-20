package models

import (
	"time"
)

type Article struct {
	ID           uint      `json:"id" gorm:"primaryKey"`
	Title        string    `json:"title"`
	Slug         string    `json:"slug" gorm:"uniqueIndex"`
	Excerpt      string    `json:"excerpt"`
	Content      string    `json:"content"`
	Category     string    `json:"category"`
	CoverImage   string    `json:"cover_image"`
	ReadTime     string    `json:"read_time"`
	Views        int       `json:"views"`
	Featured     bool      `json:"featured"`
	AuthorName   string    `json:"author_name"`
	AuthorAvatar string    `json:"author_avatar"`
	Tags         string    `json:"tags"` // Comma-separated or JSON string
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
	Comments     []Comment `json:"comments" gorm:"foreignKey:ArticleID"`
}

type Comment struct {
	ID           uint      `json:"id" gorm:"primaryKey"`
	ArticleID    uint      `json:"article_id"`
	AuthorName   string    `json:"author_name"`
	AuthorAvatar string    `json:"author_avatar"`
	Content      string    `json:"content"`
	CreatedAt    time.Time `json:"created_at"`
}

type Category struct {
	ID    uint   `json:"id" gorm:"primaryKey"`
	Name  string `json:"name"`
	Slug  string `json:"slug"`
	Icon  string `json:"icon"`
	Count int    `json:"count"`
}

type AuthorProfile struct {
	ID               uint   `json:"id" gorm:"primaryKey"`
	Name             string `json:"name"`
	Title            string `json:"title"`
	Bio              string `json:"bio"`
	Avatar           string `json:"avatar"`
	CoverImage       string `json:"cover_image"`
	ArticlesCount    int    `json:"articles_count"`
	CountriesVisited int    `json:"countries_visited"`
	PhotosTaken      int    `json:"photos_taken"`
	Location         string `json:"location"`
	Instagram        string `json:"instagram"`
	Youtube          string `json:"youtube"`
	Facebook         string `json:"facebook"`
	Github           string `json:"github"`
}

// SeedVersion tracks the version of seeded data to force reseed on schema/data changes
type SeedVersion struct {
	ID      uint   `gorm:"primaryKey"`
	Version string `gorm:"uniqueIndex"`
}
