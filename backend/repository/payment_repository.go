package repository

import (
	"log"
	"project-se/entities"

	"gorm.io/gorm"
)

type PaymentRepository interface {
	CreatePayment(payment *entities.Payment) error
	CreatePaid(paid *entities.Paid) error
}

type paymentRepo struct {
	db *gorm.DB
}

func NewPaymentRepository(db *gorm.DB) PaymentRepository {
	return &paymentRepo{db: db}
}

func (r *paymentRepo) CreatePayment(payment *entities.Payment) error {
	err := r.db.Create(payment).Error
	if err != nil {
		log.Printf("Error creating payment: %v", err)
	}
	return err
}

func (r *paymentRepo) CreatePaid(paid *entities.Paid) error {
	return r.db.Create(paid).Error
}
