import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useQueryClient } from '../contexts/QueryContext';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Image,
  Spinner,
  ListGroup,
} from 'react-bootstrap';
import { FaUserPlus } from 'react-icons/fa';
import { userAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const UserProfile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();

  const { data: user, isLoading: isLoadingUser } = useQuery(
    ['user', id],
    () => userAPI.getUser(id),
    {
      enabled: !!id,
    }
  );

  const { data: posts, isLoading: isLoadingPosts } = useQuery(
    ['userPosts', id],
    () => userAPI.getUserPosts(id),
    {
      enabled: !!id,
    }
  );

  const handleFollow = async () => {
    try {
      await userAPI.followUser(id);
      queryClient.invalidateQueries(['user', id]);
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  if (isLoadingUser) {
    return (
      <div className="min-vh-60 d-flex justify-content-center align-items-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (!user) {
    return (
      <Container>
        <h5 className="text-danger text-center">User not found</h5>
      </Container>
    );
  }

  const isFollowing = user.followers?.includes(currentUser?._id);

  return (
    <Container>
      <Row className="g-3">
        {/* User Profile Card */}
        <Col xs={12}>
          <Card>
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <Image
                  src={user.profilePhoto}
                  alt={user.name}
                  roundedCircle
                  className="me-3"
                  style={{ width: '100px', height: '100px' }}
                />
                <div className="flex-grow-1">
                  <h4 className="mb-2">{user.name}</h4>
                  <p className="text-muted mb-3">
                    {user.bio || 'No bio yet'}
                  </p>
                  {currentUser?._id !== user._id && (
                    <Button
                      variant={isFollowing ? 'outline-primary' : 'primary'}
                      onClick={handleFollow}
                    >
                      <FaUserPlus className="me-2" />
                      {isFollowing ? 'Following' : 'Follow'}
                    </Button>
                  )}
                </div>
              </div>
              <Row className="text-center">
                <Col xs={4}>
                  <h5>{user.followers?.length || 0}</h5>
                  <small className="text-muted">Followers</small>
                </Col>
                <Col xs={4}>
                  <h5>{user.following?.length || 0}</h5>
                  <small className="text-muted">Following</small>
                </Col>
                <Col xs={4}>
                  <h5>{posts?.length || 0}</h5>
                  <small className="text-muted">Posts</small>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* User's Posts */}
        <Col xs={12}>
          <Card>
            <Card.Body>
              <h5 className="mb-3">Posts</h5>
              <hr />
              {isLoadingPosts ? (
                <div className="text-center p-3">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              ) : posts?.length === 0 ? (
                <p className="text-muted text-center">No posts yet</p>
              ) : (
                <ListGroup variant="flush">
                  {posts?.map((post) => (
                    <ListGroup.Item key={post._id}>
                      <p className="mb-1">{post.content}</p>
                      <small className="text-muted">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </small>
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

export default UserProfile; 