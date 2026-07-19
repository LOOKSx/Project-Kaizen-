package main

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"kaizen-backend/database"
	"kaizen-backend/handlers"
)

func main() {
	// Initialize Database and Seed Data
	database.InitDB()

	// Set Gin Release Mode or Debug Mode
	gin.SetMode(gin.DebugMode)

	r := gin.Default()

	// Configure CORS for Angular Frontend
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Health check endpoint
	r.GET("/api/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":    "healthy",
			"app":       "Kaizen Personal Blog API",
			"timestamp": time.Now().Format(time.RFC3339),
		})
	})

	// API Routes Group
	api := r.Group("/api")
	{
		api.GET("/articles", handlers.GetArticles)
		api.GET("/articles/:slug", handlers.GetArticleBySlug)
		api.POST("/articles", handlers.CreateArticle)
		api.POST("/articles/:id/comments", handlers.AddComment)

		api.GET("/author", handlers.GetAuthor)
		api.GET("/categories", handlers.GetCategories)
	}

	port := ":8080"
	fmt.Printf("🚀 Kaizen Golang API Server running at http://localhost%s\n", port)
	if err := r.Run(port); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
