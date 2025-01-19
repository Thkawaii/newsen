package test

import (
	"testing"

	"project-se/entity"
	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestRoomName(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`RoomName is required`, func(t *testing.T) {
		room := entity.Rooms{
			RoomName: "", // ทดสอบชื่อห้องเว้นว่าง
			Capacity: 10,
			TrainerID: 1,
			Detail: "ห้องประชุมใหญ่",
		}

		ok, err := govalidator.ValidateStruct(room)

		g.Expect(ok).NotTo(BeTrue()) // Validate ต้องไม่ผ่าน
		g.Expect(err).NotTo(BeNil()) // ต้องมีข้อผิดพลาด
		g.Expect(err.Error()).To(ContainSubstring("RoomName is required"))
	})
}

func TestRoomCapacity(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`Capacity is required`, func(t *testing.T) {
		room := entity.Rooms{
			RoomName: "Meeting Room A",
			Capacity: 0, // ความจุไม่ถูกต้อง
			TrainerID: 1,
			Detail: "ห้องประชุมใหญ่",
		}

		ok, err := govalidator.ValidateStruct(room)

		g.Expect(ok).NotTo(BeTrue()) // Validate ต้องไม่ผ่าน
		g.Expect(err).NotTo(BeNil()) // ต้องมีข้อผิดพลาด
		g.Expect(err.Error()).To(ContainSubstring("Capacity is required"))
	})
}

func TestRoomTrainerID(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`TrainerID is required`, func(t *testing.T) {
		room := entity.Rooms{
			RoomName: "Meeting Room A",
			Capacity: 10,
			TrainerID: 0, // ไม่มี Trainer
			Detail: "ห้องประชุมใหญ่",
		}

		ok, err := govalidator.ValidateStruct(room)

		g.Expect(ok).NotTo(BeTrue()) // Validate ต้องไม่ผ่าน
		g.Expect(err).NotTo(BeNil()) // ต้องมีข้อผิดพลาด
		g.Expect(err.Error()).To(ContainSubstring("TrainerID is required"))
	})
}

func TestRoomDetail(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`Detail is required`, func(t *testing.T) {
		room := entity.Rooms{
			RoomName: "Meeting Room A",
			Capacity: 10,
			TrainerID: 1,
			Detail: "", // รายละเอียดว่าง
		}

		ok, err := govalidator.ValidateStruct(room)

		g.Expect(ok).NotTo(BeTrue()) // Validate ต้องไม่ผ่าน
		g.Expect(err).NotTo(BeNil()) // ต้องมีข้อผิดพลาด
		g.Expect(err.Error()).To(ContainSubstring("Detail is required"))
	})
}

func TestValidRoom(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`Valid Room`, func(t *testing.T) {
		room := entity.Rooms{
			RoomName: "Meeting Room A",
			Capacity: 10,
			TrainerID: 1,
			Detail: "ห้องประชุมใหญ่",
		}

		ok, err := govalidator.ValidateStruct(room)

		g.Expect(ok).To(BeTrue()) // Validate ต้องผ่าน
		g.Expect(err).To(BeNil()) // ไม่มีข้อผิดพลาด
	})
}
