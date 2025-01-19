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
import { GetTrainers, DeleteTrainerById } from "../../services/https/TainerAPI";
import { TrainersInterface } from "../../interfaces/ITrainer";
import dayjs from "dayjs";

const Trainer: React.FC = () => {
  const [trainers, setTrainers] = useState<TrainersInterface[]>([]);
  const [totalTrainers, setTotalTrainers] = useState(0);
  const [maleCount, setMaleCount] = useState(0);
  const [femaleCount, setFemaleCount] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentTrainerId, setCurrentTrainerId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const res = await GetTrainers();
        if (res.status === 200 && Array.isArray(res.data)) {
          setTrainers(res.data);
          setTotalTrainers(res.data.length);

          const maleTrainers = res.data.filter(
            (trainer) => trainer.GenderID === 1
          );
          const femaleTrainers = res.data.filter(
            (trainer) => trainer.GenderID === 2
          );

          setMaleCount(maleTrainers.length);
          setFemaleCount(femaleTrainers.length);
        }
      } catch (error) {
        console.error("Error fetching trainers:", error);
      }
    };

    fetchTrainers();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const res = await DeleteTrainerById(id);
      if (res.status === 200) {
        setTrainers(trainers.filter((trainer) => trainer.ID !== id));
        setTotalTrainers(totalTrainers - 1);

        const maleTrainers = trainers.filter(
          (trainer) => trainer.ID !== id && trainer.GenderID === 1
        );
        const femaleTrainers = trainers.filter(
          (trainer) => trainer.ID !== id && trainer.GenderID === 2
        );

        setMaleCount(maleTrainers.length);
        setFemaleCount(femaleTrainers.length);
      }
    } catch (error) {
      console.error("Error deleting trainer:", error);
    } finally {
      setIsModalVisible(false);
    }
  };

  const showDeleteModal = (id: number) => {
    setCurrentTrainerId(id);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentTrainerId(null);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "ID",
      key: "id",
    },
    {
      title: "ชื่อ",
      dataIndex: "first_name",
      key: "first_name",
    },
    {
      title: "นามสกุล",
      dataIndex: "last_name",
      key: "last_name",
    },
    {
      title: "อีเมล",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "วันเกิด",
      key: "birthday",
      render: (record: { birthday: string | number | Date | dayjs.Dayjs | null | undefined; }) =>
        record.birthday ? dayjs(record.birthday).format("DD/MM/YYYY") : "-",
    },
    {
      title: "เพศ",
      key: "gender",
      render: (record: { gender_id: number; }) => {
        return record.gender_id === 1 ? "Male" : "Female";
      },
    },
    {
      title: "แก้ไข/ลบ",
      key: "actions",
      render: (_text: any, record: any) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => navigate(`/trainer/edit/${record.ID}`)}
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
          ระบบจัดการเทรนเนอร์
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
                title="จำนวนเทรนเนอร์ทั้งหมด"
                value={totalTrainers}
                prefix={<TeamOutlined />}
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
                title="เทรนเนอร์ (เพศชาย)"
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
                title="เทรนเนอร์ (เพศหญิง)"
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

        {/* Trainer Table */}
        <Table
          dataSource={trainers}
          columns={columns}
          rowKey="ID"
          pagination={{ pageSize: 5 }}
          style={{ backgroundColor: "#fff", borderRadius: "8px" }}
        />

        {/* Add Trainer Button */}
        <div style={{ textAlign: "right", marginTop: "20px" }}>
          <Button
            type="primary"
            style={{ backgroundColor: "#4CAF50", borderColor: "#4CAF50" }}
            icon={<PlusOutlined />}
            onClick={() => navigate("/trainer/create")}
          >
            สร้างเทรนเนอร์
          </Button>
        </div>

        {/* Delete Confirmation Modal */}
        <Modal
          title="ยืนยันการลบ"
          open={isModalVisible}
          onOk={() => handleDelete(currentTrainerId!)}
          onCancel={handleCancel}
          okText="ยืนยัน"
          cancelText="ยกเลิก"
        >
          <p>คุณแน่ใจหรือไม่ว่าต้องการลบเทรนเนอร์นี้?</p>
        </Modal>
      </div>
    </div>
  );
};

export default Trainer;
