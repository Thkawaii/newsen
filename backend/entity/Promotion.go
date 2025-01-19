package entity


import (
	
	"time"

	"gorm.io/gorm"

)

type Promotion struct {
	gorm.Model // gorm.Model จะทำให้มี ID, CreatedAt, UpdatedAt, DeletedAt อัตโนมัติ

	PromotionCode        string    `json:"promotion_code" gorm:"unique;not null" valid:"required~PromotionCode is required"`   // รหัสโปรโมชั่น
	PromotionName        string    `json:"promotion_name" valid:"required~PromotionName is required"`                             // ชื่อโปรโมชั่น
	PromotionDescription string    `json:"promotion_description" valid:"required~PromotionDescription is required"`             // คำอธิบายโปรโมชั่น
	Discount             int       `json:"discount" valid:"required~Discount is required,int~Discount must be an integer"`       // ส่วนลดโปรโมชั่น
	EndDate              time.Time `json:"end_date" valid:"required~EndDate is required"`                                         // วันที่หมดเขตโปรโมชั่น
	UseLimit             int       `json:"use_limit" valid:"required~UseLimit is required,int~UseLimit must be an integer"`      // จำนวนครั้งที่สามารถใช้โค้ดได้
	UseCount             int       `json:"use_count"`                                                                              // จำนวนที่ใช้แล้ว
	DistancePromotion    float64   `json:"distance_promotion" valid:"required~DistancePromotion is required,float~DistancePromotion must be a valid number"` // ระยะทางสูงสุด
	Photo                string    `gorm:"type:longtext" json:"photo" valid:"required~Photo is required"`                        // รูปโปรโมชั่น

	DiscountTypeID  	uint      		`json:"discount_type_id" valid:"required~DiscountTypeID is required"`       // ID ประเภทส่วนลด
	DiscountType    	*DiscountType  	`gorm:"foreignKey: discount_type_id" json:"discount_type"`

	StatusPromotionID  	uint      		`json:"status_promotion_id" valid:"required~StatusPromotionID is required"` // ID สถานะโปรโมชั่น
	StatusPromotion    	*StatusPromotion  `gorm:"foreignKey: status_promotion_id" json:"status_promotion"`
}
