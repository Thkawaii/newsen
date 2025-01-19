import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/sider/AdminSidebar";
import { Table, Button, Space, Card, Row, Col, Statistic, Modal } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import Male from "../../assets/male.png";
import Female from "../../assets/female.png";
import { listEmployees, deleteEmployee } from "../../services/https/Employee/index";

const Employee: React.FC = () => {
  const [employees, setEmployees] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [maleCount, setMaleCount] = useState(0);
  const [femaleCount, setFemaleCount] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentEmployeeId, setCurrentEmployeeId] = useState<number | null>(null);
  const navigate = useNavigate(); // ใช้สำหรับนำทาง

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await listEmployees();
        setEmployees(data);
        setTotalEmployees(data.length);

        const maleEmployees = data.filter(
          (emp: any) => emp.Gender && emp.Gender.gender === "Male"
        );
        const femaleEmployees = data.filter(
          (emp: any) => emp.Gender && emp.Gender.gender === "Female"
        );

        setMaleCount(maleEmployees.length);
        setFemaleCount(femaleEmployees.length);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const success = await deleteEmployee(id);
      if (success) {
        setEmployees(employees.filter((emp: any) => emp.ID !== id));
        setTotalEmployees(totalEmployees - 1);
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
    } finally {
      setIsModalVisible(false); // Close the modal
    }
  };

  const showDeleteModal = (id: number) => {
    setCurrentEmployeeId(id);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentEmployeeId(null);
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
      title: "ตำแหน่ง",
      dataIndex: ["Position", "position"],
      key: "position",
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
            onClick={() => navigate(`/Employee/edit?id=${record.ID}`)} // นำไปยังหน้าแก้ไข
          />
          {record.Position.position !== "Owner" && (
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() => showDeleteModal(record.ID)}
            />
          )}
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
          ระบบจัดการพนักงาน
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
                title="จำนวนพนักงาน (ทั้งหมด)"
                value={totalEmployees}
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
                title="จำนวนพนักงาน (เพศชาย)"
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
                title="จำนวนพนักงาน (เพศหญิง)"
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

        {/* Employee Table */}
        <Table
          dataSource={employees}
          columns={columns}
          rowKey="ID"
          pagination={{ pageSize: 5 }}
          style={{ backgroundColor: "#fff", borderRadius: "8px" }}
        />

        {/* Add Button */}
        <div style={{ textAlign: "left", marginTop: "20px" }}> {/* ปุ่มอยู่ซ้าย */}
          <Button
            type="primary"
            size="small" // ลดขนาดปุ่ม
            style={{
              backgroundColor: "#4CAF50",
              borderColor: "#4CAF50",
            }}
            icon={<PlusOutlined />}
            onClick={() => navigate("/Employee/create")} // นำไปยังหน้าสร้าง
          >
            Add Employee
          </Button>
        </div>

        {/* Delete Confirmation Modal */}
        <Modal
          title="Confirm Delete"
          visible={isModalVisible}
          onOk={() => handleDelete(currentEmployeeId!)}
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

export default Employee;
