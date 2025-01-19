import { useState, useEffect } from "react";
import {
  Space,
  Table,
  Button,
  Col,
  Row,
  Card,
  Statistic,
  message,
  Popconfirm,
  Layout,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  HomeOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { GetRooms, DeleteRoomById } from "../../services/https/RoomAPI";
import { RoomInterface } from "../../interfaces/IRoom";
import { Link, useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/sider/AdminSidebar"; // ✅ ใช้ Sidebar ของ Admin

function Rooms() {
  const [rooms, setRooms] = useState<RoomInterface[]>([]);
  const [totalRooms, setTotalRooms] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const userRole = "admin";

  // ✅ ฟังก์ชันดึงข้อมูลห้อง
  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await GetRooms();
      console.log("📡 API Response:", res.data); // Debug API Response

      if (res && res.status === 200 && Array.isArray(res.data)) {
        // Mapping ข้อมูลห้อง
        const mappedRooms = res.data.map((room: any) => ({
          ID: room.ID,
          RoomName: room.room_name,
          Title: room.title,
          Capacity: room.capacity,
          CurrentBookings: room.current_bookings || 0,
          Trainer: room.trainer
            ? {
                FirstName: room.trainer.first_name || "ไม่ระบุชื่อ",
                LastName: room.trainer.last_name || "ไม่ระบุนามสกุล",
              }
            : null,
          Status:
            room.current_bookings >= room.capacity
              ? "เต็ม"
              : room.current_bookings > 0
              ? "ว่างบางส่วน"
              : "ว่าง",
        }));
        setRooms(mappedRooms);
        setTotalRooms(mappedRooms.length);
      } else {
        console.error("Unexpected API response:", res);
        messageApi.error(res?.error || "ไม่สามารถดึงข้อมูลได้");
        setRooms([]);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
      messageApi.error("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
    } finally {
      setLoading(false);
    }
  };

  // ✅ ฟังก์ชันเรียกหลังการจองสำเร็จ เพื่ออัปเดตจำนวนการจองในตาราง
  // const handleBookingSuccess = () => {
  //   fetchRooms(); // โหลดข้อมูลห้องใหม่หลังจองสำเร็จ
  // };

  // ✅ ฟังก์ชันลบห้อง
  const handleDelete = async (id: number) => {
    try {
      const res = await DeleteRoomById(id);
      if (res && res.status === 200) {
        messageApi.success("ลบห้องสำเร็จ");
        fetchRooms();
      } else {
        messageApi.error(res?.error || "ไม่สามารถลบห้องได้");
      }
    } catch (error) {
      messageApi.error("เกิดข้อผิดพลาดในการลบห้อง");
      console.error("Error deleting room:", error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // ✅ กำหนด Columns ของ Table
  const columns: ColumnsType<RoomInterface> = [
    {
      title: "ลำดับ",
      key: "index",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "ชื่อห้อง",
      dataIndex: "RoomName",
      key: "RoomName",
    },
    {
      title: "หัวข้อ",
      dataIndex: "Title",
      key: "Title",
    },
    {
      title: "ความจุ",
      key: "Capacity",
      render: (record: RoomInterface) =>
        `${record.CurrentBookings || 0}/${record.Capacity || 0}`,
    },
    {
      title: "เทรนเนอร์",
      key: "Trainer",
      render: (record: RoomInterface) =>
        record.Trainer
          ? `${record.Trainer.FirstName} ${record.Trainer.LastName}`
          : "ไม่ระบุเทรนเนอร์",
    },
    {
      title: "สถานะ",
      dataIndex: "Status",
      key: "Status",
    },
    {
      title: "การกระทำ",
      key: "actions",
      render: (record: RoomInterface) => (
        <Space>
          {/* <Button
            type="primary"
            onClick={() => {
              navigate(`/trainbook/${record.ID}`);
              handleBookingSuccess(); // ✅ โหลดข้อมูลห้องใหม่หลังจองสำเร็จ
            }}
          >
            จอง
          </Button> */}
          {userRole === "admin" && (
            <>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => navigate(`/rooms/edit/${record.ID}`)}
              >
                แก้ไข
              </Button>
              <Popconfirm
                title="ยืนยันการลบห้อง?"
                onConfirm={() =>
                  record.ID !== undefined && handleDelete(record.ID)
                }
                okText="ใช่"
                cancelText="ไม่"
              >
                <Button danger icon={<DeleteOutlined />}>
                  ลบ
                </Button>
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AdminSidebar /> {/* ✅ ใช้ Sidebar */}
      <Layout style={{ padding: "20px", backgroundColor: "#EDE8FE" }}>
        {contextHolder}
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
          ระบบจัดการห้องอบรม
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
                title="จำนวนห้องอบรม (ทั้งหมด)"
                value={totalRooms}
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
        </Row>

        {/* Room Table */}
        <Table
          rowKey="ID"
          columns={columns}
          dataSource={rooms}
          loading={loading}
          style={{ backgroundColor: "#fff", borderRadius: "8px" }}
        />

        {/* Add Room Button */}
        <div style={{ textAlign: "right", marginTop: "20px" }}>
          <Space>
            <Link to="/employees">
              <Button type="default" icon={<HomeOutlined />}>
                หน้าแรก
              </Button>
            </Link>
            <Link to="/rooms/create">
              <Button type="primary" icon={<PlusOutlined />}>
                สร้างห้อง
              </Button>
            </Link>
          </Space>
        </div>
      </Layout>
    </Layout>
  );
}

export default Rooms;
