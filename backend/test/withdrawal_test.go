package test

import (
	"testing"
	"time"

	"project-se/entity"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestWithdrawalDate(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`WithdrawalDate should be valid`, func(t *testing.T) {
		withdrawal := entity.Withdrawal{
			WithdrawalAmount:     500,
			WithdrawalCommission: 30,
			WithdrawalNetAmount:  470,
			WithdrawalBankNumber: "1234567890",
			WithdrawalDate:       time.Now(), // วันที่ถอนต้องไม่เป็นค่าเริ่มต้น
			BankNameID:           1,
			DriverID:             1,
		}
		ok, err := govalidator.ValidateStruct(withdrawal)

		g.Expect(ok).To(BeTrue())     // Validation ต้องผ่าน
		g.Expect(err).To(BeNil())     // ไม่มีข้อผิดพลาด
	})
}

func TestWithdrawalAmount(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`WithdrawalAmount should be valid`, func(t *testing.T) {
		withdrawal := entity.Withdrawal{
			WithdrawalAmount:     500, // ค่าถอนที่มากกว่า 0
			WithdrawalCommission: 30,
			WithdrawalNetAmount:  470,
			WithdrawalBankNumber: "1234567890",
			WithdrawalDate:       time.Now(),
			BankNameID:           1,
			DriverID:             1,
		}
		ok, err := govalidator.ValidateStruct(withdrawal)

		g.Expect(ok).To(BeTrue())     // Validation ต้องผ่าน
		g.Expect(err).To(BeNil())     // ไม่มีข้อผิดพลาด
	})
}


func TestWithdrawalCommission(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`WithdrawalCommission should be valid`, func(t *testing.T) {
		withdrawal := entity.Withdrawal{
			WithdrawalAmount:     500,
			WithdrawalCommission: 30, // ค่าคอมมิชชั่นมากกว่า 0
			WithdrawalNetAmount:  470,
			WithdrawalBankNumber: "1234567890",
			WithdrawalDate:       time.Now(),
			BankNameID:           1,
			DriverID:             1,
		}
		ok, err := govalidator.ValidateStruct(withdrawal)

		g.Expect(ok).To(BeTrue())     // Validation ต้องผ่าน
		g.Expect(err).To(BeNil())     // ไม่มีข้อผิดพลาด
	})
}


func TestWithdrawalNetAmount(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`WithdrawalNetAmount should be valid`, func(t *testing.T) {
		withdrawal := entity.Withdrawal{
			WithdrawalAmount:     500,
			WithdrawalCommission: 30,
			WithdrawalNetAmount:  470, // จำนวนเงินสุทธิที่มากกว่า 0
			WithdrawalBankNumber: "1234567890",
			WithdrawalDate:       time.Now(),
			BankNameID:           1,
			DriverID:             1,
		}
		ok, err := govalidator.ValidateStruct(withdrawal)

		g.Expect(ok).To(BeTrue())     // Validation ต้องผ่าน
		g.Expect(err).To(BeNil())     // ไม่มีข้อผิดพลาด
	})
}


func TestWithdrawalBankNumber(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`WithdrawalBankNumber should be valid`, func(t *testing.T) {
		withdrawal := entity.Withdrawal{
			WithdrawalAmount:     500,
			WithdrawalCommission: 30,
			WithdrawalNetAmount:  470,
			WithdrawalBankNumber: "1234567890", // หมายเลขบัญชีธนาคารที่ไม่เป็นค่าว่าง
			WithdrawalDate:       time.Now(),
			BankNameID:           1,
			DriverID:             1,
		}
		ok, err := govalidator.ValidateStruct(withdrawal)

		g.Expect(ok).To(BeTrue())     // Validation ต้องผ่าน
		g.Expect(err).To(BeNil())     // ไม่มีข้อผิดพลาด
	})
}
