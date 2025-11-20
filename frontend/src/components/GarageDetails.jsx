// components/GarageDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FaArrowLeft, FaStar, FaMapMarkerAlt, FaClock, 
  FaPhone, FaEnvelope, FaWrench, FaCalendarCheck,
  FaUsers, FaDollarSign, FaSpinner
} from 'react-icons/fa';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

const GarageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [garage, setGarage] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchGarageDetails();
    checkAuth();
  }, [id]);

  const checkAuth = async () => {
    const token = localStorage.getItem('autogarage_token');
    if (token) {
      try {
        const response = await fetch(`${API_BASE}/api/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    }
  };

  const fetchGarageDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch garage details
      const garageResponse = await fetch(`${API_BASE}/api/garages/${id}`);
      const garageData = await garageResponse.json();
      
      if (garageResponse.ok) {
        setGarage(garageData);
        
        // Fetch garage services
        const servicesResponse = await fetch(`${API_BASE}/api/garages/${id}/services`);
        if (servicesResponse.ok) {
          const servicesData = await servicesResponse.json();
          setServices(servicesData);
        }
      } else {
        alert('Garage not found');
        navigate('/AutoGarageHomepage');
      }
    } catch (error) {
      console.error('Error fetching garage details:', error);
      alert('Error loading garage information');
    } finally {
      setLoading(false);
    }
  };

  const handleBookService = () => {
    if (!user) {
      alert('Please login to book services');
      return;
    }
    navigate(`/booking/${id}`);
  };

  const handleMessageGarage = () => {
    if (!user) {
      alert('Please login to message the garage');
      return;
    }
    navigate(`/messages/${id}`);
  };

  const renderStars = (rating) => {
    const floored = Math.round(rating);
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar key={index} className={index < floored ? 'text-warning' : 'text-muted'} />
    ));
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <FaSpinner className="spinner-border text-danger mb-3" size={30} />
        <p>Loading garage details...</p>
      </div>
    );
  }

  if (!garage) {
    return (
      <div className="container py-5 text-center">
        <h3>Garage not found</h3>
        <button className="btn btn-danger mt-3" onClick={() => navigate('/AutoGarageHomepage')}>
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex align-items-center mb-4">
        <button 
          className="btn btn-outline-secondary me-3"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft />
        </button>
        <div>
          <h1 className="mb-1">{garage.name}</h1>
          <div className="d-flex align-items-center">
            <div className="me-2">{renderStars(garage.rating || 4.0)}</div>
            <span className="text-muted">({garage.reviews || 0} reviews)</span>
            <span className="badge bg-success ms-2">
              {garage.isVerified ? 'Verified' : 'Pending Verification'}
            </span>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Main Content */}
        <div className="col-lg-8">
          {/* Garage Image */}
          <div className="card mb-4">
            <img 
              src={garage.image || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'} 
              className="card-img-top" 
              alt={garage.name}
              style={{ height: '300px', objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
              }}
            />
          </div>

          {/* About Section */}
          <div className="card mb-4">
            <div className="card-header bg-light">
              <h5 className="mb-0">About This Garage</h5>
            </div>
            <div className="card-body">
              <p className="card-text">
                {garage.description || 'Professional auto service garage providing quality car maintenance and repair services.'}
              </p>
              
              <div className="row">
                <div className="col-md-6">
                  <p className="mb-2">
                    <FaMapMarkerAlt className="text-danger me-2" />
                    <strong>Address:</strong><br />
                    {garage.address}<br />
                    {garage.city}, {garage.location} - {garage.pincode}
                  </p>
                </div>
                <div className="col-md-6">
                  {garage.openingHours && (
                    <p className="mb-2">
                      <FaClock className="text-primary me-2" />
                      <strong>Opening Hours:</strong><br />
                      {garage.openingHours.open} - {garage.openingHours.close}<br />
                      {garage.openingHours.days}
                    </p>
                  )}
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  {garage.contactNumber && (
                    <p className="mb-2">
                      <FaPhone className="text-success me-2" />
                      <strong>Contact:</strong> {garage.contactNumber}
                    </p>
                  )}
                </div>
                <div className="col-md-6">
                  {garage.email && (
                    <p className="mb-2">
                      <FaEnvelope className="text-info me-2" />
                      <strong>Email:</strong> {garage.email}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Services Section */}
          <div className="card mb-4">
            <div className="card-header bg-light">
              <h5 className="mb-0">
                <FaWrench className="me-2" />
                Services Offered
              </h5>
            </div>
            <div className="card-body">
              {services.length > 0 ? (
                <div className="row">
                  {services.map(service => (
                    <div key={service._id} className="col-md-6 mb-3">
                      <div className="card h-100 border-0 shadow-sm">
                        <div className="card-body">
                          <h6 className="card-title text-danger">{service.name}</h6>
                          {service.description && (
                            <p className="card-text small text-muted mb-2">
                              {service.description}
                            </p>
                          )}
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="fw-bold text-success">₹{service.price}</span>
                            <span className="badge bg-light text-dark">
                              {service.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <FaWrench size={48} className="text-muted mb-3" />
                  <h6 className="text-muted">No services available</h6>
                  <p className="text-muted">This garage hasn't added any services yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-lg-4">
          {/* Action Card */}
          <div className="card shadow-sm sticky-top" style={{ top: '20px' }}>
            <div className="card-header bg-danger text-white">
              <h5 className="mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-3">
                <button
                  className="btn btn-danger btn-lg"
                  onClick={handleBookService}
                >
                  <FaCalendarCheck className="me-2" />
                  Book a Service
                </button>
                
                <button
                  className="btn btn-outline-primary"
                  onClick={handleMessageGarage}
                >
                  Message Garage
                </button>

                {garage.contactNumber && (
                  <a
                    href={`tel:${garage.contactNumber}`}
                    className="btn btn-outline-success"
                  >
                    <FaPhone className="me-2" />
                    Call Now
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Statistics Card */}
          <div className="card mt-4">
            <div className="card-header bg-light">
              <h6 className="mb-0">Garage Statistics</h6>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-6 mb-3">
                  <FaStar className="text-warning mb-2" size={24} />
                  <div className="fw-bold">{garage.rating || '4.0'}</div>
                  <small className="text-muted">Rating</small>
                </div>
                <div className="col-6 mb-3">
                  <FaUsers className="text-primary mb-2" size={24} />
                  <div className="fw-bold">{garage.reviews || 0}</div>
                  <small className="text-muted">Reviews</small>
                </div>
                <div className="col-6">
                  <FaWrench className="text-success mb-2" size={24} />
                  <div className="fw-bold">{services.length}</div>
                  <small className="text-muted">Services</small>
                </div>
                <div className="col-6">
                  <FaDollarSign className="text-info mb-2" size={24} />
                  <div className="fw-bold">
                    {services.length > 0 ? 
                      `₹${Math.min(...services.map(s => s.price))}+` : 'N/A'
                    }
                  </div>
                  <small className="text-muted">Starting Price</small>
                </div>
              </div>
            </div>
          </div>

          {/* Owner Info */}
          {garage.owner && (
            <div className="card mt-4">
              <div className="card-header bg-light">
                <h6 className="mb-0">Garage Owner</h6>
              </div>
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" 
                         style={{ width: '50px', height: '50px' }}>
                      <FaUsers size={20} />
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h6 className="mb-1">{garage.owner.name}</h6>
                    <p className="text-muted small mb-0">{garage.owner.email}</p>
                    {garage.owner.phone && (
                      <p className="text-muted small mb-0">{garage.owner.phone}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GarageDetails;