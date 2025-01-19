package handler

import (
	"net/http"
	"project-se/repository"
	"strconv"

	"github.com/gin-gonic/gin"
)

type BookingHandler struct {
	repo repository.BookingRepository
}

func NewBookingHandler(repo repository.BookingRepository) *BookingHandler {
	return &BookingHandler{repo: repo}
}

func (h *BookingHandler) GetAllBookings(c *gin.Context) {
	bookings, err := h.repo.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, bookings)
}

func (h *BookingHandler) GetBookingByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid booking ID"})
		return
	}

	booking, err := h.repo.GetByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Booking not found"})
		return
	}

	c.JSON(http.StatusOK, booking)
}
