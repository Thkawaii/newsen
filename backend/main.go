package main

import (
	"github.com/gin-gonic/gin"

	"log"
	"net/http"
	"project-se/adapter/db"
	"project-se/adapter/handler"

	"project-se/config"
	"project-se/controller"
	"project-se/repository"
	"project-se/router"
)

func main() {
	const PORT = "8080" // ระบุพอร์ตที่ต้องการรัน

	// เชื่อมต่อฐานข้อมูล
	db.ConnectDB()
	config.ConnectionDB()
	config.SetupDatabase()

	// Repositories และ Handlers
	bookingRepo := repository.NewBookingRepository(db.DB)
	bookingHandler := handler.NewBookingHandler(bookingRepo)

	promotionRepo := repository.NewPromotionRepository(db.DB)
	promotionHandler := handler.NewPromotionHandler(promotionRepo)

	paymentRepo := repository.NewPaymentRepository(db.DB)
	paymentHandler := handler.NewPaymentHandler(paymentRepo)

	reviewRepo := repository.NewReviewRepository(db.DB)
	reviewHandler := handler.NewReviewHandler(reviewRepo)

	// สร้าง Gin Router
	r := gin.Default()

	// เปิดใช้ CORS Middleware
	r.Use(CORSMiddleware())

	// Route ที่ไม่ต้องการ Authentication
	r.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "API RUNNING... PORT: %s", PORT)
	})

	// Routes ที่เกี่ยวข้องกับ Booking และ Messages
	registerRoutes(r)

	// Router
	router.SetupRoutes(r, bookingHandler, promotionHandler, paymentHandler, reviewHandler)

	// เริ่มต้น Goroutine สำหรับ handleMessages()
	//go handleMessages()

	log.Printf("Server running on localhost:%s", PORT)
	r.Run("localhost:" + PORT)

}

