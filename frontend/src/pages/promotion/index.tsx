import { useState, useEffect } from "react";
import { Table, Button, Col, Row, Divider, message, Image, Input } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { GetPromotions, DeletePromotionById } from "../../services/https/indexpromotion";
import { PromotionInterface } from "../../interfaces/IPromotion";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import AdminSidebar from "../../components/sider/AdminSidebar";
import "./Promotion.css";

function Promotion() {
  const navigate = useNavigate();
  const [promotions, setPromotions] = useState<PromotionInterface[]>([]);
  const [filteredPromotions, setFilteredPromotions] = useState<PromotionInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [searchTerm, setSearchTerm] = useState<string>("");

  const columns: ColumnsType<PromotionInterface> = [
    {
      title: "รูปภาพ",
      dataIndex: "photo",
      key: "photo",
      render: (text) => text ? <Image width={50} src={text} alt="Promotion" /> : "-",
      align: "center",
    },
    {
      title: "CODE",
      dataIndex: "promotion_code",
      key: "promotion_code",
      align: "center",
    },
    {
      title: "ชื่อโปรโมชั่น",
      dataIndex: "promotion_name",
      key: "promotion_name",
      align: "center",
    },
    {
      title: "สถานะ",
      dataIndex: "status_promotion_id",
      key: "status_promotion_id",
      render: (text) => {
        if (text === 1) {
          return (
            <span style={{ color: "green", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <CheckCircleOutlined style={{ marginRight: 5 }} />
            </span>
          );
        }
        if (text === 2) {
          return (
            <span style={{ color: "red", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <CloseCircleOutlined style={{ marginRight: 5 }} />
            </span>
          );
        }
        return "ไม่ระบุ";
      },
      align: "center",
    },
    {
      title: "ประเภท",
      dataIndex: "discount_type_id",
      key: "discount_type_id",
      render: (text) => {
        if (text === 1) return "จำนวนเงิน";
        if (text === 2) return "เปอร์เซ็นต์";
        return "ไม่ระบุ";
      },
      align: "center",
    },
    {
      title: "ส่วนลด",
      dataIndex: "discount",
      key: "discount",
      align: "center",
    },
    {
      title: "จำนวนสิทธิ์",
      dataIndex: "use_limit",
      key: "use_limit",
      align: "center",
    },
    {
      title: "จำนวนที่ใช้สิทธิ์",
      dataIndex: "use_count",
      key: "use_count",
      render: (text) => text || 0,
      align: "center",
    },
    {
      title: "ระยะทาง",
      dataIndex: "distance_promotion",
      key: "distance_promotion",
      align: "center",
    },
    {
      title: "วันหมดเขต",
      key: "end_date",
      render: (record) => <>{dayjs(record.end_date).format("DD/MM/YYYY")}</>,
      align: "center",
    },
    {
      title: "คำอธิบายโปรโมชั่น",
      dataIndex: "promotion_description",
      key: "promotion_description",
      render: (text) => (
        <div style={{ wordWrap: "break-word", whiteSpace: "normal", maxWidth: "200px" }}>
          {text || "-"}
        </div>
      ),
      align: "center",
    },
    {
      title: "",
      render: (record) => (
        <Button
          type="dashed"
          danger
          icon={<DeleteOutlined />}
          onClick={() => deletePromotionById(record.ID!)}
          className="promotion-delete-button"
        >
          ลบ
        </Button>
      ),
      align: "center",
    },
    {
      title: "",
      render: (record) => (
        <Button
          type="primary"
          onClick={() => {
            if (record.ID) {
              navigate(`/promotion/edit/${record.ID}`);
            } else {
              messageApi.error("ไม่พบข้อมูลโปรโมชั่นที่ต้องการแก้ไข");
            }
          }}
          className="promotion-edit-button"
          icon={<EditOutlined />}
        >
          แก้ไขข้อมูล
        </Button>
      ),
      align: "center",
    },
  ];

  const getPromotions = async () => {
    try {
      const res = await GetPromotions();
      if (res.status === 200) {
        setPromotions(res.data);
        setFilteredPromotions(res.data);
      } else {
        setPromotions([]);
        messageApi.error(res.data.error);
      }
    } catch (error) {
      messageApi.error("ไม่สามารถดึงข้อมูลโปรโมชันได้");
    }
  };

  const deletePromotionById = async (id: number) => {
    try {
      const res = await DeletePromotionById(String(id));
      if (res.status === 200) {
        messageApi.success(res.data.message);
        getPromotions();
      } else {
        messageApi.error(res.data.error);
      }
    } catch (error) {
      messageApi.error("ไม่สามารถลบโปรโมชันได้");
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterPromotions(value);
  };

  const filterPromotions = (search: string) => {
    const filtered = promotions.filter((promotion) =>
      promotion.promotion_code.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredPromotions(filtered);
  };

  useEffect(() => {
    getPromotions();
  }, []);

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
        <Row justify="center" align="middle" style={{ marginBottom: 16 }}>
          <Col>
            <h2 className="promotion-header" style={{ textAlign: "center" }}>ระบบจัดการโปรโมชั่น</h2>
          </Col>
        </Row>
        <Row justify="center" align="middle" style={{ marginBottom: 16 }}>
  <Col style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
    <Input
      placeholder="ค้นหารหัสโปรโมชั่น"
      value={searchTerm}
      onChange={handleSearch}
      style={{ width: 200, height: 32 }}
      prefix={<SearchOutlined />}
    />
    <Link to="/promotion/create">
      <Button
        type="primary"
        icon={<PlusOutlined />}
        className="promotion-button"
        style={{ height: 32, marginTop: "10px" }} // เพิ่ม marginTop เพื่อสร้างระยะห่างระหว่างปุ่มและช่องค้นหา
      >
        สร้างข้อมูล
      </Button>
    </Link>
  </Col>
</Row>



        <Divider />
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredPromotions}
          className="promotion-table"
          bordered
          pagination={{ pageSize: 10 }}
          style={{ backgroundColor: "#fff", borderRadius: "8px" }}
        />
      </div>
    </div>
  );
}

export default Promotion;