package test

import (
	"project-se/entities"
	"testing"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestRev1Validation(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("Valid Rev1 structure", func(t *testing.T) {
		review := entities.Rev1{
			ReviewID:  1,
			Rating:    5,
			Comment:   "Great service",
			BookingID: 123,
			Feedback:  "Excellent",
		}

		ok, err := govalidator.ValidateStruct(review)
		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}
func TestReviewCommentValidation(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("Comment is valid", func(t *testing.T) {
		review := entities.Rev1{
			ReviewID:  1,
			Rating:    5,
			Comment:   "Great service",
			BookingID: 123,
			Feedback:  "Excellent",
		}

		ok, err := govalidator.ValidateStruct(review)
		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})


}
func TestReviewFeedbackValidation(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("Feedback is valid", func(t *testing.T) {
		review := entities.Rev1{
			ReviewID:  1,
			Rating:    5,
			Comment:   "Great service",
			BookingID: 123,
			Feedback:  "Excellent",
		}

		ok, err := govalidator.ValidateStruct(review)
		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})


}
