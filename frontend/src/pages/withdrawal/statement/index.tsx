import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../../components/sider/AdminSidebar";
import { Card, message, Row, Col, Button } from "antd";
import { GetWithdrawal, GetBankName } from "../../../services/https/Driver/withdrawalAPI";
import { WithdrawalInterface } from "../../../interfaces/IWithdrawal";
import { BankNameInterface } from "../../../interfaces/IBankName";
import dayjs from "dayjs";
import "./Statement.css";

const Statement: React.FC = () => {
  const [withdrawalData, setWithdrawalData] = useState<WithdrawalInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [visibleDetails, setVisibleDetails] = useState<Record<number, boolean>>({});

  const myId = localStorage.getItem("id");
  const navigate = useNavigate();

  useEffect(() => {
    if (!myId || myId === "0") {
      messageApi.open({
        type: "error",
        content: "ไม่พบข้อมูลผู้ใช้ที่กำลังใช้งาน",
      });
      return;
    }

    const fetchWithdrawalData = async () => {
      try {
        const withdrawals = await GetWithdrawal();
        const bankName = await GetBankName();

        const withdrawalWithBankName = withdrawals.map((withdrawal: WithdrawalInterface) => {
          const bank = bankName.find((b: BankNameInterface) => b.id === withdrawal.BankNameID);
          return { ...withdrawal, bank_name: bank?.bank_name };
        });

        const filteredData = withdrawalWithBankName.filter(
          (withdrawal: WithdrawalInterface) => withdrawal.driver_id === parseInt(myId)
        );

        // เรียงข้อมูลจากใหม่สุดไปเก่าสุด
        const sortedData = filteredData.sort((a: WithdrawalInterface, b: WithdrawalInterface) => {
          const dateA = dayjs(a.withdrawal_date);
          const dateB = dayjs(b.withdrawal_date);
          return dateB.isBefore(dateA) ? -1 : 1; // ใหม่สุดไปเก่าสุด
        });

        setWithdrawalData(sortedData);
      } catch (error) {
        console.error("Error fetching withdrawals or bank names:", error);
      }
    };

    fetchWithdrawalData();
  }, [myId, messageApi]);

  const toggleDetails = (id: number) => {
    setVisibleDetails((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleBackClick = () => {
    navigate("/withdrawal");
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
      <AdminSidebar />
      <div
        style={{
          flex: 1,
          padding: "20px",
          backgroundColor: "#EDE8FE",
          overflow: "auto",
        }}
      >
        {contextHolder}

        {/* Statement Title */}
        <h1 className="statement-divider">Statement</h1>

        {/* Back Button */}
        <Row gutter={[16, 16]} style={{ marginBottom: 20 }} justify="center">
          <Col>
            <Button onClick={handleBackClick} className="back-button">
              ย้อนกลับ
            </Button>
          </Col>
        </Row>

        {/* Withdrawal List */}
        <div className="withdrawals-list">
          {withdrawalData.map((withdrawal) => (
            <Card
              key={withdrawal.id}
              className="withdrawal-card"
              bordered={false}
            >
              <Row gutter={[16, 16]} className="card-row">
                <Col span={16}>
                  <div className="withdrawal-amount">
                    เบิกเงิน {withdrawal.withdrawal_amount.toFixed(2)} บาท
                  </div>

                </Col>
                <Col span={8} className="text-right">
                  <div className="transaction-date">
                    <strong>วันทำรายการ:</strong> {dayjs(withdrawal.withdrawal_date).format("DD/MM/YYYY")}
                  </div>
                </Col>
              </Row>

              {/* Toggle Details Button */}
              <Row gutter={[16, 16]} style={{ marginTop: 10 }} justify="end">
                <Col>
                  <Button
                    type="link"
                    onClick={() => toggleDetails(withdrawal.id!)}
                    className="details-toggle-btn"
                  >
                    {visibleDetails[withdrawal.id!] ? "ซ่อนรายละเอียด" : "แสดงรายละเอียด"}
                  </Button>
                </Col>
              </Row>

              {/* Additional Details */}
              {visibleDetails[withdrawal.id!] && (
                <>
                  <Row gutter={[16, 16]} style={{ marginTop: 10 }}>
                    <Col span={12} className="text-left">
                    <div className="commission">
  <strong>ค่าคอมมิชชั่น </strong> {(withdrawal.withdrawal_commission ?? 0).toFixed(2)} บาท
</div>


                    </Col>
                    <Col span={12} className="text-right">
                      <div className="bank-name">
                        {(() => {
                          switch (withdrawal.bank_name_id) {
                            case 1:
                              return "ธนาคารกรุงเทพ";
                            case 2:
                              return "ธนาคารกสิกรไทย";
                            case 3:
                              return "ธนาคารไทยพาณิชย์";
                            case 4:
                              return "ธนาคารกรุงไทย";
                            case 5:
                              return "ธนาคารทหารไทย";
                            default:
                              return "ไม่ทราบ";
                          }
                        })()}
                      </div>
                    </Col>
                  </Row>

                  <Row gutter={[16, 16]} style={{ marginTop: 10 }}>
                    <Col span={12} className="text-left">
                    <div className="net-amount">
  <strong>จำนวนเงินที่ได้ </strong> {(withdrawal.withdrawal_net_amount ?? 0).toFixed(2)} บาท
</div>


                    </Col>
                    <Col span={12} className="text-right">
                      <div className="account-number">
                        <strong>เลขบัญชี</strong> {withdrawal.withdrawal_bank_number}
                      </div>
                    </Col>
                  </Row>
                </>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Statement;
