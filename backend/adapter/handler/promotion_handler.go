package handler

import (
	"log"
	"net/http"
	"project-se/repository"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

type PromotionHandler struct {
	repo repository.PromotionRepository
}

func NewPromotionHandler(repo repository.PromotionRepository) *PromotionHandler {
	return &PromotionHandler{repo: repo}
}

func (h *PromotionHandler) CheckPromotionCode(c *gin.Context) {
	promotionCode := c.Query("code")
	distanceParam := c.Query("distance")
	priceParam := c.Query("price")

	// แปลง distance และ price
	distance, err := strconv.ParseFloat(distanceParam, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid distance value"})
		return
	}
	price, err := strconv.ParseFloat(priceParam, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid price value"})
		return
	}

	// ดึงข้อมูล Promotion
	promotion, err := h.repo.GetPromotionByCode(promotionCode)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Promotion code not found"})
		return
	}

	if promotion.StatusPromotionID == 2 {
		c.JSON(http.StatusOK, gin.H{
			"message":      "Promotion code is not active",
			"promotion_id": promotion.ID,
			"can_use":      false,
		})
		return
	}

	// ตรวจสอบวันหมดอายุ
	currentTime := time.Now()
	if promotion.EndDate.Before(currentTime) {
		c.JSON(http.StatusOK, gin.H{
			"message":      "Promotion code has expired",
			"promotion_id": promotion.ID,
			"can_use":      false,
		})
		return
	}

	// ตรวจสอบจำนวนการใช้
	if promotion.UseCount >= promotion.UseLimit {
		c.JSON(http.StatusOK, gin.H{
			"message":      "Promotion code usage limit reached",
			"promotion_id": promotion.ID,
			"can_use":      false,
		})
		return
	}

	// ตรวจสอบเงื่อนไขระยะทาง
	canUse := false
	switch promotion.DistanceCondition {
	case "greater":
		canUse = distance > promotion.DistancePromotion
	case "greater_equal":
		canUse = distance >= promotion.DistancePromotion
	case "less":
		canUse = distance < promotion.DistancePromotion
	case "less_equal":
		canUse = distance <= promotion.DistancePromotion
	case "free":
		canUse = true
	default:
		c.JSON(http.StatusBadRequest, gin.H{
			"message":      "Invalid distance_condition in database",
			"promotion_id": promotion.ID,
			"can_use":      false,
		})
		return
	}

	if !canUse {
		c.JSON(http.StatusOK, gin.H{
			"message":      "Promotion code cannot be used for this distance",
			"promotion_id": promotion.ID,
			"can_use":      false,
		})
		return
	}

	// ดึงประเภทส่วนลด
	discountType, err := h.repo.GetDiscountTypeByID(promotion.DiscountTypeID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch discount type"})
		return
	}

	if discountType.DiscountType == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid DiscountType. Please provide a valid DiscountType."})
		return
	}

	// คำนวณส่วนลด
	var discountAmount float64
	if discountType.DiscountType == "percent" {
		discountAmount = (promotion.Discount / 100) * price
	} else if discountType.DiscountType == "amount" {
		discountAmount = promotion.Discount
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid DiscountType. Please provide either 'percent' or 'amount'."})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":        "Promotion code can be used",
		"promotion_id":   promotion.ID,
		"can_use":        true,
		"discount_type":  discountType.DiscountType,
		"discount_value": discountAmount,
		"details":        promotion,
	})
}

func (h *PromotionHandler) UpdateUseCount(c *gin.Context) {
	promotionID, err := strconv.Atoi(c.Query("promotion_id"))
	if err != nil || promotionID <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid promotion ID"})
		return
	}

	// ดึงข้อมูล Promotion
	promotion, err := h.repo.GetByID(promotionID)
	if err != nil {
		log.Println("Get Promotion Error:", err)
		c.JSON(http.StatusNotFound, gin.H{"error": "Promotion not found"})
		return
	}

	// ตรวจสอบจำนวนการใช้
	if promotion.UseCount >= promotion.UseLimit {
		c.JSON(http.StatusForbidden, gin.H{
			"error": "Promotion usage limit reached",
		})
		return
	}

	// อัปเดต Use Count
	promotion.UseCount++
	if err := h.repo.UpdateUseCountByID(promotion.ID, promotion.UseCount); err != nil {
		log.Println("Update UseCount Error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update use count"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":   "Promotion usage updated successfully",
		"use_count": promotion.UseCount,
	})
}
