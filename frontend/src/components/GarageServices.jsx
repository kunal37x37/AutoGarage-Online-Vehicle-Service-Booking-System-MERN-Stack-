// components/GarageServices.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaRupeeSign, 
  FaClock, 
  FaTools,
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

const GarageServices = () => {
  const [services, setServices] = useState([]);
  const [garages, setGarages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [serviceForm, setServiceForm] = useState({
    garageId: '',
    name: '',
    description: '',
    price: '',
    duration: '1-2 hours',
    category: 'Maintenance'
  });

  const categories = [
    'Maintenance',
    'Electrical',
    'Mechanical',
    'Diagnostics',
    'Body Repair',
    'AC Service',
    'Tire Service',
    'General'
  ];

  const durations = [
    '30-45 mins',
    '1 hour',
    '1-2 hours',
    '2-3 hours',
    '3-4 hours',
    'Full Day'
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('autogarage_token');
      
      // Fetch user's garages
      const garagesResponse = await fetch(`${API_BASE}/api/garages/my-garages`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const garagesData = await garagesResponse.json();
      if (garagesResponse.ok) {
        setGarages(garagesData);
        if (garagesData.length > 0) {
          setServiceForm(prev => ({ ...prev, garageId: garagesData[0]._id }));
        }
      }

      // Fetch user's services
      const servicesResponse = await fetch(`${API_BASE}/api/services/my-services`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const servicesData = await servicesResponse.json();
      if (servicesResponse.ok) {
        setServices(servicesData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error loading services');
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    
    if (!serviceForm.garageId || !serviceForm.name || !serviceForm.price) {
      alert('Please fill all required fields');
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('autogarage_token');
      const response = await fetch(`${API_BASE}/api/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          garageId: serviceForm.garageId,
          name: serviceForm.name,
          description: serviceForm.description,
          price: parseInt(serviceForm.price),
          duration: serviceForm.duration,
          category: serviceForm.category
        })
      });

      const data = await response.json();

      if (response.ok) {
        setShowAddModal(false);
        setServiceForm({
          garageId: garages[0]?._id || '',
          name: '',
          description: '',
          price: '',
          duration: '1-2 hours',
          category: 'Maintenance'
        });
        alert('Service added successfully!');
        fetchData();
      } else {
        alert(data.message || 'Failed to add service');
      }
    } catch (error) {
      console.error('Add service error:', error);
      alert('Error adding service');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditService = async (e) => {
    e.preventDefault();
    
    if (!selectedService) return;

    setIsLoading(true);

    try {
      const token = localStorage.getItem('autogarage_token');
      const response = await fetch(`${API_BASE}/api/services/${selectedService._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: serviceForm.name,
          description: serviceForm.description,
          price: parseInt(serviceForm.price),
          duration: serviceForm.duration,
          category: serviceForm.category,
          isActive: true
        })
      });

      const data = await response.json();

      if (response.ok) {
        setShowEditModal(false);
        setSelectedService(null);
        alert('Service updated successfully!');
        fetchData();
      } else {
        alert(data.message || 'Failed to update service');
      }
    } catch (error) {
      console.error('Update service error:', error);
      alert('Error updating service');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm('Are you sure you want to delete this service?')) {
      return;
    }

    try {
      const token = localStorage.getItem('autogarage_token');
      const response = await fetch(`${API_BASE}/api/services/${serviceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        alert('Service deleted successfully!');
        fetchData();
      } else {
        alert(data.message || 'Failed to delete service');
      }
    } catch (error) {
      console.error('Delete service error:', error);
      alert('Error deleting service');
    }
  };

  const openEditModal = (service) => {
    setSelectedService(service);
    setServiceForm({
      garageId: service.garage._id,
      name: service.name,
      description: service.description || '',
      price: service.price.toString(),
      duration: service.duration || '1-2 hours',
      category: service.category || 'Maintenance'
    });
    setShowEditModal(true);
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <FaSpinner className="spinner-border text-danger mb-3" size={30} />
        <p>Loading services...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold">Manage Services</h2>
            <button 
              className="btn btn-danger"
              onClick={() => setShowAddModal(true)}
              disabled={garages.length === 0}
            >
              <FaPlus className="me-2" />
              Add New Service
            </button>
          </div>

          {garages.length === 0 ? (
            <div className="alert alert-warning text-center">
              <h5>No Garages Found</h5>
              <p>You need to add a garage first before you can manage services.</p>
              <a href="/AutoGarageHomepage" className="btn btn-outline-danger">
                Add Garage
              </a>
            </div>
          ) : services.length === 0 ? (
            <div className="alert alert-info text-center">
              <FaTools size={48} className="mb-3 text-muted" />
              <h5>No Services Added Yet</h5>
              <p>Start by adding your first service to your garage.</p>
              <button 
                className="btn btn-danger mt-2"
                onClick={() => setShowAddModal(true)}
              >
                <FaPlus className="me-2" />
                Add Your First Service
              </button>
            </div>
          ) : (
            <div className="row">
              {services.map(service => (
                <div key={service._id} className="col-md-6 col-lg-4 mb-4">
                  <div className="card h-100 shadow-sm">
                    <div className="card-header bg-light d-flex justify-content-between align-items-center">
                      <h6 className="mb-0">{service.garage?.name}</h6>
                      <span className={`badge ${service.isActive ? 'bg-success' : 'bg-secondary'}`}>
                        {service.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="card-body">
                      <h5 className="card-title text-danger">{service.name}</h5>
                      {service.description && (
                        <p className="card-text text-muted small">{service.description}</p>
                      )}
                      
                      <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="text-muted">
                            <FaRupeeSign className="me-1" />
                            Price:
                          </span>
                          <strong className="text-success">₹{service.price}</strong>
                        </div>
                        
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="text-muted">
                            <FaClock className="me-1" />
                            Duration:
                          </span>
                          <span>{service.duration}</span>
                        </div>
                        
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="text-muted">
                            <FaTools className="me-1" />
                            Category:
                          </span>
                          <span className="badge bg-info">{service.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="card-footer bg-white">
                      <div className="d-flex gap-2">
                        <button 
                          className="btn btn-outline-primary btn-sm flex-fill"
                          onClick={() => openEditModal(service)}
                        >
                          <FaEdit className="me-1" />
                          Edit
                        </button>
                        <button 
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDeleteService(service._id)}
                        >
                          <FaTrash className="me-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Service Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{maxWidth: '500px'}}>
            <div className="modal-header">
              <h5 className="modal-title">Add New Service</h5>
              <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAddService}>
                <div className="mb-3">
                  <label className="form-label">Select Garage *</label>
                  <select
                    className="form-select"
                    value={serviceForm.garageId}
                    onChange={(e) => setServiceForm({...serviceForm, garageId: e.target.value})}
                    required
                  >
                    <option value="">Choose Garage</option>
                    {garages.map(garage => (
                      <option key={garage._id} value={garage._id}>
                        {garage.name} - {garage.location}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Service Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={serviceForm.name}
                    onChange={(e) => setServiceForm({...serviceForm, name: e.target.value})}
                    required
                    placeholder="e.g., Oil Change, Brake Service"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={serviceForm.description}
                    onChange={(e) => setServiceForm({...serviceForm, description: e.target.value})}
                    placeholder="Describe the service details..."
                  />
                </div>

                <div className="row">
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

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Duration</label>
                    <select
                      className="form-select"
                      value={serviceForm.duration}
                      onChange={(e) => setServiceForm({...serviceForm, duration: e.target.value})}
                    >
                      {durations.map(duration => (
                        <option key={duration} value={duration}>{duration}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={serviceForm.category}
                    onChange={(e) => setServiceForm({...serviceForm, category: e.target.value})}
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-danger w-100"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="spinner-border spinner-border-sm me-2" />
                      Adding Service...
                    </>
                  ) : (
                    'Add Service'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Service Modal */}
      {showEditModal && selectedService && (
        <div className="modal-overlay">
          <div className="modal-content" style={{maxWidth: '500px'}}>
            <div className="modal-header">
              <h5 className="modal-title">Edit Service</h5>
              <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleEditService}>
                <div className="mb-3">
                  <label className="form-label">Service Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={serviceForm.name}
                    onChange={(e) => setServiceForm({...serviceForm, name: e.target.value})}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={serviceForm.description}
                    onChange={(e) => setServiceForm({...serviceForm, description: e.target.value})}
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Price (₹) *</label>
                    <input
                      type="number"
                      className="form-control"
                      value={serviceForm.price}
                      onChange={(e) => setServiceForm({...serviceForm, price: e.target.value})}
                      required
                      min="0"
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Duration</label>
                    <select
                      className="form-select"
                      value={serviceForm.duration}
                      onChange={(e) => setServiceForm({...serviceForm, duration: e.target.value})}
                    >
                      {durations.map(duration => (
                        <option key={duration} value={duration}>{duration}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={serviceForm.category}
                    onChange={(e) => setServiceForm({...serviceForm, category: e.target.value})}
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-danger w-100"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="spinner-border spinner-border-sm me-2" />
                      Updating Service...
                    </>
                  ) : (
                    'Update Service'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GarageServices;