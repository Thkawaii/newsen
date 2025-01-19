package services

import (
	"errors"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v4"
)

// JwtWrapper wraps the signing key and the issuer
type JwtWrapper struct {
	SecretKey       string
	Issuer          string
	ExpirationHours int64
}

// JwtClaim adds email and role as claims to the token
type JwtClaim struct {
	Email    string `json:"email"`
	Role     string `json:"role"`
	jwt.RegisteredClaims // เปลี่ยนเป็น RegisteredClaims
}

// GenerateToken generates a JWT token with email and role
func (j *JwtWrapper) GenerateToken(email string, role string) (signedToken string, err error) {
	claims := &JwtClaim{
		Email: email,
		Role:  role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * time.Duration(j.ExpirationHours))),
			Issuer:    j.Issuer,
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err = token.SignedString([]byte(j.SecretKey))
	if err != nil {
		return "", err
	}

	return signedToken, nil
}

// ValidateToken validates the JWT token and extracts the claims
func (j *JwtWrapper) ValidateToken(signedToken string) (claims *JwtClaim, err error) {
	token, err := jwt.ParseWithClaims(
		signedToken,
		&JwtClaim{},
		func(token *jwt.Token) (interface{}, error) {
			return []byte(j.SecretKey), nil
		},
	)

	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(*JwtClaim)
	if !ok {
		return nil, errors.New("could not parse claims") // แก้ข้อความ error
	}

	if claims.ExpiresAt.Time.Before(time.Now()) {
		return nil, errors.New("JWT is expired")
	}

	// เพิ่ม Log เพื่อ Debug ค่า Claims
	fmt.Printf("JWT Claims: Email=%s, Role=%s\n", claims.Email, claims.Role)

	return claims, nil
}
