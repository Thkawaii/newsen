package entity

import (
   
	"gorm.io/gorm"

)
type StatusPromotion struct {

   gorm.Model   

   StatusPromotion string  `json:"status_promotion"`

}