package controller

import (
	"net/http"
	"project-se/entity"
	"project-se/config"
	"github.com/gin-gonic/gin"
	
)

func GetAllStatus(c *gin.Context) {

	db := config.DB()


	var statuspromotion []entity.StatusPromotion
 
	db.Find(&statuspromotion)
 
 
	c.JSON(http.StatusOK, &statuspromotion)

}
