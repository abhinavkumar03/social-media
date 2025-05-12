import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Image,
  Spinner,
  ListGroup,
} from 'react-bootstrap';
import {
  FaEdit,
  FaUserPlus,
  FaUserMinus,
} from 'react-icons/fa';
import { userAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');

  const { data: followers, isLoading: isLoadingFollowers } = useQuery({
    queryKey: ['followers', user?._id],
    queryFn: () => userAPI.getFollowers(user?._id),
    enabled: !!user?._id,
  });

  const { data: following, isLoading: isLoadingFollowing } = useQuery({
    queryKey: ['following', user?._id],
    queryFn: () => userAPI.getFollowing(user?._id),
    enabled: !!user?._id,
  });

  const handleUpdateProfile = async () => {
    try {
      await updateProfile({ name, bio });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!user) {
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
      <Row className="g-3">
        {/* Profile Card */}
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
                  {isEditing ? (
                    <>
                      <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Bio</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                        />
                      </Form.Group>
                      <div className="mt-2">
                        <Button
                          variant="primary"
                          onClick={handleUpdateProfile}
                          className="me-2"
                        >
                          Save
                        </Button>
                        <Button
                          variant="outline-secondary"
                          onClick={() => {
                            setIsEditing(false);
                            setName(user.name);
                            setBio(user.bio);
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h4 className="mb-2">{user.name}</h4>
                      <p className="text-muted mb-3">
                        {user.bio || 'No bio yet'}
                      </p>
                      <Button
                        variant="outline-primary"
                        onClick={() => setIsEditing(true)}
                      >
                        <FaEdit className="me-2" />
                        Edit Profile
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Followers */}
        <Col xs={12} md={6}>
          <Card>
            <Card.Body>
              <h5 className="mb-3">
                Followers ({followers?.length || 0})
              </h5>
              <hr />
              {isLoadingFollowers ? (
                <div className="text-center p-3">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              ) : (
                <ListGroup variant="flush">
                  {followers?.map((follower) => (
                    <ListGroup.Item key={follower._id} className="d-flex align-items-center">
                      <Image
                        src={follower.profilePhoto}
                        alt={follower.name}
                        roundedCircle
                        className="me-3"
                        style={{ width: '40px', height: '40px' }}
                      />
                      <div className="flex-grow-1">
                        <h6 className="mb-0">{follower.name}</h6>
                        <small className="text-muted">{follower.bio}</small>
                      </div>
                      <Button variant="link" className="p-0">
                        <FaUserMinus />
                      </Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Following */}
        <Col xs={12} md={6}>
          <Card>
            <Card.Body>
              <h5 className="mb-3">
                Following ({following?.length || 0})
              </h5>
              <hr />
              {isLoadingFollowing ? (
                <div className="text-center p-3">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              ) : (
                <ListGroup variant="flush">
                  {following?.map((followed) => (
                    <ListGroup.Item key={followed._id} className="d-flex align-items-center">
                      <Image
                        src={followed.profilePhoto}
                        alt={followed.name}
                        roundedCircle
                        className="me-3"
                        style={{ width: '40px', height: '40px' }}
                      />
                      <div className="flex-grow-1">
                        <h6 className="mb-0">{followed.name}</h6>
                        <small className="text-muted">{followed.bio}</small>
                      </div>
                      <Button variant="link" className="p-0">
                        <FaUserMinus />
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

export default Profile; 