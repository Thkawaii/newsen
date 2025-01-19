/*import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Avatar, Button, Input, Form, message, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { fetchUserData, updateUserData } from "../../services/https/passenger/passenger"; // ใช้ฟังก์ชัน fetch และ update

const { Title, Text } = Typography;

const EditProfile: React.FC = () => {
  const [passengerData, setPassengerData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("id");
    const userRole = localStorage.getItem("role");
    const token = localStorage.getItem("token");

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

  const handleSubmit = async (values: any) => {
    setLoading(true);
    const userId = localStorage.getItem("id");
    const userRole = localStorage.getItem("role");

    try {
      await updateUserData(userId, userRole, values);
      message.success("Profile updated successfully!");
      navigate("/profile");
    } catch (err) {
      console.error("Error updating profile:", err);
      message.error("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
        <Title level={3}>Edit Profile</Title>
        <Form
          initialValues={{
            first_name: passengerData.first_name,
            last_name: passengerData.last_name,
            email: passengerData.email,
            phone: passengerData.phone,
          }}
          onFinish={handleSubmit}
        >
          <Form.Item
            label="First Name"
            name="first_name"
            rules={[{ required: true, message: "Please input your first name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="last_name"
            rules={[{ required: true, message: "Please input your last name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: "Please input your phone number!" }]}
          >
            <Input />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={loading}>
            Save Changes
          </Button>
        </Form>
        <Button
          type="default"
          style={{ marginTop: "10px" }}
          onClick={() => navigate("/profile")}
        >
          Cancel
        </Button>
      </Card>
    </div>
  );
};

export default EditProfile;*/
