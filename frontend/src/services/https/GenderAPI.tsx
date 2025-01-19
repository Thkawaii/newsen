import axios from "axios";

const apiUrl = "http://localhost:8080";

const Authorization = localStorage.getItem("token") || ""; // ตรวจสอบว่ามี token หรือไม่
const Bearer = localStorage.getItem("token_type") || ""; // ตรวจสอบว่า token_type มีหรือไม่

const requestOptions = {
  headers: {
    "Content-Type": "application/json",
    Authorization: Authorization && Bearer ? `${Bearer} ${Authorization}` : "",
  },
};

async function GetGender() {
    try {
      const res = await axios.get(`${apiUrl}/gender`, requestOptions);
      return res;
    } catch (e) {
      const error = e as any; // แปลงชนิด `e` เป็น any หรือ AxiosError
      if (error.response) {
        // จัดการข้อผิดพลาดที่ตอบกลับมาจาก API
        return error.response;
      }
      // จัดการข้อผิดพลาดทั่วไป (เช่น เซิร์ฟเวอร์ไม่ตอบสนอง)
      return {
        status: 500,
        data: null,
        error: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้",
      };
    }
  }  

export {
  GetGender,
};
