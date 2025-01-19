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
  Spin,
  Layout,
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import { RoomInterface } from "../../../interfaces/IRoom";
import { GetRoomById, UpdateRoomById } from "../../../services/https/RoomAPI";
import { GetTrainers } from "../../../services/https/TainerAPI";
import { TrainersInterface } from "../../../interfaces/ITrainer";
import AdminSidebar from "../../../components/sider/AdminSidebar"; // ✅ เพิ่มการใช้งาน Sidebar ของ Admin

function EditRoom() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [messageApi, contextHolder] = message.useMessage();
  const [trainers, setTrainers] = useState<Pick<TrainersInterface, "ID" | "FirstName" | "LastName">[]>([]);
  const [loading, setLoading] = useState(false);
  const [originalData, setOriginalData] = useState<Partial<RoomInterface>>({});
  const [form] = Form.useForm();

  // ฟังก์ชันดึงข้อมูลห้อง
  const fetchRoomData = async () => {
    setLoading(true);
    try {
      const res = await GetRoomById(Number(id));
      if (res && res.status === 200 && res.data) {
        const roomData = {
          RoomName: res.data.data.room_name, // เข้าถึง res.data.data
          Capacity: res.data.data.capacity,
          TrainerID: res.data.data.trainer_id,
          Detail: res.data.data.detail,
          Title: res.data.data.title || "", // กรณีไม่มีฟิลด์ Title ใน API
        };
        console.log("Fetched Room Data:", roomData); // ตรวจสอบข้อมูล
        setOriginalData(roomData);
        form.setFieldsValue(roomData); // ตั้งค่าข้อมูลในฟอร์ม
      } else {
        messageApi.error("ไม่สามารถดึงข้อมูลห้องได้");
      }
    } catch (error) {
      console.error("Error fetching room data:", error);
      messageApi.error("เกิดข้อผิดพลาดในการเชื่อมต่อกับ API");
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันดึงข้อมูลเทรนเนอร์
  const fetchTrainers = async () => {
    setLoading(true);
    try {
      const res = await GetTrainers();
      if (res && res.status === 200 && Array.isArray(res.data)) {
        setTrainers(
          res.data.map((trainer: any) => ({
            ID: trainer.ID,
            FirstName: trainer.first_name || "ไม่ระบุชื่อ",
            LastName: trainer.last_name || "ไม่ระบุนามสกุล",
          }))
        );
      } else {
        messageApi.error("ไม่สามารถดึงข้อมูลเทรนเนอร์ได้");
      }
    } catch (error) {
      messageApi.error("เกิดข้อผิดพลาดในการเชื่อมต่อกับ API");
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันอัปเดตข้อมูลห้อง
  const onFinish = async (values: RoomInterface) => {
    // สร้าง payload เพื่ออัปเดตข้อมูลห้อง
    const payload = {
      room_name: values.RoomName || originalData.RoomName || "",
      capacity: values.Capacity || originalData.Capacity || 0,
      trainer_id: values.TrainerID || originalData.TrainerID || 0,
      detail: values.Detail || originalData.Detail || "",
      title: values.Title || originalData.Title || "",
    };
  
    console.log("Payload being sent to API:", payload); // ตรวจสอบ payload
  
    try {
      const res = await UpdateRoomById(Number(id), payload);
  
      console.log("API Response:", res); // ตรวจสอบการตอบกลับจาก API
  
      if (res && res.status === 200 && res.data) {
        messageApi.success("แก้ไขห้องสำเร็จ");
        setTimeout(() => navigate("/rooms"), 2000); // เปลี่ยนเส้นทางหลังสำเร็จ
      } else {
        messageApi.error(res.error || "ไม่สามารถแก้ไขห้องได้");
      }
    } catch (error) {
      console.error("Error updating room:", error); // ตรวจสอบข้อผิดพลาด
      messageApi.error("เกิดข้อผิดพลาดในการแก้ไขห้อง");
    }
  };  

  useEffect(() => {
    if (id) {
      console.log("Fetching data for Room ID:", id);
      fetchRoomData();
      fetchTrainers();
    }
  }, [id]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AdminSidebar /> {/* ✅ ใช้ Sidebar ของ Admin */}
      <Layout style={{ padding: "0 24px", background: "#fff" }}>
        <Spin spinning={loading}>
          {contextHolder}
          <Card>
            <h2>แก้ไขข้อมูลห้อง</h2>
            <Divider />
            <Form name="edit-room" layout="vertical" form={form} onFinish={onFinish}>
              <Row gutter={[16, 0]}>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    label="ชื่อห้อง"
                    name="RoomName"
                    rules={[{ required: true, message: "กรุณากรอกชื่อห้อง" }]}
                  >
                    <Input placeholder="กรอกชื่อห้อง" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    label="ความจุ"
                    name="Capacity"
                    rules={[{ required: true, message: "กรุณากรอกความจุ" }]}
                  >
                    <InputNumber min={1} max={100} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    label="เทรนเนอร์"
                    name="TrainerID"
                    rules={[{ required: true, message: "กรุณาเลือกเทรนเนอร์" }]}
                  >
                    <Select placeholder="เลือกเทรนเนอร์">
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
                    rules={[{ required: true, message: "กรุณากรอกหัวข้อ" }]}
                  >
                    <Input placeholder="กรอกหัวข้อ" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="รายละเอียด"
                    name="Detail"
                    rules={[{ required: true, message: "กรุณากรอกรายละเอียดของห้อง" }]}
                  >
                    <Input.TextArea
                      autoSize={{ minRows: 4, maxRows: 10 }}
                      placeholder="กรอกข้อมูลรายละเอียดของห้อง"
                    />
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
        </Spin>
      </Layout>
    </Layout>
  );
}

export default EditRoom;
