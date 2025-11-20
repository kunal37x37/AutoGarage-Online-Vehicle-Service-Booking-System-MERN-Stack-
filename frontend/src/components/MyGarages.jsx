// components/MyGarages.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaEdit, FaTrash, FaPlus, FaStar, FaMapMarkerAlt, 
  FaClock, FaPhone, FaEnvelope, FaSpinner,
  FaEye, FaTools
} from 'react-icons/fa';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

const MyGarages = () => {
  const [garages, setGarages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyGarages();
  }, []);

  const fetchMyGarages = async () => {
    try {
      const token = localStorage.getItem('autogarage_token');
      const response = await fetch(`${API_BASE}/api/garages/my-garages`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setGarages(data);
      } else {
        console.error('Failed to fetch garages');
      }
    } catch (error) {
      console.error('Error fetching garages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGarage = async (garageId) => {
    if (!window.confirm('Are you sure you want to delete this garage? This action cannot be undone.')) {
      return;
    }

    setDeletingId(garageId);
    
    try {
      const token = localStorage.getItem('autogarage_token');
      const response = await fetch(`${API_BASE}/api/garages/${garageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Garage deleted successfully');
        setGarages(garages.filter(garage => garage._id !== garageId));
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to delete garage');
      }
    } catch (error) {
      console.error('Error deleting garage:', error);
      alert('Error deleting garage');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditGarage = (garageId) => {
    navigate(`/add-garage?edit=${garageId}`);
  };

  const handleViewGarage = (garageId) => {
    navigate(`/garage/${garageId}`);
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
        <p>Loading your garages...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">My Garages</h2>
          <p className="text-muted mb-0">Manage your registered garages</p>
        </div>
        <Link to="/add-garage" className="btn btn-danger">
          <FaPlus className="me-2" />
          Add New Garage
        </Link>
      </div>

      {/* Garages Grid */}
      {garages.length === 0 ? (
        <div className="text-center py-5">
          <FaTools size={64} className="text-muted mb-3" />
          <h4 className="text-muted">No Garages Found</h4>
          <p className="text-muted mb-4">
            You haven't registered any garages yet. Start by adding your first garage to receive bookings.
          </p>
          <Link to="/add-garage" className="btn btn-danger btn-lg">
            <FaPlus className="me-2" />
            Add Your First Garage
          </Link>
        </div>
      ) : (
        <div className="row">
          {garages.map(garage => (
            <div key={garage._id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 shadow-sm garage-card">
                {/* Garage Header */}
                <div className="card-header bg-light d-flex justify-content-between align-items-center">
                  <h6 className="mb-0 text-truncate">{garage.name}</h6>
                  <span className={`badge ${garage.isVerified ? 'bg-success' : 'bg-warning'}`}>
                    {garage.isVerified ? 'Verified' : 'Pending'}
                  </span>
                </div>

                {/* Garage Body */}
                <div className="card-body">
                  {/* Rating */}
                  <div className="d-flex align-items-center mb-2">
                    <div className="me-2">{renderStars(garage.rating || 4.0)}</div>
                    <span className="text-muted small">({garage.reviews || 0} reviews)</span>
                  </div>

                  {/* Location */}
                  <p className="card-text mb-2">
                    <FaMapMarkerAlt className="text-danger me-2" />
                    <small>{garage.location}, {garage.city}</small>
                  </p>

                  {/* Address */}
                  <p className="card-text small text-muted mb-2">
                    {garage.address}
                  </p>

                  {/* Contact Info */}
                  {garage.contactNumber && (
                    <p className="card-text small mb-1">
                      <FaPhone className="me-2 text-muted" size={12} />
                      <strong>Phone:</strong> {garage.contactNumber}
                    </p>
                  )}

                  {garage.email && (
                    <p className="card-text small mb-2">
                      <FaEnvelope className="me-2 text-muted" size={12} />
                      <strong>Email:</strong> {garage.email}
                    </p>
                  )}

                  {/* Opening Hours */}
                  {garage.openingHours && (
                    <p className="card-text small mb-3">
                      <FaClock className="me-2 text-muted" size={12} />
                      <strong>Hours:</strong> {garage.openingHours.open} - {garage.openingHours.close}
                      <br />
                      <span className="ms-4">{garage.openingHours.days}</span>
                    </p>
                  )}

                  {/* Services */}
                  <div className="mb-3">
                    <h6 className="small fw-bold mb-2">Services Offered:</h6>
                    <div className="d-flex flex-wrap gap-1">
                      {garage.services.slice(0, 3).map((service, idx) => (
                        <span key={idx} className="badge bg-light text-dark border small">
                          {service}
                        </span>
                      ))}
                      {garage.services.length > 3 && (
                        <span className="badge bg-light text-dark border small">
                          +{garage.services.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Statistics */}
                  <div className="row text-center small">
                    <div className="col-4">
                      <div className="fw-bold text-primary">{garage.reviews || 0}</div>
                      <div className="text-muted">Reviews</div>
                    </div>
                    <div className="col-4">
                      <div className="fw-bold text-success">{garage.rating || '4.0'}</div>
                      <div className="text-muted">Rating</div>
                    </div>
                    <div className="col-4">
                      <div className="fw-bold text-info">{garage.services.length}</div>
                      <div className="text-muted">Services</div>
                    </div>
                  </div>
                </div>

                {/* Garage Footer */}
                <div className="card-footer bg-white">
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-primary btn-sm flex-fill"
                      onClick={() => handleViewGarage(garage._id)}
                    >
                      <FaEye className="me-1" />
                      View
                    </button>
                    <button
                      className="btn btn-outline-warning btn-sm"
                      onClick={() => handleEditGarage(garage._id)}
                      title="Edit Garage"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDeleteGarage(garage._id)}
                      disabled={deletingId === garage._id}
                      title="Delete Garage"
                    >
                      {deletingId === garage._id ? (
                        <FaSpinner className="spinner-border spinner-border-sm" />
                      ) : (
                        <FaTrash />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Stats */}
      {garages.length > 0 && (
        <div className="row mt-5">
          <div className="col-12">
            <div className="card bg-light">
              <div className="card-body">
                <h5 className="card-title">Garage Statistics</h5>
                <div className="row text-center">
                  <div className="col-md-3 mb-3">
                    <div className="display-6 fw-bold text-primary">{garages.length}</div>
                    <div className="text-muted">Total Garages</div>
                  </div>
                  <div className="col-md-3 mb-3">
                    <div className="display-6 fw-bold text-success">
                      {garages.filter(g => g.isVerified).length}
                    </div>
                    <div className="text-muted">Verified</div>
                  </div>
                  <div className="col-md-3 mb-3">
                    <div className="display-6 fw-bold text-warning">
                      {garages.filter(g => !g.isVerified).length}
                    </div>
                    <div className="text-muted">Pending</div>
                  </div>
                  <div className="col-md-3 mb-3">
                    <div className="display-6 fw-bold text-info">
                      {garages.reduce((total, garage) => total + garage.services.length, 0)}
                    </div>
                    <div className="text-muted">Total Services</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyGarages;