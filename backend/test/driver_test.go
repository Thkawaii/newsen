package test

import (
	
	"testing"
	"time"

	"project-se/entity"
	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestFirstname(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`Firstname is required`, func(t *testing.T) {
		driver := entity.Driver{
			Firstname: "", // เว้นว่างเพื่อทดสอบเฉพาะ Firstname
			Lastname:  "Doe",
			PhoneNumber: "0801234567",
			DateOfBirth: time.Now().AddDate(-30, 0, 0),
			IdentificationNumber: "1234567890123",
			DriverLicensenumber: "12345678",
			DriverLicenseExpirationDate: time.Now().AddDate(1, 0, 0),
			Income: 5000.00,
			Email: "john.doe@example.com",
			Password: "password123",
			GenderID: 1,
			LocationID: 1,
			VehicleID: 1,
			EmployeeID: 1,
			DriverStatusID: 1,
			RoleID: 1,
		}

		ok, err := govalidator.ValidateStruct(driver)

		// ตรวจสอบเฉพาะ Firstname
		g.Expect(ok).NotTo(BeTrue()) // Validate ต้องไม่ผ่าน
		g.Expect(err).NotTo(BeNil()) // ต้องมีข้อผิดพลาด
		g.Expect(err.Error()).To(ContainSubstring("Firstname is required"))
	})
}

func TestLastname(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`Lastname is required`, func(t *testing.T) {
		driver := entity.Driver{
			Firstname: "John",
			Lastname:  "", // ทดสอบ Lastname ว่าง
			PhoneNumber: "0801234567",
			DateOfBirth: time.Now().AddDate(-30, 0, 0),
			IdentificationNumber: "1234567890123",
			DriverLicensenumber: "12345678",
			DriverLicenseExpirationDate: time.Now().AddDate(1, 0, 0),
			Income: 5000.00,
			Email: "john.doe@example.com",
			Password: "password123",
			GenderID: 1,
			LocationID: 1,
			VehicleID: 1,
			EmployeeID: 1,
			DriverStatusID: 1,
			RoleID: 1,
		}

		ok, err := govalidator.ValidateStruct(driver)

		// ตรวจสอบเฉพาะ Lastname
		g.Expect(ok).NotTo(BeTrue()) // Validate ต้องไม่ผ่าน
		g.Expect(err).NotTo(BeNil()) // ต้องมีข้อผิดพลาด
		g.Expect(err.Error()).To(ContainSubstring("Lastname is required"))
	})
}


func TestPhoneNumberdriver(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`PhoneNumber is required`, func(t *testing.T) {
		driver := entity.Driver{
			Firstname: "John",
			Lastname:  "Doe",
			PhoneNumber: "", // ทดสอบ PhoneNumber ว่าง
			DateOfBirth: time.Now().AddDate(-30, 0, 0),
			IdentificationNumber: "1234567890123",
			DriverLicensenumber: "12345678",
			DriverLicenseExpirationDate: time.Now().AddDate(1, 0, 0),
			Income: 5000.00,
			Email: "john.doe@example.com",
			Password: "password123",
		}

		ok, err := govalidator.ValidateStruct(driver)

		g.Expect(ok).NotTo(BeTrue()) 
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("PhoneNumber is required"))
	})

	t.Run(`PhoneNumber contain exactly 10 digits`, func(t *testing.T) {
		driver := entity.Driver{
			Firstname: "John",
			Lastname:  "Doe",
			PhoneNumber: "08012345678", // เกิน 10 หลัก
			DateOfBirth: time.Now().AddDate(-30, 0, 0),
			IdentificationNumber: "1234567890123",
			DriverLicensenumber: "12345678",
			DriverLicenseExpirationDate: time.Now().AddDate(1, 0, 0),
			Income: 5000.00,
			Email: "john.doe@example.com",
			Password: "password123",
		}

		ok, err := govalidator.ValidateStruct(driver)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("PhoneNumber must start with 0 and contain exactly 10 digits"))
	})

	t.Run(`PhoneNumber must start with 0`, func(t *testing.T) {
		driver := entity.Driver{
			Firstname: "John",
			Lastname:  "Doe",
			PhoneNumber: "1801234567", // ไม่เริ่มด้วย 0
			DateOfBirth: time.Now().AddDate(-30, 0, 0),
			IdentificationNumber: "1234567890",
			DriverLicensenumber: "12345678",
			DriverLicenseExpirationDate: time.Now().AddDate(1, 0, 0),
			Income: 5000.00,
			Email: "john.doe@example.com",
			Password: "password123",
		}

		ok, err := govalidator.ValidateStruct(driver)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("PhoneNumber must start with 0 and contain exactly 10 digits"))
	})

}

