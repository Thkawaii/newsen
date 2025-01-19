import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/sider/AdminSidebar";
import { Table, Button, Space, Card, Row, Col, Statistic, Modal } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import Male from "../../assets/male.png";
import Female from "../../assets/female.png";
import {
  listPassenger,
  deletePassenger,
} from "../../services/https/Passenger/index";

const Passenger: React.FC = () => {
  const [passengers, setPassengers] = useState([]);
  const [totalPassengers, setTotalPassengers] = useState(0);
  const [maleCount, setMaleCount] = useState(0);
  const [femaleCount, setFemaleCount] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPassengerId, setCurrentPassengerId] = useState<number | null>(
    null
  );
  const navigate = useNavigate(); // ใช้สำหรับนำทาง

  useEffect(() => {
    const fetchPassengers = async () => {
        try {
          const data = await listPassenger();
          console.log(data); // ตรวจสอบโครงสร้างข้อมูลที่ได้
      
          if (data && Array.isArray(data.passengers)) {
            const passengerArray = data.passengers; // ดึงค่า array ภายใน key "passengers"
            setPassengers(passengerArray);
      
            const malePassengers = passengerArray.filter(
              (psg: any) => psg.Gender && psg.Gender.gender === "Male"
            );
            const femalePassengers = passengerArray.filter(
              (psg: any) => psg.Gender && psg.Gender.gender === "Female"
            );
      
            setMaleCount(malePassengers.length);
            setFemaleCount(femalePassengers.length);
            setTotalPassengers(passengerArray.length);
          } else {
            console.error("Unexpected data format:", data);
            setPassengers([]); // กำหนดค่าเริ่มต้นเป็น array เปล่า
          }
        } catch (error) {
          console.error("Error fetching passengers:", error);
        }
      };      

    fetchPassengers();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const success = await deletePassenger(id);
      if (success) {
        setPassengers(passengers.filter((psg: any) => psg.ID !== id));
        setTotalPassengers(totalPassengers - 1);
      }
    } catch (error) {
      console.error("Error deleting passenger:", error);
    } finally {
      setIsModalVisible(false); // Close the modal
    }
  };

  const showDeleteModal = (id: number) => {
    setCurrentPassengerId(id);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentPassengerId(null);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "ID",
      key: "id",
    },
    {
      title: "ชื่อ",
      dataIndex: "Firstname",
      key: "firstname",
    },
    {
      title: "นามสกุล",
      dataIndex: "Lastname",
      key: "lastname",
    },
    {
      title: "เบอร์โทรศัพท์",
      dataIndex: "PhoneNumber",
      key: "phoneNumber",
    },
    {
      title: "อีเมล",
      dataIndex: "Email",
      key: "email",
    },
    {
      title: "เพศ",
      dataIndex: ["Gender", "gender"],
      key: "gender",
    },
    {
      title: "แก้ไข/ลบ",
      key: "actions",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => navigate(`/Passenger/edit?id=${record.ID}`)} // นำไปยังหน้าแก้ไข
          />
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => showDeleteModal(record.ID)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
      <AdminSidebar />
      <div
        style={{
          flex: 1,
          padding: "20px",
          backgroundColor: "#EDE8FE",
          overflow: "auto",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
          ระบบจัดการสมาชิก
        </h1>

        {/* Summary Section */}
        <Row gutter={[32, 32]} style={{ marginBottom: "30px" }}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card
              bordered={false}
              style={{
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                padding: "16px",
              }}
            >
              <Statistic
                title="จำนวนสมาชิก (ทั้งหมด)"
                value={totalPassengers}
                prefix={<TeamOutlined style={{ marginLeft: "-100px" }} />}
                valueStyle={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  textAlign: "center",
                  marginTop: "10px",
                }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8} lg={6}>
            <Card
              bordered={false}
              style={{
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                padding: "16px",
              }}
            >
              <Statistic
                title="จำนวนสมาชิก (เพศชาย)"
                value={maleCount}
                valueStyle={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  color: "#1890ff",
                  textAlign: "center",
                  marginTop: "10px",
                }}
                prefix={
                  <img
                    src={Male}
                    alt="Male"
                    style={{ marginLeft: "-100px", width: "30px" }}
                  />
                }
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8} lg={6}>
            <Card
              bordered={false}
              style={{
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                padding: "16px",
              }}
            >
              <Statistic
                title="จำนวนสมาชิก (เพศหญิง)"
                value={femaleCount}
                valueStyle={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  color: "#f5222d",
                  textAlign: "center",
                  marginTop: "10px",
                }}
                prefix={
                  <img
                    src={Female}
                    alt="Female"
                    style={{ marginLeft: "-100px", width: "24px" }}
                  />
                }
              />
            </Card>
          </Col>
        </Row>

        {/* Passenger Table */}
        <Table
          dataSource={passengers}
          columns={columns}
          rowKey="ID"
          pagination={{ pageSize: 5 }}
          style={{ backgroundColor: "#fff", borderRadius: "8px" }}
        />
        
        {/* Delete Confirmation Modal */}
        <Modal
          title="Confirm Delete"
          open={isModalVisible} // เปลี่ยนจาก visible เป็น open
          onOk={() => handleDelete(currentPassengerId!)}
          onCancel={handleCancel}
          okText="Confirm"
          cancelText="Cancel"
        >
          <p>Are you sure you want to delete?</p>
        </Modal>
      </div>
    </div>
  );
};

export default Passenger;
