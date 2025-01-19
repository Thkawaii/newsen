package repository

import (
	"project-se/entities"

	"gorm.io/gorm"
)

type BookingRepository interface {
	GetAll() ([]entities.Booking, error)
	GetByID(id int) (*entities.Booking, error)
}

type bookingRepo struct {
	db *gorm.DB
}

func NewBookingRepository(db *gorm.DB) BookingRepository {
	return &bookingRepo{db: db}
}

func (r *bookingRepo) GetAll() ([]entities.Booking, error) {
	var bookings []entities.Booking
	err := r.db.Find(&bookings).Error
	return bookings, err
}

func (r *bookingRepo) GetByID(id int) (*entities.Booking, error) {
	var booking entities.Booking
	err := r.db.First(&booking, id).Error
	return &booking, err
}
