import React, { useState } from 'react';
import { useNavigate, useLocation, Outlet, Link } from 'react-router-dom';
import {
  Navbar,
  Container,
  Nav,
  Offcanvas,
  Button,
  Image,
  Badge,
  NavDropdown,
} from 'react-bootstrap';
import {
  FaHome,
  FaUser,
  FaComments,
  FaBell,
  FaUsers,
  FaSignOutAlt,
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const Layout = () => {
  const [show, setShow] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleLogout = () => {
    logout();
  };

  const menuItems = [
    { text: 'Home', icon: <FaHome />, path: '/' },
    { text: 'Profile', icon: <FaUser />, path: '/profile' },
    { text: 'Chat', icon: <FaComments />, path: '/chat' },
    { text: 'Notifications', icon: <FaBell />, path: '/notifications' },
    { text: 'Users', icon: <FaUsers />, path: '/users' },
  ];

  const Sidebar = () => (
    <Nav className="flex-column">
      {menuItems.map((item) => (
        <Nav.Link
          key={item.text}
          onClick={() => {
            navigate(item.path);
            handleClose();
          }}
          active={location.pathname === item.path}
          className="d-flex align-items-center gap-2"
        >
          {item.icon}
          {item.text}
        </Nav.Link>
      ))}
    </Nav>
  );

  return (
    <div className="d-flex">
      {/* Sidebar for desktop */}
      <div className="d-none d-md-block bg-light" style={{ width: '240px', minHeight: '100vh' }}>
        <div className="p-3">
          <h5 className="mb-3">Social App</h5>
          <Sidebar />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-grow-1">
        <Navbar bg="light" expand="md" className="border-bottom">
          <Container fluid>
            <Button
              variant="link"
              className="d-md-none"
              onClick={handleShow}
            >
              <span className="navbar-toggler-icon"></span>
            </Button>
            <Navbar.Brand className="d-none d-md-block">Social App</Navbar.Brand>
            <div className="ms-auto d-flex align-items-center">
              <Button variant="link" className="position-relative me-3">
                <FaBell />
                <Badge bg="danger" className="position-absolute top-0 start-100 translate-middle">
                  4
                </Badge>
              </Button>
              <NavDropdown
                title={
                  <Image
                    src={user?.profilePhoto}
                    alt={user?.name}
                    roundedCircle
                    style={{ width: '32px', height: '32px' }}
                  />
                }
                id="basic-nav-dropdown"
                align="end"
              >
                <NavDropdown.Item onClick={() => navigate('/profile')}>
                  <FaUser className="me-2" />
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  <FaSignOutAlt className="me-2" />
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </div>
          </Container>
        </Navbar>

        {/* Mobile sidebar */}
        <Offcanvas show={show} onHide={handleClose}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Social App</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Sidebar />
          </Offcanvas.Body>
        </Offcanvas>

        {/* Main content */}
        <main className="p-3">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout; 