export interface EmployeeInterface {
  ID?: number; // ตัวเลือก (Optional) สำหรับ ID
  firstname: string; // ใช้ตัวพิมพ์เล็กให้ตรงกับ JSON ที่ส่ง
  lastname: string;
  phone_number: string; // ใช้ตัวพิมพ์เล็กและเครื่องหมายขีดล่าง (snake_case)
  date_of_birth: string; // ใช้ตัวพิมพ์เล็กและเครื่องหมายขีดล่าง
  start_date: string;    // ใช้ตัวพิมพ์เล็กและเครื่องหมายขีดล่าง
  salary: number;
  profile: string;
  email: string;
  password: string;
  position_id: number; // ใช้ตัวพิมพ์เล็กและเครื่องหมายขีดล่าง
  gender_id: number;   // ใช้ตัวพิมพ์เล็กและเครื่องหมายขีดล่าง
}
