import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Card,
  Image,
} from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';

const validationSchema = Yup.object({
  mobile: Yup.number().required('Mobile is required'),
  password: Yup.string()
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Password is required'),
});

const Login = () => {
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const formik = useFormik({
    initialValues: {
      mobile: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setError('');
      const result = await login(values);

      if (!result.success) {
        setError(result.error);
      } else {
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      }
    },
  });

  return (
    <Container fluid className="min-vh-100">
      <Row className="min-vh-100">
        {/* Left image panel - hidden on small screens */}
        <Col
          md={6}
          className="d-none d-md-flex align-items-center justify-content-center bg-light"
        >
          <Image
            src="/images/loginPageImageRemovebg.png"
            alt="Signup"
            fluid
            className="rounded"
            style={{ maxHeight: '80vh' }}
          />
        </Col>

        {/* Login form */}
        <Col md={6} className="d-flex align-items-center justify-content-center">
          <Card className="w-100 mx-4" style={{ maxWidth: '400px' }}>
            <Card.Body className="p-4">
              <h1 className="text-center mb-4 fw-bold">Sign in</h1>

              {error && (
                <Alert variant="danger" className="mb-3">
                  {error}
                </Alert>
              )}

              <Form onSubmit={formik.handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Mobile Number</Form.Label>
                  <Form.Control
                    type="number"
                    id="mobile"
                    name="mobile"
                    placeholder="Enter mobile number"
                    value={formik.values.mobile}
                    onChange={formik.handleChange}
                    isInvalid={formik.touched.mobile && formik.errors.mobile}
                    className="rounded-pill"
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.mobile}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    isInvalid={formik.touched.password && formik.errors.password}
                    className="rounded-pill"
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-100 rounded-pill mb-3"
                  disabled={formik.isSubmitting}
                >
                  Sign In
                </Button>

                <div className="d-flex justify-content-between">
                  <Link to="/forgot-password" className="text-decoration-none">
                    Forgot password?
                  </Link>
                  <Link to="/register" className="text-decoration-none">
                    Don't have an account? Sign Up
                  </Link>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
