import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Container,
  Card,
  ListGroup,
  Image,
  Spinner,
  Badge,
} from 'react-bootstrap';
import { FaComments } from 'react-icons/fa';
import { chatAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const ChatList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: chats, isLoading } = useQuery({
    queryKey: ['chats'],
    queryFn: () => chatAPI.getChats(),
    enabled: !!user,
  });

  const handleChatClick = (chatId) => {
    navigate(`/chat/${chatId}`);
  };

  if (isLoading) {
    return (
      <div className="min-vh-80 d-flex justify-content-center align-items-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Container className="py-3">
      <Card>
        <Card.Body>
          <h5 className="mb-3">Messages</h5>
          <hr className="mb-3" />
          {!chats || chats.length === 0 ? (
            <div className="text-center py-4">
              <FaComments className="text-muted mb-3" style={{ fontSize: '3rem' }} />
              <h6 className="text-muted mb-2">No conversations yet</h6>
              <p className="text-muted mb-0">
                Start a new conversation by visiting someone's profile
              </p>
            </div>
          ) : (
            <ListGroup variant="flush">
              {chats.map((chat) => {
                const otherUser = chat.participants.find(p => p.id !== user.id);
                return (
                  <ListGroup.Item
                    key={chat.id}
                    action
                    onClick={() => handleChatClick(chat.id)}
                    className="d-flex align-items-center py-3"
                  >
                    <Image
                      src={otherUser.profilePicture}
                      alt={otherUser.name}
                      roundedCircle
                      className="me-3"
                      style={{ width: '48px', height: '48px' }}
                    />
                    <div className="flex-grow-1">
                      <h6 className={`mb-1 ${chat.unreadCount > 0 ? 'fw-bold' : ''}`}>
                        {otherUser.name}
                      </h6>
                      <p className={`mb-0 small ${chat.unreadCount > 0 ? 'text-dark' : 'text-muted'}`}>
                        {chat.lastMessage?.content || 'No messages yet'}
                      </p>
                    </div>
                    {chat.unreadCount > 0 && (
                      <Badge bg="primary" pill className="ms-2">
                        {chat.unreadCount}
                      </Badge>
                    )}
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ChatList; 