// ฟังก์ชันสำหรับ Register Routes
func registerRoutes(r *gin.Engine) {
		// Route สำหรับ Auth
	r.POST("/signup", controller.SignUp)
	r.POST("/signin", controller.SignIn)

	//passenger
	r.GET("/passenger/:id", controller.GetPassengerByID)

	// Booking
	r.POST("/startlocation", controller.CreateStartLocation)
	r.POST("/destination", controller.CreateDestination)
	r.POST("/bookings", controller.CreateBooking)
	r.GET("/bookings", controller.GetAllBookings)
	r.GET("/bookings/:id", controller.GetBookingByID)
	r.POST("/bookings/:id/accept", controller.AcceptBooking)
	r.POST("/bookings/:id/finish", controller.FinishBooking)

	// WebSocket
	//socketdriverbooking
	r.GET("/ws/driver/:driverID", controller.DriverWebSocketHandler)

	// API ส่งข้อความไปยัง Passenger
	r.POST("/passenger/:passengerId/notify", controller.NotifyPassengerHandler)
	r.GET("/ws/passenger/:passengerId", controller.ConnectPassengerWebSocket)

	// Route สำหรับ WebSocket Passenger chat
	r.GET("/ws/chat/passenger/:bookingID", controller.PassengerWebSocketHandler)
	// Route สำหรับ WebSocket Driver chat
	r.GET("/ws/chat/driver/:bookingID", controller.DriverChatWebSocketHandler)
	// chat
	r.POST("/message", controller.CreateMessage)
	r.GET("/message/:bookingID", controller.GetMessagesByBookingID) // ดึงข้อความตาม Booking ID
	r.GET("/message/chat/:roomChatId", controller.GetChatMessages)

	//roomchat
	r.POST("/roomchat", controller.CreateRoomChat)

	// bookingsttus

	r.PATCH("/bookingstatus/:id", controller.UpdateBookingStatus)   
	r.POST("/bookingstatus", controller.CreateBookingStatus)

	// Route สำหรับดึง 3 สถานที่ล่าสุด
    r.GET("/history-places", controller.GetLatestDestinations)



	// Promotion Routes
	r.GET("/promotions", controller.GetAllPromotion)
	r.GET("/promotion/:id", controller.GetPromotion)
	r.POST("/promotion", controller.CreatePromotion)
	r.PUT("/promotion/:id", controller.UpdatePromotion)
	r.DELETE("/promotion/:id", controller.DeletePromotion)
	//promotion Chrilden
	r.GET("/discounttype", controller.GetAllD)
	r.GET("/statuspromotion", controller.GetAllStatus)

	// Withdrawal Routes
	r.POST("/withdrawal/money", controller.CreateWithdrawal)
	r.GET("/withdrawal/statement", controller.GetAllWithdrawal)  // เพิ่มเส้นทางดึงข้อมูลการถอนเงินทั้งหมด
	r.GET("/withdrawal/statement/:id", controller.GetWithdrawal) // เพิ่มเส้นทางดึงข้อมูลการถอนเงินตาม ID
	r.GET("/commission", controller.GetAllCommission)
	// Withdrawal Chrilden
	r.GET("/bankname", controller.GetAllBankName)

	// Routes สำหรับ Room
	r.GET("/rooms", controller.GetRooms)        // ดึงข้อมูลห้องทั้งหมด
	r.GET("/rooms/:id", controller.GetRoomByID) // ดึงข้อมูลห้องตาม ID
	r.GET("/rooms/edit/:id", controller.GetRoomByID)
	r.POST("/rooms", controller.CreateRoom)       // สร้างห้องใหม่
	r.PATCH("/rooms/:id", controller.UpdateRoom)  // อัปเดตข้อมูลห้อง
	r.DELETE("/rooms/:id", controller.DeleteRoom) // ลบห้อง

	// Routes สำหรับ Trainer
	r.GET("/trainers", controller.GetAllTrainer)        // ดึงข้อมูล Trainer ทั้งหมด
	r.GET("/trainers/:id", controller.GetByIDTrainer)   // ดึงข้อมูล Trainer ตาม ID
	r.POST("/trainers", controller.CreateTrainer)       // สร้าง Trainer ใหม่
	r.PATCH("/trainers/:id", controller.UpdateTrainer)  // อัปเดตข้อมูล Trainer
	r.DELETE("/trainers/:id", controller.DeleteTrainer) // ลบ Trainer

	r.GET("/trainbook", controller.GetTrainBookings)                      // ✅ ดึงข้อมูลการจองทั้งหมด
	r.GET("/trainbook/:id", controller.GetTrainBookingByID)               // ✅ ดึงข้อมูลการจองตาม ID
	r.POST("/trainbook", controller.CreateTrainBookingByRoom)             // ✅ แก้ไขให้เส้นทาง POST ทำงานถูกต้อง
	r.PATCH("/trainbook/:id", controller.UpdateTrainBooking)              // ✅ อัปเดตข้อมูลการจองทั่วไป
	r.PATCH("/trainbook/:id/status", controller.UpdateTrainBookingStatus) // ✅ อัปเดตสถานะการจอง
	r.DELETE("/trainbook/:id", controller.DeleteTrainBooking)             // ✅ ลบข้อมูลการจอง

	r.GET("/gender", controller.GetAllGender)      // ดึงข้อมูล Gender ทั้งหมด
	r.GET("/gender/:id", controller.GetGenderByID) // ดึงข้อมูล Gender ตาม ID

	// Position Routes
	r.GET("/positions", controller.ListPositions)
	r.GET("/position/:id", controller.GetPosition)

	// Employee Routes
	r.GET("/employees", controller.ListEmployees)
	r.GET("/employees/:id", controller.GetEmployee)
	r.POST("/employees", controller.CreateEmployee)
	r.DELETE("/employee/:id", controller.DeleteEmployee)
	r.PATCH("/employee/:id", controller.UpdateEmployee)

	// Driver Routes
	r.GET("/drivers", controller.GetDrivers)         // ดึงข้อมูล Driver ทั้งหมด
	r.GET("/driver/:id", controller.GetDriverDetail) // ดึงข้อมูล Driver ตาม ID
	r.POST("/drivers", controller.CreateDriver)      // สร้าง Driver ใหม่
	r.PATCH("/driver/:id", controller.UpdateDriver)  // อัปเดตข้อมูล Driver ตาม ID
	r.DELETE("/driver/:id", controller.DeleteDriver) // ลบข้อมูล Driver ตาม ID

	// Passenger Routes
	r.POST("/passengers", controller.CreatePassenger)
	r.GET("/passengers", controller.GetPassengers)
	//r.GET("/passenger/:id", controller.GetPassengerDetail)   ถ้าไม่ comment รันไม่ได้ 
	r.PUT("/passenger/:id", controller.UpdatePassenger)
	r.DELETE("/passenger/:id", controller.DeletePassenger)

	// Vehicle Routes
	r.POST("/vehicles", controller.CreateVehicle)
	r.GET("/vehicles", controller.GetVehicles)
	r.GET("/vehicles/:id", controller.GetVehicleDetail)
	r.PUT("/vehicles/:id", controller.UpdateVehicle)
	r.DELETE("/vehicles/:id", controller.DeleteVehicle)

	// VehicleType Routes
	r.GET("/vehicletype/:id", controller.GetVehicleType)
	r.GET("/vehicletypes", controller.ListVehicleTypes)

}

// CORSMiddleware จัดการ Cross-Origin Resource Sharing (CORS)
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// ระบุ Origin ที่อนุญาต (แทนที่ด้วย URL ของ Frontend ของคุณ)
		allowedOrigin := "http://localhost:5173"

		c.Writer.Header().Set("Access-Control-Allow-Origin", allowedOrigin)
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")

		// จัดการ Preflight Request (OPTIONS Method)
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		// ส่งไปยัง Middleware ถัดไป
		c.Next()
	}
}

