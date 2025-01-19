package handler

import (
	"net/http"
	"project-se/entities"
	"project-se/repository"
	"strconv"

	"github.com/gin-gonic/gin"
)

type ReviewHandler struct {
	repo repository.ReviewRepository
}

func NewReviewHandler(repo repository.ReviewRepository) *ReviewHandler {
	return &ReviewHandler{repo: repo}
}

func (h *ReviewHandler) CreateReview(c *gin.Context) {
	var review entities.Review

	if err := c.ShouldBindJSON(&review); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	if err := h.repo.Create(&review); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create review"})
		return
	}

	c.JSON(http.StatusCreated, review)
}

func (h *ReviewHandler) GetAllReviews(c *gin.Context) {
	reviews, err := h.repo.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch reviews"})
		return
	}

	c.JSON(http.StatusOK, reviews)
}

func (h *ReviewHandler) GetReviewByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid review ID"})
		return
	}

	review, err := h.repo.GetByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Review not found"})
		return
	}

	c.JSON(http.StatusOK, review)
}

func (h *ReviewHandler) GetReviewsByDriverID(c *gin.Context) {
	driverID, err := strconv.Atoi(c.Param("driver_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid driver ID"})
		return
	}

	reviews, err := h.repo.GetReviewsByDriverID(driverID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var totalRating, count int
	for _, review := range reviews {
		totalRating += review.Rating
		count++
	}

	averageRating := 0
	if count > 0 {
		averageRating = totalRating / count
	}

	c.JSON(http.StatusOK, gin.H{
		"driver_id":     driverID,
		"averageRating": averageRating,
		"totalRatings":  count,
		"reviews":       reviews,
	})
}

func (h *ReviewHandler) UpdateReview(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid review ID"})
		return
	}

	var review entities.Review
	if err := c.ShouldBindJSON(&review); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	review.ReviewID = id

	if err := h.repo.Update(&review); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update review"})
		return
	}

	c.JSON(http.StatusOK, review)
}

func (h *ReviewHandler) DeleteReview(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid review ID"})
		return
	}

	if err := h.repo.Delete(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete review"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Successfully deleted"})
}
