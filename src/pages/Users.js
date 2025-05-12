import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Image,
  Button,
  Spinner,
} from 'react-bootstrap';
import {
  FaUserPlus,
  FaUserMinus,
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { userAPI } from '../services/api';

const Users = () => {
  const { user } = useAuth();

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => userAPI.getUsers(),
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
      <Row>
        <Col xs={12} md={8} lg={6} className="mx-auto">
          <Card>
            <Card.Body>
              <h5 className="mb-3">Users ({users?.length || 0})</h5>
              <hr className="mb-3" />
              {isLoading ? (
                <div className="text-center p-3">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              ) : (
                <ListGroup variant="flush">
                  {users?.map((otherUser) => (
                    <ListGroup.Item key={otherUser._id} className="d-flex align-items-center py-3">
                      <Image
                        src={otherUser.profilePhoto}
                        alt={otherUser.name}
                        roundedCircle
                        className="me-3"
                        style={{ width: '48px', height: '48px' }}
                      />
                      <div className="flex-grow-1">
                        <h6 className="mb-1">{otherUser.name}</h6>
                        <small className="text-muted">{otherUser.email}</small>
                      </div>
                      <Button
                        variant="link"
                        className="p-0 text-muted"
                        onClick={() => {
                          // Handle follow/unfollow
                        }}
                      >
                        {otherUser.followers?.includes(user._id) ? (
                          <FaUserMinus />
                        ) : (
                          <FaUserPlus />
                        )}
                      </Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Users; 