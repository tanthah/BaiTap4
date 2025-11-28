import React, { useEffect } from 'react';
import { Container, Card, Button, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!token || !user) {
      navigate('/login');
    }
  }, [token, user, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (!user) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="shadow-lg">
            <Card.Header className="bg-primary text-white py-3">
              <h3 className="mb-0">
                <i className="bi bi-speedometer2"></i> Dashboard
              </h3>
            </Card.Header>
            <Card.Body className="p-4">
              <Alert variant="success" className="mb-4">
                <Alert.Heading>
                  <i className="bi bi-check-circle-fill"></i> Chào mừng bạn đã đăng nhập!
                </Alert.Heading>
                <hr />
                <p className="mb-0">
                  Tài khoản của bạn đã được xác thực thành công. Bạn có thể sử dụng đầy đủ các tính năng của hệ thống.
                </p>
              </Alert>

              <Card className="mb-4 border-0 bg-light">
                <Card.Body>
                  <h5 className="card-title text-primary mb-3">
                    <i className="bi bi-person-circle"></i> Thông tin tài khoản
                  </h5>
                  <hr />
                  
                  <Row className="mb-3">
                    <Col sm={4}>
                      <strong>Họ và tên:</strong>
                    </Col>
                    <Col sm={8}>
                      <span className="text-muted">{user.name}</span>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col sm={4}>
                      <strong>Email:</strong>
                    </Col>
                    <Col sm={8}>
                      <span className="text-muted">{user.email}</span>
                    </Col>
                  </Row>

                  <Row>
                    <Col sm={4}>
                      <strong>User ID:</strong>
                    </Col>
                    <Col sm={8}>
                      <code className="bg-white px-2 py-1 rounded">{user.id}</code>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              <Card className="mb-4 border-0 bg-light">
                <Card.Body>
                  <h5 className="card-title text-primary mb-3">
                    <i className="bi bi-gear-fill"></i> Thao tác nhanh
                  </h5>
                  <hr />
                  <Row className="g-3">
                    <Col md={6}>
                      <Card className="h-100 border hover-shadow" style={{cursor: 'pointer'}}>
                        <Card.Body className="text-center">
                          <i className="bi bi-person-gear" style={{fontSize: '2rem'}}></i>
                          <h6 className="mt-2">Chỉnh sửa hồ sơ</h6>
                          <p className="text-muted small mb-0">Cập nhật thông tin cá nhân</p>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6}>
                      <Card className="h-100 border hover-shadow" style={{cursor: 'pointer'}}>
                        <Card.Body className="text-center">
                          <i className="bi bi-shield-lock" style={{fontSize: '2rem'}}></i>
                          <h6 className="mt-2">Đổi mật khẩu</h6>
                          <p className="text-muted small mb-0">Bảo mật tài khoản</p>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              <div className="d-flex gap-2 flex-wrap">
                <Button variant="danger" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right"></i> Đăng xuất
                </Button>
                <Button variant="outline-secondary">
                  <i className="bi bi-person-fill"></i> Chỉnh sửa hồ sơ
                </Button>
                <Button variant="outline-primary" as={Link} to="/forgot-password">
                  <i className="bi bi-key-fill"></i> Đổi mật khẩu
                </Button>
              </div>
            </Card.Body>
            <Card.Footer className="text-muted text-center">
              <small>Đăng nhập lần cuối: {new Date().toLocaleString('vi-VN')}</small>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;