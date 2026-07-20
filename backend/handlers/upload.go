package handlers

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

type imgurResponse struct {
	Data struct {
		Link string `json:"link"`
		ID   string `json:"id"`
	} `json:"data"`
	Success bool `json:"success"`
	Status  int  `json:"status"`
}

// UploadImage accepts a multipart file upload, encodes it as base64,
// and uploads it to Imgur anonymously, returning the public URL.
func UploadImage(c *gin.Context) {
	file, header, err := c.Request.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "No image file provided: " + err.Error(),
		})
		return
	}
	defer file.Close()

	// Validate file size (max 10MB)
	if header.Size > 10*1024*1024 {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "File size exceeds 10MB limit",
		})
		return
	}

	// Read file bytes
	fileBytes, err := io.ReadAll(file)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "Failed to read file",
		})
		return
	}

	// Encode to base64
	encoded := base64.StdEncoding.EncodeToString(fileBytes)

	// Upload to Imgur (anonymous, no auth needed for basic uploads)
	imgurClientID := "546c25a59c58ad7" // Imgur anonymous client ID

	reqBody := strings.NewReader(fmt.Sprintf("image=%s&type=base64", encoded))
	req, err := http.NewRequest("POST", "https://api.imgur.com/3/image", reqBody)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "Failed to create upload request",
		})
		return
	}
	req.Header.Set("Authorization", "Client-ID "+imgurClientID)
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "Failed to upload to Imgur: " + err.Error(),
		})
		return
	}
	defer resp.Body.Close()

	var imgurResp imgurResponse
	if err := json.NewDecoder(resp.Body).Decode(&imgurResp); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "Failed to parse Imgur response",
		})
		return
	}

	if !imgurResp.Success {
		c.JSON(http.StatusBadGateway, gin.H{
			"status":  "error",
			"message": fmt.Sprintf("Imgur upload failed with status %d", imgurResp.Status),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"url":    imgurResp.Data.Link,
		"id":     imgurResp.Data.ID,
	})
}
