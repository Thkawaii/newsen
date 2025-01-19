import React from "react";
import { apiRequest } from "../../config/ApiService";
import { Endpoint } from "../../config/Endpoint";

// ทดสอบกดจบงาน หน้าชำระเงิน
const notifyPaymentServer = async () => {
  // id -> booking_id
  const notifyPayment = {
    id: "4",
    message: "update",
  };
  apiRequest("POST", Endpoint.PAYMENT_NOTIFY, notifyPayment);
};

const FinishJob: React.FC = () => {
  return (
    <div className="finish-job-container">
      <h2>จบงาน</h2>
      <p>หมายเลขงาน: 4</p>

      {/* ข้อความแสดงข้อผิดพลาด */}
      <p className="error">เกิดข้อผิดพลาดในการจบงาน</p>

      {/* ปุ่มจบงาน */}
      {/* <button className="btn-finish-job">กดเพื่อจบงาน</button> */}
      <button onClick={notifyPaymentServer}>กดเพื่อจบงาน</button>
    </div>
  );
};

export default FinishJob;
