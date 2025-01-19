import { useState, useEffect } from "react";
import { message, Layout, Button } from "antd";
import { GetTrainbooks, UpdateTrainbookStatus } from "../../services/https/TrainBookAPI";
import DriverSidebar from "../../components/sider/DriverSidebar";
import { useNavigate } from "react-router-dom";
import "./Training.css";

function Training() {
  const [room, setRoom] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const driverID = localStorage.getItem("id")
    ? Number(localStorage.getItem("id"))
    : null;
  const token = localStorage.getItem("token");

  const fetchDriverTrainbooks = async () => {
    if (!driverID || !token) {
      messageApi.error("ไม่พบข้อมูลผู้ขับ กรุณาเข้าสู่ระบบใหม่");
      return;
    }

    setLoading(true);
    try {
      const res = await GetTrainbooks();
      if (res && Array.isArray(res)) {
        const driverBooking = res.find(
          (trainbook: any) => trainbook.driver_id === driverID && trainbook.status === "in-progress"
        );

        if (!driverBooking) {
          messageApi.info("คุณยังไม่ได้จองห้อง หรือสถานะการจองของคุณไม่อยู่ระหว่างอบรม");
          setRoom(null);
        } else {
          setRoom({
            TrainbookID: driverBooking.ID,
            RoomName: driverBooking.room?.room_name ?? "ไม่พบชื่อห้อง",
            Trainer: driverBooking.room.trainer
              ? `${driverBooking.room.trainer.first_name} ${driverBooking.room.trainer.last_name}`
              : "ไม่ระบุเทรนเนอร์",
            Details: driverBooking.room?.detail ?? "ไม่มีรายละเอียด",
          });
        }
      } else {
        messageApi.error("ไม่สามารถดึงข้อมูลการจองได้");
        setRoom(null);
      }
    } catch (error) {
      messageApi.error("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
      setRoom(null);
    } finally {
      setLoading(false);
    }
  };

  const markAsCompleted = async () => {
    if (!room || !room.TrainbookID) return;

    try {
      const res = await UpdateTrainbookStatus(room.TrainbookID, { status: "completed" });
      if (res && res.status === 200) {
        messageApi.success("สถานะอัปเดตเป็น 'Completed' สำเร็จ");
        fetchDriverTrainbooks();
        setTimeout(() => navigate("/room"), 1500);
      } else {
        messageApi.success("สถานะอัปเดตเป็น 'Completed' สำเร็จ");
        setTimeout(() => navigate("/room"), 1500);
      }
    } catch (error) {
      messageApi.error("เกิดข้อผิดพลาดในการอัปเดตสถานะ");
    }
  };

  useEffect(() => {
    fetchDriverTrainbooks();
  }, []);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <DriverSidebar />
      <Layout className="training-layout">
        {contextHolder}
        <div className="training-container">
          <h1 className="training-title">ห้องอบรม</h1>
          {loading ? (
            <p className="training-loading">กำลังโหลดข้อมูล...</p>
          ) : room ? (
            <div className="training-details">
              <p>
                <strong>ชื่อห้อง:</strong> {room.RoomName}
              </p>
              <p>
                <strong>เทรนเนอร์:</strong> {room.Trainer}
              </p>
              <p>
                <strong>รายละเอียดการอบรม:</strong> {room.Details}
              </p>
              <Button type="primary" onClick={markAsCompleted}>
                สำเร็จ
              </Button>
            </div>
          ) : (
            <p className="training-no-data">ไม่มีข้อมูลห้องอบรม</p>
          )}
        </div>
      </Layout>
    </Layout>
  );
}

export default Training;
