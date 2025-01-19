package router

import (
	"project-se/adapter/handler"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine, bookingHandler *handler.BookingHandler, promotionHandler *handler.PromotionHandler, paymentHandler *handler.PaymentHandler, reviewHandler *handler.ReviewHandler) {
	api := r.Group("/api/v1")

	api.GET("/bookings", bookingHandler.GetAllBookings)
	api.GET("/bookings/:id", bookingHandler.GetBookingByID)

	api.GET("/promotions/check", promotionHandler.CheckPromotionCode)
	api.POST("/payments", paymentHandler.CreatePayment)
	api.PUT("/promotions/use-count", promotionHandler.UpdateUseCount)

	api.POST("/reviews", reviewHandler.CreateReview)
	api.GET("/reviews", reviewHandler.GetAllReviews)
	api.GET("/reviews/:id", reviewHandler.GetReviewByID)
	api.GET("/reviews/driver/:driver_id", reviewHandler.GetReviewsByDriverID)
	api.PUT("/reviews/:id", reviewHandler.UpdateReview)
	api.DELETE("/reviews/:id", reviewHandler.DeleteReview)

	//  WebSocket Payment
	api.POST("/payment-notify", handler.NotifyPaymentClient)
	r.GET("/ws/payment-notify/:id", handler.WebSocketPaymentHandler)
	//  WebSocket Review
	api.POST("/review-notify", handler.NotifyReviewClient)
	r.GET("/ws/review-notify/:id", handler.WebSocketReviewHandler)

}
