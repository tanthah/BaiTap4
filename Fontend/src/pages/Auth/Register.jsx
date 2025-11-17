import { useState } from "react";
import { Form, Input, Button, message, Card } from "antd";
import { api } from "../api.js";

export default function Register() {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const res = await api.post("/register", values);
      if (res.data.status) {
        message.success("Đăng ký thành công!");
      } else {
        message.error(res.data.message);
      }
    } catch (err) {
      message.error("Có lỗi xảy ra!");
    }
    setLoading(false);
  };

  return (
    <div style={{ width: 400, margin: "50px auto" }}>
      <Card title="Register" bordered={false}>
        <Form onFinish={onFinish} layout="vertical">
          
          <Form.Item name="name" label="Tên người dùng" rules={[{ required: true }]}>
            <Input placeholder="Nhập tên" />
          </Form.Item>

          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input placeholder="Nhập email" />
          </Form.Item>

          <Form.Item name="password" label="Mật khẩu" rules={[{ required: true }]}>
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={loading} block>
            Đăng ký
          </Button>
        </Form>
      </Card>
    </div>
  );
}
