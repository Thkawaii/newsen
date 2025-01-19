import { useState, useEffect } from "react";
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
  DatePicker,
  Select,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { TrainersInterface } from "../../../interfaces/ITrainer";
import { Gender } from "../../../interfaces/IGender";
import { GetTrainerById, UpdateTrainerById } from "../../../services/https/TainerAPI";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { GetGender } from "../../../services/https/GenderAPI";

function TrainerEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [messageApi, contextHolder] = message.useMessage();
  const [gender, setGender] = useState<Gender[]>([]);
  const [form] = Form.useForm();

  // Fetch gender data
  const fetchGenders = async () => {
    try {
      const res = await GetGender();
      if (res.status === 200) {
        setGender(res.data);
      } else {
        messageApi.error("ไม่สามารถดึงข้อมูลเพศได้");
        setTimeout(() => navigate("/trainers"), 2000);
      }
    } catch (error) {
      messageApi.error("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
    }
  };

  // Fetch trainer data by ID
  const fetchTrainerById = async (trainerId: string) => {
    try {
      const res = await GetTrainerById(trainerId);
      if (res.status === 200) {
        form.setFieldsValue({
          first_name: res.data?.FirstName,
          last_name: res.data?.LastName,
          email: res.data?.Email,
          birthday: dayjs(res.data?.BirthDay),
          age: res.data?.Age,
          gender_id: res.data?.GenderID,
        });
      } else {
        messageApi.error("ไม่พบข้อมูลเทรนเนอร์");
        setTimeout(() => navigate("/trainers"), 2000);
      }
    } catch (error) {
      messageApi.error("เกิดข้อผิดพลาดในการดึงข้อมูลเทรนเนอร์");
    }
  };

  // Handle form submission
  const onFinish = async (values: any) => {
    const payload: TrainersInterface = {
      FirstName: values.first_name,
      LastName: values.last_name,
      Email: values.email,
      BirthDay: values.birthday?.toISOString(),
      Age: values.age,
      GenderID: values.gender_id,
      rolesId: values.roleId,
      message: "",
    };

    try {
      const parsedId = parseInt(id || "", 10);
      if (isNaN(parsedId)) {
        throw new Error("Invalid trainer ID");
      }

      const res = await UpdateTrainerById(parsedId, payload);
      if (res.status === 200) {
        messageApi.success("แก้ไขข้อมูลสำเร็จ");
        navigate("/trainers");
      } else {
        throw new Error(res.error || "เกิดข้อผิดพลาดในการแก้ไขข้อมูล");
      }
    } catch (error: any) {
      messageApi.error(error.message || "ไม่สามารถแก้ไขข้อมูลได้");
    }
  };

  useEffect(() => {
    if (id) {
      fetchGenders();
      fetchTrainerById(id);
    }
  }, [id]);

  return (
    <div>
      {contextHolder}
      <Card>
        <h2>แก้ไขข้อมูล เทรนเนอร์</h2>
        <Divider />
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="ชื่อจริง"
                name="first_name"
                rules={[{ required: true, message: "กรุณากรอกชื่อ!" }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="นามสกุล"
                name="last_name"
                rules={[{ required: true, message: "กรุณากรอกนามสกุล!" }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="อีเมล"
                name="email"
                rules={[
                  { type: "email", message: "รูปแบบอีเมลไม่ถูกต้อง!" },
                  { required: true, message: "กรุณากรอกอีเมล!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="วัน/เดือน/ปี เกิด"
                name="birthday"
                rules={[{ required: true, message: "กรุณาเลือกวัน/เดือน/ปี เกิด!" }]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="เพศ"
                name="gender_id"
                rules={[{ required: true, message: "กรุณาเลือกเพศ!" }]}
              >
                <Select placeholder="เลือกเพศ">
                  {gender.map((item) => (
                    <Select.Option key={item.ID} value={item.ID}>
                      {item.gender}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row justify="end">
            <Col>
              <Space>
                <Button onClick={() => navigate("/trainer")}>ยกเลิก</Button>
                <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
                  บันทึก
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
}

export default TrainerEdit;