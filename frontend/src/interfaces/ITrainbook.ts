import { RoomInterface } from "./IRoom"; // ตรวจสอบ Path ให้ถูกต้อง
import { Driver } from "./IDriver"; // ตรวจสอบ Path ให้ถูกต้อง

export interface TrainbookInterface {
  ID?: number; // รหัสการจอง
  RoomID: number; // รหัสห้องที่จอง
  Room?: RoomInterface; // ข้อมูลห้องที่จอง (Optional)
  DriverID: number; // รหัสผู้ขับที่จอง
  Driver?: Driver; // ข้อมูลผู้ขับ (Optional)
  Status: string; // สถานะการจอง เช่น "Pending", "Confirmed", "Cancelled"
}