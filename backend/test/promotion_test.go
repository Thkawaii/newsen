package test

import (
	"testing"
	"time"

	"project-se/entity"
	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestPromotionCode(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`PromotionCode is required`, func(t *testing.T) {
		promotion := entity.Promotion{
			PromotionCode:        "", // Leave empty for testing
			PromotionName:        "Holiday Sale",
			PromotionDescription: "Huge discount on holidays",
			Discount:             20,
			EndDate:              time.Now().Add(24 * time.Hour),
			UseLimit:             100,
			UseCount:             0,
			DistancePromotion:    50.5,
			Photo:                "photo_url",
			DiscountTypeID:       1,
			StatusPromotionID:    1,
		}

		ok, err := govalidator.ValidateStruct(promotion)

		g.Expect(ok).NotTo(BeTrue()) // Validate should fail
		g.Expect(err).NotTo(BeNil()) // There should be an error
		g.Expect(err.Error()).To(ContainSubstring("PromotionCode is required"))
	})
}

func TestPromotionName(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`PromotionName is required`, func(t *testing.T) {
		promotion := entity.Promotion{
			PromotionCode:        "PROMO001",
			PromotionName:        "", // Leave empty for testing
			PromotionDescription: "Huge discount on holidays",
			Discount:             20,
			EndDate:              time.Now().Add(24 * time.Hour),
			UseLimit:             100,
			UseCount:             0,
			DistancePromotion:    50.5,
			Photo:                "photo_url",
			DiscountTypeID:       1,
			StatusPromotionID:    1,
		}

		ok, err := govalidator.ValidateStruct(promotion)

		g.Expect(ok).NotTo(BeTrue()) // Validate should fail
		g.Expect(err).NotTo(BeNil()) // There should be an error
		g.Expect(err.Error()).To(ContainSubstring("PromotionName is required"))
	})
}

func TestDiscount(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`Discount is required`, func(t *testing.T) {
		promotion := entity.Promotion{
			PromotionCode:        "PROMO001",
			PromotionName:        "Holiday Sale",
			PromotionDescription: "Huge discount on holidays",
			Discount:             0, // Test with zero (invalid)
			EndDate:              time.Now().Add(24 * time.Hour),
			UseLimit:             100,
			UseCount:             0,
			DistancePromotion:    50.5,
			Photo:                "photo_url",
			DiscountTypeID:       1,
			StatusPromotionID:    1,
		}

		ok, err := govalidator.ValidateStruct(promotion)

		g.Expect(ok).NotTo(BeTrue()) // Validate should fail
		g.Expect(err).NotTo(BeNil()) // There should be an error
		g.Expect(err.Error()).To(ContainSubstring("Discount is required"))
	})
}

func TestEndDate(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`EndDate is required`, func(t *testing.T) {
		promotion := entity.Promotion{
			PromotionCode:        "PROMO001",
			PromotionName:        "Holiday Sale",
			PromotionDescription: "Huge discount on holidays",
			Discount:             20,
			EndDate:              time.Time{}, // Empty date for testing
			UseLimit:             100,
			UseCount:             0,
			DistancePromotion:    50.5,
			Photo:                "photo_url",
			DiscountTypeID:       1,
			StatusPromotionID:    1,
		}

		ok, err := govalidator.ValidateStruct(promotion)

		g.Expect(ok).NotTo(BeTrue()) // Validate should fail
		g.Expect(err).NotTo(BeNil()) // There should be an error
		g.Expect(err.Error()).To(ContainSubstring("EndDate is required"))
	})
}

func TestUseLimit(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`UseLimit is required`, func(t *testing.T) {
		promotion := entity.Promotion{
			PromotionCode:        "PROMO001",
			PromotionName:        "Holiday Sale",
			PromotionDescription: "Huge discount on holidays",
			Discount:             20,
			EndDate:              time.Now().Add(24 * time.Hour),
			UseLimit:             0, // Test with zero (invalid)
			UseCount:             0,
			DistancePromotion:    50.5,
			Photo:                "photo_url",
			DiscountTypeID:       1,
			StatusPromotionID:    1,
		}

		ok, err := govalidator.ValidateStruct(promotion)

		g.Expect(ok).NotTo(BeTrue()) // Validate should fail
		g.Expect(err).NotTo(BeNil()) // There should be an error
		g.Expect(err.Error()).To(ContainSubstring("UseLimit is required"))
	})
}