func TestDateOfBirth(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`DateOfBirth is required`, func(t *testing.T) {
		driver := entity.Driver{
			Firstname: "John",
			Lastname:  "Doe",
			PhoneNumber: "0801234567",
			DateOfBirth: time.Time{}, // ไม่กำหนดค่าวันเกิด
			IdentificationNumber: "1234567890123",
			DriverLicensenumber: "12345678",
			DriverLicenseExpirationDate: time.Now().AddDate(1, 0, 0),
			Income: 5000.00,
			Email: "john.doe@example.com",
			Password: "password123",
			GenderID: 1,
			LocationID: 1,
			VehicleID: 1,
			EmployeeID: 1,
			DriverStatusID: 1,
			RoleID: 1,
		}

		ok, err := govalidator.ValidateStruct(driver)

		// ตรวจสอบเฉพาะ DateOfBirth
		g.Expect(ok).NotTo(BeTrue()) // Validate ต้องไม่ผ่าน
		g.Expect(err).NotTo(BeNil()) // ต้องมีข้อผิดพลาด
		g.Expect(err.Error()).To(ContainSubstring("DateOfBirth is required"))
	})
}

func TestIncome(t *testing.T) {
	g := NewGomegaWithT(t)

	//  ทดสอบ Income เป็นค่าว่าง
	t.Run(`Income is required`, func(t *testing.T) {
		driver := entity.Driver{
			Firstname: "John",
			Lastname:  "Doe",
			PhoneNumber: "0801234567",
			DateOfBirth: time.Now().AddDate(-30, 0, 0),
			IdentificationNumber: "1234567890123",
			DriverLicensenumber: "12345678",
			DriverLicenseExpirationDate: time.Now().AddDate(1, 0, 0),
			Income: 0.0, // ไม่กำหนดค่า Income
			Email: "john.doe@example.com",
			Password: "password123",
			GenderID: 1,
			LocationID: 1,
			VehicleID: 1,
			EmployeeID: 1,
			DriverStatusID: 1,
			RoleID: 1,
		}

		ok, err := govalidator.ValidateStruct(driver)

		// ตรวจสอบเฉพาะ Income
		g.Expect(ok).NotTo(BeTrue()) // Validate ต้องไม่ผ่าน
		g.Expect(err).NotTo(BeNil()) // ต้องมีข้อผิดพลาด
		g.Expect(err.Error()).To(ContainSubstring("Income is required"))
	})

	//  ทดสอบ Income ไม่ใช่ตัวเลข (กรณีที่ใช้ค่าไม่ถูกต้องใน struct)
	t.Run(`Income must be a valid number`, func(t *testing.T) {
		driver := entity.Driver{
			Firstname: "John",
			Lastname:  "Doe",
			PhoneNumber: "0801234567",
			DateOfBirth: time.Now().AddDate(-30, 0, 0),
			IdentificationNumber: "1234567890123",
			DriverLicensenumber: "12345678",
			DriverLicenseExpirationDate: time.Now().AddDate(1, 0, 0),
			Income: -1000.50, // ทดสอบค่าที่อาจไม่ถูกต้องตามตรรกะ
			Email: "john.doe@example.com",
			Password: "password123",
			GenderID: 1,
			LocationID: 1,
			VehicleID: 1,
			EmployeeID: 1,
			DriverStatusID: 1,
			RoleID: 1,
		}

		ok, err := govalidator.ValidateStruct(driver)

		// ตรวจสอบว่า Income ต้องเป็นค่าที่เหมาะสม
		g.Expect(ok).To(BeTrue()) // Validate ควรผ่าน เพราะค่าที่กำหนดยังเป็น float64
		g.Expect(err).To(BeNil()) // ไม่ควรมีข้อผิดพลาด
	})
}

