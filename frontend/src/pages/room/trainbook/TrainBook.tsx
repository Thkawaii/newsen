import { useState, useEffect } from "react";
import { Space, Table, Button, message, Layout } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { GetRooms } from "../../../services/https/RoomAPI";
import {
  GetTrainbooksByDriver,
  CreateTrainbook,
} from "../../../services/https/TrainBookAPI";
import { RoomInterface } from "../../../interfaces/IRoom";
import { TrainbookInterface } from "../../../interfaces/ITrainbook";
import { useNavigate, Link } from "react-router-dom";
import DriverSidebar from "../../../components/sider/DriverSidebar";
import "./TrainBook.css";

function Trainbook() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<RoomInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [bookingLoading, setBookingLoading] = useState<boolean>(false);
  const [hasBooking, setHasBooking] = useState<boolean>(false);
  const [bookedRoomId, setBookedRoomId] = useState<number | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  const driverID = localStorage.getItem("id")
    ? Number(localStorage.getItem("id"))
    : null;
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!driverID || !token) return;
    const checkBooking = async () => {
      try {
        const res = await GetTrainbooksByDriver(driverID, token);
        if (res && res.length > 0) {
          setHasBooking(true);
          setBookedRoomId(res[0].RoomID); // บันทึกห้องที่จองไปแล้ว
        }
      } catch (error) {
        console.error("❌ Error fetching trainbooks for driver:", error);
      }
    };
    checkBooking();
  }, [driverID, token]);

  // ✅ ดึงข้อมูลห้องทั้งหมด
  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await GetRooms(); 
      console.log("📡 API Response:", res.data);

      if (res && res.status === 200 && Array.isArray(res.data)) {
        const mappedRooms = res.data.map((room: any) => ({
          ID: room.ID ?? room.id ?? null,
          RoomName: room.RoomName ?? room.room_name ?? "❌ ไม่พบข้อมูล",
          Capacity: room.Capacity ?? room.capacity ?? 0,
          CurrentBookings: room.current_bookings ?? room.current_bookings ?? 0,
          Trainer: room.trainer
            ? {
                FirstName:
                  room.trainer.FirstName ??
                  room.trainer.first_name ??
                  "❌ ไม่ระบุชื่อ",
                LastName:
                  room.trainer.LastName ??
                  room.trainer.last_name ??
                  "❌ ไม่ระบุนามสกุล",
              }
            : null,
          Detail: room.Detail ?? room.detail ?? "❌ ไม่มีรายละเอียด",
          Status:
            room.current_bookings >= room.Capacity
              ? "เต็ม"
              : room.current_bookings > 0
              ? "ว่างบางส่วน"
              : "ว่าง",
        }));
        console.log("✅ Mapped Rooms:", mappedRooms);
        setRooms(mappedRooms);
      } else {
        messageApi.error(res?.error || "ไม่สามารถดึงข้อมูลได้");
        setRooms([]);
      }
    } catch (error) {
      console.error("❌ Error fetching rooms:", error);
      messageApi.error("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // ✅ ฟังก์ชันสำหรับทำการจองห้อง
  const handleBooking = async (roomId: number) => {
    if (!driverID || isNaN(driverID) || driverID <= 0) {
      message.error("⚠️ ไม่พบข้อมูลผู้ขับ กรุณาเข้าสู่ระบบใหม่อีกครั้ง");
      return;
    }

    if (!token) {
      message.error("⚠️ ไม่พบ Token กรุณาเข้าสู่ระบบใหม่อีกครั้ง");
      return;
    }

    if (!roomId || isNaN(roomId) || roomId <= 0) {
      message.error("⚠️ Room ID ไม่ถูกต้อง");
      return;
    }

    if (hasBooking) {
      message.warning(
        bookedRoomId === roomId
          ? "คุณได้ทำการจองห้องนี้ไปแล้ว"
          : "คุณได้ทำการจองห้องอื่นไปแล้ว ไม่สามารถจองห้องใหม่ได้"
      );
      return;
    }

    setBookingLoading(true);
    try {
      const trainbook: TrainbookInterface = {
        RoomID: roomId,
        DriverID: driverID,
        Status: "Confirmed",
      };

      console.log("📡 ตรวจสอบค่าก่อนส่ง API:", trainbook);

      const res = await CreateTrainbook(roomId, trainbook, token);
      console.log("📡 API Response:", res);

      if (res && res.message === "สร้างการจองสำเร็จ") {
        message.success("ยืนยันการจองสำเร็จ!");
        fetchRooms();
        setTimeout(() => navigate("/room"), 2000);
      } else {
        message.error(res?.error || "❌ เกิดข้อผิดพลาดในการจองห้อง");
        setTimeout(() => navigate("/room"), 2000);
      }
    } catch (error) {
      console.error("❌ Error while booking:", error);
      message.error("❌ เกิดข้อผิดพลาดขณะจอง กรุณาลองใหม่");
    } finally {
      setBookingLoading(false);
    }
  };

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
      title: "รายละเอียด",
      dataIndex: "Detail",
      key: "Detail",
      render: (detail: string) => <span>{detail}</span>,
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
          <Button
            type="primary"
            onClick={() => handleBooking(record.ID!)}
            loading={bookingLoading}
            disabled={record.Status === "เต็ม"}
          >
            ยืนยันการจอง
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <DriverSidebar /> {/* ✅ ใช้ Sidebar ของ Driver */}
      <Layout style={{ padding: "20px", backgroundColor: "#EDE8FE" }}>
        {contextHolder}
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
          ระบบจองห้องอบรม
        </h1>

        {/* Room Table */}
        <Table
          rowKey="ID"
          columns={columns}
          dataSource={rooms}
          loading={loading}
          style={{ backgroundColor: "#fff", borderRadius: "8px" }}
        />

        {/* Back Button */}
        <div style={{ textAlign: "right", marginTop: "20px" }}>
          <Space>
            <Link to="/room">
              <Button type="default" icon={<HomeOutlined />}>
                ย้อนกลับ
              </Button>
            </Link>
          </Space>
        </div>
      </Layout>
    </Layout>
  );
}

export default Trainbook;
