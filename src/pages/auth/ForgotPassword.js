import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  email: Yup.string()
    .email('Enter a valid email')
    .required('Email is required'),
});

const ForgotPassword = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setError('');
      setSuccess(false);
      try {
        await authAPI.forgotPassword(values.email);
        setSuccess(true);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to send reset email');
      }
    },
  });

  return (
    <Container className="min-vh-100 d-flex align-items-center justify-content-center">
      <Card className="w-100" style={{ maxWidth: '400px' }}>
        <Card.Body className="p-4">
          <h1 className="text-center mb-4">Forgot Password</h1>

          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}

          {success && (
            <Alert variant="success" className="mb-3">
              Password reset instructions have been sent to your email.
            </Alert>
          )}

          <Form onSubmit={formik.handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formik.values.email}
                onChange={formik.handleChange}
                isInvalid={formik.touched.email && formik.errors.email}
                className="rounded-pill"
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              className="w-100 rounded-pill mb-3"
              disabled={formik.isSubmitting}
            >
              Send Reset Instructions
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

export default ForgotPassword; 