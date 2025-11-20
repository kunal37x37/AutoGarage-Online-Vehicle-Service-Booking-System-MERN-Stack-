// components/MyBookings.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaDollarSign,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaSpinner,
  FaExclamationTriangle,
  FaCar,
  FaWrench,
  FaTrash,
  FaEye,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaInfoCircle,
  FaComment,
  FaSearch,
  FaFilter,
  FaStar,
  FaTools,
  FaUserCog,
  FaCheck,
  FaBan,
  FaPlayCircle,
  FaFlagCheckered
} from 'react-icons/fa';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedMessageBooking, setSelectedMessageBooking] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    in_progress: 0,
    completed: 0,
    cancelled: 0
  });

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user, filter]);

  const checkUser = async () => {
    const token = localStorage.getItem('autogarage_token');
    if (token) {
      try {
        const response = await fetch(`${API_BASE}/api/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          localStorage.removeItem('autogarage_token');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('autogarage_token');
      }
    }
  };

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('autogarage_token');
      if (!token) {
        setLoading(false);
        return;
      }

      let url = '';
      let queryParams = [];
      
      if (user?.userType === 'garage_owner') {
        url = `${API_BASE}/api/bookings/garage-bookings`;
      } else {
        url = `${API_BASE}/api/bookings/my-bookings`;
      }

      if (filter !== 'all') {
        queryParams.push(`status=${filter}`);
      }

      if (queryParams.length > 0) {
        url += `?${queryParams.join('&')}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Bookings data:', data);
        setBookings(data.bookings || data);
        
        // Calculate stats
        if (data.bookings) {
          calculateStats(data.bookings);
        } else if (Array.isArray(data)) {
          calculateStats(data);
        }
      } else {
        console.error('Failed to fetch bookings');
        setBookings([]);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (bookingsData) => {
    const stats = {
      total: bookingsData.length,
      pending: 0,
      confirmed: 0,
      in_progress: 0,
      completed: 0,
      cancelled: 0
    };

    bookingsData.forEach(booking => {
      if (booking.status) {
        stats[booking.status] = (stats[booking.status] || 0) + 1;
      }
    });

    setStats(stats);
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      return;
    }

    setCancellingId(bookingId);
    
    try {
      const token = localStorage.getItem('autogarage_token');
      const response = await fetch(`${API_BASE}/api/bookings/${bookingId}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Booking cancelled successfully');
        fetchBookings(); // Refresh the list
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Error cancelling booking');
    } finally {
      setCancellingId(null);
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    if (!window.confirm(`Are you sure you want to ${status.replace('_', ' ')} this booking?`)) {
      return;
    }

    setUpdatingStatus(bookingId);
    
    try {
      const token = localStorage.getItem('autogarage_token');
      const response = await fetch(`${API_BASE}/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        alert(`Booking ${status.replace('_', ' ')} successfully`);
        fetchBookings(); // Refresh the list
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to update booking status');
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Error updating booking status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const sendMessageToCustomer = async (e) => {
    e.preventDefault();
    if (!messageText.trim()) {
      alert('Please enter a message');
      return;
    }

    try {
      const token = localStorage.getItem('autogarage_token');
      const response = await fetch(`${API_BASE}/api/messages/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          bookingId: selectedMessageBooking._id,
          message: messageText,
          receiverId: selectedMessageBooking.customer?._id || selectedMessageBooking.userId
        })
      });

      if (response.ok) {
        alert('Message sent successfully');
        setMessageText('');
        setShowMessageModal(false);
        setSelectedMessageBooking(null);
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error sending message');
    }
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const handleMessageCustomer = (booking) => {
    setSelectedMessageBooking(booking);
    setShowMessageModal(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <FaCheckCircle className="text-success" />;
      case 'pending':
        return <FaHourglassHalf className="text-warning" />;
      case 'completed':
        return <FaCheckCircle className="text-primary" />;
      case 'cancelled':
        return <FaTimesCircle className="text-danger" />;
      case 'in_progress':
        return <FaSpinner className="text-info" />;
      default:
        return <FaExclamationTriangle className="text-secondary" />;
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      confirmed: 'bg-success',
      pending: 'bg-warning',
      completed: 'bg-primary',
      cancelled: 'bg-danger',
      in_progress: 'bg-info'
    };
    
    return `badge ${statusClasses[status] || 'bg-secondary'}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not scheduled';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      weekday: 'short'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Not scheduled';
    return timeString;
  };

  const canCancelBooking = (booking) => {
    return booking.status === 'pending' || booking.status === 'confirmed';
  };

  const getServicePrice = (booking) => {
    return booking.servicePrice || booking.service?.price || booking.totalAmount || booking.amount || 0;
  };

  const getServiceName = (booking) => {
    return booking.serviceName || booking.service?.name || booking.serviceType || 'Service';
  };

  const getServiceDuration = (booking) => {
    return booking.duration || booking.service?.duration || 'Not specified';
  };

  const getGarageName = (booking) => {
    return booking.garage?.name || booking.garageName || 'Unknown Garage';
  };

  const getGarageLocation = (booking) => {
    return booking.garage?.location || booking.garageLocation || 'Location not specified';
  };

  const getCustomerName = (booking) => {
    return booking.customer?.name || booking.user?.name || 'Customer';
  };

  const getCustomerEmail = (booking) => {
    return booking.customer?.email || booking.user?.email || 'No email';
  };

  const getCustomerPhone = (booking) => {
    return booking.customer?.phone || booking.user?.phone || 'No phone';
  };

  const filteredBookings = bookings.filter(booking => {
    const searchLower = searchTerm.toLowerCase();
    return (
      getServiceName(booking).toLowerCase().includes(searchLower) ||
      getGarageName(booking).toLowerCase().includes(searchLower) ||
      getCustomerName(booking).toLowerCase().includes(searchLower) ||
      (booking.vehicleInfo?.make?.toLowerCase() || '').includes(searchLower) ||
      (booking.vehicleInfo?.model?.toLowerCase() || '').includes(searchLower) ||
      (booking.vehicleInfo?.licensePlate?.toLowerCase() || '').includes(searchLower) ||
      (booking._id?.toLowerCase() || '').includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <FaSpinner className="spinner spinner-border text-danger mb-3" style={{width: '3rem', height: '3rem'}} />
        <p className="fs-5">Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-12">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold text-primary">
                {user?.userType === 'garage_owner' ? (
                  <>
                    <FaTools className="me-2" />
                    Garage Bookings Management
                  </>
                ) : (
                  <>
                    <FaCalendarAlt className="me-2" />
                    My Bookings
                  </>
                )}
              </h2>
              <p className="text-muted">
                {user?.userType === 'garage_owner' 
                  ? 'Manage all bookings for your garage' 
                  : 'View and manage your service bookings'
                }
              </p>
            </div>
            
            {/* Stats Summary */}
            <div className="d-none d-md-flex gap-3">
              <div className="text-center">
                <div className="fs-4 fw-bold text-primary">{stats.total}</div>
                <small className="text-muted">Total</small>
              </div>
              <div className="text-center">
                <div className="fs-4 fw-bold text-warning">{stats.pending}</div>
                <small className="text-muted">Pending</small>
              </div>
              <div className="text-center">
                <div className="fs-4 fw-bold text-success">{stats.confirmed}</div>
                <small className="text-muted">Confirmed</small>
              </div>
              <div className="text-center">
                <div className="fs-4 fw-bold text-info">{stats.in_progress}</div>
                <small className="text-muted">In Progress</small>
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <FaSearch className="text-muted" />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by service, vehicle, customer, or booking ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex flex-wrap gap-2 align-items-center">
                    <span className="text-muted me-2">
                      <FaFilter className="me-1" />
                      Filter:
                    </span>
                    <select
                      className="form-select"
                      style={{width: 'auto'}}
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bookings List */}
          <div className="row">
            {filteredBookings.length > 0 ? (
              filteredBookings.map(booking => (
                <div key={booking._id} className="col-12 mb-4">
                  <div className="card shadow-sm booking-card h-100">
                    <div className="card-header bg-light d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1 text-primary">
                          Booking #{booking._id?.slice(-8).toUpperCase()}
                        </h6>
                        <small className="text-muted">
                          Created: {formatDate(booking.createdAt || booking.bookingDate)}
                        </small>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <span className={getStatusBadge(booking.status)}>
                          {getStatusIcon(booking.status)} 
                          <span className="ms-1">{booking.status?.replace('_', ' ').toUpperCase() || 'UNKNOWN'}</span>
                        </span>
                      </div>
                    </div>
                    
                    <div className="card-body">
                      <div className="row">
                        {/* Service Information */}
                        <div className="col-lg-3 col-md-6 mb-3">
                          <h6 className="text-danger mb-3">
                            <FaWrench className="me-2" />
                            Service Details
                          </h6>
                          <p className="mb-1 fw-bold">{getServiceName(booking)}</p>
                          <p className="mb-1 text-muted">Duration: {getServiceDuration(booking)}</p>
                          <p className="mb-0 fs-5 fw-bold text-success">₹{getServicePrice(booking)}</p>
                        </div>

                        {/* Vehicle Information */}
                        <div className="col-lg-3 col-md-6 mb-3">
                          <h6 className="text-primary mb-3">
                            <FaCar className="me-2" />
                            Vehicle Details
                          </h6>
                          <p className="mb-1 fw-bold">{booking.vehicleInfo?.make} {booking.vehicleInfo?.model}</p>
                          <p className="mb-1 text-muted">Year: {booking.vehicleInfo?.year}</p>
                          <p className="mb-0 text-muted">Plate: {booking.vehicleInfo?.licensePlate}</p>
                        </div>

                        {/* Schedule & Location */}
                        <div className="col-lg-3 col-md-6 mb-3">
                          <h6 className="text-success mb-3">
                            <FaCalendarAlt className="me-2" />
                            Schedule & Location
                          </h6>
                          <p className="mb-1">
                            <FaClock className="me-2 text-muted" />
                            {formatDate(booking.date)} at {formatTime(booking.time)}
                          </p>
                          <p className="mb-0">
                            <FaMapMarkerAlt className="me-2 text-muted" />
                            {getGarageLocation(booking)}
                          </p>
                          {user?.userType === 'customer' && (
                            <p className="mb-0 mt-2">
                              <strong>Garage:</strong> {getGarageName(booking)}
                            </p>
                          )}
                        </div>

                        {/* Customer/Garage Info & Actions */}
                        <div className="col-lg-3 col-md-6 mb-3">
                          {user?.userType === 'garage_owner' ? (
                            <>
                              <h6 className="text-info mb-3">
                                <FaUser className="me-2" />
                                Customer
                              </h6>
                              <p className="mb-1 fw-bold">{getCustomerName(booking)}</p>
                              <p className="mb-1 text-muted small">{getCustomerEmail(booking)}</p>
                              {getCustomerPhone(booking) !== 'No phone' && (
                                <p className="mb-2 text-muted small">{getCustomerPhone(booking)}</p>
                              )}
                            </>
                          ) : (
                            <h6 className="text-info mb-3">
                              <FaMapMarkerAlt className="me-2" />
                              Garage
                            </h6>
                          )}
                          
                          {/* Payment Info */}
                          <p className="mb-2 small">
                            <strong>Payment:</strong> {booking.paymentMethod === 'pay_at_garage' ? 'Pay at Garage' : (booking.paymentMethod || 'Not specified')}
                          </p>

                          {/* Action Buttons */}
                          <div className="d-flex flex-wrap gap-2 mt-3">
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => handleViewDetails(booking)}
                              title="View Details"
                            >
                              <FaEye className="me-1" />
                              Details
                            </button>
                            
                            {user?.userType === 'garage_owner' && (
                              <button
                                className="btn btn-outline-info btn-sm"
                                onClick={() => handleMessageCustomer(booking)}
                                title="Message Customer"
                              >
                                <FaComment className="me-1" />
                                Message
                              </button>
                            )}
                            
                            {user?.userType === 'customer' && canCancelBooking(booking) && (
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => handleCancelBooking(booking._id)}
                                disabled={cancellingId === booking._id}
                                title="Cancel Booking"
                              >
                                {cancellingId === booking._id ? (
                                  <FaSpinner className="spinner spinner-border spinner-border-sm me-1" />
                                ) : (
                                  <FaTimesCircle className="me-1" />
                                )}
                                Cancel
                              </button>
                            )}
                          </div>

                          {/* Garage Owner Status Controls */}
                          {user?.userType === 'garage_owner' && (
                            <div className="mt-2">
                              {booking.status === 'pending' && (
                                <div className="d-flex gap-1">
                                  <button
                                    className="btn btn-success btn-sm flex-fill"
                                    onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                                    disabled={updatingStatus === booking._id}
                                  >
                                    {updatingStatus === booking._id ? (
                                      <FaSpinner className="spinner spinner-border spinner-border-sm" />
                                    ) : (
                                      <>
                                        <FaCheck className="me-1" />
                                        Confirm
                                      </>
                                    )}
                                  </button>
                                  <button
                                    className="btn btn-danger btn-sm flex-fill"
                                    onClick={() => updateBookingStatus(booking._id, 'cancelled')}
                                    disabled={updatingStatus === booking._id}
                                  >
                                    <FaBan className="me-1" />
                                    Reject
                                  </button>
                                </div>
                              )}
                              
                              {booking.status === 'confirmed' && (
                                <button
                                  className="btn btn-info btn-sm w-100"
                                  onClick={() => updateBookingStatus(booking._id, 'in_progress')}
                                  disabled={updatingStatus === booking._id}
                                >
                                  {updatingStatus === booking._id ? (
                                    <FaSpinner className="spinner spinner-border spinner-border-sm" />
                                  ) : (
                                    <>
                                      <FaPlayCircle className="me-1" />
                                      Start Service
                                    </>
                                  )}
                                </button>
                              )}
                              
                              {booking.status === 'in_progress' && (
                                <button
                                  className="btn btn-primary btn-sm w-100"
                                  onClick={() => updateBookingStatus(booking._id, 'completed')}
                                  disabled={updatingStatus === booking._id}
                                >
                                  {updatingStatus === booking._id ? (
                                    <FaSpinner className="spinner spinner-border spinner-border-sm" />
                                  ) : (
                                    <>
                                      <FaFlagCheckered className="me-1" />
                                      Complete
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Special Instructions */}
                      {booking.specialInstructions && (
                        <div className="row mt-3">
                          <div className="col-12">
                            <div className="alert alert-light border">
                              <h6 className="text-muted mb-2">
                                <FaInfoCircle className="me-2" />
                                Special Instructions:
                              </h6>
                              <p className="text-muted mb-0 small">{booking.specialInstructions}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <FaCalendarAlt size={80} className="text-muted mb-4" />
                <h4 className="text-muted mb-3">No bookings found</h4>
                <p className="text-muted mb-4">
                  {searchTerm 
                    ? "No bookings match your search criteria. Try adjusting your search terms."
                    : filter === 'all'
                    ? "You don't have any bookings yet."
                    : `You don't have any ${filter} bookings.`
                  }
                </p>
                {searchTerm && (
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => setSearchTerm('')}
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="modal-overlay">
          <div className="modal-content" style={{maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto'}}>
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">
                Booking Details - #{selectedBooking._id?.slice(-8).toUpperCase()}
              </h5>
              <button 
                type="button" 
                className="btn-close btn-close-white" 
                onClick={() => setShowDetailsModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <div className="row">
                {/* Customer Information */}
                <div className="col-md-6 mb-4">
                  <h6 className="text-primary border-bottom pb-2 mb-3">
                    <FaUser className="me-2" />
                    {user?.userType === 'garage_owner' ? 'Customer Information' : 'Your Information'}
                  </h6>
                  <p><strong>Name:</strong> {getCustomerName(selectedBooking)}</p>
                  <p><strong>Email:</strong> {getCustomerEmail(selectedBooking)}</p>
                  {getCustomerPhone(selectedBooking) !== 'No phone' && (
                    <p><strong>Phone:</strong> {getCustomerPhone(selectedBooking)}</p>
                  )}
                </div>

                {/* Service Information */}
                <div className="col-md-6 mb-4">
                  <h6 className="text-success border-bottom pb-2 mb-3">
                    <FaWrench className="me-2" />
                    Service Information
                  </h6>
                  <p><strong>Service:</strong> {getServiceName(selectedBooking)}</p>
                  <p><strong>Price:</strong> ₹{getServicePrice(selectedBooking)}</p>
                  <p><strong>Duration:</strong> {getServiceDuration(selectedBooking)}</p>
                  <p><strong>Payment Method:</strong> {selectedBooking.paymentMethod === 'pay_at_garage' ? 'Pay at Garage' : selectedBooking.paymentMethod}</p>
                </div>
              </div>

              <div className="row">
                {/* Vehicle Information */}
                <div className="col-md-6 mb-4">
                  <h6 className="text-info border-bottom pb-2 mb-3">
                    <FaCar className="me-2" />
                    Vehicle Information
                  </h6>
                  <p><strong>Make:</strong> {selectedBooking.vehicleInfo?.make}</p>
                  <p><strong>Model:</strong> {selectedBooking.vehicleInfo?.model}</p>
                  <p><strong>Year:</strong> {selectedBooking.vehicleInfo?.year}</p>
                  <p><strong>License Plate:</strong> {selectedBooking.vehicleInfo?.licensePlate}</p>
                </div>

                {/* Schedule & Status */}
                <div className="col-md-6 mb-4">
                  <h6 className="text-warning border-bottom pb-2 mb-3">
                    <FaCalendarAlt className="me-2" />
                    Schedule & Status
                  </h6>
                  <p><strong>Date:</strong> {formatDate(selectedBooking.date)}</p>
                  <p><strong>Time:</strong> {formatTime(selectedBooking.time)}</p>
                  <p>
                    <strong>Status:</strong>{' '}
                    <span className={getStatusBadge(selectedBooking.status)}>
                      {getStatusIcon(selectedBooking.status)} {selectedBooking.status?.replace('_', ' ').toUpperCase()}
                    </span>
                  </p>
                  <p><strong>Garage:</strong> {getGarageName(selectedBooking)}</p>
                  <p><strong>Location:</strong> {getGarageLocation(selectedBooking)}</p>
                </div>
              </div>

              {/* Special Instructions */}
              {selectedBooking.specialInstructions && (
                <div className="row">
                  <div className="col-12 mb-4">
                    <h6 className="text-muted border-bottom pb-2 mb-3">
                      <FaInfoCircle className="me-2" />
                      Special Instructions
                    </h6>
                    <div className="alert alert-light border">
                      <p className="mb-0">{selectedBooking.specialInstructions}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Notes for Garage Owners */}
              {user?.userType === 'garage_owner' && selectedBooking.notes && (
                <div className="row">
                  <div className="col-12">
                    <h6 className="text-secondary border-bottom pb-2 mb-3">
                      <FaStickyNote className="me-2" />
                      Internal Notes
                    </h6>
                    <div className="alert alert-warning border">
                      <p className="mb-0">{selectedBooking.notes}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              {user?.userType === 'customer' && canCancelBooking(selectedBooking) && (
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    handleCancelBooking(selectedBooking._id);
                    setShowDetailsModal(false);
                  }}
                  disabled={cancellingId === selectedBooking._id}
                >
                  {cancellingId === selectedBooking._id ? (
                    <>
                      <FaSpinner className="spinner spinner-border spinner-border-sm me-2" />
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <FaTimesCircle className="me-2" />
                      Cancel Booking
                    </>
                  )}
                </button>
              )}
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setShowDetailsModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && selectedMessageBooking && (
        <div className="modal-overlay">
          <div className="modal-content" style={{maxWidth: '500px'}}>
            <div className="modal-header bg-info text-white">
              <h5 className="modal-title">Message Customer</h5>
              <button 
                type="button" 
                className="btn-close btn-close-white" 
                onClick={() => {
                  setShowMessageModal(false);
                  setSelectedMessageBooking(null);
                  setMessageText('');
                }}
              ></button>
            </div>
            <div className="modal-body">
              <div className="alert alert-light border mb-3">
                <p className="mb-1"><strong>To:</strong> {getCustomerName(selectedMessageBooking)}</p>
                <p className="mb-1"><strong>Booking:</strong> {getServiceName(selectedMessageBooking)}</p>
                <p className="mb-0"><strong>Date:</strong> {formatDate(selectedMessageBooking.date)}</p>
              </div>
              
              <form onSubmit={sendMessageToCustomer}>
                <div className="mb-3">
                  <label className="form-label fw-bold">Your Message</label>
                  <textarea
                    className="form-control"
                    rows="5"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type your message to the customer. You can provide updates, ask for clarification, or share important information about their booking..."
                    required
                  />
                  <div className="form-text">
                    This message will be sent to the customer and they'll be able to reply.
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary flex-fill">
                    <FaComment className="me-2" />
                    Send Message
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary" 
                    onClick={() => {
                      setShowMessageModal(false);
                      setSelectedMessageBooking(null);
                      setMessageText('');
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;