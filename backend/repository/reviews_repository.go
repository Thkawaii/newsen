package repository

import (
	"project-se/entities"

	"gorm.io/gorm"
)

type ReviewRepository interface {
	Create(review *entities.Review) error
	GetAll() ([]entities.Review, error)
	GetByID(id int) (*entities.Review, error)
	GetReviewsByDriverID(driverID int) ([]entities.Review, error)
	Update(review *entities.Review) error
	Delete(id int) error
}

type reviewRepo struct {
	db *gorm.DB
}

func NewReviewRepository(db *gorm.DB) ReviewRepository {
	return &reviewRepo{db: db}
}

func (r *reviewRepo) Create(review *entities.Review) error {
	return r.db.Create(review).Error
}

func (r *reviewRepo) GetAll() ([]entities.Review, error) {
	var reviews []entities.Review
	err := r.db.Find(&reviews).Error
	return reviews, err
}

func (r *reviewRepo) GetByID(id int) (*entities.Review, error) {
	var review entities.Review
	err := r.db.First(&review, id).Error
	return &review, err
}

func (r *reviewRepo) GetReviewsByDriverID(driverID int) ([]entities.Review, error) {
	var reviews []entities.Review
	result := r.db.Where("driver_id = ?", driverID).Find(&reviews)
	return reviews, result.Error
}

func (r *reviewRepo) Update(review *entities.Review) error {
	return r.db.Save(review).Error
}

func (r *reviewRepo) Delete(id int) error {
	return r.db.Delete(&entities.Review{}, id).Error
}