func TestPassword(t *testing.T) {
	g := NewGomegaWithT(t)

	//  ทดสอบ Password เป็นค่าว่าง
	t.Run(`Password is required`, func(t *testing.T) {
		driver := entity.Driver{
			Firstname: "John",
			Lastname:  "Doe",
			PhoneNumber: "0801234567",
			DateOfBirth: time.Now().AddDate(-30, 0, 0),
			IdentificationNumber: "1234567890123",
			DriverLicensenumber: "12345678",
			DriverLicenseExpirationDate: time.Now().AddDate(1, 0, 0),
			Income: 5000.00,
			Email: "john.doe@example.com",
			Password: "", // ทดสอบ Password เป็นค่าว่าง
			GenderID: 1,
			LocationID: 1,
			VehicleID: 1,
			EmployeeID: 1,
			DriverStatusID: 1,
			RoleID: 1,
		}

		ok, err := govalidator.ValidateStruct(driver)

		// ตรวจสอบเฉพาะ Password
		g.Expect(ok).NotTo(BeTrue()) // Validate ต้องไม่ผ่าน
		g.Expect(err).NotTo(BeNil()) // ต้องมีข้อผิดพลาด
		g.Expect(err.Error()).To(ContainSubstring("Password is required"))
	})

	//  ทดสอบ Password มีค่า
	t.Run(`Password is valid`, func(t *testing.T) {
		driver := entity.Driver{
			Firstname: "John",
			Lastname:  "Doe",
			PhoneNumber: "0801234567",
			DateOfBirth: time.Now().AddDate(-30, 0, 0),
			IdentificationNumber: "1234567890123",
			DriverLicensenumber: "12345678",
			DriverLicenseExpirationDate: time.Now().AddDate(1, 0, 0),
			Income: 5000.00,
			Email: "john.doe@example.com",
			Password: "StrongPassword123!", // ทดสอบ Password ที่ถูกต้อง
			GenderID: 1,
			LocationID: 1,
			VehicleID: 1,
			EmployeeID: 1,
			DriverStatusID: 1,
			RoleID: 1,
		}

		ok, err := govalidator.ValidateStruct(driver)

		// ตรวจสอบว่า Password ถูกต้อง
		g.Expect(ok).To(BeTrue()) // Validate ต้องผ่าน
		g.Expect(err).To(BeNil()) // ต้องไม่มีข้อผิดพลาด
	})
}


