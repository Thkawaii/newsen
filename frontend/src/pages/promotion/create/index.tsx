import { Button, Col, Row, Divider, Form, Input, Card, message, DatePicker, InputNumber, Select, Upload } from "antd";
import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import ImgCrop from "antd-img-crop";
import { useSpring, animated } from "@react-spring/web";
import { FileImageOutlined } from "@ant-design/icons";
import { PromotionInterface } from "../../../interfaces/IPromotion";
import { CreatePromotion } from "../../../services/https/indexpromotion";
import dayjs from 'dayjs';
import AdminSidebar from "../../../components/sider/AdminSidebar";

const PromotionCreate = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [discountType, setDiscountType] = useState<'amount' | 'percent'>('amount');
  const [status, setStatus] = useState<'active' | 'expired'>('active');
  const [fileList, setFileList] = useState<any[]>([]);

  const discountTypeMap = {
    amount: 1,
    percent: 2,
  };

  const statusMap = {
    active: 1,
    expired: 2,
  };

  const onFinish = async (values: PromotionInterface) => {
    const promotionData = {
      ...values,
      discount_type_id: discountTypeMap[discountType],
      status_promotion_id: statusMap[status],
      photo: fileList.length > 0 ? fileList[0].thumbUrl : null,
    };

    const res = await CreatePromotion(promotionData);

    if (res.status === 200) {
      messageApi.open({
        type: 'success',
        content: res.data.message,
      });
      setTimeout(() => {
        navigate('/promotion');
      }, 2000);
    } else {
      messageApi.error(res.error || 'Create Promotion Fail');
    }
  };

  const onChange = ({ fileList: newFileList }: { fileList: any[] }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file: any) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src as string;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const cardAnimation = useSpring({
    opacity: 1,
    transform: 'translateY(0)',
    from: { opacity: 0, transform: 'translateY(-50px)' },
    config: { tension: 250, friction: 20 },
  });

  const formAnimation = useSpring({
    opacity: 1,
    transform: 'translateY(0)',
    from: { opacity: 0, transform: 'translateY(20px)' },
    delay: 100,
    config: { tension: 200, friction: 30 },
  });

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        width: '100%',
        backgroundColor: 'rgba(233, 213, 255, 0.4)',
      }}
    >
      <AdminSidebar /> {/* Include AdminSidebar */}
      <div style={{ flex: 1, padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {contextHolder}
        <animated.div style={cardAnimation}>
          <Card
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              borderRadius: '8px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <h2
              style={{
                color: '#6B21A8',
                textAlign: 'left',
                fontSize: '29px',
                fontWeight: 'bold',
                marginTop: 0,
              }}
            >
              สร้างโปรโมชั่นใหม่
            </h2>
            <Divider style={{ margin: '10px 0' }} />
            <animated.div style={formAnimation}>
              <Form
                name="promotionCreate"
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
                style={{
                  padding: '20px',
                  borderRadius: '8px',
                  width: '100%',
                }}
              >
                <Row gutter={[16, 16]}>
                  <Col xs={24}>
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          label="รหัสโปรโมชั่น"
                          name="promotion_code"
                          rules={[
                            { required: true, message: 'กรุณากรอกรหัสโปรโมชั่น !' },
                            { max: 20, message: 'รหัสโปรโมชั่นต้องไม่เกิน 20 ตัวอักษร !' },
                          ]}
                        >
                          <Input placeholder="กรอกรหัส เช่น NEWYEAR2024" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          label="ชื่อโปรโมชั่น"
                          name="promotion_name"
                          rules={[{ required: true, message: 'กรุณากรอกชื่อโปรโมชั่น !' }]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>

                  <Col xs={24}>
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          label="ประเภทส่วนลด"
                          name="discount_type_id"
                          rules={[{ required: true, message: 'กรุณาเลือกประเภทส่วนลด !' }]}
                        >
                          <Select value={discountType} onChange={(value) => setDiscountType(value)}>
                            <Select.Option value="amount">จำนวนเงิน (บาท)</Select.Option>
                            <Select.Option value="percent">เปอร์เซ็นต์ (%)</Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          label={discountType === 'amount' ? 'ส่วนลด (บาท)' : 'ส่วนลด (%)'}
                          name="discount"
                          rules={[{ required: true, message: 'กรุณากรอกจำนวนส่วนลด !' }]}
                        >
                          <InputNumber
                            min={0}
                            max={discountType === 'percent' ? 100 : undefined}
                            style={{ width: '100%' }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>

                  <Col xs={24}>
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          label="สถานะโปรโมชั่น"
                          name="status_promotion_id"
                          rules={[{ required: true, message: 'กรุณาเลือกสถานะโปรโมชั่น !' }]}
                        >
                          <Select value={status} onChange={(value) => setStatus(value)}>
                            <Select.Option value="active">ใช้งานได้</Select.Option>
                            <Select.Option value="expired">ปิดใช้งาน</Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          label="จำนวนสิทธิ์"
                          name="use_limit"
                          rules={[{ required: true, message: 'กรุณากรอกจำนวนครั้งที่ใช้ได้ !' }]}
                        >
                          <InputNumber min={1} style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>

                  <Col xs={24}>
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={12}>
                        <Form.Item label="ระยะทางขั้นต่ำ (กิโลเมตร)" name="distance_promotion">
                          <InputNumber min={0} style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>

                      <Col xs={24} sm={12}>
                        <Form.Item
                          label="วันสิ้นสุดโปรโมชั่น"
                          name="end_date"
                          rules={[{ required: true, message: 'กรุณาเลือกวันหมดเขต !' }]}
                        >
                          <DatePicker
                            style={{ width: '100%' }}
                            disabledDate={(current) => current && current < dayjs().endOf('day')}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>

                  <Col xs={24}>
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          label="รายละเอียดโปรโมชั่น"
                          name="promotion_description"
                          rules={[{ required: true, message: 'กรุณากรอกคำอธิบายโปรโมชั่น !' }]}
                        >
                          <Input.TextArea rows={4} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item label="รูปภาพ" name="photo">
                          <ImgCrop rotationSlider>
                            <Upload
                              listType="picture-card"
                              fileList={fileList}
                              onChange={onChange}
                              onPreview={onPreview}
                              beforeUpload={() => false}
                              maxCount={1}
                            >
                              {fileList.length < 1 && (
                                <div>
                                  <FileImageOutlined style={{ fontSize: '34px' }} />
                                  <div style={{ marginTop: 8 }}>อัพโหลด</div>
                                </div>
                              )}
                            </Upload>
                          </ImgCrop>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>

                  <Col xs={24} style={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
                    <Link to="/promotion">
                      <Button block style={{ width: '150px' }}>ยกเลิก</Button>
                    </Link>
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon={<PlusOutlined />}
                      block
                      style={{
                        backgroundColor: '#9333EA',
                        borderColor: '#9333EA',
                        color: '#fff',
                        width: '150px',
                      }}
                    >
                      บันทึก
                    </Button>
                  </Col>
                </Row>
              </Form>
            </animated.div>
          </Card>
        </animated.div>
      </div>
    </div>
  );
};

export default PromotionCreate;