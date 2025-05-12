import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Card,
  Form,
  Button,
  Alert,
} from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { authAPI } from '../../services/api';

const validationSchema = Yup.object({
  password: Yup.string()
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

const ResetPassword = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const token = new URLSearchParams(location.search).get('token');

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setError('');
      try {
        await authAPI.resetPassword({ token, password: values.password });
        navigate('/login', { state: { message: 'Password reset successful. Please login with your new password.' } });
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to reset password');
      }
    },
  });

  if (!token) {
    return (
      <Container className="min-vh-100 d-flex align-items-center justify-content-center">
        <Card className="w-100" style={{ maxWidth: '400px' }}>
          <Card.Body className="p-4">
            <h1 className="text-center mb-4">Invalid Reset Link</h1>
            <Alert variant="danger">
              The password reset link is invalid or has expired.
            </Alert>
            <div className="text-center mt-3">
              <Link to="/forgot-password" className="text-decoration-none">
                Request a new reset link
              </Link>
            </div>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="min-vh-100 d-flex align-items-center justify-content-center">
      <Card className="w-100" style={{ maxWidth: '400px' }}>
        <Card.Body className="p-4">
          <h1 className="text-center mb-4">Reset Password</h1>

          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}

          <Form onSubmit={formik.handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                id="password"
                name="password"
                placeholder="Enter new password"
                value={formik.values.password}
                onChange={formik.handleChange}
                isInvalid={formik.touched.password && formik.errors.password}
                className="rounded-pill"
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.password}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm new password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                isInvalid={formik.touched.confirmPassword && formik.errors.confirmPassword}
                className="rounded-pill"
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.confirmPassword}
              </Form.Control.Feedback>
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              className="w-100 rounded-pill mb-3"
              disabled={formik.isSubmitting}
            >
              Reset Password
            </Button>

            <div className="text-center">
              <Link to="/login" className="text-decoration-none">
                Back to Sign In
              </Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ResetPassword; 