func TestIdentificationNumber(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`IdentificationNumber is required`, func(t *testing.T) {
		driver := entity.Driver{
			Firstname: "John",
			Lastname:  "Doe",
			PhoneNumber: "0801234567",
			DateOfBirth: time.Now().AddDate(-30, 0, 0),
			IdentificationNumber: "", // เว้นว่างไว้เพื่อทดสอบเฉพาะ IdentificationNumber
			DriverLicensenumber: "12345678",
			DriverLicenseExpirationDate: time.Now().AddDate(1, 0, 0),
			Income: 5000.00,
			Email: "john.doe@example.com",
			Password: "password123",
			GenderID: 1,
			LocationID: 1,
			VehicleID: 1,
			EmployeeID: 1,
			DriverStatusID: 1,
			RoleID: 1,
		}

		ok, err := govalidator.ValidateStruct(driver)

		// ตรวจสอบเฉพาะ IdentificationNumber
		g.Expect(ok).NotTo(BeTrue()) // Validate ต้องไม่ผ่าน
		g.Expect(err).NotTo(BeNil()) // ต้องมีข้อผิดพลาด
		g.Expect(err.Error()).To(ContainSubstring("IdentificationNumber is required"))
	})

	t.Run(`IdentificationNumber must contain exactly 13 digits`, func(t *testing.T) {
		driver := entity.Driver{
			Firstname: "John",
			Lastname:  "Doe",
			PhoneNumber: "0801234567",
			DateOfBirth: time.Now().AddDate(-30, 0, 0),
			IdentificationNumber: "1478954652148745", // เกิน 13 ตัว
			DriverLicensenumber: "12345678",
			DriverLicenseExpirationDate: time.Now().AddDate(1, 0, 0),
			Income: 5000.00,
			Email: "john.doe@example.com",
			Password: "password123",
			GenderID: 1,
			LocationID: 1,
			VehicleID: 1,
			EmployeeID: 1,
			DriverStatusID: 1,
			RoleID: 1,
		}

		ok, err := govalidator.ValidateStruct(driver)

		// ตรวจสอบเฉพาะ IdentificationNumber
		g.Expect(ok).NotTo(BeTrue()) // Validate ต้องไม่ผ่าน
		g.Expect(err).NotTo(BeNil()) // ต้องมีข้อผิดพลาด
		g.Expect(err.Error()).To(ContainSubstring("IdentificationNumber must contain exactly 13 digits"))
	})
}

func TestDriverLicensenumber(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`DriverLicensenumber is required`, func(t *testing.T) {
		driver := entity.Driver{
			Firstname: "John",
			Lastname:  "Doe",
			PhoneNumber: "0801234567",
			DateOfBirth: time.Now().AddDate(-30, 0, 0),
			IdentificationNumber: "1234578454685",
			DriverLicensenumber: "",// เว้นว่างไว้
			DriverLicenseExpirationDate: time.Now().AddDate(1, 0, 0),
			Income: 5000.00,
			Email: "john.doe@example.com",
			Password: "password123",
			GenderID: 1,
			LocationID: 1,
			VehicleID: 1,
			EmployeeID: 1,
			DriverStatusID: 1,
			RoleID: 1,
		}

		ok, err := govalidator.ValidateStruct(driver)

		// ตรวจสอบเฉพาะ IdentificationNumber
		g.Expect(ok).NotTo(BeTrue()) // Validate ต้องไม่ผ่าน
		g.Expect(err).NotTo(BeNil()) // ต้องมีข้อผิดพลาด
		g.Expect(err.Error()).To(ContainSubstring("DriverLicensenumber is required"))
	})

	t.Run(`IdentificationNumber must contain exactly 13 digits`, func(t *testing.T) {
		driver := entity.Driver{
			Firstname: "John",
			Lastname:  "Doe",
			PhoneNumber: "0801234567",
			DateOfBirth: time.Now().AddDate(-30, 0, 0),
			IdentificationNumber: "1234578454685", 
			DriverLicensenumber: "5877123456",	// เกิน 8 ตัว
			DriverLicenseExpirationDate: time.Now().AddDate(1, 0, 0),
			Income: 5000.00,
			Email: "john.doe@example.com",
			Password: "password123",
			GenderID: 1,
			LocationID: 1,
			VehicleID: 1,
			EmployeeID: 1,
			DriverStatusID: 1,
			RoleID: 1,
		}

		ok, err := govalidator.ValidateStruct(driver)

		// ตรวจสอบเฉพาะ IdentificationNumber
		g.Expect(ok).NotTo(BeTrue()) // Validate ต้องไม่ผ่าน
		g.Expect(err).NotTo(BeNil()) // ต้องมีข้อผิดพลาด
		g.Expect(err.Error()).To(ContainSubstring("DriverLicensenumber must contain exactly 8 digits"))
	})
}

