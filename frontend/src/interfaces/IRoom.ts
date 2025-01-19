import { TrainersInterface } from "./ITrainer";

export interface RoomInterface {
  ID?: number; // ID ของห้อง
  RoomName?: string; // ชื่อห้อง (สำหรับ Frontend)
  room_name?: string; // ชื่อห้อง (สำหรับ API)
  Capacity?: number; // ความจุของห้อง (สำหรับ Frontend)
  capacity?: number; // ความจุของห้อง (สำหรับ API)
  TrainerID?: number; // ID ของเทรนเนอร์ที่เชื่อมโยงกับห้อง
  Trainer?: Pick<TrainersInterface, "FirstName" | "LastName"> | null; // จำกัดข้อมูลเฉพาะ FirstName และ LastName ของ Trainer
  Detail?: string; // รายละเอียดห้อง (สำหรับ Frontend)
  detail?: string; // รายละเอียดห้อง (สำหรับ API)
  Title?: string; // รายละเอียดห้อง (สำหรับ Frontend)
  title?: string; // รายละเอียดห้อง (สำหรับ API)
  CurrentBookings?: number; // จำนวนผู้จองห้อง (สำหรับ Frontend)
  current_bookings?: number; // จำนวนผู้จองห้อง (สำหรับ API)
  Status?: string; // สถานะห้อง (Frontend)
  status?: string; // สถานะห้อง (API)
  CreatedAt?: string; // วันที่สร้างห้อง
  UpdatedAt?: string; // วันที่แก้ไขล่าสุด
}