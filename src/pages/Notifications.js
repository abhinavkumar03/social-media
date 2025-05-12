import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Container,
  Card,
  ListGroup,
  Image,
  Spinner,
} from 'react-bootstrap';
import { FaBell } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { userAPI } from '../services/api';

const Notifications = () => {
  const { user } = useAuth();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => userAPI.getNotifications(),
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="min-vh-60 d-flex justify-content-center align-items-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Container>
      <Card>
        <Card.Body>
          <h5 className="mb-3">Notifications</h5>
          <hr className="mb-3" />
          {notifications?.length === 0 ? (
            <div className="text-center py-4">
              <FaBell className="text-muted mb-3" style={{ fontSize: '3rem' }} />
              <p className="text-muted mb-0">No notifications yet</p>
            </div>
          ) : (
            <ListGroup variant="flush">
              {notifications?.map((notification) => (
                <ListGroup.Item key={notification._id} className="d-flex align-items-center py-3">
                  <Image
                    src={notification.sender?.profilePhoto}
                    alt={notification.sender?.name}
                    roundedCircle
                    className="me-3"
                    style={{ width: '48px', height: '48px' }}
                  />
                  <div className="flex-grow-1">
                    <p className="mb-1">{notification.message}</p>
                    <small className="text-muted">
                      {new Date(notification.createdAt).toLocaleString()}
                    </small>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Notifications; 