func TestEmaildriver(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`Email is required`, func(t *testing.T) {
		driver := entity.Driver{
			Firstname: "John",
			Lastname:  "Doe",
			PhoneNumber: "0801234567",
			DateOfBirth: time.Now().AddDate(-30, 0, 0),
			IdentificationNumber: "1234567890123",
			DriverLicensenumber: "12345678",
			DriverLicenseExpirationDate: time.Now().AddDate(1, 0, 0),
			Income: 5000.00,
			Email: "", // ทดสอบ Email เว้นว่างไว้
			Password: "password123",
			GenderID: 1,
			LocationID: 1,
			VehicleID: 1,
			EmployeeID: 1,
			DriverStatusID: 1,
			RoleID: 1,
		}

		ok, err := govalidator.ValidateStruct(driver)

		// ตรวจสอบเฉพาะ Email
		g.Expect(ok).NotTo(BeTrue()) // การ Validate ต้องไม่ผ่าน
		g.Expect(err).NotTo(BeNil()) // ต้องมีข้อผิดพลาด
		g.Expect(err.Error()).To(ContainSubstring("Email is required"))
	})

	t.Run(`Email format is invalid`, func(t *testing.T) {
		driver := entity.Driver{
			Firstname: "John",
			Lastname:  "Doe",
			PhoneNumber: "0801234567",
			DateOfBirth: time.Now().AddDate(-30, 0, 0),
			IdentificationNumber: "1234567890123",
			DriverLicensenumber: "12345678",
			DriverLicenseExpirationDate: time.Now().AddDate(1, 0, 0),
			Income: 5000.00,
			Email: "invalid-email", // ฟอร์แมตอีเมลไม่ถูกต้อง
			Password: "password123",
			GenderID: 1,
			LocationID: 1,
			VehicleID: 1,
			EmployeeID: 1,
			DriverStatusID: 1,
			RoleID: 1,
		}

		ok, err := govalidator.ValidateStruct(driver)

		// ตรวจสอบรูปแบบ Email
		g.Expect(ok).NotTo(BeTrue()) // การ Validate ต้องไม่ผ่าน
		g.Expect(err).NotTo(BeNil()) // ต้องมีข้อผิดพลาด
		g.Expect(err.Error()).To(ContainSubstring("Email is invalid"))
	})
}

func TestDriverLicenseExpirationDate(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`DriverLicenseExpirationDate is required`, func(t *testing.T) {
		driver := entity.Driver{
			Firstname: "John",
			Lastname:  "Doe",
			PhoneNumber: "0801234567",
			DateOfBirth: time.Now().AddDate(-30, 0, 0),
			IdentificationNumber: "1234567890123",
			DriverLicensenumber: "12345678",
			DriverLicenseExpirationDate: time.Time{}, // ไม่กำหนดวันหมดอายุใบขับขี่
			Income: 5000.00,
			Email: "john.doe@example.com",
			Password: "password123",
			GenderID: 1,
			LocationID: 1,
			VehicleID: 1,
			EmployeeID: 1,
			DriverStatusID: 1,
			RoleID: 1,
		}

		ok, err := govalidator.ValidateStruct(driver)

		// ตรวจสอบเฉพาะ DriverLicenseExpirationDate
		g.Expect(ok).NotTo(BeTrue()) // การ Validate ต้องไม่ผ่าน
		g.Expect(err).NotTo(BeNil()) // ต้องมีข้อผิดพลาด
		g.Expect(err.Error()).To(ContainSubstring("DriverLicenseExpirationDate is required"))
	})
}


func TestValidDriver(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`Valid Driver`, func(t *testing.T) {
		driver := entity.Driver{
			Firstname: "John",
			Lastname:  "Doe",
			PhoneNumber: "0801234567",
			DateOfBirth: time.Now().AddDate(-30, 0, 0),
			IdentificationNumber: "1234567890123",
			DriverLicensenumber: "12345612",
			DriverLicenseExpirationDate: time.Now().AddDate(1, 0, 0),
			Income: 5000.00,
			Email: "john.doe@example.com",
			Password: "password123",
			GenderID: 1,
			LocationID: 1,
			VehicleID: 1,
			EmployeeID: 1,
			DriverStatusID: 1,
			RoleID: 1,
		}

		ok, err := govalidator.ValidateStruct(driver)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}
