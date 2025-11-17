import { useState } from "react";
import { Form, Input, Button, message, Card } from "antd";
import { api } from "../api";

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const res = await api.post("/forgot-password", values);
      if (res.data.status) {
        message.success("Hãy kiểm tra email của bạn!");
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
      <Card title="Quên mật khẩu" bordered={false}>
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input placeholder="Nhập email" />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={loading} block>
            Gửi yêu cầu khôi phục
          </Button>
        </Form>
      </Card>
    </div>
  );
}
