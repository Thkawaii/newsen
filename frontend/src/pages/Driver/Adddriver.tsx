import React, { useEffect, useState } from "react";
import { Input, Button, DatePicker, Select, Upload, Form, message } from "antd";
import AdminSidebar from "../../components/sider/AdminSidebar";
import ImgCrop from "antd-img-crop";
import { PlusOutlined } from "@ant-design/icons";
import { createDriver, listGenders } from "../../services/https/Driver/index"; // Adjust paths for Driver services
import { Gender } from "../../interfaces/IGender";
import type { GetProp, UploadFile, UploadProps } from "antd";
import { useNavigate } from "react-router-dom";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const { Option } = Select;

const AddDriver: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [genders, setGenders] = useState<Gender[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // Fetch employee ID from local storage
  const loggedInEmployeeId = parseInt(
    localStorage.getItem("id") || "0",
    10
  );

  // Fetch Genders on component mount
  const getGenders = async () => {
    try {
      const genderData = await listGenders();
      if (genderData) setGenders(genderData);
    } catch (error) {
      console.error("Error fetching genders:", error);
      message.error("Failed to load genders.");
    }
  };

  useEffect(() => {
    getGenders();
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
      const driverData = {
        firstname: values.firstname,
        lastname: values.lastname,
        phone_number: values.phone,
        date_of_birth: values.birthdate.format("YYYY-MM-DD"),
        identification_number: values.identification_number,
        driver_license_number: values.driver_license_number,
        driver_license_expiration_date:
          values.license_expiration.format("YYYY-MM-DD"),
        income: parseFloat(values.income),
        profile: fileList[0]?.thumbUrl || "",
        email: values.email,
        password: values.password,
        gender_id: parseInt(values.gender, 10),
        employee_id: loggedInEmployeeId,
      };

      console.log("Driver Data Sent:", driverData); // Debugging log

      await createDriver(driverData);

      messageApi.open({
        type: "success",
        content: "บันทึกข้อมูลพนักงานขับรถสำเร็จ!",
      });
      setTimeout(() => navigate("/drivers"), 2000);
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
      <AdminSidebar />

      <div style={{ flex: 1, background: "#D9D7EF" }}>
        {contextHolder}
        <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
          เพิ่มข้อมูลพนักงานขับรถใหม่
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
              label="เลขบัตรประชาชน"
              name="identification_number"
              rules={[
                { required: true, message: "กรุณากรอกเลขบัตรประชาชน" },
                { pattern: /^\d{13}$/, message: "ต้องมี 13 หลัก" },
              ]}
            >
              <Input placeholder="กรอกเลขบัตรประชาชน" />
            </Form.Item>

            <Form.Item
              label="เลขใบขับขี่"
              name="driver_license_number"
              rules={[
                { required: true, message: "กรุณากรอกเลขใบขับขี่" },
                { pattern: /^\d{8}$/, message: "ต้องมี 8 หลัก" },
              ]}
            >
              <Input placeholder="กรอกเลขใบขับขี่" />
            </Form.Item>

            <Form.Item
              label="วันหมดอายุใบขับขี่"
              name="license_expiration"
              rules={[
                { required: true, message: "กรุณาเลือกวันหมดอายุใบขับขี่" },
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                placeholder="เลือกวันหมดอายุ"
              />
            </Form.Item>

            <Form.Item
              label="รายได้"
              name="income"
              rules={[{ required: true, message: "กรุณากรอกรายได้" }]}
            >
              <Input placeholder="กรอกรายได้" type="number" />
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
              id="profile"
              label="รูปประจำตัว"
              name="profile"
              valuePropName="fileList"
              getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
            >
              <ImgCrop rotationSlider>
                <Upload
                  beforeUpload={() => false}
                  fileList={fileList}
                  onChange={onChange}
                  listType="picture-card"
                  onPreview={onPreview}
                  id="driverPic"
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
              เพิ่มพนักงานขับรถ
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default AddDriver;
