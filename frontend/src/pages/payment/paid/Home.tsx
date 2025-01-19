import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import "./Home.css";
import { fetchBooking } from "../services/api";
import {
  BookingInterface,
  PromotionResponseInterface,
} from "../interfaces/PaidInterface";
import { apiRequest } from "../../../config/ApiService";
import { Endpoint } from "../../../config/Endpoint";
const HomePayment: React.FC = () => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [bookingNew, setBookingNew] = useState<BookingInterface | null>(null);
  const [isLoadBooking, setisLoadBooking] = useState(true);
  const [promotionCode, setPromotionCode] = useState("");
  const [promotionId, setPromotionId] = useState<number | null>();
  const [discount, setDiscount] = useState("No discount applied");
  const [summery, setSummery] = useState(0.0);
  const [discountType, setDiscountType] = useState("");
  const [deliveryCost, setDeliveryCost] = useState("FREE");

  const { id } = useParams<{ id: string }>();
  if (!id) {
    alert("No booking ID found in URL");
    return;
  }

  function formatPrice(value: number): string {
    return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const loadBooking = async () => {
    try {
      const bookingId = parseInt(id, 10);
      const data = await fetchBooking(bookingId);

      setBookingNew(data);
      if (data.distance > 5) {
        let sumDeliveryCost: number = (data.distance - 5) * 10;
        setDeliveryCost(`${sumDeliveryCost.toFixed(2)}`);
        setSummery((data.distance - 5) * 10 + data.total_price);
      } else {
        setSummery(data.total_price);
      }
    } catch (error) {
      console.error("Failed to fetch booking:", error);
    } finally {
      setisLoadBooking(false);
    }
  };

  useEffect(() => {
    loadBooking();
  }, []);

  const handleCheckPomotion = async () => {
    if (!promotionCode.trim() || promotionCode === "None") {
      alert("No valid promotion code applied.");
      return;
    }

    setDiscountType("");

    try {
      const response = await apiRequest<PromotionResponseInterface>(
        "GET",
        `${Endpoint.PAYMENT_PROMOTION_CHECK}?code=${promotionCode}&distance=${bookingNew?.distance}&price=${bookingNew?.total_price}`
      );

      if (response.can_use) {
        let d = `${formatPrice(response.details.discount)}`;
        let sum = 0;
        if (bookingNew != null) {
          sum =
            bookingNew.distance > 5
              ? bookingNew.total_price -
                response.discount_value +
                (bookingNew.distance - 5) * 10
              : bookingNew.total_price - response.discount_value;
        }
        setPromotionId(response.promotion_id);
        setSummery(sum);
        setDiscount(d);
        setDiscountType(response.discount_type);
      } else {
        alert(response.message);
        if (bookingNew != null) {
          bookingNew.distance > 5
            ? setSummery(
                bookingNew.total_price + (bookingNew.distance - 5) * 10
              )
            : setSummery(bookingNew.total_price);
        }
        setPromotionCode("");
        setDiscount("No discount applied");
      }
    } catch (error) {
      console.error("Error checking promotion code:", error);
      alert("No such promotional code found.");
      if (bookingNew != null) {
        bookingNew.distance > 5
          ? setSummery(bookingNew.total_price + (bookingNew.distance - 5) * 10)
          : setSummery(bookingNew.total_price);
      }
      setPromotionCode("");
      setDiscount("No discount applied");
    } finally {
      setIsEditMode(false);
    }
  };

  const handleProceed = () => {
    navigate("/payment", {
      state: {
        paymenyAmount: summery,
        promotionId: promotionId,
        bookingId: bookingNew?.id,
        driverId: bookingNew?.driver_id,
        passengerId: bookingNew?.passenger_id,
      },
    });
  };

  const handleMapClick = () => {
    window.open("https://www.google.com/maps", "_blank"); // Replace with actual map URL
  };

  const handleCancel = () => {
    alert("Cancel Payment"); // Show the alert
    navigate("/home");
  };
  const handleEdit = () => {
    setIsEditMode(true);
  };

  return (
    <div className="aa">
      <div className="payment-page">
        {/* Sidebar */}
        {/* <div className="sidebar">
          {menuItems.map((item) => (
            <div
              key={item.name}
              className="menu-item"
              onClick={() => handleMenuClick(item)}
            >
              <img src={item.icon} alt={item.name} className="menu-icon" />
              <p className="menu-text">{item.name}</p>
            </div>
          ))}
        </div> */}

        {/* Main Content */}
        <div className="main-content">
          {/* <video autoPlay muted loop className="xox">
            <source
              src="https://media.istockphoto.com/id/1334409221/th/%E0%B8%A7%E0%B8%B4%E0%B8%94%E0%B8%B5%E0%B9%82%E0%B8%AD/%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%A5%E0%B9%88%E0%B8%99%E0%B9%80%E0%B8%81%E0%B8%A1%E0%B8%82%E0%B8%AD%E0%B8%87%E0%B8%A7%E0%B8%B4%E0%B8%94%E0%B8%B5%E0%B9%82%E0%B8%AD%E0%B9%80%E0%B8%81%E0%B8%A1%E0%B8%88%E0%B9%8D%E0%B8%B2%E0%B8%A5%E0%B8%AD%E0%B8%87%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%81%E0%B8%82%E0%B9%88%E0%B8%87%E0%B8%A3%E0%B8%96%E0%B8%9E%E0%B8%A3%E0%B9%89%E0%B8%AD%E0%B8%A1%E0%B8%AD%E0%B8%B4%E0%B8%99%E0%B9%80%E0%B8%97%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B9%80%E0%B8%9F%E0%B8%8B-%E0%B8%84%E0%B8%AD%E0%B8%A1%E0%B8%9E%E0%B8%B4%E0%B8%A7%E0%B9%80%E0%B8%95%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%AA%E0%B8%A3%E0%B9%89%E0%B8%B2%E0%B8%87%E0%B8%A3%E0%B8%96-3-%E0%B8%A1%E0%B8%B4%E0%B8%95%E0%B8%B4%E0%B8%82%E0%B8%B1%E0%B8%9A%E0%B8%A3%E0%B8%96%E0%B9%80%E0%B8%A3%E0%B9%87%E0%B8%A7.mp4?s=mp4-640x640-is&k=20&c=Ip7fZ-VgYj-qisggItY13xe2CEjmS-0-PPIGDSgdM84="
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>*/}
          <div className="headerx">
            <h1>PAYMENT</h1>
            <div className="progress-indicator">
              <div className="circle filled"></div>
              <div className="circle"></div>
              <div className="circle"></div>
            </div>
          </div>
          <div className="content-wrapper">
            <div className="information-container">
              <h2>INFORMATION</h2>
              <div className="information-details">
                <div className="row">
                  <span className="label-with-icon">
                    <img
                      src="https://cdn-icons-png.flaticon.com/128/854/854904.png"
                      alt="Starting Point Icon"
                      className="info-icon"
                    />
                    Starting Point:
                  </span>
                  <span>
                    {isLoadBooking
                      ? "Loading..."
                      : bookingNew == null
                      ? "None"
                      : bookingNew?.beginning ?? ""}
                  </span>
                </div>
                <div className="row">
                  <span className="label-with-icon">
                    <img
                      src="https://cdn-icons-png.flaticon.com/128/1257/1257385.png"
                      alt="Destination Icon"
                      className="info-icon"
                    />
                    Destination:
                  </span>
                  <span>
                    {isLoadBooking
                      ? "Loading..."
                      : bookingNew == null
                      ? "None"
                      : bookingNew?.terminus ?? ""}
                  </span>
                </div>
                <div className="row">
                  <span className="label-with-icon">
                    <img
                      src="https://cdn-icons-png.flaticon.com/128/5488/5488668.png"
                      alt="Vehicle Type Icon"
                      className="info-icon"
                    />
                    Vehicle Type:
                  </span>
                  <span>
                    {isLoadBooking
                      ? "Loading..."
                      : bookingNew == null
                      ? "None"
                      : bookingNew?.vehicle ?? ""}
                  </span>
                </div>
                <div className="row">
                  <span className="label-with-icon">
                    <img
                      src="https://cdn-icons-png.flaticon.com/128/2382/2382625.png"
                      alt="Estimated Cost Icon"
                      className="info-icon"
                    />
                    Estimated Cost:
                  </span>
                  <span>
                    {isLoadBooking
                      ? "Loading..."
                      : formatPrice(bookingNew?.total_price ?? 0)}{" "}
                    Baht
                  </span>
                </div>
                <div className="row">
                  <span className="promotion-label">
                    <img
                      src="https://cdn-icons-png.flaticon.com/128/6632/6632881.png"
                      alt="Promo Code Icon"
                      className="promo-code-icon"
                    />
                    Promotion Code:
                  </span>
                  {isEditMode ? (
                    <input
                      type="text"
                      value={promotionCode}
                      onChange={(e) => setPromotionCode(e.target.value)}
                      className="promo-input"
                    />
                  ) : (
                    <span className="promo-value">
                      {promotionCode || "None"}
                    </span>
                  )}
                </div>

                {/* Buttons moved to a separate container */}
                <div className="promotion-actions">
                  <button className="used-button" onClick={handleCheckPomotion}>
                    Used
                  </button>
                  <button className="edit-button" onClick={handleEdit}>
                    Edit
                  </button>
                </div>
                <div className="row">
                  <span className="label-with-icon">
                    <img
                      src="https://cdn-icons-png.flaticon.com/128/9341/9341950.png"
                      alt=" Discount Icon"
                      className="info-icon"
                    />
                    <span className="vb">
                      Discount:
                      <span className="io">
                        {discount}{" "}
                        {discountType != ""
                          ? discountType == "percent"
                            ? "%"
                            : "Baht"
                          : ""}
                      </span>
                    </span>
                  </span>
                </div>
                <div className="row">
                  <span className="label-with-icon">
                    <img
                      src="https://cdn-icons-png.flaticon.com/128/870/870181.png"
                      alt="Delivery Cost Icon"
                      className="info-icon"
                    />
                    <span>
                      Delivery Cost:
                      <span>
                        {deliveryCost} {deliveryCost != "FREE" ? "Baht" : ""}
                      </span>
                    </span>
                  </span>
                </div>
                <div className="row">
                  <span className="label-with-icon">
                    <img
                      src="https://cdn-icons-png.flaticon.com/128/6712/6712918.png"
                      alt="Total Cost Icon"
                      className="info-icon"
                    />

                    <span>
                      Total Cost:
                      <span>{summery.toFixed(2)} Baht</span>
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <div className="avatar-container">
              <div
                className="avatar-frame"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
              >
                <div className="blinking-light"></div> {/* Blinking Light */}
                <img
                  src={
                    hovered
                      ? "https://cdn-icons-png.flaticon.com/128/854/854878.png"
                      : "https://cdn-icons-png.flaticon.com/512/16802/16802273.png"
                  }
                  alt="User Avatar"
                  className="avatar-img"
                />
              </div>
              <p className="booking-text">
                Booking:{" "}
                {isLoadBooking
                  ? "No bookings available"
                  : bookingNew == null
                  ? "No bookings available"
                  : bookingNew?.id}
              </p>
              <p className="distance-text">
                Distance:{" "}
                {isLoadBooking
                  ? "Loading..."
                  : bookingNew == null
                  ? "None"
                  : bookingNew?.distance ?? ""}{" "}
                {bookingNew != null ? <span>KM</span> : ""}
              </p>
              <div className="tgx" onClick={handleMapClick}>
                <img
                  src="https://img.freepik.com/premium-vector/map-with-destination-location-point-city-map-with-street-river-gps-map-navigator-concept_34645-1078.jpg"
                  alt="Map Preview"
                  className="map-img"
                />
              </div>
              <p className="map-label">View Map</p>
            </div>
          </div>

          <div className="buttons">
            <button className="proceed-button" onClick={handleProceed}>
              Proceed to Payment
            </button>
            <button className="cancel-button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default HomePayment;
