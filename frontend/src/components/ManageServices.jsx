// components/ManageServices.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, FaPlus, FaEdit, FaTrash, FaSave, 
  FaTimes, FaWrench, FaDollarSign, FaClock 
} from 'react-icons/fa';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

const ManageServices = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [garages, setGarages] = useState([]);
  const [selectedGarage, setSelectedGarage] = useState('');
  const [services, setServices] = useState([]);
  const [showAddService, setShowAddService] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [serviceForm, setServiceForm] = useState({
    name: '',
    description: '',
    price: '',
    duration: '1-2 hours',
    category: 'General'
  });

  const durationOptions = [
    '30-45 mins',
    '1 hour',
    '1-2 hours',
    '2-3 hours',
    '3-4 hours',
    '1-3 days'
  ];

  const categoryOptions = [
    'General',
    'Maintenance',
    'Electrical',
    'Mechanical',
    'Body Work',
    'AC Service',
    'Tire Service',
    'Other'
  ];

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('autogarage_token');
    if (!token) {
      navigate('/AutoGarageHomepage');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        fetchMyGarages();
      } else {
        navigate('/AutoGarageHomepage');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      navigate('/AutoGarageHomepage');
    }
  };

  const fetchMyGarages = async () => {
    try {
      const token = localStorage.getItem('autogarage_token');
      const response = await fetch(`${API_BASE}/api/garages/my-garages`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setGarages(data);
        if (data.length > 0) {
          setSelectedGarage(data[0]._id);
        }
      }
    } catch (error) {
      console.error('Error fetching garages:', error);
    }
  };

  const fetchServices = async (garageId) => {
    try {
      const response = await fetch(`${API_BASE}/api/garages/${garageId}/services`);
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  useEffect(() => {
    if (selectedGarage) {
      fetchServices(selectedGarage);
    }
  }, [selectedGarage]);

  const handleSubmitService = async (e) => {
    e.preventDefault();
    
    if (!serviceForm.name || !serviceForm.price) {
      alert('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('autogarage_token');
      const url = editingService 
        ? `${API_BASE}/api/services/${editingService._id}`
        : `${API_BASE}/api/services`;
      
      const method = editingService ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          garageId: selectedGarage,
          name: serviceForm.name,
          description: serviceForm.description,
          price: parseInt(serviceForm.price),
          duration: serviceForm.duration,
          category: serviceForm.category
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert(editingService ? 'Service updated successfully!' : 'Service added successfully!');
        setShowAddService(false);
        setEditingService(null);
        setServiceForm({
          name: '',
          description: '',
          price: '',
          duration: '1-2 hours',
          category: 'General'
        });
        fetchServices(selectedGarage);
      } else {
        alert(data.message || `Failed to ${editingService ? 'update' : 'add'} service`);
      }
    } catch (error) {
      console.error('Service operation error:', error);
      alert(`Error ${editingService ? 'updating' : 'adding'} service`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setServiceForm({
      name: service.name,
      description: service.description || '',
      price: service.price.toString(),
      duration: service.duration || '1-2 hours',
      category: service.category || 'General'
    });
    setShowAddService(true);
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm('Are you sure you want to delete this service?')) {
      return;
    }

    try {
      const token = localStorage.getItem('autogarage_token');
      const response = await fetch(`${API_BASE}/api/services/${serviceId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('Service deleted successfully!');
        fetchServices(selectedGarage);
      } else {
        alert('Failed to delete service');
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Error deleting service');
    }
  };

  const cancelEdit = () => {
    setShowAddService(false);
    setEditingService(null);
    setServiceForm({
      name: '',
      description: '',
      price: '',
      duration: '1-2 hours',
      category: 'General'
    });
  };

  if (!user) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          {/* Header */}
          <div className="d-flex align-items-center mb-4">
            <button 
              className="btn btn-outline-secondary me-3"
              onClick={() => navigate(-1)}
            >
              <FaArrowLeft />
            </button>
            <div>
              <h2 className="mb-1">Manage Services</h2>
              <p className="text-muted mb-0">Add, edit, or remove services for your garages</p>
            </div>
          </div>

          {/* Garage Selection */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <label className="form-label">Select Garage</label>
              <select
                className="form-select"
                value={selectedGarage}
                onChange={(e) => setSelectedGarage(e.target.value)}
              >
                <option value="">Select a garage</option>
                {garages.map(garage => (
                  <option key={garage._id} value={garage._id}>
                    {garage.name} - {garage.location}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedGarage ? (
            <>
              {/* Add Service Button */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4>Services</h4>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowAddService(true)}
                >
                  <FaPlus className="me-2" />
                  Add New Service
                </button>
              </div>

              {/* Add/Edit Service Form */}
              {showAddService && (
                <div className="card shadow-sm mb-4">
                  <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                    <span>{editingService ? 'Edit Service' : 'Add New Service'}</span>
                    <button
                      type="button"
                      className="btn btn-sm btn-light"
                      onClick={cancelEdit}
                    >
                      <FaTimes />
                    </button>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleSubmitService}>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Service Name *</label>
                          <input
                            type="text"
                            className="form-control"
                            value={serviceForm.name}
                            onChange={(e) => setServiceForm({...serviceForm, name: e.target.value})}
                            required
                            placeholder="e.g., Oil Change"
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Price (₹) *</label>
                          <input
                            type="number"
                            className="form-control"
                            value={serviceForm.price}
                            onChange={(e) => setServiceForm({...serviceForm, price: e.target.value})}
                            required
                            min="0"
                            placeholder="500"
                          />
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Duration</label>
                          <select
                            className="form-select"
                            value={serviceForm.duration}
                            onChange={(e) => setServiceForm({...serviceForm, duration: e.target.value})}
                          >
                            {durationOptions.map(duration => (
                              <option key={duration} value={duration}>{duration}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Category</label>
                          <select
                            className="form-select"
                            value={serviceForm.category}
                            onChange={(e) => setServiceForm({...serviceForm, category: e.target.value})}
                          >
                            {categoryOptions.map(category => (
                              <option key={category} value={category}>{category}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          value={serviceForm.description}
                          onChange={(e) => setServiceForm({...serviceForm, description: e.target.value})}
                          placeholder="Describe the service in detail..."
                        />
                      </div>

                      <div className="d-flex gap-2">
                        <button
                          type="submit"
                          className="btn btn-success"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" />
                              {editingService ? 'Updating...' : 'Adding...'}
                            </>
                          ) : (
                            <>
                              <FaSave className="me-2" />
                              {editingService ? 'Update Service' : 'Add Service'}
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={cancelEdit}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Services List */}
              <div className="row">
                {services.length > 0 ? (
                  services.map(service => (
                    <div key={service._id} className="col-md-6 col-lg-4 mb-3">
                      <div className="card h-100">
                        <div className="card-body">
                          <h6 className="card-title">{service.name}</h6>
                          <div className="mb-2">
                            <small className="text-muted">
                              <FaDollarSign className="me-1" />
                              ₹{service.price}
                            </small>
                          </div>
                          <div className="mb-2">
                            <small className="text-muted">
                              <FaClock className="me-1" />
                              {service.duration}
                            </small>
                          </div>
                          {service.description && (
                            <p className="card-text small">{service.description}</p>
                          )}
                          {service.category && (
                            <span className="badge bg-light text-dark">{service.category}</span>
                          )}
                        </div>
                        <div className="card-footer">
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleEditService(service)}
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteService(service._id)}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-12 text-center py-5">
                    <FaWrench size={48} className="text-muted mb-3" />
                    <h5 className="text-muted">No services found</h5>
                    <p className="text-muted">Add your first service to get started</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-5">
              <FaWrench size={48} className="text-muted mb-3" />
              <h5 className="text-muted">No garage selected</h5>
              <p className="text-muted">Please select a garage to manage services</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageServices;