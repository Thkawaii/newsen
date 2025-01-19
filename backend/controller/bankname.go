package controller


import (
	"net/http"

	"github.com/gin-gonic/gin"
	"project-se/config"
	"project-se/entity"

)


func GetAllBankName(c *gin.Context) {


   db := config.DB()


   var bankname []entity.BankName

   db.Find(&bankname)


   c.JSON(http.StatusOK, &bankname)


}