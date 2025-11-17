import { useState } from "react";
import { useParams } from "react-router-dom";
import { Form, Input, Button, message, Card } from "antd";
import { api } from "../api";

export default function ResetPassword() {
  const { token } = useParams();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const res = await api.post(`/reset-password/${token}`, values);

      if (res.data.status) {
        message.success("Đặt mật khẩu thành công!");
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
      <Card title="Đặt lại mật khẩu" bordered={false}>
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item
            name="password"
            label="Mật khẩu mới"
            rules={[{ required: true }]}
          >
            <Input.Password placeholder="Nhập mật khẩu mới" />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={loading} block>
            Đặt lại mật khẩu
          </Button>
        </Form>
      </Card>
    </div>
  );
}
