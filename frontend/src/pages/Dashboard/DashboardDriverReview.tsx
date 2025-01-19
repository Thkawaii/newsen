import React, { useEffect, useState } from "react";
import { Table } from "antd";
import AdminSidebar from "../../components/sider/DriverSidebar";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { Endpoint } from "../../config/Endpoint";
import { apiRequest } from "../../config/ApiService";
import "./DashboardDriverReview.css";

interface ReviewDriver {
  driver_id: number;
  averageRating: number;
  totalRatings: number;
  reviews: Review[];
}

interface Review {
  review_id: number;
  rating: number;
  comment: string;
  feedback: string;
  booking_id: number;
  passenger_id: number;
  driver_id: number;
}

const DashboardDriverReview: React.FC = () => {
  const [ratingData, setRatingData] = useState<{
    averageRating: number;
    totalRatings: number;
    starDistribution: number[];
    reviews: Review[];
  }>({
    averageRating: 0,
    totalRatings: 0,
    starDistribution: [0, 0, 0, 0, 0],
    reviews: [],
  });

  const [notifyReview, setNotifyReview] = useState(false);

  const driverId = localStorage.getItem("id");

  useEffect(() => {
    fetchData();
  }, []);

  // Reset notifyReview to false after 20 seconds
  useEffect(() => {
    if (notifyReview) {
      const timer = setTimeout(() => {
        setNotifyReview(false);
      }, 20000); // 20 seconds

      return () => clearTimeout(timer); // Cleanup timer
    }
  }, [notifyReview]);

  // WebSocket Waiting Driver
  useEffect(() => {
    if (!driverId) {
      console.error("Driver ID not found in localStorage");
    }

    // WebSocket URL
    const socket = new WebSocket(
      `ws://localhost:8080/ws/review-notify/${driverId}`
    );

    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
      console.log("Message from WebSocket:", event.data);

      // แจ้งเตือนเมื่อมีรีวิว
      if (event.data === "update") {
        setNotifyReview(true);
        fetchData();
      }
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      socket.close(); // ปิด WebSocket เมื่อ Component ถูก unmount
    };
  }, [driverId]);

  const fetchData = async () => {
    try {
      const response: ReviewDriver = await apiRequest(
        "GET",
        `${Endpoint.REVIEW_DRIVER}/${driverId}`
      );
      const starDistribution = [0, 0, 0, 0, 0];

      // Calculate star distribution
      response.reviews.forEach((review) => {
        if (review.rating >= 1 && review.rating <= 5) {
          starDistribution[5 - review.rating]++;
        }
      });

      // Update state with fetched data
      setRatingData({
        averageRating: response.averageRating,
        totalRatings: response.totalRatings,
        starDistribution,
        reviews: response.reviews,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const columns = [
    {
      title: "Passenger",
      dataIndex: "passenger_id",
      key: "passenger_id",
    },
    {
      title: "Feedback",
      dataIndex: "feedback",
      key: "feedback",
    },
    {
      title: "Stars",
      dataIndex: "rating",
      key: "rating",
      render: (rating: number) => renderStars(rating),
    },
  ];

  const renderStars = (average: number) => {
    const fullStars = Math.floor(average);
    const hasHalfStar = average % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} color="#FFD700" size={20} />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" color="#FFD700" size={20} />);
    }

    while (stars.length < 5) {
      stars.push(
        <FaRegStar key={`empty-${stars.length}`} color="#DDD" size={20} />
      );
    }

    return stars;
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
      <AdminSidebar />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#EDE8FE",
          overflow: "auto",
        }}
      >
        {/* Alert Section */}
        {notifyReview ? (
          <div
            style={{
              backgroundColor: "#FFF",
              borderRadius: "10px",
              padding: "10px 20px",
              marginBottom: "20px",
              fontSize: "18px",
              fontWeight: "bold",
              color: "#000",
              textAlign: "center",
              width: "80%",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              fontFamily: "Comic Sans MS, sans-serif",
            }}
          >
            “New review alert! See what our passenger loved about their
            journey!”
          </div>
        ) : (
          <div
            style={{
              borderRadius: "10px",
              padding: "10px 20px",
              marginBottom: "20px",
              fontSize: "18px",
              fontWeight: "bold",
              color: "#000",
              textAlign: "center",
              width: "80%",
            }}
          ></div>
        )}

        {/* Review Section */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "flex-start",
            backgroundColor: "#D4BAF5",
            borderRadius: "20px",
            padding: "20px",
            width: "90%",
            height: "80vh",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Passenger Feedback */}
          <div
            style={{
              flex: 1,
              padding: "10px",
              backgroundColor: "#F5E6FF",
              borderRadius: "10px",
              marginRight: "10px",
            }}
          >
            <h2
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: "15px",
                color: "#552D88",
                fontFamily: "Comic Sans MS, sans-serif",
              }}
            >
              Review By
            </h2>
            <Table
              className="custom-ant-table"
              columns={columns}
              dataSource={ratingData.reviews}
              pagination={false}
              scroll={{ y: 435 }}
              style={{
                backgroundColor: "#FFF",
                borderRadius: "10px",
                minHeight: "495px",
              }}
            />
          </div>

          {/* Rating Overview */}
          <div
            style={{
              flex: 1,
              padding: "10px",
              backgroundColor: "#FFF",
              borderRadius: "10px",
              marginLeft: "10px",
              textAlign: "center",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              minHeight: "575px",
            }}
          >
            <h2
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                marginBottom: "20px",
                color: "#552D88",
                fontFamily: "Comic Sans MS, sans-serif",
              }}
            >
              Rating overview
            </h2>
            <div
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                color: "#552D88",
                marginBottom: "10px",
                fontFamily: "Comic Sans MS, sans-serif",
              }}
            >
              {ratingData.averageRating.toFixed(1)}/5
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "20px",
              }}
            >
              {renderStars(ratingData.averageRating)}
            </div>
            <div
              style={{
                fontSize: "14px",
                color: "#888",
                marginBottom: "30px",
                fontFamily: "Comic Sans MS, sans-serif",
              }}
            >
              {ratingData.totalRatings} Ratings
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              {[5, 4, 3, 2, 1].map((stars) => (
                <div
                  key={stars}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    marginBottom: "5px",
                    fontFamily: "Comic Sans MS, sans-serif",
                  }}
                >
                  <span style={{ color: "#333", marginRight: "5px", flex: 1 }}>
                    {stars} ★
                  </span>
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "10px",
                      backgroundColor: "#DDD",
                      borderRadius: "5px",
                      flex: 3,
                      marginLeft: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: `${
                          (ratingData.starDistribution[5 - stars] /
                            ratingData.totalRatings) *
                          100
                        }%`,
                        height: "100%",
                        backgroundColor: "#FFD700",
                        borderRadius: "5px",
                      }}
                    ></div>
                  </div>
                  <span
                    style={{
                      color: "#888",
                      fontSize: "14px",
                      marginLeft: "10px",
                      marginRight: "20px",
                      textAlign: "right",
                      flex: 1,
                      fontFamily: "Comic Sans MS, sans-serif",
                    }}
                  >
                    {ratingData.starDistribution[5 - stars]} Ratings
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardDriverReview;
