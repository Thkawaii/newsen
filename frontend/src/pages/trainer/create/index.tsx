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
  notification,
  DatePicker,
  Select,
} from "antd";
import { useState, useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { TrainersInterface } from "../../../interfaces/ITrainer";
import { Gender } from "../../../interfaces/IGender";
import { CreateTrainer } from "../../../services/https/TainerAPI";
import { GetGender } from "../../../services/https/GenderAPI";
import { useNavigate, Link } from "react-router-dom";

function TrainerCreate() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [gender, setGender] = useState<Gender[]>([]);
  const [loading, setLoading] = useState(false);

  // ป๊อปอัพแจ้งเตือน
  const showErrorNotification = (title: string, description: string) => {
    notification.error({
      message: title,
      description: description,
      duration: 5, // ระยะเวลาแสดงผล 5 วินาที
    });
  };

  const onGetGender = async () => {
    setLoading(true);
    try {
      const res = await GetGender();
      if (res.status === 200 && Array.isArray(res.data) && res.data.length > 0) {
        setGender(res.data);
      } else {
        throw new Error("ไม่มีข้อมูลเพศ");
      }
    } catch (error: any) {
      showErrorNotification("ข้อผิดพลาด", error.message || "ไม่พบข้อมูลเพศ");
      setGender([]);
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: TrainersInterface) => {
    try {
      const payload = { ...values };
      const res = await CreateTrainer(payload);

      if (res.status === 201 && res.data) {
        messageApi.success(res.data.message || "เพิ่มข้อมูลสำเร็จ");
        setTimeout(() => navigate("/trainer"), 2000);
      } else {
        throw new Error(res.error || "ไม่สามารถเพิ่มข้อมูลได้");
      }
    } catch (error: any) {
      showErrorNotification(
        "เกิดข้อผิดพลาด",
        error.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล"
      );
    }
  };

  useEffect(() => {
    onGetGender();
  }, []);

  return (
    <div>
      {contextHolder}
      <Card>
        <h2>เพิ่มข้อมูลเทรนเนอร์</h2>
        <Divider />
        <Form name="basic" layout="vertical" onFinish={onFinish} autoComplete="off">
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="ชื่อจริง"
                name="first_name"
                rules={[{ required: true, message: "กรุณากรอกชื่อ !" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="นามสกุล"
                name="last_name"
                rules={[{ required: true, message: "กรุณากรอกนามสกุล !" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="อีเมล"
                name="email"
                rules={[
                  { type: "email", message: "รูปแบบอีเมลไม่ถูกต้อง !" },
                  { required: true, message: "กรุณากรอกอีเมล !" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="รหัสผ่าน"
                name="password"
                rules={[{ required: true, message: "กรุณากรอกรหัสผ่าน !" }]}
              >
                <Input.Password />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="วัน/เดือน/ปี เกิด"
                name="birthday"
                rules={[{ required: true, message: "กรุณาเลือกวัน/เดือน/ปี เกิด !" }]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="เพศ"
                name="gender_id"
                rules={[{ required: true, message: "กรุณาเลือกเพศ !" }]}
              >
                <Select placeholder="เลือกเพศ" style={{ width: "100%" }} loading={loading}>
                  {gender?.length > 0 ? (
                    gender.map((item) => (
                      <Select.Option key={item.ID} value={item.ID}>
                        {item.gender}
                      </Select.Option>
                    ))
                  ) : (
                    <Select.Option disabled value="">
                      ไม่มีข้อมูลเพศ
                    </Select.Option>
                  )}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row justify="end">
            <Col style={{ marginTop: "40px" }}>
              <Form.Item>
                <Space>
                  <Link to="/trainer">
                    <Button htmlType="button">ยกเลิก</Button>
                  </Link>
                  <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
                    ยืนยัน
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
}

export default TrainerCreate;
