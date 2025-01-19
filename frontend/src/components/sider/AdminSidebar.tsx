import React, { useState, useEffect } from "react";
import {
  UserOutlined,
  TeamOutlined,
  CarOutlined,
  GiftOutlined,
  LogoutOutlined,
  DashboardOutlined,
  FundProjectionScreenOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { AiOutlineHome } from "react-icons/ai";
import { Layout, Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import "./AdminSidebar.css";

const { Sider } = Layout;

// กำหนดชนิดข้อมูลใหม่สำหรับ items
type CustomMenuItem = {
  key: string;
  icon: React.ReactNode;
  label: string;
  className?: string;
};

// รายการเมนู
const items: CustomMenuItem[] = [
  { key: "/dashboard", label: "DASHBOARD", icon: <DashboardOutlined /> },
  { key: "/employees", label: "EMPLOYEE", icon: <UserOutlined /> },
  { key: "/members", label: "MEMBER", icon: <TeamOutlined /> },
  { key: "/drivers", label: "DRIVER", icon: <IdcardOutlined /> },
  { key: "/vehicles", label: "VEHICLE", icon: <CarOutlined /> },
  {
    key: "/trainer",
    label: "TRAINING",
    icon: <FundProjectionScreenOutlined />,
  },
  { key: "/promotion", label: "PROMOTION", icon: <GiftOutlined /> },
  { key: "/rooms", label: "ROOM", icon: <AiOutlineHome /> },
  {
    key: "/",
    label: "Log out",
    icon: <LogoutOutlined />,
    className: "menu-item-logout",
  },
];

const AdminSidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  // ตั้งค่า key ที่เลือกในเมนูตาม URL ปัจจุบัน
  useEffect(() => {
    setSelectedKeys([location.pathname]);
  }, [location.pathname]);

  // การคลิกเมนู
  const handleMenuClick = (e: { key: string }) => {
    navigate(e.key);
  };

  return (
    <div className="admin">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={250}
        collapsedWidth={90}
        className="sider"
      >
        <div className={`logo ${collapsed ? "logo-collapsed" : ""}`}>
          <div
            className={`logo-circle ${
              collapsed ? "logo-circle-collapsed" : ""
            }`}
          />
          {!collapsed && <span>admin</span>}
        </div>

        {/* สร้างเมนู */}
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={selectedKeys}
          className="menu"
          onClick={handleMenuClick}
        >
          {items.map((item) => (
            <Menu.Item
              key={item.key}
              icon={
                <span
                  className={`icon-style ${
                    collapsed ? "icon-style-collapsed" : ""
                  }`}
                >
                  {item.icon}
                </span>
              }
              className={`menu-item ${collapsed ? "menu-item-collapsed" : ""} ${
                item.className || ""
              }`}
            >
              {item.label}
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
    </div>
  );
};

export default AdminSidebar;
