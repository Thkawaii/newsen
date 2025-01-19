import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  DatePicker,
  Select,
  Upload,
  Form,
  message,
  Modal,
} from "antd";
import AdminSidebar from "../../components/sider/AdminSidebar";
import ImgCrop from "antd-img-crop";
import { PlusOutlined } from "@ant-design/icons";
//import { useParams, useNavigate } from "react-router-dom";
import {
  getEmployee,
  listGenders,
  listPositions,
  updateEmployee,
} from "../../services/https/Employee/index";
import { EmployeeInterface } from "../../interfaces/IEmployee";
import type { UploadFile } from "antd";

const { Option } = Select;

const EditEmployee: React.FC = () => {
  // กำหนด id เองเพื่อทดสอบ (แทนที่ useParams)
  const id = "1"; // เปลี่ยน id ที่ต้องการทดสอบ

  //const navigate = useNavigate();
  const [form] = Form.useForm();
  const [genders, setGenders] = useState([]);
  const [positions, setPositions] = useState([]);
  const [employeeData, setEmployeeData] = useState<EmployeeInterface | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  // Fetch Genders and Positions on component mount
  useEffect(() => {
    const fetchData = async () => {
      const genderData = await listGenders();
      const positionData = await listPositions();
      if (genderData) setGenders(genderData);
      if (positionData) setPositions(positionData);

      // Fetch Employee Data
      const employee = await getEmployee(id);
      if (employee) {
        setEmployeeData(employee);
        form.setFieldsValue({
          firstname: employee.Firstname,
          lastname: employee.Lastname,
          phone: employee.PhoneNumber,
          gender: employee.GenderID,
          position: employee.PositionId,
          salary: employee.Salary,
          email: employee.Email,
          password: employee.Password,
          startdate: employee.startDate,
          birthdate: employee.dateOfBirth,
        });
        if (employee.profile) {
          setFileList([
            {
              uid: "-1",
              name: "profile",
              status: "done",
              url: employee.profile,
              thumbUrl: employee.profile,
            },
          ]);
        }
      }
    };

    fetchData();
  }, [id]);

  const onChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
    setFileList(newFileList.slice(-1)); // จำกัดให้สามารถอัปโหลดได้เพียง 1 รูป
  };

  const onPreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as Blob);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    );
  };

  const handleFinish = async (values: any) => {
    try {
      // ตรวจสอบว่า gender และ position ถูกแปลงเป็น Number
      const genderId = Number(values.gender);
      const positionId = Number(values.position);

      // เช็คว่า genderId และ positionId เป็นตัวเลขที่ถูกต้อง
      if (isNaN(genderId) || isNaN(positionId)) {
        throw new Error("กรุณาเลือกเพศและตำแหน่งที่ถูกต้อง");
      }

      let roleId: number | null = null;
      if (positionId === 2) {
        roleId = 3; // Employee
      } else if (positionId === 1 || positionId === 3) {
        roleId = 4; // Owner or Admin
      }

      const employeeData: EmployeeInterface = {
        ID: Number(id), // Employee ID should be passed for update
        firstname: values.firstname,
        lastname: values.lastname,
        phone_number: values.phone,
        gender_id: genderId,
        position_id: positionId,
        salary: values.salary,
        email: values.email,
        password: values.password,
        start_date: values.startdate.format("YYYY-MM-DD"),
        date_of_birth: values.birthdate.format("YYYY-MM-DD"),
        profile: fileList[0]?.thumbUrl || "",
      };

      const response = await updateEmployee(employeeData);

      if (response.status === 200) {
        message.success("ข้อมูลพนักงานถูกอัพเดตเรียบร้อย!");
        //navigate("/employees"); // Redirect to employees list or relevant page
      } else {
        throw new Error(response.data?.message || "Unknown error");
      }
    } catch (error: any) {
      console.error("Error updating employee:", error);
      message.error(`อัพเดตข้อมูลล้มเหลว: ${error.message}`);
    }
  };

  if (!employeeData) return <div>Loading...</div>;

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100vw" }}>
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div style={{ flex: 1, background: "#D9D7EF" }}>
        <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
          แก้ไขข้อมูลพนักงาน
        </h1>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          style={{
            width: "100%",
            maxWidth: "1200px",
            height: "67%",
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
            {/* Other form items */}
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
              rules={[{ required: true, message: "กรุณาเลือกเพศ" }]}
            >
              <Select placeholder="เลือกเพศ">
                {genders.map((gender: any) => (
                  <Option key={gender.id} value={Number(gender.id)}>
                    {gender.gender}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="เบอร์โทรศัพท์"
              name="phone"
              rules={[{ required: true, message: "กรุณากรอกเบอร์โทรศัพท์" }]}
            >
              <Input placeholder="กรอกเบอร์โทรศัพท์" />
            </Form.Item>

            <Form.Item
              label="วันเกิด"
              name="birthdate"
              rules={[{ required: true, message: "กรุณากรอกวันเกิด" }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                placeholder="เลือกวันเกิด"
              />
            </Form.Item>

            <Form.Item
              label="ตำแหน่ง"
              name="position"
              rules={[{ required: true, message: "กรุณากรอกตำแหน่ง" }]}
            >
              <Select placeholder="เลือกตำแหน่ง">
                {positions.map((position: any) => (
                  <Option key={position.id} value={Number(position.id)}>
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
                  required: true,
                  type: "email",
                  message: "กรุณากรอกอีเมลที่ถูกต้อง",
                },
              ]}
            >
              <Input placeholder="กรอกอีเมล" />
            </Form.Item>

            <Form.Item
              label="รหัสผ่าน"
              name="password"
              rules={[
                { required: true, message: "กรุณากรอกรหัสผ่าน" },
                {
                  min: 6,
                  message: "รหัสผ่านต้องมีความยาวไม่น้อยกว่า 6 ตัวอักษร",
                },
              ]}
            >
              <Input.Password placeholder="กรอกรหัสผ่าน" />
            </Form.Item>

            <Form.Item
              label="วันที่เริ่มงาน"
              name="startdate"
              rules={[{ required: true, message: "กรุณากรอกวันที่เริ่มงาน" }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                placeholder="เลือกวันที่เริ่มงาน"
              />
            </Form.Item>

            <Form.Item label="โปรไฟล์" valuePropName="fileList">
              <ImgCrop rotationSlider>
                <div>
                  <Upload
                    action="/upload"
                    listType="picture-card"
                    fileList={fileList}
                    onChange={onChange}
                    onPreview={onPreview}
                    maxCount={1}
                  >
                    <div>
                      <PlusOutlined />
                      <div>อัปโหลดโปรไฟล์</div>
                    </div>
                  </Upload>
                </div>
              </ImgCrop>
            </Form.Item>

            <div
              style={{
                textAlign: "center",
                marginTop: "30px",
              }}
            >
              <Button type="primary" htmlType="submit" style={{ width: "30%" }}>
                บันทึก
              </Button>
            </div>
          </div>
        </Form>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={() => setPreviewVisible(false)}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </div>
    </div>
  );
};

export default EditEmployee;
