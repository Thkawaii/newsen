package test

import (
    "fmt"
    "testing"
	"time"

    "project-se/entity"
    "github.com/asaskevich/govalidator"
    . "github.com/onsi/gomega"
)

// setupTestTrainBook สร้างข้อมูล TrainBook สำหรับใช้ในแต่ละ Test Case
func setupTestTrainBook() entity.TrainBook {
    driverID := uint(1)
    roomID := uint(1)
    trainerID := uint(1)

    // แปลง string เป็น time.Time
    dateOfBirth, _ := time.Parse("2006-01-02", "1990-01-01")
    licenseExpirationDate, _ := time.Parse("2006-01-02", "2030-01-01")

    return entity.TrainBook{
        RoomID:   roomID,
        DriverID: &driverID,
        Status:   "completed", // ค่าเริ่มต้นที่ถูกต้อง
        Room: entity.Rooms{
            Capacity:  10,
            RoomName:  "Room A",
            TrainerID: trainerID,
			Detail: "This is a valid train book",
        },
        Driver: entity.Driver{
            Firstname:                  "John",
            Lastname:                   "Doe",
            DateOfBirth:                dateOfBirth,
            IdentificationNumber:       "1234567890123",
            DriverLicensenumber:        "12345678", // ปรับให้มี 8 หลัก
            DriverLicenseExpirationDate: licenseExpirationDate,
            Email:                      "driver@example.com",
            PhoneNumber:                "0812345678",
            Income:                     20000.00, // เพิ่ม Income
            Password:                   "password123", // เพิ่ม Password
        },
    }
}

func TestTrainBookRoomID(t *testing.T) {
    g := NewGomegaWithT(t)

    t.Run("Invalid RoomID (Zero)", func(t *testing.T) {
        trainbook := setupTestTrainBook()
        trainbook.RoomID = 0 // RoomID เป็น 0 ซึ่งไม่ถูกต้อง

        ok, err := govalidator.ValidateStruct(trainbook)
        if err != nil {
            fmt.Println("Validation Error:", err.Error())
        }

        g.Expect(ok).NotTo(BeTrue()) // Validate ต้องไม่ผ่าน
        g.Expect(err).NotTo(BeNil()) // ต้องมีข้อผิดพลาด
        g.Expect(err.Error()).To(ContainSubstring("RoomID is required"))
    })
}

func TestTrainBookDriverID(t *testing.T) {
    g := NewGomegaWithT(t)

    t.Run("Invalid DriverID (Nil)", func(t *testing.T) {
        trainbook := setupTestTrainBook()
        trainbook.DriverID = nil // DriverID เป็น nil ซึ่งไม่ถูกต้อง

        ok, err := govalidator.ValidateStruct(trainbook)
        if err != nil {
            fmt.Println("Validation Error:", err.Error())
        }

        g.Expect(ok).NotTo(BeTrue()) // Validate ต้องไม่ผ่าน
        g.Expect(err).NotTo(BeNil()) // ต้องมีข้อผิดพลาด
        g.Expect(err.Error()).To(ContainSubstring("DriverID is required"))
    })
}

func TestTrainBookStatus(t *testing.T) {
    g := NewGomegaWithT(t)

    t.Run("Invalid Status (Empty)", func(t *testing.T) {
        trainbook := setupTestTrainBook()
        trainbook.Status = "" // Status เป็นค่าว่าง ซึ่งไม่ถูกต้อง

        ok, err := govalidator.ValidateStruct(trainbook)
        if err != nil {
            fmt.Println("Validation Error:", err.Error())
        }

        g.Expect(ok).NotTo(BeTrue()) // Validate ต้องไม่ผ่าน
        g.Expect(err).NotTo(BeNil()) // ต้องมีข้อผิดพลาด
        g.Expect(err.Error()).To(ContainSubstring("Status is required"))
    })

    t.Run("Invalid Status (Unknown Value)", func(t *testing.T) {
        trainbook := setupTestTrainBook()
        trainbook.Status = "unknown" // Status ไม่ตรงกับเงื่อนไข

        ok, err := govalidator.ValidateStruct(trainbook)
        if err != nil {
            fmt.Println("Validation Error:", err.Error())
        }

        g.Expect(ok).NotTo(BeTrue()) // Validate ต้องไม่ผ่าน
        g.Expect(err).NotTo(BeNil()) // ต้องมีข้อผิดพลาด
        g.Expect(err.Error()).To(ContainSubstring("Status must be 'completed' or 'in-progress'"))
    })
}

func TestValidTrainBook(t *testing.T) {
    g := NewGomegaWithT(t)

    t.Run("Valid TrainBook", func(t *testing.T) {
        trainbook := setupTestTrainBook()

        ok, err := govalidator.ValidateStruct(trainbook)
        if err != nil {
            fmt.Println("Validation Error:", err.Error())
        }

        g.Expect(ok).To(BeTrue()) // Validate ต้องผ่าน
        g.Expect(err).To(BeNil()) // ต้องไม่มีข้อผิดพลาด
    })
}
