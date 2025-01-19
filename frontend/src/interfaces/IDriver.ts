export interface Driver {
  ID?: number; // สำหรับการอัปเดตหรือดึงข้อมูล
  firstname: string;
  lastname: string;
  phone_number: string;
  date_of_birth: string; // รูปแบบ "YYYY-MM-DD"
  identification_number: string;
  driver_license_number: string;
  driver_license_expiration_date: string; // รูปแบบ "YYYY-MM-DD"
  income: number;
  profile?: string; // อาจไม่มีรูปโปรไฟล์
  email: string;
  password: string;
  gender_id: number; // อ้างอิง ID ของ Gender
  statusId?: number; // อาจไม่มี
  employee_id: number;
  locationId?: number; // อาจไม่มี
  rolesId?: number;
  vehicleId?: number;
}
