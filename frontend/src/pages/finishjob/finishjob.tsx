import React from "react";




const FinishJob: React.FC = () => {
  return (
    <div className="finish-job-container">
      <h2>จบงาน</h2>
      <p>หมายเลขงาน: </p>

      {/* ข้อความแสดงข้อผิดพลาด */}
      <p className="error">เกิดข้อผิดพลาดในการจบงาน</p>

      {/* ปุ่มจบงาน */}
      <button className="btn-finish-job">กดเพื่อจบงาน</button>
    </div>
  );
};

export default FinishJob;
