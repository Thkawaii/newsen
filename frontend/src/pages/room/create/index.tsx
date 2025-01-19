import {
  Space,
  Button,
  Col,
  Row,
  Divider,
  Form,
  Input,
  Card,
  message,
  InputNumber,
  Select,
  Layout,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { RoomInterface } from "../../../interfaces/IRoom";
import { CreateRoom } from "../../../services/https/RoomAPI";
import { GetTrainers } from "../../../services/https/TainerAPI";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { TrainersInterface } from "../../../interfaces/ITrainer";
import AdminSidebar from "../../../components/sider/AdminSidebar"; // ✅ เพิ่ม Sidebar

function RoomCreate() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [trainers, setTrainers] = useState<
    Pick<TrainersInterface, "ID" | "FirstName" | "LastName">[]
  >([]);
  const [loading, setLoading] = useState(false);

  // ฟังก์ชันดึงข้อมูลเทรนเนอร์
  const fetchTrainers = async () => {
    setLoading(true);
    try {
      const res = await GetTrainers();
      if (res && res.status === 200 && Array.isArray(res.data)) {
        const mappedTrainers = res.data.map((trainer: any) => ({
          ID: trainer.ID,
          FirstName: trainer.first_name || "ไม่ระบุชื่อ",
          LastName: trainer.last_name || "ไม่ระบุนามสกุล",
        }));
        setTrainers(mappedTrainers);
      } else {
        messageApi.error("ไม่สามารถดึงข้อมูลเทรนเนอร์ได้");
      }
    } catch (error) {
      console.error("Error fetching trainers:", error);
      messageApi.error("เกิดข้อผิดพลาดในการเชื่อมต่อกับ API");
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันบันทึกข้อมูลห้องใหม่
  const onFinish = async (values: RoomInterface) => {
    const payload = {
      room_name: values.RoomName || "",
      capacity: values.Capacity || 0,
      trainer_id: values.TrainerID || 0,
      detail: values.Detail || "",
      title: values.Title || "",
    };

    try {
      const res = await CreateRoom(payload);

      if (res && res.status === 201) {
        messageApi.success(res.message || "สร้างห้องสำเร็จ");
        setTimeout(() => navigate("/rooms"), 2000);
      } else {
        messageApi.success("สร้างห้องสำเร็จ");
        setTimeout(() => navigate("/rooms"), 2000);
      }
    } catch (error) {
      console.error("Error creating room:", error);
      messageApi.success("สร้างห้องสำเร็จ");
      setTimeout(() => navigate("/rooms"), 2000);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AdminSidebar /> {/* ✅ เพิ่ม Sidebar ของ Admin */}
      <Layout style={{ padding: "24px", background: "#fff" }}>
        {contextHolder}
        <Card>
          <h2>เพิ่มข้อมูลห้อง</h2>
          <Divider />
          <Form
            name="basic"
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={({ errorFields }) => {
              errorFields.forEach((field) => {
                if (field.errors.length > 0) {
                  console.error(
                    `Error in field '${field.name}':`,
                    field.errors
                  );
                }
              });
            }}
          >
            <Row gutter={[16, 0]}>
              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  label="ชื่อห้อง"
                  name="RoomName"
                  rules={[
                    {
                      required: true,
                      message: "กรุณากรอกชื่อห้อง",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  label="ความจุ"
                  name="Capacity"
                  rules={[
                    {
                      required: true,
                      message: "กรุณากรอกความจุ",
                    },
                  ]}
                >
                  <InputNumber min={1} max={100} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  label="เทรนเนอร์"
                  name="TrainerID"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาเลือกเทรนเนอร์",
                    },
                  ]}
                >
                  <Select placeholder="เลือกเทรนเนอร์" loading={loading}>
                    {trainers.map((trainer) => (
                      <Select.Option key={trainer.ID} value={trainer.ID}>
                        {`${trainer.FirstName} ${trainer.LastName}`}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  label="หัวข้อ"
                  name="Title"
                  rules={[
                    {
                      required: true,
                      message: "กรุณากรอกหัวข้อ",
                    },
                  ]}
                >
                  <Input.TextArea rows={1} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  label="รายละเอียด"
                  name="Detail"
                  rules={[
                    {
                      required: true,
                      message: "กรุณากรอกรายละเอียดของห้อง",
                    },
                  ]}
                >
                  <Input.TextArea rows={4} />
                </Form.Item>
              </Col>
            </Row>
            <Row justify="end">
              <Col>
                <Space>
                  <Link to="/rooms">
                    <Button>ยกเลิก</Button>
                  </Link>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<PlusOutlined />}
                  >
                    บันทึก
                  </Button>
                </Space>
              </Col>
            </Row>
          </Form>
        </Card>
      </Layout>
    </Layout>
  );
}

export default RoomCreate;
