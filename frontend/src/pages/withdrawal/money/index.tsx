import { useState, useEffect } from "react";
import { Button, Col, Row, Divider, Card, message, Input, Select, InputNumber, } from "antd";
import { CreditCardOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { CreateWithdrawal } from "../../../services/https/Driver/withdrawalAPI";
import { Link } from "react-router-dom";
import AdminSidebar from "../../../components/sider/DriverSidebar";
import { WithdrawalInterface } from "../../../interfaces/IWithdrawal";
import { listDrivers } from "../../../services/https/Driver/index";
import logo from "../../../assets/money.png";

const bankname = [
    { ID: "1", bank_name: "ธนาคารกรุงเทพ" },
    { ID: "2", bank_name: "ธนาคารกสิกรไทย" },
    { ID: "3", bank_name: "ธนาคารไทยพาณิชย์" },
    { ID: "4", bank_name: "ธนาคารกรุงไทย" },
    { ID: "5", bank_name: "ธนาคารทหารไทย" },
];

function WithdrawalCreate() {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [drivers, setDrivers] = useState<any[]>([]);
    const [withdrawalAmount, setWithdrawalAmount] = useState<number>(0);
    const [withdrawalCommission, setWithdrawalCommission] = useState<number>(0);
    const [withdrawalNetAmount, setWithdrawalNetAmount] = useState<number>(0);
    const [withdrawalBankNumber, setWithdrawalBankNumber] = useState<string>("");
    const [selectedBank, setSelectedBank] = useState<string>("1");
    const myId = localStorage.getItem("id");

    if (!myId || myId === "0") {
        messageApi.open({
            type: "error",
            content: "ไม่พบข้อมูลผู้ใช้ที่กำลังใช้งาน",
        });
        return;
    }

    const [currentDriverId, setCurrentDriverId] = useState<number | null>(null);

    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                const data = await listDrivers();
                const filteredDrivers = data.filter((drv: any) => drv.ID === parseInt(myId || "0"));
                setDrivers(filteredDrivers);
                if (filteredDrivers.length > 0) {
                    setCurrentDriverId(filteredDrivers[0].ID);
                } else {
                    messageApi.open({
                        type: "error",
                        content: "ไม่พบข้อมูลไดรเวอร์ที่ตรงกับข้อมูลผู้ใช้",
                    });
                }
            } catch (error) {
                console.error("Error fetching drivers:", error);
            }
        };

        fetchDrivers();
    }, [myId]);

    const calculateCommission = (amount: number) => {
        const commission = Math.floor(amount * 0.30 * 100) / 100; // ปัดเศษลงให้เป็นสองตำแหน่ง
        const netAmount = Math.floor((amount - commission) * 100) / 100; // ปัดเศษลงให้เป็นสองตำแหน่ง
        setWithdrawalCommission(commission);
        setWithdrawalNetAmount(netAmount);
    };


    const handleWithdrawalAmountChange = (value: number | null) => {
        if (value !== null) {
            // ตรวจสอบว่า amount มากกว่าหรือเท่ากับ 100 หรือไม่
            if (value < 100) {
                value = 100;
                messageApi.open({
                    type: "warning",
                    content: "จำนวนเงินที่ถอนต้องไม่น้อยกว่า 100 บาท, จะรีเซ็ตเป็น 100 บาท",
                });
            }

            // ตรวจสอบว่า amount มากกว่าหรือเท่ากับ Income หรือไม่
            if (value > (drivers.length > 0 ? drivers[0].Income : 0)) {
                messageApi.open({
                    type: "error",
                    content: `จำนวนเงินที่ถอนไม่สามารถเกิน ${drivers.length > 0 ? drivers[0].Income : 0} บาท`,
                });
                return;
            }

            setWithdrawalAmount(value);
            calculateCommission(value);
        }
    };

    const handleBankNumberChange = (value: string | null) => {
        if (value !== null && /^\d{0,10}$/.test(value)) {
            setWithdrawalBankNumber(value);
        }
    };

    const handleWithdrawalSubmit = async () => {
        if (withdrawalBankNumber.length !== 10) {
            messageApi.open({
                type: "error",
                content: "กรุณากรอกหมายเลขบัญชีธนาคารให้ครบ 10 หลัก",
            });
            return;
        }

        const withdrawalData: WithdrawalInterface = {
            withdrawal_amount: withdrawalAmount,
            withdrawal_commission: withdrawalCommission,
            withdrawal_net_amount: withdrawalNetAmount,
            withdrawal_bank_number: withdrawalBankNumber,
            withdrawal_date: new Date().toISOString(),  // ให้แน่ใจว่าได้ตั้งค่าทุกครั้ง
            bank_name_id: parseInt(selectedBank),
            driver_id: currentDriverId!,
        };


        await CreateWithdrawal(withdrawalData);

        // แสดงข้อความเสมอว่า "Withdrawal created successfully"
        messageApi.success("Withdrawal created successfully");

        // นำผู้ใช้งานไปยังหน้า /withdrawal เสมอ
        setTimeout(() => {
            navigate("/withdrawal");
        }, 2000);


    };

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100%', backgroundColor: 'rgba(233, 213, 255, 0.4)' }}>
            <AdminSidebar />
            <div style={{ flex: 1, padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {contextHolder}
                <Row gutter={16} style={{ width: '100%' }}>
                    {/* Left Card - Information */}
                    <Col xs={24} sm={12} style={{ display: 'flex', justifyContent: 'center' }}>
                        <Card style={{ width: "100%", backgroundColor: "rgba(254, 246, 255, 0.8)", borderRadius: "8px", textAlign: 'center' }}>
                            <h2 style={{ fontSize: "49px", fontWeight: "bold", color: "#47456C" }}>
                                เบิกเงินพนักงาน
                            </h2>
                            <Divider style={{ margin: "10px 0" }} />
                            <img src={logo} alt="Logo" style={{ width: "650px", marginBottom: "20px", borderRadius: "8px" }} />
                            <h3 style={{ fontSize: "40px", color: "#47456C" }}>
                                <div style={{ fontSize: "30px", fontWeight: "bold", color: "#47456C", marginBottom: "8px" }}>
                                    ยอดเงินของคุณ
                                </div>
                                <CreditCardOutlined style={{ color: "#7F6BCC", marginRight: "8px" }} />
                                {drivers.length > 0 ? drivers[0].Income.toFixed(2) : "0.00"} บาท
                            </h3>
                        </Card>
                    </Col>

                    {/* Right Card - Form */}
                    <Col xs={24} sm={12}>
                        <Card style={{ width: "100%", backgroundColor: "rgba(254, 246, 255, 0.8)", borderRadius: "8px", padding: "20px" }}>
                            {/* Title for the form */}
                            <h3 style={{ fontSize: "30px", fontWeight: "bold", color: "#47456C", marginBottom: "20px" }}>
                                กรอกข้อมูลเบิกเงิน
                            </h3>

                            <div style={{ marginBottom: "20px" }}>
                                <label style={{ fontWeight: "bold" }}>จำนวนเงินที่ถอน:</label>
                                <InputNumber
                                    min={100}
                                    max={drivers.length > 0 ? drivers[0].Income : 0}
                                    style={{ width: "100%" }}
                                    step={1}
                                    precision={0}
                                    value={withdrawalAmount}
                                    onChange={handleWithdrawalAmountChange}
                                />
                            </div>

                            <div style={{ marginBottom: "20px" }}>
                                <label style={{ fontWeight: "bold" }}>ค่าคอมมิชชั่น (30%):</label>
                                <InputNumber value={withdrawalCommission} disabled style={{ width: "100%" }} />
                            </div>

                            <div style={{ marginBottom: "20px" }}>
                                <label style={{ fontWeight: "bold" }}>จำนวนเงินสุทธิ:</label>
                                <InputNumber value={withdrawalNetAmount} disabled style={{ width: "100%" }} />
                            </div>

                            <div style={{ marginBottom: "20px" }}>
                                <label style={{ fontWeight: "bold" }}>หมายเลขบัญชีธนาคาร:</label>
                                <Input type="text" value={withdrawalBankNumber} onChange={(e) => handleBankNumberChange(e.target.value)} maxLength={10} />
                            </div>

                            <div style={{ marginBottom: "20px" }}>
                                <label style={{ fontWeight: "bold" }}>เลือกธนาคาร:</label>
                                <Select value={selectedBank} onChange={(value) => setSelectedBank(value)} style={{ width: '100%' }}>
                                    {bankname.map((bank) => (
                                        <Select.Option key={bank.ID} value={bank.ID}>
                                            {bank.bank_name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </div>

                            <Row justify="center">
                                <Col xs={24} style={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
                                    <Link to="/withdrawal">
                                        <Button block style={{ width: '150px' }}>ย้อนกลับ</Button>
                                    </Link>
                                    <Button block type="primary" style={{ width: '150px' }} onClick={handleWithdrawalSubmit}>ยืนยันการเบิกเงิน</Button>
                                </Col>
                            </Row>
                        </Card>

                        {/* New Card - Additional Information */}
                        <Card style={{ width: "100%", backgroundColor: "rgba(254, 246, 255, 0.8)", borderRadius: "8px", padding: "2px", marginTop: "20px" }}>
                            <h3 style={{ fontSize: "25px", fontWeight: "bold", color: "#47456C", marginBottom: "1px" }}>
                                ข้อตกลงในการเบิกเงิน
                            </h3>
                            <p style={{ fontSize: "15px", color: "#47456C", fontWeight: "bold" }}>
                                พนักงานสามารถเบิกเงินได้ขั้นต่ำ 100 บาท และจะถูกทางบริษัทหักค่าคอมมิชชั่นออกเป็นจำนวน 30%
                            </p>
                        </Card>

                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default WithdrawalCreate;