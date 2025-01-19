import React from "react";
import AdminSidebar from "../../components/sider/DriverSidebar"; // ปรับ path ให้ถูกต้อง

const Dashboard: React.FC = () => {
  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
      <AdminSidebar />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#EDE8FE",
          overflow: "auto",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          -- Driver Dashboard --
        </h1>
      </div>
    </div>
  );
};

export default Dashboard;
