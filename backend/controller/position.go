package controller

import (
	"net/http"

	"project-se/config"
	"project-se/entity"

	"github.com/gin-gonic/gin"
)

// GET /position/:id
func GetPosition(c *gin.Context) {
	ID := c.Param("id")
	var position entity.Position

	db := config.DB()
	result := db.First(&position, ID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}
	if position.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
	c.JSON(http.StatusOK, position)
}

// GET /positions
func ListPositions(c *gin.Context) {
	var positions []entity.Position

	db := config.DB()
	result := db.Find(&positions)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, positions)
}
