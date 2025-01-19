package middlewares

import (
	"fmt"
	"net/http"
	"strings"

	"project-se/services"

	"github.com/gin-gonic/gin"
)

// Authorizes เป็นฟังก์ชันตรวจเช็ค Authorization พร้อม Role
func Authorizes(allowedRoles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		clientToken := c.Request.Header.Get("Authorization")
		if clientToken == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "No Authorization header provided"})
			return
		}

		// แยก Bearer ออกจาก Token
		extractedToken := strings.Split(clientToken, "Bearer ")
		if len(extractedToken) != 2 {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Incorrect Format of Authorization Token"})
			return
		}

		clientToken = strings.TrimSpace(extractedToken[1])

		// Validate Token
		jwtWrapper := services.JwtWrapper{
			SecretKey: "SvNQpBN8y3qlVrsGAYYWoJJk56LtzFHx",
			Issuer:    "AuthService",
		}

		claims, err := jwtWrapper.ValidateToken(clientToken)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			return
		}

		// Debug Log สำหรับตรวจสอบค่า Claims
		fmt.Printf("Debug - Email: %s, Role: %s\n",claims.Email, claims.Role)

		// ตรวจสอบ Role
		isAllowed := false
		for _, role := range allowedRoles {
			if claims.Role == role {
				isAllowed = true
				break
			}
		}

		if !isAllowed {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Access Denied"})
			return
		}

		// เซ็ตข้อมูลลง Context
		c.Set("email", claims.Email)
		c.Set("role", claims.Role)

		c.Next()
	}
}
