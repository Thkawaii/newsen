package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"project-se/entity"
	"project-se/config"
)

// ดึงข้อมูล Trainer ทั้งหมด
func GetAllTrainer(c *gin.Context) {
    var trainers []entity.Trainers
    db := config.DB()
    if err := db.Find(&trainers).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงข้อมูลเทรนเนอร์ได้"})
        return
    }
    c.JSON(http.StatusOK, trainers)
}


// ดึงข้อมูล Trainer ตาม ID
func GetByIDTrainer(c *gin.Context) {
	id := c.Param("id")
	var trainer entity.Trainers
	db := config.DB()
	results := db.Preload("Gender").First(&trainer, id)

	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, trainer)
}

// สร้าง Trainer ใหม่
func CreateTrainer(c *gin.Context) {
	var trainer entity.Trainers
	if err := c.ShouldBindJSON(&trainer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	db := config.DB()
	result := db.Create(&trainer)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to create trainer"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Trainer created successfully", "trainer": trainer})
}

// อัปเดตข้อมูล Trainer
func UpdateTrainer(c *gin.Context) {
	id := c.Param("id")
	var trainer entity.Trainers
	db := config.DB()
	result := db.First(&trainer, id)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Trainer not found"})
		return
	}

	if err := c.ShouldBindJSON(&trainer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&trainer)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to update trainer"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Trainer updated successfully"})
}

// ลบ Trainer
func DeleteTrainer(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()
	if tx := db.Delete(&entity.Trainers{}, id); tx.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Trainer not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Trainer deleted successfully"})
}
