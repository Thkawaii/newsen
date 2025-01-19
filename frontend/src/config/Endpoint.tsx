export const HOST_SERVE = "http://localhost:8080";
const API = "/api";
const V1 = "/v1";

export const Endpoint = {
  PAYMENT_BOOKING: HOST_SERVE + API + V1 + "/bookings",
  PAYMENT_PROMOTION_CHECK: HOST_SERVE + API + V1 + "/promotions/check",
  PAYMENT: HOST_SERVE + API + V1 + "/payments",
  PROMOTION_USECOUNT: HOST_SERVE + API + V1 + "/promotions/use-count",
  REVIEW: HOST_SERVE + API + V1 + "/reviews",
  REVIEW_DRIVER: HOST_SERVE + API + V1 + "/reviews/driver",
  PAYMENT_NOTIFY: HOST_SERVE + API + V1 + "/payment-notify",
  REVIEW_NOTIFY: HOST_SERVE + API + V1 + "/review-notify",
};
