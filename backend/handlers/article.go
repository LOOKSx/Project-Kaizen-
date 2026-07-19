package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"kaizen-backend/database"
	"kaizen-backend/models"
)

func GetArticles(c *gin.Context) {
	category := c.Query("category")
	search := c.Query("search")
	articles := database.GetAllArticles(category, search)
	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   articles,
		"count":  len(articles),
	})
}

func GetArticleBySlug(c *gin.Context) {
	slug := c.Param("slug")
	article, found := database.GetArticleBySlug(slug)
	if !found {
		c.JSON(http.StatusNotFound, gin.H{
			"status":  "error",
			"message": "Article not found",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   article,
	})
}

func CreateArticle(c *gin.Context) {
	var input models.Article
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": err.Error(),
		})
		return
	}

	if input.Title == "" || input.Content == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Title and Content are required fields",
		})
		return
	}

	created := database.CreateArticle(input)
	c.JSON(http.StatusCreated, gin.H{
		"status":  "success",
		"message": "Article created successfully",
		"data":    created,
	})
}

func AddComment(c *gin.Context) {
	idStr := c.Param("id")
	articleID, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Invalid article ID",
		})
		return
	}

	var comment models.Comment
	if err := c.ShouldBindJSON(&comment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": err.Error(),
		})
		return
	}

	added, ok := database.AddComment(uint(articleID), comment)
	if !ok {
		c.JSON(http.StatusNotFound, gin.H{
			"status":  "error",
			"message": "Article not found",
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"status": "success",
		"data":   added,
	})
}

func GetAuthor(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   database.DBAuthor,
	})
}

func GetCategories(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   database.DBCategories,
	})
}
