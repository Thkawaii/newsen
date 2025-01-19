package repository

import (
	"project-se/entities"

	"gorm.io/gorm"
)

type PromotionRepository interface {
	GetPromotionByCode(code string) (*entities.Promotion, error)
	GetDiscountTypeByID(id int) (*entities.DiscountType, error)
	GetByID(promotionID int) (*entities.Promotion, error)
	UpdateUseCountByID(promotionID int, useCount int) error
}

type promotionRepo struct {
	db *gorm.DB
}

func NewPromotionRepository(db *gorm.DB) PromotionRepository {
	return &promotionRepo{db: db}
}

func (r *promotionRepo) GetPromotionByCode(code string) (*entities.Promotion, error) {
	var promotion entities.Promotion
	err := r.db.Where("promotion_code = ?", code).First(&promotion).Error
	return &promotion, err
}

func (r *promotionRepo) GetDiscountTypeByID(id int) (*entities.DiscountType, error) {
	var discountType entities.DiscountType
	err := r.db.Where("id = ?", id).First(&discountType).Error
	return &discountType, err
}

func (r *promotionRepo) GetByID(promotionID int) (*entities.Promotion, error) {
	var promotion entities.Promotion
	err := r.db.Where("id = ?", promotionID).First(&promotion).Error
	return &promotion, err
}

func (r *promotionRepo) UpdateUseCountByID(promotionID int, useCount int) error {
	err := r.db.Model(&entities.Promotion{}).
		Where("id = ?", promotionID).
		Update("use_count", useCount).Error
	return err
}
