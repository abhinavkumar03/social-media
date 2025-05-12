import { io } from 'socket.io-client';
import { toast } from 'react-toastify';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3000';

class SocketService {
  constructor() {
    this.socket = null;
    this.subscribers = new Map();
  }

  connect() {
    if (this.socket?.connected) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    this.socket = io(SOCKET_URL, {
      auth: { token },
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
      toast.error('Connection error. Please try again.');
    });

    // Set up event listeners for all subscribed events
    this.subscribers.forEach((handlers, event) => {
      handlers.forEach(handler => {
        this.socket.on(event, handler);
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  subscribe(event, handler) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, new Set());
    }
    this.subscribers.get(event).add(handler);

    if (this.socket?.connected) {
      this.socket.on(event, handler);
    }
  }

  unsubscribe(event, handler) {
    if (this.subscribers.has(event)) {
      this.subscribers.get(event).delete(handler);
      if (this.socket?.connected) {
        this.socket.off(event, handler);
      }
    }
  }

  sendMessage(chatId, content) {
    if (!this.socket?.connected) {
      throw new Error('Socket not connected');
    }
    this.socket.emit('message', { chatId, content });
  }

  sendTyping(chatId) {
    if (!this.socket?.connected) return;
    this.socket.emit('typing', { chatId });
  }

  markAsRead(chatId) {
    if (!this.socket?.connected) return;
    this.socket.emit('read', { chatId });
  }
}

export const socketService = new SocketService(); 