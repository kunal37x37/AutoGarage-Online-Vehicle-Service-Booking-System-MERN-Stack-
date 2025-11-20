// components/AddGarage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  FaArrowLeft, FaPlus, FaWrench, FaSave, FaClock, 
  FaDollarSign, FaTrash, FaEdit, FaTimes, FaSpinner
} from 'react-icons/fa';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

const AddGarage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingGarageId, setEditingGarageId] = useState(null);
  const [garageData, setGarageData] = useState(null);
  
  const [garageForm, setGarageForm] = useState({
    name: '',
    description: '',
    location: '',
    city: '',
    pincode: '',
    address: '',
    services: [],
    customServices: [],
    openingHours: {
      open: '09:00',
      close: '18:00',
      days: 'Monday - Saturday'
    },
    contactNumber: '',
    email: ''
  });

  const [newCustomService, setNewCustomService] = useState({
    name: '',
    price: '',
    duration: '',
    description: ''
  });

  const [showCustomServiceForm, setShowCustomServiceForm] = useState(false);

  const availableServices = [
    { name: 'General Maintenance', defaultPrice: 500, defaultDuration: '1-2 hours' },
    { name: 'Oil Change', defaultPrice: 300, defaultDuration: '30-45 mins' },
    { name: 'Battery Replacement', defaultPrice: 800, defaultDuration: '1 hour' },
    { name: 'Engine Diagnostics', defaultPrice: 600, defaultDuration: '1-2 hours' },
    { name: 'Brake Service', defaultPrice: 1200, defaultDuration: '2-3 hours' },
    { name: 'AC Service', defaultPrice: 900, defaultDuration: '1-2 hours' },
    { name: 'Tire Service', defaultPrice: 400, defaultDuration: '1 hour' },
    { name: 'Transmission Repair', defaultPrice: 1500, defaultDuration: '3-4 hours' },
    { name: 'Electrical Repair', defaultPrice: 700, defaultDuration: '1-2 hours' },
    { name: 'Body Repair', defaultPrice: 2000, defaultDuration: '1-3 days' },
    { name: 'Car Wash', defaultPrice: 200, defaultDuration: '30-45 mins' },
    { name: 'Wheel Alignment', defaultPrice: 600, defaultDuration: '1 hour' }
  ];

  const timeSlots = [
    '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00',
    '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00',
    '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'
  ];

  const daysOptions = [
    'Monday - Friday',
    'Monday - Saturday',
    'Monday - Sunday',
    'Tuesday - Sunday',
    'Wednesday - Sunday',
    'All Days',
    '24/7'
  ];

  useEffect(() => {
    checkAuth();
    const editId = searchParams.get('edit');
    if (editId) {
      setIsEditing(true);
      setEditingGarageId(editId);
      fetchGarageDetails(editId);
    }
  }, [searchParams]);

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
        
        if (data.user.userType !== 'garage_owner') {
          alert('Only garage owners can add garages');
          navigate('/AutoGarageHomepage');
        }
      } else {
        navigate('/AutoGarageHomepage');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      navigate('/AutoGarageHomepage');
    }
  };

  const fetchGarageDetails = async (garageId) => {
    try {
      const token = localStorage.getItem('autogarage_token');
      const response = await fetch(`${API_BASE}/api/garages/${garageId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const garage = await response.json();
        setGarageData(garage); // Store the full garage data
        
        // Safely set the form data with null checks
        setGarageForm({
          name: garage?.name || '',
          description: garage?.description || '',
          location: garage?.location || '',
          city: garage?.city || '',
          pincode: garage?.pincode || '',
          address: garage?.address || '',
          services: garage?.services?.map(service => ({
            name: service,
            price: 0, // Default price, you might want to fetch actual prices
            duration: '1-2 hours' // Default duration
          })) || [],
          customServices: garage?.customServices || [],
          openingHours: garage?.openingHours || {
            open: '09:00',
            close: '18:00',
            days: 'Monday - Saturday'
          },
          contactNumber: garage?.contactNumber || '',
          email: garage?.email || ''
        });
      } else {
        alert('Failed to load garage details');
        navigate('/my-garages');
      }
    } catch (error) {
      console.error('Error fetching garage details:', error);
      alert('Error loading garage details');
    }
  };

  const handleServiceToggle = (service) => {
    setGarageForm(prev => {
      const isServiceSelected = prev.services.some(s => s.name === service.name);
      
      if (isServiceSelected) {
        // Remove service
        return {
          ...prev,
          services: prev.services.filter(s => s.name !== service.name)
        };
      } else {
        // Add service with default price and duration
        return {
          ...prev,
          services: [...prev.services, {
            name: service.name,
            price: service.defaultPrice,
            duration: service.defaultDuration,
            description: service.description || ''
          }]
        };
      }
    });
  };

  const handleServicePriceChange = (serviceName, newPrice) => {
    setGarageForm(prev => ({
      ...prev,
      services: prev.services.map(service =>
        service.name === serviceName 
          ? { ...service, price: parseInt(newPrice) || 0 }
          : service
      )
    }));
  };

  const handleServiceDurationChange = (serviceName, newDuration) => {
    setGarageForm(prev => ({
      ...prev,
      services: prev.services.map(service =>
        service.name === serviceName 
          ? { ...service, duration: newDuration }
          : service
      )
    }));
  };

  const handleAddCustomService = () => {
    if (!newCustomService.name || !newCustomService.price) {
      alert('Please enter service name and price');
      return;
    }

    const customService = {
      name: newCustomService.name,
      price: parseInt(newCustomService.price) || 0,
      duration: newCustomService.duration || '1-2 hours',
      description: newCustomService.description || '',
      isCustom: true
    };

    setGarageForm(prev => ({
      ...prev,
      customServices: [...prev.customServices, customService],
      services: [...prev.services, customService]
    }));

    setNewCustomService({
      name: '',
      price: '',
      duration: '',
      description: ''
    });
    setShowCustomServiceForm(false);
  };

  const handleRemoveCustomService = (serviceName) => {
    setGarageForm(prev => ({
      ...prev,
      customServices: prev.customServices.filter(s => s.name !== serviceName),
      services: prev.services.filter(s => s.name !== serviceName)
    }));
  };

  const handleOpeningHoursChange = (field, value) => {
    setGarageForm(prev => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (garageForm.services.length === 0) {
      alert('Please select at least one service');
      return;
    }

    if (!garageForm.pincode || garageForm.pincode.length !== 6) {
      alert('Please enter a valid 6-digit pincode');
      return;
    }

    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('autogarage_token');
      const url = isEditing 
        ? `${API_BASE}/api/garages/${editingGarageId}`
        : `${API_BASE}/api/garages`;
      
      const method = isEditing ? 'PUT' : 'POST';

      // Prepare services data for backend - extract just the service names
      const servicesData = garageForm.services.map(service => service.name);

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...garageForm,
          services: servicesData
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Create services in the database
        if (data.garage && data.garage._id) {
          await createServicesInDatabase(garageForm.services, data.garage._id);
        } else if (isEditing && editingGarageId) {
          await createServicesInDatabase(garageForm.services, editingGarageId);
        }
        
        alert(isEditing ? 'Garage updated successfully!' : 'Garage added successfully!');
        navigate('/my-garages');
      } else {
        alert(data.message || `Failed to ${isEditing ? 'update' : 'add'} garage`);
      }
    } catch (error) {
      console.error('Garage operation error:', error);
      alert(`Error ${isEditing ? 'updating' : 'adding'} garage`);
    } finally {
      setIsLoading(false);
    }
  };

  const createServicesInDatabase = async (services, garageId) => {
    try {
      const token = localStorage.getItem('autogarage_token');
      
      // First, delete existing services for this garage
      try {
        await fetch(`${API_BASE}/api/services/garage/${garageId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (error) {
        console.log('No existing services to delete or endpoint not available');
      }

      // Then create new services
      for (const service of services) {
        try {
          const response = await fetch(`${API_BASE}/api/services`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              garageId: garageId,
              name: service.name,
              price: service.price,
              duration: service.duration,
              description: service.description || '',
              category: 'General'
            })
          });

          if (!response.ok) {
            console.error('Failed to create service:', service.name);
          }
        } catch (error) {
          console.error('Error creating service:', service.name, error);
        }
      }
    } catch (error) {
      console.error('Error in createServicesInDatabase:', error);
    }
  };

  const totalServices = garageForm.services.length;

  if (!user) {
    return (
      <div className="container py-5 text-center">
        <FaSpinner className="spinner-border text-danger" />
        <p className="mt-2">Loading...</p>
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
              <h2 className="mb-1">
                {isEditing ? 'Edit Garage' : 'Add New Garage'}
              </h2>
              <p className="text-muted mb-0">
                {isEditing ? 'Update your garage information' : 'Register your garage to start receiving bookings'}
              </p>
            </div>
          </div>

          {/* Garage Form */}
          <div className="card shadow-sm">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {/* Basic Information */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Garage Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={garageForm.name}
                      onChange={(e) => setGarageForm({...garageForm, name: e.target.value})}
                      required
                      placeholder="Enter garage name"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Location (Area) *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={garageForm.location}
                      onChange={(e) => setGarageForm({...garageForm, location: e.target.value})}
                      required
                      placeholder="e.g., Andheri East, Connaught Place"
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">City *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={garageForm.city}
                      onChange={(e) => setGarageForm({...garageForm, city: e.target.value})}
                      required
                      placeholder="Enter city name"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Pincode *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={garageForm.pincode}
                      onChange={(e) => setGarageForm({...garageForm, pincode: e.target.value.replace(/\D/g, '')})}
                      required
                      maxLength="6"
                      placeholder="6-digit pincode"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Full Address *</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={garageForm.address}
                    onChange={(e) => setGarageForm({...garageForm, address: e.target.value})}
                    required
                    placeholder="Enter complete address with landmark"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Describe your garage services, expertise, and facilities..."
                    value={garageForm.description}
                    onChange={(e) => setGarageForm({...garageForm, description: e.target.value})}
                  />
                </div>

                {/* Services Section */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <label className="form-label mb-0">Services Offered *</label>
                    <span className="badge bg-primary">{totalServices} services selected</span>
                  </div>
                  
                  {/* Standard Services */}
                  <div className="mb-4">
                    <h6 className="text-muted mb-3">Standard Services</h6>
                    <div className="row">
                      {availableServices.map((service, index) => {
                        const isSelected = garageForm.services.some(s => s?.name === service.name);
                        const selectedService = garageForm.services.find(s => s?.name === service.name);
                        
                        return (
                          <div key={index} className="col-md-6 mb-3">
                            <div className={`card ${isSelected ? 'border-primary' : ''}`}>
                              <div className="card-body p-3">
                                <div className="form-check mb-2">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => handleServiceToggle(service)}
                                  />
                                  <label className="form-check-label fw-bold">
                                    <FaWrench className="me-2 text-muted" size={12} />
                                    {service.name}
                                  </label>
                                </div>
                                
                                {isSelected && (
                                  <div className="row g-2">
                                    <div className="col-6">
                                      <label className="form-label small">Price (₹)</label>
                                      <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        value={selectedService?.price || service.defaultPrice}
                                        onChange={(e) => handleServicePriceChange(service.name, e.target.value)}
                                        min="0"
                                      />
                                    </div>
                                    <div className="col-6">
                                      <label className="form-label small">Duration</label>
                                      <select
                                        className="form-select form-select-sm"
                                        value={selectedService?.duration || service.defaultDuration}
                                        onChange={(e) => handleServiceDurationChange(service.name, e.target.value)}
                                      >
                                        <option value="30-45 mins">30-45 mins</option>
                                        <option value="1 hour">1 hour</option>
                                        <option value="1-2 hours">1-2 hours</option>
                                        <option value="2-3 hours">2-3 hours</option>
                                        <option value="3-4 hours">3-4 hours</option>
                                        <option value="1-3 days">1-3 days</option>
                                      </select>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom Services */}
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="text-muted mb-0">Custom Services</h6>
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => setShowCustomServiceForm(true)}
                      >
                        <FaPlus className="me-1" />
                        Add Custom Service
                      </button>
                    </div>

                    {/* Custom Service Form */}
                    {showCustomServiceForm && (
                      <div className="card border-primary mb-3">
                        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                          <span>Add Custom Service</span>
                          <button
                            type="button"
                            className="btn btn-sm btn-light"
                            onClick={() => setShowCustomServiceForm(false)}
                          >
                            <FaTimes />
                          </button>
                        </div>
                        <div className="card-body">
                          <div className="row g-3">
                            <div className="col-md-4">
                              <label className="form-label">Service Name *</label>
                              <input
                                type="text"
                                className="form-control"
                                value={newCustomService.name}
                                onChange={(e) => setNewCustomService({...newCustomService, name: e.target.value})}
                                placeholder="e.g., Turbo Charging"
                              />
                            </div>
                            <div className="col-md-3">
                              <label className="form-label">Price (₹) *</label>
                              <input
                                type="number"
                                className="form-control"
                                value={newCustomService.price}
                                onChange={(e) => setNewCustomService({...newCustomService, price: e.target.value})}
                                min="0"
                                placeholder="500"
                              />
                            </div>
                            <div className="col-md-3">
                              <label className="form-label">Duration</label>
                              <select
                                className="form-select"
                                value={newCustomService.duration}
                                onChange={(e) => setNewCustomService({...newCustomService, duration: e.target.value})}
                              >
                                <option value="30-45 mins">30-45 mins</option>
                                <option value="1 hour">1 hour</option>
                                <option value="1-2 hours">1-2 hours</option>
                                <option value="2-3 hours">2-3 hours</option>
                                <option value="3-4 hours">3-4 hours</option>
                                <option value="1-3 days">1-3 days</option>
                              </select>
                            </div>
                            <div className="col-md-2">
                              <label className="form-label">&nbsp;</label>
                              <button
                                type="button"
                                className="btn btn-success w-100"
                                onClick={handleAddCustomService}
                              >
                                <FaPlus />
                              </button>
                            </div>
                            <div className="col-12">
                              <label className="form-label">Description</label>
                              <textarea
                                className="form-control"
                                rows="2"
                                value={newCustomService.description}
                                onChange={(e) => setNewCustomService({...newCustomService, description: e.target.value})}
                                placeholder="Service description..."
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Display Custom Services */}
                    {garageForm.customServices.length > 0 && (
                      <div className="row">
                        {garageForm.customServices.map((service, index) => (
                          <div key={index} className="col-md-6 mb-2">
                            <div className="card border-success">
                              <div className="card-body p-2">
                                <div className="d-flex justify-content-between align-items-center">
                                  <div>
                                    <strong>{service.name}</strong>
                                    <div className="small text-muted">
                                      ₹{service.price} • {service.duration}
                                    </div>
                                    {service.description && (
                                      <div className="small">{service.description}</div>
                                    )}
                                  </div>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => handleRemoveCustomService(service.name)}
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {garageForm.services.length === 0 && (
                    <div className="alert alert-warning">
                      Please select at least one service
                    </div>
                  )}
                </div>

                {/* Opening Hours Section */}
                <div className="mb-4">
                  <label className="form-label">
                    <FaClock className="me-2" />
                    Opening Hours *
                  </label>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label small">Opening Time</label>
                      <select
                        className="form-select"
                        value={garageForm.openingHours.open}
                        onChange={(e) => handleOpeningHoursChange('open', e.target.value)}
                        required
                      >
                        {timeSlots.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small">Closing Time</label>
                      <select
                        className="form-select"
                        value={garageForm.openingHours.close}
                        onChange={(e) => handleOpeningHoursChange('close', e.target.value)}
                        required
                      >
                        {timeSlots.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small">Working Days</label>
                      <select
                        className="form-select"
                        value={garageForm.openingHours.days}
                        onChange={(e) => handleOpeningHoursChange('days', e.target.value)}
                        required
                      >
                        {daysOptions.map(day => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Contact Number *</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={garageForm.contactNumber}
                      onChange={(e) => setGarageForm({...garageForm, contactNumber: e.target.value})}
                      required
                      placeholder="Enter contact number"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={garageForm.email}
                      onChange={(e) => setGarageForm({...garageForm, email: e.target.value})}
                      placeholder="Enter email address"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="d-grid gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-danger btn-lg"
                    disabled={isLoading || garageForm.services.length === 0 || !garageForm.pincode}
                  >
                    {isLoading ? (
                      <>
                        <FaSpinner className="spinner-border spinner-border-sm me-2" />
                        {isEditing ? 'Updating...' : 'Adding...'}
                      </>
                    ) : (
                      <>
                        {isEditing ? <FaSave className="me-2" /> : <FaPlus className="me-2" />}
                        {isEditing ? 'Update Garage' : 'Add Garage'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddGarage;