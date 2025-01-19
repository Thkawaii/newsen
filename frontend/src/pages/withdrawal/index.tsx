import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/sider/DriverSidebar";
import { Button, Card, Row, Col, Modal, Divider } from "antd";
import { listDrivers, deleteDriver } from "../../services/https/Driver/index";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/wallet.png";
import { LoginOutlined, HistoryOutlined, CreditCardOutlined } from "@ant-design/icons";
import './DriverWithWithdrawal.css'; // Import external CSS file

const DriverWithWithdrawal: React.FC = () => {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [totalDrivers, setTotalDrivers] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentDriverId, setCurrentDriverId] = useState<number | null>(null);
  const myId = localStorage.getItem("id");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const data = await listDrivers();
        const filteredDrivers = data.filter((drv: any) => drv.ID === parseInt(myId || "0"));
        setDrivers(filteredDrivers);
        setTotalDrivers(filteredDrivers.length);
      } catch (error) {
        console.error("Error fetching drivers:", error);
      }
    };

    fetchDrivers();
  }, [myId]);

  const handleWithdrawClick = () => {
    navigate("/withdrawal/money");
  };

  const handleHistoryClick = () => {
    navigate("/withdrawal/statement");
  };

  const handleDelete = async (id: number) => {
    try {
      const success = await deleteDriver(id);
      if (success) {
        setDrivers(drivers.filter((drv: any) => drv.ID !== id));
        setTotalDrivers(totalDrivers - 1);
      }
    } catch (error) {
      console.error("Error deleting driver:", error);
    } finally {
      setIsModalVisible(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentDriverId(null);
  };

  return (
    <div className="container">
      <AdminSidebar />
      <div className="content">
        <Row gutter={[32, 32]} style={{ marginBottom: "30px" }}></Row>

        {/* Delete Confirmation Modal */}
        <Modal
          title="Confirm Delete"
          open={isModalVisible}
          onOk={() => handleDelete(currentDriverId!)}
          onCancel={handleCancel}
          okText="Confirm"
          cancelText="Cancel"
        >
          <p>Are you sure you want to delete?</p>
        </Modal>

        <Divider />

        {/* กระเป๋าเงิน Section (Moved outside Card) */}
        <Row>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <h2 className="wallet-header">กระเป๋าเงิน</h2>
          </Col>
        </Row>

        {/* Withdrawal Section */}
        <Row>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Card className="wallet-card">
  <img
    src={logo}
    alt="logo"
    className="wallet-logo"
  />
  <h3 className="balance-text" style={{ fontSize: '25px', fontWeight: 'bold', color: '#47456C' }}>ยอดเงินของคุณ</h3>
  <h3 className="balance-amount" style={{ fontSize: '40px', fontWeight: 'bold', color: '#47456C' }}>
  <CreditCardOutlined className="balance-icon" style={{ fontSize: '40px', marginRight: '10px', color: '#7F6BCC' }} />
  {drivers.length > 0 ? drivers[0].Income : 0} บาท
</h3>

  <Button
    type="primary"
    size="large"
    className="withdraw-button"
    onClick={handleWithdrawClick}
    icon={<LoginOutlined />}
  >
    เบิกเงิน
  </Button>
  <Button
    type="default"
    size="large"
    className="history-button"
    onClick={handleHistoryClick}
    icon={<HistoryOutlined />}
  >
    ประวัติการทำรายการ
  </Button>
</Card>

          </Col>
        </Row>
      </div>
    </div>
  );
};

export default DriverWithWithdrawal;
