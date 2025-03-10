import React, { useEffect, useState, useRef } from 'react';
import { getMessages, sendMessage } from '../api/services';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000'); // Replace with your backend URL

const Messaging = ({ receiverId }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Fetch messages when receiverId changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (receiverId) {
        const fetchedMessages = await getMessages(receiverId);
        setMessages(fetchedMessages);
      }
    };

    fetchMessages();
  }, [receiverId]);

  // Scroll to the bottom of the messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Listen for incoming messages
  useEffect(() => {
    socket.on('receiveMessage', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  const handleSendMessage = async () => {
    if (newMessage.trim() && receiverId) { // Ensure receiverId is defined
      try {
        // Send the message via the REST API
        const messageData = {
          receiver: receiverId,
          content: newMessage,
          sender: user.id // Assuming `user` is the authenticated user
        };

        // Call the sendMessage API
        const response = await sendMessage(messageData);

        // Emit the message via Socket.IO
        socket.emit('sendMessage', messageData);

        // Clear the input field
        setNewMessage('');

        // Optionally, update the messages state with the new message
        setMessages((prevMessages) => [...prevMessages, response.data]);
      } catch (error) {
        console.error('Error sending message:', error);
        // Display an error message to the user (optional)
        alert('Failed to send message. Please try again.');
      }
    } else {
      console.error('Receiver ID or message content is missing.');
    }
  };

  return (
    <div className="flex flex-col h-full p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Chat</h2>
      <div className="flex-grow overflow-y-auto mb-4">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex mb-2 ${
              msg.sender._id === user.id ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs p-3 rounded-lg ${
                msg.sender._id === user.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              <p>{msg.content}</p>
              <span className="text-xs text-gray-400 block mt-1">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type your message..."
          className="flex-grow p-2 border rounded-l-lg focus:outline-none"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600 transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Messaging;