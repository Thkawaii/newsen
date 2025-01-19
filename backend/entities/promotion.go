package entities

import "time"

type Promotion struct {
	ID                   int       `json:"id"`
	PromotionCode        string    `json:"promotion_code"`
	PromotionName        string    `json:"promotion_name"`
	PromotionDescription string    `json:"promotion_description"`
	Discount             float64   `json:"discount"`
	EndDate              time.Time `json:"end_date"`
	UseLimit             int       `json:"use_limit"`
	UseCount             int       `json:"use_count"`
	DistancePromotion    float64   `json:"distance_promotion"`
	DistanceCondition    string    `json:"distance_condition"`
	DiscountTypeID       int       `json:"discount_type_id"`
	StatusPromotionID    int       `json:"status_promotion_id"`
}

type DiscountType struct {
	ID           int       `json:"id"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
	DeletedAt    time.Time `json:"deleted_at"`
	DiscountType string    `json:"discount_type"`
}
