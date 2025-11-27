import React, { useState } from 'react';
import { Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const body = JSON.stringify({ email, password });

      const res = await axios.post(
        'http://localhost:5000/api/auth/login',
        body,
        config
      );

      // Lưu token và user info vào localStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // Chuyển hướng đến dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Email hoặc mật khẩu không đúng'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <Card style={{ width: '400px' }} className="shadow">
        <Card.Body>
          <h2 className="text-center mb-4">Đăng Nhập</h2>
          
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Nhập email"
                name="email"
                value={email}
                onChange={onChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu</Form.Label>
              <Form.Control
                type="password"
                placeholder="Nhập mật khẩu"
                name="password"
                value={password}
                onChange={onChange}
                required
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Đang xử lý...
                </>
              ) : (
                'Đăng Nhập'
              )}
            </Button>
          </Form>

          <div className="text-center mt-3">
            <Link to="/forgot-password">Quên mật khẩu?</Link>
          </div>
          
          <hr />
          
          <div className="text-center">
            <p className="mb-0">
              Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
            </p>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;