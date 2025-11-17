import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Input, Button, message, Card } from "antd";
import { api } from "../../api/api";
import { AuthContext } from "../../context/AuthContext";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const res = await api.post("/login", values);
      
      if (res.data.status) {
        message.success("Đăng nhập thành công!");
        login(res.data.user);
        navigate("/");
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
      <Card title="Đăng nhập" variant="outlined">
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input placeholder="Nhập email" />
          </Form.Item>

          <Form.Item name="password" label="Mật khẩu" rules={[{ required: true }]}>
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={loading} block>
            Đăng nhập
          </Button>

          <div style={{ marginTop: "10px", textAlign: "center" }}>
            <Link to="/forgot-password">Quên mật khẩu?</Link>
            {" | "}
            <Link to="/register">Đăng ký</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}