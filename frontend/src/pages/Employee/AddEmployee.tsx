import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  DatePicker,
  Select,
  Upload,
  Form,
  message,
  //Modal,
} from "antd";
import AdminSidebar from "../../components/sider/AdminSidebar";
import ImgCrop from "antd-img-crop";
import { PlusOutlined } from "@ant-design/icons";
import {
  createEmployee,
  listGenders,
  listPositions,
} from "../../services/https/Employee/index";
import { Position } from "../../interfaces/IPosition";
import { Gender } from "../../interfaces/IGender";
import type { GetProp, UploadFile, UploadProps } from "antd";
import { useNavigate } from "react-router-dom";
//import { EmployeeInterface } from "../../interfaces/IEmployee";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const { Option } = Select;

const AddEmployee: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [genders, setGenders] = useState<Gender[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // Fetch Genders and Positions on component mount
  const getGenderAndPositions = async () => {
    try {
      const genderData = await listGenders();
      const positionData = await listPositions();
      if (genderData) setGenders(genderData);
      if (positionData) setPositions(positionData);
    } catch (error) {
      console.error("Error fetching genders and positions:", error);
      message.error("Failed to load genders or positions.");
    }
  };

  useEffect(() => {
    getGenderAndPositions();
  }, []);

  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList.slice(-1)); // Limit to 1 file
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as FileType);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const handleFinish = async (values: any) => {
    try {
      const employeeData = {
        firstname: values.firstname,
        lastname: values.lastname,
        phone_number: values.phone,
        date_of_birth: values.birthdate.format("YYYY-MM-DD"),
        start_date: values.startdate.format("YYYY-MM-DD"),
        salary: parseFloat(values.salary),
        profile: fileList[0]?.thumbUrl || "",
        email: values.email,
        password: values.password,
        position_id: values.position,
        gender_id: values.gender,
      };

      const response = await createEmployee(employeeData);
      void response
      
      messageApi.open({
        type: "success",
        content: "บันทึกข้อมูลพนักงานสำเร็จ!",
      });
      setTimeout(() => navigate("/employees"), 2000);
    } catch (error: any) {
      console.error("Error in handleFinish:", error.message || error);

      messageApi.open({
        type: "error",
        content: `บันทึกข้อมูลล้มเหลว: ${error.message || "เกิดข้อผิดพลาด!"}`,
      });
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100vw" }}>
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div style={{ flex: 1, background: "#D9D7EF" }}>
        {contextHolder}
        <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
          เพิ่มข้อมูลพนักงานใหม่
        </h1>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          autoComplete="off"
          style={{
            width: "100%",
            maxWidth: "1200px",
            margin: "0 auto",
            background: "#ffffff",
            padding: "40px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "20px",
            }}
          >
            <Form.Item
              label="ชื่อจริง"
              name="firstname"
              rules={[{ required: true, message: "กรุณากรอกชื่อจริง" }]}
            >
              <Input placeholder="กรอกชื่อจริง" />
            </Form.Item>

            <Form.Item
              label="นามสกุล"
              name="lastname"
              rules={[{ required: true, message: "กรุณากรอกนามสกุล" }]}
            >
              <Input placeholder="กรอกนามสกุล" />
            </Form.Item>

            <Form.Item
              label="เพศ"
              name="gender"
              rules={[{ required: true, message: "กรุณาระบุเพศ" }]}
            >
              <Select placeholder="เลือกเพศ">
                {genders.map((gender) => (
                  <Option key={gender.ID} value={gender.ID}>
                    {gender.gender}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="เบอร์โทรศัพท์"
              name="phone"
              rules={[
                {
                  required: true,
                  message: "กรุณากรอกเบอร์โทรศัพท์",
                },
                {
                  pattern: /^[0]\d{9}$/,
                  message:
                    "Phone number must be exactly 10 digits and start with '0'!",
                },
              ]}
            >
              <Input placeholder="กรอกเบอร์โทรศัพท์" />
            </Form.Item>

            <Form.Item
              label="วันเกิด"
              name="birthdate"
              rules={[{ required: true, message: "กรุณาเลือกวันเกิด" }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                placeholder="เลือกวันเกิด"
              />
            </Form.Item>

            <Form.Item
              label="ตำแหน่ง"
              name="position"
              rules={[{ required: true, message: "กรุณาเลือกตำแหน่ง" }]}
            >
              <Select placeholder="เลือกตำแหน่ง">
                {positions.map((position) => (
                  <Option key={position.ID} value={position.ID}>
                    {position.position}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="เงินเดือน"
              name="salary"
              rules={[{ required: true, message: "กรุณากรอกเงินเดือน" }]}
            >
              <Input placeholder="กรอกเงินเดือน" type="number" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  type: "email",
                  message: "รูปแบบอีเมลไม่ถูกต้อง",
                },
                {
                  required: true,
                  message: "กรุณากรอกอีเมล",
                },
              ]}
            >
              <Input placeholder="กรอกอีเมล" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "กรุณากรอก Password" }]}
            >
              <Input.Password placeholder="กรอก Password" />
            </Form.Item>

            <Form.Item
              label="วันที่เริ่มงาน"
              name="startdate"
              rules={[{ required: true, message: "กรุณาเลือกวันที่เริ่มงาน" }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                placeholder="เลือกวันที่เริ่มงาน"
              />
            </Form.Item>

            <Form.Item
              id="profile"
              label="รูปประจำตัว"
              name="profile"
              valuePropName="fileList"
              getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
            >
              <ImgCrop rotationSlider>
                <Upload
                  beforeUpload={() => false} // ปิดการอัปโหลดอัตโนมัติ
                  fileList={fileList}
                  onChange={onChange}
                  listType="picture-card"
                  onPreview={onPreview}
                  id="employeePic" // เพิ่ม id สำหรับ Selenium
                >
                  {fileList.length < 1 && (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>อัพโหลด</div>
                    </div>
                  )}
                </Upload>
              </ImgCrop>
            </Form.Item>
          </div>

          <Form.Item style={{ textAlign: "center" }}>
            <Button type="primary" htmlType="submit">
              เพิ่มพนักงาน
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default AddEmployee;
