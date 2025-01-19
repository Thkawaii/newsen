import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/sider/AdminSidebar";
import { Table, Button, Space, Card, Row, Col, Statistic, Modal } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import VehicleIcon from "../../assets/vehicle.png";
import CarIcon from "../../assets/car.png";
import BikeIcon from "../../assets/bike.png";
import { listVehicles, deleteVehicle } from "../../services/https/Vehicle/index";

const Vehicle: React.FC = () => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [totalVehicles, setTotalVehicles] = useState(0);
  const [totalCars, setTotalCars] = useState(0);
  const [totalBikes, setTotalBikes] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentVehicleId, setCurrentVehicleId] = useState<number | null>(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await listVehicles();
        console.log("Fetched Vehicles:", data);
        setVehicles(data);
        setTotalVehicles(data.length);

        const cars = data.filter(
          (vehicle: any) => vehicle.VehicleType?.vehicleType === "Car"
        );
        const bikes = data.filter(
          (vehicle: any) => vehicle.VehicleType?.vehicleType === "Motorcycle"
        );

        setTotalCars(cars.length);
        setTotalBikes(bikes.length);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    fetchVehicles();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const success = await deleteVehicle(id);
      if (success) {
        setVehicles(vehicles.filter((vehicle: any) => vehicle.ID !== id));
        setTotalVehicles(totalVehicles - 1);
      }
    } catch (error) {
      console.error("Error deleting vehicle:", error);
    } finally {
      setIsModalVisible(false);
    }
  };

  const showDeleteModal = (id: number) => {
    setCurrentVehicleId(id);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentVehicleId(null);
  };

  const columns = [
    {
      title: "ลำดับ",
      dataIndex: "ID",
      key: "id",
      render: (__: number, _: any, index: number) => index + 1,
    },
    {
      title: "แบรนด์",
      dataIndex: "Brand",
      key: "brand",
    },
    {
      title: "รุ่น",
      dataIndex: "VehicleModel",
      key: "vehicleModel",
    },
    {
      title: "ทะเบียน",
      dataIndex: "LicensePlate",
      key: "licensePlate",
    },
    {
      title: "ประเภท",
      dataIndex: "VehicleType",
      key: "vehicleType",
      render: (value: any) => value?.vehicleType || "ไม่ระบุ",
    },
    {
      title: "สี",
      dataIndex: "Color",
      key: "color",
    },
    {
      title: "แก้ไข/ลบ",
      key: "actions",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />} />
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => showDeleteModal(record.ID)}
          />
        </Space>
      ),
    },
  ];

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
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
          ระบบจัดการยานพาหนะ
        </h1>

        {/* Summary Section */}
        <Row gutter={[32, 32]} style={{ marginBottom: "30px" }}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card
              bordered={false}
              style={{
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                padding: "16px",
              }}
            >
              <Statistic
                title="จำนวนยานพาหนะ (ทั้งหมด)"
                value={totalVehicles}
                prefix={
                  <img
                    src={VehicleIcon}
                    alt="Vehicle"
                    style={{ marginRight: "8px", width: "30px" }}
                  />
                }
                valueStyle={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8} lg={6}>
            <Card
              bordered={false}
              style={{
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                padding: "16px",
              }}
            >
              <Statistic
                title="จำนวนรถยนต์"
                value={totalCars}
                prefix={
                  <img
                    src={CarIcon}
                    alt="Car"
                    style={{ marginRight: "8px", width: "30px" }}
                  />
                }
                valueStyle={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8} lg={6}>
            <Card
              bordered={false}
              style={{
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                padding: "16px",
              }}
            >
              <Statistic
                title="จำนวนมอเตอร์ไซต์"
                value={totalBikes}
                prefix={
                  <img
                    src={BikeIcon}
                    alt="Bike"
                    style={{ marginRight: "8px", width: "30px" }}
                  />
                }
                valueStyle={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              />
            </Card>
          </Col>
        </Row>

        {/* Vehicle Table */}
        <Table
          dataSource={vehicles}
          columns={columns}
          rowKey="ID"
          pagination={{ pageSize: 5 }}
          style={{ backgroundColor: "#fff", borderRadius: "8px" }}
        />

        {/* Add Button */}
        <div style={{ textAlign: "right", marginTop: "20px" }}>
          <Button
            type="primary"
            style={{ backgroundColor: "#4CAF50", borderColor: "#4CAF50" }}
            icon={<PlusOutlined />}
          >
            Add Vehicle
          </Button>
        </div>

        {/* Delete Confirmation Modal */}
        <Modal
          title="ยืนยันการลบ"
          open={isModalVisible}
          onOk={() => handleDelete(currentVehicleId!)}
          onCancel={handleCancel}
          okText="ยืนยัน"
          cancelText="ยกเลิก"
        >
          <p>คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?</p>
        </Modal>
      </div>
    </div>
  );
};

export default Vehicle;
