package test

import (
	"project-se/entities"
	"testing"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestTotalAmountValidation(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`TotalAmount must be a positive number between 0 and 1000`, func(t *testing.T) {
		// Test case where TotalAmount is not positive
		payment := entities.Pay1{
			TotalAmount:   -1,    // Negative TotalAmount
			PaymentMethod: "Credit card",
			BookingID:     1,
		}

		ok, err := govalidator.ValidateStruct(payment)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("TotalAmount must be a positive number between 0 and 1000"))
	})

	t.Run(`TotalAmount is valid`, func(t *testing.T) {
		// Test case where TotalAmount is valid
		payment := entities.Pay1{
			TotalAmount:   100,   // Valid TotalAmount
			PaymentMethod: "card",
			BookingID:     1,
		}

		ok, err := govalidator.ValidateStruct(payment)
		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}
func TestPaymentMethodValidation(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`PaymentMethod is required`, func(t *testing.T) {
		payment := entities.Pay1{
			TotalAmount:   100,
			PaymentMethod: "",    // Missing PaymentMethod
			BookingID:     1,
		}

		ok, err := govalidator.ValidateStruct(payment)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("PaymentMethod is required"))
	})

	t.Run(`PaymentMethod must be 'card' or 'cash'`, func(t *testing.T) {
		payment := entities.Pay1{
			TotalAmount:   100,
			PaymentMethod: "invalid", // Invalid PaymentMethod
			BookingID:     1,
		}

		ok, err := govalidator.ValidateStruct(payment)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("PaymentMethod must be 'card' or 'cash'"))
	})

	t.Run(`PaymentMethod is valid`, func(t *testing.T) {
		payment := entities.Pay1{
			TotalAmount:   100,
			PaymentMethod: "card",   // Valid PaymentMethod
			BookingID:     1,
		}

		ok, err := govalidator.ValidateStruct(payment)
		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}


func TestCreditCardValidation(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`Credit Card Number is required`, func(t *testing.T) {
		payment := entities.Pay1{
			TotalAmount:   100,
			PaymentMethod: "card",
			BookingID:     1,
			CardNumber:    "",    // Missing Card Number
		}

		ok, err := govalidator.ValidateStruct(payment)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("Card Number is required"))
	})


}
func TestExpiryValidation(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`Expiry Month and Year is valid future date`, func(t *testing.T) {
		payment := entities.Pay1{
			TotalAmount:   100,
			PaymentMethod: "card",
			BookingID:     1,
			CardNumber:    "1234-5678-9012-3456",
			ExpiryMonth:   12,
			ExpiryYear:    2025,
			CVV:           123,
		}

		ok, err := govalidator.ValidateStruct(payment)
		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})

	t.Run(`Expiry Month and Year is invalid future date`, func(t *testing.T) {
		payment := entities.Pay1{
			TotalAmount:   100,
			PaymentMethod: "card",
			BookingID:     1,
			CardNumber:    "1234-5678-9012-3456",
			ExpiryMonth:   13, // Invalid month
			ExpiryYear:    2025,
			CVV:           123,
		}

		ok, err := govalidator.ValidateStruct(payment)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("Expiry Month must be between 1 and 12"))
	})

	
}
