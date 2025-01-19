package handler

import (
	"log"
	"net/http"
	"project-se/entities"
	"project-se/repository"
	"time"

	"github.com/gin-gonic/gin"
)

type PaymentHandler struct {
	repo repository.PaymentRepository
}

func NewPaymentHandler(repo repository.PaymentRepository) *PaymentHandler {
	return &PaymentHandler{repo: repo}
}

func (h *PaymentHandler) CreatePayment(c *gin.Context) {
	cardType := c.Query("card_type")

	var payment entities.Payment

	if err := c.ShouldBindJSON(&payment); err != nil {
		log.Println("BodyParser Error:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	log.Printf("Parsed Payment: %+v\n", payment)

	payment.PaymentDate = time.Now().Format("2006-01-02 15:04:05")

	if err := h.repo.CreatePayment(&payment); err != nil {
		log.Println("CreatePayment Error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create payment"})
		return
	}

	if cardType != "" {
		paid := entities.Paid{
			CardType:  cardType,
			PaymentID: payment.PaymentID,
		}
		if err := h.repo.CreatePaid(&paid); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create paid record"})
			return
		}
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Payment created successfully"})
}
