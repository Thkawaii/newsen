import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Avatar, Button, Typography, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { fetchUserData } from "../../services/https/passenger/passenger"; // นำฟังก์ชัน fetchUserData เข้ามาใช้

const { Title, Text } = Typography;

const PassengerProfile: React.FC = () => {
  const [passengerData, setPassengerData] = useState<any>(null); // เก็บข้อมูลผู้โดยสาร
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("id");
    const userRole = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    console.log("JWT Token:", token);
    console.log("User Role:", userRole);
    console.log("id passenger:",userId)

    if (!userId || !userRole || !token) {
        message.error("Unauthorized access.");
        navigate("/home");
        return;
    }

    if (userRole.toLowerCase() !== "passenger") {
        message.error("Access restricted to passengers only.");
        navigate("/home");
        return;
    }

    fetchUserData(userId, userRole, setPassengerData).catch((err) => {
        console.error("Error fetching user data:", err);
        message.error("Failed to load profile. Please try again.");
    });
}, [navigate]);



    console.log("Passenger Data:", passengerData);


  // ตรวจสอบข้อมูลที่ได้จาก API
  if (!passengerData) {
    return <p>Loading profile...</p>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <Card
        style={{
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
        }}
      >
        <Avatar
          size={100}
          icon={<UserOutlined />}
          style={{ marginBottom: "20px" }}
        />
        <Title level={3}>
          {passengerData.first_name} {passengerData.last_name}
        </Title>
        <Text type="secondary" style={{ display: "block", marginBottom: "10px" }}>
          Email: {passengerData.email || "Not available"}
        </Text>
        <Text style={{ display: "block", marginBottom: "20px" }}>
          Phone: {passengerData.phone || "Not available"}
        </Text>
        <Button
          type="primary"
          style={{ marginRight: "10px" }}
          onClick={() => navigate("/Editprofile")}
        >
          Edit Profile
        </Button>
        <Button type="default" onClick={() => navigate("/home")}>
          Back to Home
        </Button>
      </Card>
    </div>
  );
};

export default PassengerProfile;