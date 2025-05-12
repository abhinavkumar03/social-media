import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Container,
  Card,
  Form,
  Button,
  Image,
  Spinner,
} from 'react-bootstrap';
import { FaPaperPlane } from 'react-icons/fa';
import { chatAPI } from '../services/api';
import { socketService } from '../services/socket';
import { useAuth } from '../contexts/AuthContext';

const Chat = () => {
  const { chatId } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  const { data: chat, isLoading: isLoadingChat } = useQuery({
    queryKey: ['chat', chatId],
    queryFn: () => chatAPI.getChats(chatId),
    enabled: !!chatId,
  });

  const { data: messages, isLoading: isLoadingMessages } = useQuery({
    queryKey: ['messages', chatId],
    queryFn: () => chatAPI.getMessages(chatId),
    enabled: !!chatId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: (content) => chatAPI.sendMessage(chatId, content),
    onSuccess: () => {
      queryClient.invalidateQueries(['messages', chatId]);
      setMessage('');
    },
  });

  const handleNewMessage = useCallback((newMessage) => {
    if (newMessage.chatId === chatId) {
      queryClient.invalidateQueries(['messages', chatId]);
    }
  }, [chatId, queryClient]);

  const handleTyping = useCallback(({ chatId: typingChatId, user: typingUser }) => {
    if (typingChatId === chatId && typingUser.id !== user.id) {
      setIsTyping(true);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
      }, 3000);
    }
  }, [chatId, user.id]);

  const handleRead = useCallback(({ chatId: readChatId }) => {
    if (readChatId === chatId) {
      queryClient.invalidateQueries(['messages', chatId]);
    }
  }, [chatId, queryClient]);

  useEffect(() => {
    if (chatId) {
      socketService.connect();
      socketService.subscribe('message', handleNewMessage);
      socketService.subscribe('typing', handleTyping);
      socketService.subscribe('read', handleRead);
    }

    return () => {
      socketService.unsubscribe('message', handleNewMessage);
      socketService.unsubscribe('typing', handleTyping);
      socketService.unsubscribe('read', handleRead);
    };
  }, [chatId, handleNewMessage, handleTyping, handleRead]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    sendMessageMutation.mutate(message);
    socketService.sendMessage(chatId, message);
  };

  const handleTypingStart = () => {
    socketService.sendTyping(chatId);
  };

  if (isLoadingChat || isLoadingMessages) {
    return (
      <div className="min-vh-80 d-flex justify-content-center align-items-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (!chat) {
    return (
      <Container>
        <h5 className="text-danger">Chat not found</h5>
      </Container>
    );
  }

  const otherUser = chat.participants.find(p => p.id !== user.id);

  return (
    <Container className="h-100 py-3" style={{ height: 'calc(100vh - 64px)' }}>
      <Card className="h-100">
        {/* Chat header */}
        <Card.Header className="py-3">
          <div className="d-flex align-items-center">
            <Image
              src={otherUser.profilePicture}
              alt={otherUser.name}
              roundedCircle
              className="me-2"
              style={{ width: '40px', height: '40px' }}
            />
            <h6 className="mb-0">{otherUser.name}</h6>
          </div>
        </Card.Header>

        {/* Messages */}
        <div className="flex-grow-1 overflow-auto p-3" style={{ height: 'calc(100% - 130px)' }}>
          <div className="d-flex flex-column gap-2">
            {messages?.map((msg) => (
              <div
                key={msg.id}
                className={`d-flex ${msg.sender.id === user.id ? 'justify-content-end' : 'justify-content-start'}`}
              >
                <div
                  className={`p-2 rounded-3 ${
                    msg.sender.id === user.id
                      ? 'bg-primary text-white'
                      : 'bg-light'
                  }`}
                  style={{ maxWidth: '70%' }}
                >
                  <p className="mb-1">{msg.content}</p>
                  <small className={`${msg.sender.id === user.id ? 'text-white-50' : 'text-muted'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </small>
                </div>
              </div>
            ))}
            {isTyping && (
              <small className="text-muted">
                {otherUser.name} is typing...
              </small>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message input */}
        <Card.Footer className="py-3">
          <Form onSubmit={handleSendMessage} className="d-flex gap-2">
            <Form.Control
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleTypingStart}
            />
            <Button
              type="submit"
              variant="primary"
              disabled={!message.trim() || sendMessageMutation.isLoading}
            >
              <FaPaperPlane />
            </Button>
          </Form>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default Chat; 