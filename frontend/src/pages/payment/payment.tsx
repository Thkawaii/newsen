import React, { useState, useEffect } from "react";
import "./payment.css";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import TrueMoneyQR from "../../assets/2.png";
import PromptPayQR from "../../assets/3.png";
import AlipayQR from "../../assets/4.png";
import LinePayQR from "../../assets/5.png";
import VisaIcon from "../../assets/visa.png";
import MasterCardIcon from "../../assets/mastercard.png";
import AmexIcon from "../../assets/amex.png";
import JCBIcon from "../../assets/jcb.png";
import DiscoverIcon from "../../assets/discover.png";
import DinersIcon from "../../assets/diners.png";
import UnionPayIcon from "../../assets/unionpay.png";
import OtherCardIcon from "../../assets/OtherCard.png";
import { apiRequest } from "../../config/ApiService";
import { Endpoint } from "../../config/Endpoint";
import { patchBookingStatus } from "../../services/https/statusbooking/statusbooking"; //อัพเดตสถานนะการจ่ายเงิน
import CircularProgress from "@mui/material/CircularProgress/CircularProgress";
import { Alert } from "@mui/material";

const Payment: React.FC = () => {
  const [method, setMethod] = useState<string | null>(null);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardholderName: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  });
  const [cardType, setCardType] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [wallet, setWallet] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [waitingDriver, setWaitingDriver] = useState(0);
  // const [isPaid, setIsPaid] = useState(false); // ติดตามสถานะ paid
  const [isSubmitting, setIsSubmitting] = useState(false); // เพิ่ม state สำหรับป้องกันการส่งซ้ำ
  const [notifyPayment, setNotifyPayment] = useState(false);
  const navigate = useNavigate();

  const location = useLocation();
  const { paymenyAmount, promotionId, bookingId, driverId, passengerId } =
    location.state || {};

  // WebSocket Waiting Driver
  useEffect(() => {
    if (!bookingId) {
      console.error("Booking ID not found in location.state");
    }

    // WebSocket URL
    const socket = new WebSocket(
      `ws://localhost:8080/ws/payment-notify/${bookingId}`
    );

    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
      console.log("Message from WebSocket:", event.data);

      // ไปหน้า Review เมื่อกดสำเร็จงาน
      if (event.data === "update") {
        setNotifyPayment(true);

        // แจ้งเตือนขึ้น รอ 19 วิ
        const notificationTimer = setTimeout(() => {
          setNotifyPayment(false);

          //  รอ 1 วิ และไปหน้าต่อไป
          const navigateTimer = setTimeout(() => {
            navigate("/review", {
              state: {
                bookingId: bookingId,
                driverId: driverId,
                passengerId: passengerId,
              },
            });
          }, 1000);

          return () => clearTimeout(navigateTimer);
        }, 19000);

        return () => clearTimeout(notificationTimer);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      socket.close(); // ปิด WebSocket เมื่อ Component ถูก unmount
    };
  }, [bookingId]);

  useEffect(() => {
    setWallet(null);
    setCardDetails({
      cardNumber: "",
      cardholderName: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
    });
    setErrors({});
    setError("");
  }, [method]);

  const handleCardInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "cardNumber") {
      const numericValue = value.replace(/\D/g, "");
      const formattedValue =
        numericValue
          .match(/.{1,4}/g)
          ?.join("-")
          .substr(0, 19) || "";
      setCardDetails((prev) => ({ ...prev, [name]: formattedValue }));
      detectCardType(numericValue);
    } else {
      setCardDetails((prev) => ({ ...prev, [name]: value }));
    }
  };

  const detectCardType = (cardNumber: string) => {
    if (/^4/.test(cardNumber)) {
      setCardType("Visa");
    } else if (/^5[1-5]/.test(cardNumber)) {
      setCardType("MasterCard");
    } else if (/^3[47]/.test(cardNumber)) {
      setCardType("Amex");
    } else if (/^(?:2131|1800|35)/.test(cardNumber)) {
      setCardType("JCB");
    } else if (/^6(?:011|5)/.test(cardNumber)) {
      setCardType("Discover");
    } else if (/^3(?:0[0-5]|[68])/.test(cardNumber)) {
      setCardType("Diners");
    } else if (/^62/.test(cardNumber)) {
      setCardType("UnionPay");
    } else {
      setCardType("OtherCard");
    }
  };

  const validateForm = () => {
    const validationErrors: { [key: string]: string } = {};

    const cardNumberRegex = /^\d{4}-\d{4}-\d{4}-\d{4}$/;

    if (!cardNumberRegex.test(cardDetails.cardNumber)) {
      validationErrors.cardNumber =
        "Card Number must be in XXXX-XXXX-XXXX-XXXX format.";
    }

    if (!cardDetails.cardholderName.trim().includes(" ")) {
      validationErrors.cardholderName =
        "Please enter a valid first and last name.";
    }

    if (!cardDetails.expiryMonth) {
      validationErrors.expiryMonth = "Please select an expiry month.";
    }

    if (!cardDetails.expiryYear) {
      validationErrors.expiryYear = "Please select an expiry year.";
    }

    const cvvRegex = /^\d{3,4}$/;
    if (!cvvRegex.test(cardDetails.cvv)) {
      validationErrors.cvv = "CVV must be exactly 3 or 4 numeric digits.";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleConfirm = async () => {
    try {
      if (!bookingId) {
        alert("Please check bookinID ");
        return;
      }

      if (!method) {
        setError("Please Select Payment Method.");
        return;
      }

      let card: string = "";

      if (method === "wallet") {
        if (!wallet) {
          setError("Please Select Wallet Payment.");
          return;
        } else {
          setError("");
        }
      } else if (method === "card") {
        if (!validateForm()) {
          return;
        } else {
          card = `?card_type=${cardType}`;
        }
      }

      const paymentData = {
        payment_amount: paymenyAmount,
        payment_method: method === "wallet" ? wallet : cardType,
        booking_id: bookingId,
        promotion_id: promotionId === undefined ? null : promotionId,
      };

      const response = await apiRequest(
        "POST",
        Endpoint.PAYMENT + card,
        paymentData
      );

      if (promotionId != undefined || promotionId != null) {
        await apiRequest(
          "PUT",
          `${Endpoint.PROMOTION_USECOUNT}?promotion_id=${promotionId}`
        );
      }

      const data = await patchBookingStatus("paid", bookingId);

      if (data.success) {
        console.log("Booking status updated to paid:", data);
        // setIsPaid(true); // ตั้งสถานะใน Frontend เป็น "paid"
      } else {
        console.error("Failed to update booking status:", data.message);
        //alert(`Failed to update booking status: ${data.message}`);
      }

      if (response) {
        alert("Payment successfully!");
        setWaitingDriver(1);
      } else {
        setError("Payment failed. Please try again.");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(`An error occurred: ${error.message}`);
      } else {
        setError("An unknown error occurred.");
      }
      console.error("Error during payment:", error);
    } finally {
      setIsSubmitting(false); // รีเซ็ตสถานะกำลังส่ง
    }
  };

  const cardTypeIcons = {
    Visa: VisaIcon,
    MasterCard: MasterCardIcon,
    Amex: AmexIcon,
    JCB: JCBIcon,
    Discover: DiscoverIcon,
    Diners: DinersIcon,
    UnionPay: UnionPayIcon,
    OtherCard: OtherCardIcon,
  };

  function GradientCircularProgress() {
    return (
      <React.Fragment>
        <svg width={0} height={0}>
          <defs>
            <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e01cd5" />
              <stop offset="100%" stopColor="#1CB5E0" />
            </linearGradient>
          </defs>
        </svg>
        <CircularProgress
          size={60} // ขยายขนาด
          thickness={6} // ปรับความหนา
          sx={{
            "svg circle": {
              stroke: "url(#my_gradient)", // เพิ่ม gradient
            },
          }}
          style={{ marginBottom: "40px" }}
        />
      </React.Fragment>
    );
  }

  return (
    <div className="nn">
      {waitingDriver == 1 ? (
        <div className="waiting-container">
          {notifyPayment ? (
            <Alert icon={false} severity="success">
              The journey is complete! Please take a moment to review your
              experience with us.
            </Alert>
          ) : (
            <></>
          )}
          <header className="payment-header">
            <h1>
              WAITING
              <br />
              FOR DRIVER
            </h1>
          </header>
          <GradientCircularProgress />
          <div className="loading loading08">
            <span data-text="L">L</span>
            <span data-text="O">O</span>
            <span data-text="A">A</span>
            <span data-text="D">D</span>
            <span data-text="I">I</span>
            <span data-text="N">N</span>
            <span data-text="G">G</span>
          </div>
        </div>
      ) : (
        <div className="payment-container1">
          <header className="payment-header">
            <h1>PAYMENT</h1>
            <div className="step-indicators">
              <div className="step completed"></div>
              <div className="step active"></div>
              <div className="step"></div>
            </div>
          </header>
          <div className="payment-options">
            <div
              className={`payment-option ${
                method === "card" ? "selected" : ""
              }`}
              onClick={() => setMethod("card")}
            >
              <p>Credit/Debit Card</p>
              <div className="image-row">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/349/349221.png"
                  alt="Image 1"
                  className="image-item"
                />
                <img
                  src="https://cdn-icons-png.flaticon.com/128/16174/16174534.png"
                  alt="Image 2"
                  className="image-item"
                />
                <img
                  src="https://cdn-icons-png.flaticon.com/128/311/311147.png"
                  alt="Image 3"
                  className="image-item"
                />
              </div>
            </div>
            <div
              className={`payment-option ${
                method === "wallet" ? "selected" : ""
              }`}
              onClick={() => setMethod("wallet")}
            >
              <p>Digital Wallet</p>
              <img
                src="https://cdn-icons-png.flaticon.com/128/2335/2335451.png"
                alt="Digital Wallet"
                className="payment-option-img"
              />
            </div>
          </div>
          <div>
            {error && <div className="error-message">{error}</div>}
            {/* Wallet Options */}
            {method === "wallet" && (
              <div className="wallet-grid">
                <button
                  className="wallet-btn"
                  onClick={() => {
                    setWallet("truemoney");
                    setError(""); // Clear error when this wallet is selected
                  }}
                >
                  <img
                    src="https://play-lh.googleusercontent.com/eOzvk-ekluYaeLuvDkLb5RJ0KqfFQpodZDnppxPfpEfqEqbNo5erEkmwLBgqP-k-e2kQ"
                    alt="TrueMoney"
                  />
                  <span>TrueMoney</span>
                </button>
                <button
                  className="wallet-btn"
                  onClick={() => {
                    setWallet("promptpay");
                    setError(""); // Clear error when this wallet is selected
                  }}
                >
                  <img
                    src="https://www.bot.or.th/content/dam/bot/icons/icon-thaiqr.png"
                    alt="PromptPay"
                  />
                  <span>PromptPay</span>
                </button>
                <button
                  className="wallet-btn"
                  onClick={() => {
                    setWallet("alipay");
                    setError(""); // Clear error when this wallet is selected
                  }}
                >
                  <img
                    src="https://cdn.techinasia.com/data/images/c91cff808dad89b1dd21f6f3f433c521.png"
                    alt="Alipay"
                  />
                  <span>Alipay</span>
                </button>
                <button
                  className="wallet-btn"
                  onClick={() => {
                    setWallet("linepay");
                    setError(""); // Clear error when this wallet is selected
                  }}
                >
                  <img
                    src="https://d.line-scdn.net/linepay/portal/v-241028/portal/assets/img/linepay-logo-jp-gl.png"
                    alt="Line Pay"
                  />
                  <span>Line Pay</span>
                </button>
              </div>
            )}
          </div>
          {wallet === "truemoney" && (
            <div className="qr-code-section">
              <h2>Scan the QR Code</h2>
              <img
                className="qr-code-img"
                src={TrueMoneyQR}
                alt="TrueMoneyQR"
              />
            </div>
          )}
          {wallet === "promptpay" && (
            <div className="qr-code-section">
              <h2>Scan the QR Code</h2>
              <img
                className="qr-code-img"
                src={PromptPayQR}
                alt="PromptPayQR"
              />
            </div>
          )}
          {wallet === "alipay" && (
            <div className="qr-code-section">
              <h2>Scan the QR Code</h2>
              <img className="qr-code-img" src={AlipayQR} alt="AlipayQR" />
            </div>
          )}
          {wallet === "linepay" && (
            <div className="qr-code-section">
              <h2>Scan the QR Code</h2>
              <img className="qr-code-img" src={LinePayQR} alt="LinePayQR" />
            </div>
          )}

          {method === "card" && (
            <div className="card-details-form">
              <div className="form-group">
                <label htmlFor="cardNumber">Card Number</label>
                <div
                  className="card-number-input"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    placeholder="1234-5678-9012-3456"
                    value={cardDetails.cardNumber}
                    onChange={handleCardInputChange}
                    style={{ flex: 1, color: "#909090" }}
                  />
                  {cardType && cardType in cardTypeIcons && (
                    <img
                      src={
                        cardTypeIcons[cardType as keyof typeof cardTypeIcons]
                      }
                      alt={cardType}
                      className="card-type-icon"
                    />
                  )}
                </div>
                {errors.cardNumber && (
                  <div className="error-message">{errors.cardNumber}</div>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="cardholderName">Cardholder Name</label>
                <input
                  type="text"
                  id="cardholderName"
                  name="cardholderName"
                  placeholder="John Doe"
                  value={cardDetails.cardholderName}
                  style={{ color: "#909090" }}
                  onChange={(e) =>
                    setCardDetails((prev) => ({
                      ...prev,
                      cardholderName: e.target.value,
                    }))
                  }
                />
                {errors.cardholderName && (
                  <div className="error-message">{errors.cardholderName}</div>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="expiryMonth">Expiry Month</label>
                <select
                  id="expiryMonth"
                  name="expiryMonth"
                  value={cardDetails.expiryMonth}
                  onChange={handleCardInputChange}
                  style={{ color: "#909090" }}
                >
                  <option value="">Month</option>
                  {[...Array(12).keys()].map((m) => (
                    <option key={m + 1} value={String(m + 1).padStart(2, "0")}>
                      {String(m + 1).padStart(2, "0")}
                    </option>
                  ))}
                </select>
                {errors.expiryMonth && (
                  <div className="error-message">{errors.expiryMonth}</div>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="expiryYear">Expiry Year</label>
                <select
                  id="expiryYear"
                  name="expiryYear"
                  value={cardDetails.expiryYear}
                  onChange={handleCardInputChange}
                  style={{ color: "#909090" }}
                >
                  <option value="">Year</option>
                  {Array.from(
                    { length: 30 },
                    (_, i) => new Date().getFullYear() + i
                  ).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                {errors.expiryYear && (
                  <div className="error-message">{errors.expiryYear}</div>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="cvv">CVV</label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  placeholder="123"
                  value={cardDetails.cvv}
                  onChange={handleCardInputChange}
                  style={{ color: "#909090" }}
                />
                {errors.cvv && (
                  <div className="error-message">{errors.cvv}</div>
                )}
              </div>
            </div>
          )}

          <div className="button-container">
            <button
              className="ax"
              onClick={handleConfirm} // ใช้ handleConfirmebooking โดยตรง
              disabled={isSubmitting} // ปิดการใช้งานปุ่มขณะกำลังส่ง
            >
              {isSubmitting ? "Processing..." : "Confirm Payment"}
            </button>
            <button className="cx" onClick={() => navigate(-1)}>
              Cancel
            </button>
          </div>
          <Outlet />
        </div>
      )}
    </div>
  );
};
export default Payment;
