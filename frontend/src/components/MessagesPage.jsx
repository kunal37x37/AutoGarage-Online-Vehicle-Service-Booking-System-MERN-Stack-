// components/MessagesPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaPaperPlane, 
  FaArrowLeft, 
  FaUser, 
  FaRegClock,
  FaCheckDouble,
  FaSpinner,
  FaMapMarkerAlt,
  FaPhone,
  FaTools,
  FaStar,
  FaEnvelope
} from 'react-icons/fa';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

const MessagesPage = () => {
  const { garageId, userId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [garage, setGarage] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  console.log('URL Parameters - garageId:', garageId, 'userId:', userId);

  // Mock data for testing (backend नहीं होने पर)
  const mockGarages = {
    '1': { 
      _id: '1', 
      name: 'City Auto Care', 
      location: 'Mumbai', 
      contactNumber: '+91 9876543210',
      address: '123 Main Street, Andheri East',
      city: 'Mumbai',
      pincode: '400069',
      services: ['Oil Change', 'General Maintenance', 'Battery Replacement'],
      rating: 4.8,
      owner: {
        _id: 'owner1',
        name: 'Rajesh Kumar',
        email: 'rajesh@cityautocare.com',
        userType: 'garage_owner'
      }
    },
    '2': { 
      _id: '2', 
      name: 'Premium Car Services', 
      location: 'Delhi', 
      contactNumber: '+91 9876543211',
      address: '456 MG Road, Connaught Place',
      city: 'Delhi',
      pincode: '110001',
      services: ['Engine Diagnostics', 'AC Service', 'Brake Service'],
      rating: 4.5,
      owner: {
        _id: 'owner2',
        name: 'Priya Singh',
        email: 'priya@premiumcars.com',
        userType: 'garage_owner'
      }
    }
  };

  const mockUsers = {
    'user1': {
      _id: 'user1',
      name: 'Amit Sharma',
      email: 'amit@gmail.com',
      phone: '+91 9876543212',
      userType: 'customer'
    },
    'user2': {
      _id: 'user2',
      name: 'Neha Patel',
      email: 'neha@gmail.com',
      phone: '+91 9876543213',
      userType: 'customer'
    }
  };

  // Get current user and setup chat
  useEffect(() => {
    initializeChat();
  }, [garageId, userId]);

  const initializeChat = async () => {
    try {
      setIsLoading(true);
      
      // Get current user from localStorage or mock
      const token = localStorage.getItem('autogarage_token');
      let userData = null;

      if (token) {
        try {
          const userResponse = await fetch(`${API_BASE}/api/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (userResponse.ok) {
            userData = await userResponse.json();
            setCurrentUser(userData.user);
          }
        } catch (error) {
          console.log('Real API failed, using mock data');
        }
      }

      // If no user from API, use mock data
      if (!userData) {
        const storedUser = localStorage.getItem('autogarage_user');
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
        } else {
          // Create mock user based on context
          const mockUser = garageId ? 
            { _id: 'customer1', name: 'Customer', email: 'customer@example.com', userType: 'customer' } :
            { _id: 'owner1', name: 'Garage Owner', email: 'owner@example.com', userType: 'garage_owner' };
          setCurrentUser(mockUser);
        }
      }

      // Setup chat based on parameters
      if (garageId) {
        await setupUserToGarageChat(garageId);
      } else if (userId) {
        await setupGarageOwnerToUserChat(userId);
      }

    } catch (error) {
      console.error('Error initializing chat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setupUserToGarageChat = async (garageId) => {
    console.log('Setting up user to garage chat with ID:', garageId);
    
    // Try real API first, then mock
    try {
      const response = await fetch(`${API_BASE}/api/garages/${garageId}`);
      if (response.ok) {
        const garageData = await response.json();
        setGarage(garageData);
        setOtherUser(garageData.owner);
      } else {
        throw new Error('API failed');
      }
    } catch (error) {
      // Use mock data
      const garageData = mockGarages[garageId];
      if (garageData) {
        setGarage(garageData);
        setOtherUser(garageData.owner);
        
        // Set mock messages for user
        setMessages([
          {
            _id: '1',
            message: 'Hello! I need to book an oil change service for my car.',
            sender: { _id: 'customer1', name: 'You', userType: 'customer' },
            receiver: garageData.owner,
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            read: true
          },
          {
            _id: '2',
            message: 'Hi! We have slots available tomorrow. What time works for you?',
            sender: garageData.owner,
            receiver: { _id: 'customer1', name: 'Customer', userType: 'customer' },
            createdAt: new Date(Date.now() - 1800000).toISOString(),
            read: true
          }
        ]);
      }
    }
  };

  const setupGarageOwnerToUserChat = async (userId) => {
    console.log('Setting up garage owner to user chat with ID:', userId);
    
    // Try real API first, then mock
    try {
      const response = await fetch(`${API_BASE}/api/users/${userId}`);
      if (response.ok) {
        const userData = await response.json();
        setOtherUser(userData);
        
        // Get garage for this owner
        const token = localStorage.getItem('autogarage_token');
        const garageResponse = await fetch(`${API_BASE}/api/garages/my-garage`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (garageResponse.ok) {
          const garageData = await garageResponse.json();
          setGarage(garageData);
        }
      } else {
        throw new Error('API failed');
      }
    } catch (error) {
      // Use mock data
      const userData = mockUsers[userId];
      if (userData) {
        setOtherUser(userData);
        setGarage(mockGarages['1']); // Default garage
        
        // Set mock messages for garage owner
        setMessages([
          {
            _id: '1',
            message: 'Hello, I would like to know about your car service packages.',
            sender: userData,
            receiver: { _id: 'owner1', name: 'You', userType: 'garage_owner' },
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            read: true
          },
          {
            _id: '2',
            message: 'Hi! We offer various packages. What type of service are you looking for?',
            sender: { _id: 'owner1', name: 'You', userType: 'garage_owner' },
            receiver: userData,
            createdAt: new Date(Date.now() - 1800000).toISOString(),
            read: true
          }
        ]);
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    setSending(true);

    try {
      // Simulate API call - Replace with real API when ready
      setTimeout(() => {
        const newMsg = {
          _id: Date.now().toString(),
          message: newMessage.trim(),
          sender: currentUser,
          receiver: otherUser,
          createdAt: new Date().toISOString(),
          read: false
        };

        setMessages(prev => [...prev, newMsg]);
        setNewMessage('');
        setSending(false);
      }, 500);

      // Real API code (commented for now)
      /*
      const token = localStorage.getItem('autogarage_token');
      const response = await fetch(`${API_BASE}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          receiverId: otherUser._id,
          garageId: garage?._id,
          message: newMessage.trim()
        })
      });

      if (response.ok) {
        setNewMessage('');
        // Refresh messages
        await fetchMessages();
      } else {
        alert('Failed to send message');
      }
      */

    } catch (error) {
      console.error('Send message error:', error);
      alert('Error sending message');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isSameDay = (date1, date2) => {
    return new Date(date1).toDateString() === new Date(date2).toDateString();
  };

  const getHeaderTitle = () => {
    if (garageId) {
      return garage?.name || 'Garage';
    } else {
      return otherUser?.name || 'Customer';
    }
  };

  const getHeaderSubtitle = () => {
    if (garageId) {
      return `Garage Owner • ${garage?.location || ''}`;
    } else {
      return `Customer • ${otherUser?.phone || ''}`;
    }
  };

  const isMyMessage = (message) => {
    return message.sender._id === currentUser?._id;
  };

  if (isLoading) {
    return (
      <div className="container-fluid py-4 text-center">
        <FaSpinner className="spinner-border text-danger mb-3" size={30} />
        <p>Loading messages...</p>
      </div>
    );
  }

  if (!garage && !otherUser) {
    return (
      <div className="container-fluid py-4 text-center">
        <FaUser size={64} className="text-muted mb-3" />
        <h3 className="text-muted">Chat Not Found</h3>
        <p className="text-muted mb-4">Unable to load the conversation.</p>
        <button className="btn btn-danger" onClick={() => navigate(-1)}>
          <FaArrowLeft className="me-2" />
          Go Back
        </button>
        
        {/* Debug Info */}
        <div className="mt-4 p-3 bg-light rounded">
          <small className="text-muted">
            <strong>Debug Info:</strong><br />
            garageId: {garageId}<br />
            userId: {userId}<br />
            Current User: {currentUser?.name}<br />
            User Type: {currentUser?.userType}
          </small>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm">
            {/* Chat Header */}
            <div className="card-header bg-danger text-white d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <button 
                  className="btn btn-sm btn-outline-light me-3"
                  onClick={() => navigate(-1)}
                >
                  <FaArrowLeft />
                </button>
                <div>
                  <h5 className="mb-0">{getHeaderTitle()}</h5>
                  <small className="text-light">
                    <FaUser className="me-1" />
                    {getHeaderSubtitle()}
                  </small>
                </div>
              </div>
            </div>

            {/* Messages Container */}
            <div className="card-body p-0">
              <div 
                className="messages-container p-3"
                style={{ 
                  height: '60vh', 
                  overflowY: 'auto',
                  backgroundColor: '#f8f9fa'
                }}
              >
                {messages.length === 0 ? (
                  <div className="text-center py-5">
                    <FaUser size={48} className="text-muted mb-3" />
                    <h5 className="text-muted">No messages yet</h5>
                    <p className="text-muted">
                      Start a conversation with {otherUser?.name}
                    </p>
                  </div>
                ) : (
                  messages.map((message, index) => {
                    const showDate = index === 0 || 
                      !isSameDay(message.createdAt, messages[index - 1].createdAt);
                    const myMessage = isMyMessage(message);
                    
                    return (
                      <div key={message._id}>
                        {/* Date Separator */}
                        {showDate && (
                          <div className="text-center my-3">
                            <span className="badge bg-secondary">
                              {formatDate(message.createdAt)}
                            </span>
                          </div>
                        )}
                        
                        {/* Message */}
                        <div
                          className={`d-flex mb-3 ${myMessage ? 'justify-content-end' : 'justify-content-start'}`}
                        >
                          <div
                            className={`message-bubble p-3 rounded ${
                              myMessage 
                                ? 'bg-primary text-white' 
                                : 'bg-light text-dark'
                            }`}
                            style={{ maxWidth: '70%' }}
                          >
                            {!myMessage && (
                              <div className="sender-name small text-muted mb-1">
                                <strong>{message.sender.name}</strong>
                              </div>
                            )}
                            <div className="message-text">{message.message}</div>
                            <div 
                              className={`message-time small mt-1 d-flex align-items-center ${
                                myMessage ? 'text-light' : 'text-muted'
                              }`}
                            >
                              <FaRegClock className="me-1" size={10} />
                              {formatTime(message.createdAt)}
                              {myMessage && (
                                <FaCheckDouble className="ms-2" size={12} />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="card-footer bg-white border-0">
                <form onSubmit={handleSendMessage}>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      disabled={sending}
                    />
                    <button 
                      className="btn btn-danger" 
                      type="submit"
                      disabled={!newMessage.trim() || sending}
                    >
                      {sending ? (
                        <FaSpinner className="spinner-border spinner-border-sm" />
                      ) : (
                        <FaPaperPlane />
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Information Card */}
          <div className="card mt-4 shadow-sm">
            <div className="card-header bg-light">
              <h6 className="mb-0">
                {garageId ? 'Garage Information' : 'Customer Information'}
              </h6>
            </div>
            <div className="card-body">
              {garageId ? (
                // Garage Information
                <div className="row">
                  <div className="col-md-6">
                    <p className="mb-2">
                      <strong>
                        <FaMapMarkerAlt className="me-2 text-danger" />
                        Address:
                      </strong><br />
                      {garage?.address}<br />
                      {garage?.city} - {garage?.pincode}
                    </p>
                    {garage?.contactNumber && (
                      <p className="mb-2">
                        <strong>
                          <FaPhone className="me-2 text-success" />
                          Phone:
                        </strong> {garage.contactNumber}
                      </p>
                    )}
                  </div>
                  <div className="col-md-6">
                    <p className="mb-2">
                      <strong>
                        <FaTools className="me-2 text-info" />
                        Services:
                      </strong><br />
                      {garage?.services?.join(', ')}
                    </p>
                    {garage?.rating && (
                      <p className="mb-0">
                        <strong>
                          <FaStar className="me-2 text-warning" />
                          Rating:
                        </strong> {garage.rating}/5
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                // Customer Information
                <div className="row">
                  <div className="col-md-6">
                    <p className="mb-2">
                      <strong>
                        <FaUser className="me-2 text-primary" />
                        Name:
                      </strong> {otherUser?.name}
                    </p>
                    <p className="mb-2">
                      <strong>
                        <FaEnvelope className="me-2 text-success" />
                        Email:
                      </strong> {otherUser?.email}
                    </p>
                  </div>
                  <div className="col-md-6">
                    {otherUser?.phone && (
                      <p className="mb-2">
                        <strong>
                          <FaPhone className="me-2 text-info" />
                          Phone:
                        </strong> {otherUser.phone}
                      </p>
                    )}
                    <p className="mb-0">
                      <strong>User Type:</strong> {otherUser?.userType === 'customer' ? 'Customer' : 'Garage Owner'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;