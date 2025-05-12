import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useQueryClient } from '../contexts/QueryContext';
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
  FaHeart,
  FaRegHeart,
  FaComment,
} from 'react-icons/fa';
import { postAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [newPost, setNewPost] = useState('');
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts', page],
    queryFn: () => postAPI.getPosts(page),
    keepPreviousData: true,
  });

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    try {
      await postAPI.createPost({ content: newPost });
      setNewPost('');
      queryClient.invalidateQueries(['posts']);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleLike = async (postId) => {
    try {
      await postAPI.likePost(postId);
      queryClient.invalidateQueries(['posts']);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

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
      {/* Create Post */}
      <Card className="mb-4">
        <Card.Body>
          <Form onSubmit={handleCreatePost}>
            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="What's on your mind?"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="mb-3"
              />
              <Button
                type="submit"
                variant="primary"
                disabled={!newPost.trim()}
              >
                Post
              </Button>
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>

      {/* Posts Feed */}
      <Row className="g-3">
        {posts?.data.map((post) => (
          <Col xs={12} key={post._id}>
            <Card>
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <Image
                    src={post.user.profilePhoto}
                    alt={post.user.name}
                    roundedCircle
                    className="me-3"
                    style={{ width: '40px', height: '40px' }}
                  />
                  <div>
                    <h6 className="mb-0">{post.user.name}</h6>
                    <small className="text-muted">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                </div>
                <Card.Text>{post.content}</Card.Text>
              </Card.Body>
              <ListGroup className="list-group-flush">
                <ListGroup.Item className="d-flex align-items-center">
                  <Button
                    variant="link"
                    className="p-0 me-2"
                    onClick={() => handleLike(post._id)}
                  >
                    {post.likes.includes(user._id) ? (
                      <FaHeart className="text-danger" />
                    ) : (
                      <FaRegHeart />
                    )}
                  </Button>
                  <span className="me-3">{post.likes.length}</span>
                  <Button variant="link" className="p-0 me-2">
                    <FaComment />
                  </Button>
                  <span>{post.comments.length}</span>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Load More Button */}
      {posts?.hasMore && (
        <div className="text-center mt-4">
          <Button
            variant="outline-primary"
            onClick={() => setPage((p) => p + 1)}
            disabled={isLoading}
          >
            Load More
          </Button>
        </div>
      )}
    </Container>
  );
};

export default Home;
