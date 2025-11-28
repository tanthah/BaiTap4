import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword, reset } from '../redux/authSlice';

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [validationError, setValidationError] = useState('');

  const { password, confirmPassword } = formData;

  const { loading, error, success } = useSelector((state) => state.auth);

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }

    return () => {
      dispatch(reset());
    };
  }, [success, navigate, dispatch]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    // Validation
    if (password !== confirmPassword) {
      setValidationError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (password.length < 6) {
      setValidationError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    dispatch(resetPassword({ token, password }));
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <Card style={{ width: '400px' }} className="shadow">
        <Card.Body>
          <h2 className="text-center mb-4">Đặt Lại Mật Khẩu</h2>
          
          {(error || validationError) && (
            <Alert variant="danger">{error || validationError}</Alert>
          )}
          {success && (
            <Alert variant="success">
              Mật khẩu đã được đặt lại thành công!
            </Alert>
          )}

          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu mới</Form.Label>
              <Form.Control
                type="password"
                placeholder="Nhập mật khẩu mới"
                name="password"
                value={password}
                onChange={onChange}
                required
                minLength="6"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Xác nhận mật khẩu</Form.Label>
              <Form.Control
                type="password"
                placeholder="Nhập lại mật khẩu mới"
                name="confirmPassword"
                value={confirmPassword}
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
                'Đặt Lại Mật Khẩu'
              )}
            </Button>
          </Form>

          <div className="text-center mt-3">
            <Link to="/login">Quay lại đăng nhập</Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ResetPassword;