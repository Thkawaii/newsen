import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/sider/AdminSidebar";
import { useNavigate } from "react-router-dom";
import { Table, Button, Space, Card, Row, Col, Statistic, Modal } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import Male from "../../assets/male.png";
import Female from "../../assets/female.png";
import { listDrivers, deleteDriver } from "../../services/https/Driver/index";

const Driver: React.FC = () => {
  const [drivers, setDrivers] = useState([]);
  const [totalDrivers, setTotalDrivers] = useState(0);
  const [maleCount, setMaleCount] = useState(0);
  const [femaleCount, setFemaleCount] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentDriverId, setCurrentDriverId] = useState<number | null>(null);
  const navigate = useNavigate(); // ใช้สำหรับนำทาง

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const data = await listDrivers();
        console.log(data); // ตรวจสอบข้อมูลที่ได้จาก API
        setDrivers(data);
        setTotalDrivers(data.length);

        const maleDrivers = data.filter((drv: any) => drv.Gender && drv.Gender.gender === "Male");
        const femaleDrivers = data.filter((drv: any) => drv.Gender && drv.Gender.gender === "Female");

        setMaleCount(maleDrivers.length);
        setFemaleCount(femaleDrivers.length);
      } catch (error) {
        console.error("Error fetching drivers:", error);
      }
    };

    fetchDrivers();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const success = await deleteDriver(id);
      if (success) {
        setDrivers(drivers.filter((drv: any) => drv.ID !== id));
        setTotalDrivers(totalDrivers - 1);

        const maleDrivers = drivers.filter(
          (drv: any) => drv.ID !== id && drv.Gender?.gender === "Male"
        );
        const femaleDrivers = drivers.filter(
          (drv: any) => drv.ID !== id && drv.Gender?.gender === "Female"
        );

        setMaleCount(maleDrivers.length);
        setFemaleCount(femaleDrivers.length);
      }
    } catch (error) {
      console.error("Error deleting driver:", error);
    } finally {
      setIsModalVisible(false);
    }
  };

  const showDeleteModal = (id: number) => {
    setCurrentDriverId(id);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentDriverId(null);
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
          <Button type="link" icon={<EditOutlined />} />
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
          ระบบจัดการพนักงานขับรถ
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
                title="จำนวนพนักงานขับรถ (ทั้งหมด)"
                value={totalDrivers}
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
                title="จำนวนพนักงานขับรถ (เพศชาย)"
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
                title="จำนวนพนักงานขับรถ (เพศหญิง)"
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

        {/* Driver Table */}
        <Table
          dataSource={drivers}
          columns={columns}
          rowKey="ID"
          pagination={{ pageSize: 5 }}
          style={{ backgroundColor: "#fff", borderRadius: "8px" }}
        />

        {/* Add Button */}
        <div style={{ textAlign: "right", marginTop: "20px" }}>
          <Button
            type="primary"
            style={{ backgroundColor: "#4CAF50", borderColor: "#4CAF50" }}
            icon={<PlusOutlined />}
            onClick={() => navigate("/driver/create")} // นำไปยังหน้าสร้าง
          >
            Add Driver
          </Button>
        </div>

        {/* Delete Confirmation Modal */}
        <Modal
          title="Confirm Delete"
          open={isModalVisible} // ใช้ open แทน visible
          onOk={() => handleDelete(currentDriverId!)}
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

export default Driver;
