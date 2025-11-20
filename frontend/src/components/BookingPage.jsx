// components/BookingPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaDollarSign, 
  FaCheckCircle,
  FaArrowLeft,
  FaMapMarkerAlt,
  FaStar,
  FaWrench,
  FaSpinner,
  FaPlus,
  FaTimes,
  FaExclamationTriangle,
  FaCar
} from 'react-icons/fa';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

const BookingPage = () => {
  const { garageId } = useParams();
  const navigate = useNavigate();
  const [garage, setGarage] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [userVehicle, setUserVehicle] = useState({
    make: '',
    model: '',
    year: '',
    licensePlate: ''
  });
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [customService, setCustomService] = useState('');
  const [showCustomService, setShowCustomService] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
    '06:00 PM'
  ];

  // Default prices for common services
  const defaultServicePrices = {
    'General Maintenance': 500,
    'Oil Change': 300,
    'Battery Replacement': 800,
    'Engine Diagnostics': 600,
    'Brake Service': 1200,
    'AC Service': 900,
    'Tire Service': 400,
    'Transmission Repair': 1500,
    'Electrical Repair': 700,
    'Body Repair': 2000,
    'Car Wash': 200,
    'Wheel Alignment': 600
  };

  // Fetch garage details and services
  useEffect(() => {
    const fetchGarageData = async () => {
      try {
        setLoading(true);
        setError('');
        
        console.log('🔍 Fetching garage data for ID:', garageId);
        
        // Fetch garage details
        const garageResponse = await fetch(`${API_BASE}/api/garages/${garageId}`);
        
        if (!garageResponse.ok) {
          throw new Error(`Failed to fetch garage: ${garageResponse.status}`);
        }
        
        const garageData = await garageResponse.json();
        console.log('✅ Garage data loaded:', garageData);
        
        if (garageData) {
          setGarage(garageData);
        } else {
          throw new Error('Garage data is empty');
        }

        // Fetch garage services
        console.log('🔍 Fetching services for garage:', garageId);
        const servicesResponse = await fetch(`${API_BASE}/api/garages/${garageId}/services`);
        
        if (servicesResponse.ok) {
          const servicesData = await servicesResponse.json();
          console.log('✅ Services data loaded:', servicesData);
          
          if (servicesData && servicesData.length > 0) {
            // Ensure all services have prices
            const servicesWithPrices = servicesData.map(service => ({
              ...service,
              price: service.price || defaultServicePrices[service.name] || 0
            }));
            setServices(servicesWithPrices);
          } else {
            // If no services found in Service collection, check garage's serviceDetails
            console.log('⚠️ No services in Service collection, checking garage serviceDetails');
            if (garageData.serviceDetails && garageData.serviceDetails.length > 0) {
              const serviceDetails = garageData.serviceDetails.map((service, index) => ({
                _id: `garage-service-${index}`,
                name: service.name,
                description: service.description,
                price: service.price || defaultServicePrices[service.name] || 0,
                duration: service.duration || '1-2 hours',
                category: 'General',
                isFromGarage: true
              }));
              setServices(serviceDetails);
              console.log('✅ Using services from garage serviceDetails:', serviceDetails);
            } else if (garageData.services && garageData.services.length > 0) {
              // Fallback to basic services array with default prices
              const basicServices = garageData.services.map((serviceName, index) => ({
                _id: `basic-service-${index}`,
                name: serviceName,
                description: `${serviceName} service`,
                price: defaultServicePrices[serviceName] || 0,
                duration: '1-2 hours',
                category: 'General',
                isBasic: true
              }));
              setServices(basicServices);
              console.log('✅ Using basic services from garage with default prices:', basicServices);
            } else {
              setServices([]);
              console.log('❌ No services available for this garage');
            }
          }
        } else {
          console.warn('⚠️ Failed to fetch services, using fallback');
          // Use garage's serviceDetails as fallback with prices
          if (garageData.serviceDetails && garageData.serviceDetails.length > 0) {
            const fallbackServices = garageData.serviceDetails.map((service, index) => ({
              _id: `fallback-service-${index}`,
              name: service.name,
              description: service.description,
              price: service.price || defaultServicePrices[service.name] || 0,
              duration: service.duration || '1-2 hours',
              category: 'General',
              isFallback: true
            }));
            setServices(fallbackServices);
          } else {
            setServices([]);
          }
        }

      } catch (error) {
        console.error('❌ Error fetching garage data:', error);
        setError(`Error loading garage information: ${error.message}`);
        
        // Set demo data for testing with proper prices
        setGarage({
          _id: garageId,
          name: 'Auto Care Center',
          location: 'City Center',
          city: 'Mumbai',
          address: '123 Main Street',
          rating: 4.5,
          reviews: 100,
          contactNumber: '+91 9876543210',
          openingHours: {
            open: '09:00',
            close: '18:00',
            days: 'Monday - Saturday'
          },
          services: ['General Maintenance', 'Oil Change', 'Battery Replacement']
        });
        
        setServices([
          {
            _id: '1',
            name: 'General Maintenance',
            description: 'Complete car checkup and maintenance',
            price: 500,
            duration: '1-2 hours'
          },
          {
            _id: '2',
            name: 'Oil Change',
            description: 'Engine oil change with filter replacement',
            price: 300,
            duration: '30-45 mins'
          },
          {
            _id: '3',
            name: 'Battery Replacement',
            description: 'Battery testing and replacement service',
            price: 800,
            duration: '1 hour'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchGarageData();
  }, [garageId, navigate]);

  const handleServiceToggle = (service) => {
    setSelectedServices(prev => {
      const isSelected = prev.some(s => s._id === service._id);
      
      if (isSelected) {
        // Remove service
        return prev.filter(s => s._id !== service._id);
      } else {
        // Add service
        return [...prev, {
          ...service,
          bookingId: `booking-${Date.now()}-${service._id}`
        }];
      }
    });
  };

  const handleAddCustomService = () => {
    if (customService.trim() === '') {
      alert('Please enter service description');
      return;
    }

    const customServiceObj = {
      _id: `custom-${Date.now()}`,
      name: 'Custom Service',
      description: customService,
      price: 0,
      duration: 'To be determined',
      isCustom: true,
      bookingId: `custom-${Date.now()}`
    };

    setSelectedServices(prev => [...prev, customServiceObj]);
    setCustomService('');
    setShowCustomService(false);
  };

  const handleRemoveService = (serviceId) => {
    setSelectedServices(prev => prev.filter(s => s._id !== serviceId));
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    
    if (selectedServices.length === 0) {
      alert('Please select at least one service');
      return;
    }

    if (!selectedDate || !selectedTime) {
      alert('Please select date and time');
      return;
    }

    if (!userVehicle.make || !userVehicle.model || !userVehicle.year || !userVehicle.licensePlate) {
      alert('Please fill in all vehicle information');
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('autogarage_token');
      if (!token) {
        alert('Please login to book services');
        navigate('/AutoGarageHomepage');
        return;
      }

      console.log('📦 Preparing booking data...');
      
      // Create a single booking with all selected services
      const bookingData = {
        garageId,
        vehicleInfo: userVehicle,
        date: selectedDate,
        time: selectedTime,
        specialInstructions: specialInstructions,
        totalAmount: calculateTotal(),
        paymentMethod: 'pay_at_garage',
        selectedServices: selectedServices.map(service => ({
          serviceId: service.isCustom ? null : service._id,
          serviceName: service.name,
          servicePrice: service.price,
          serviceDescription: service.description,
          isCustom: service.isCustom || false
        }))
      };

      console.log('📤 Sending booking data:', bookingData);

      const response = await fetch(`${API_BASE}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingData)
      });

      const result = await response.json();

      if (response.ok) {
        alert(`Booking created successfully for ${selectedServices.length} service(s)! The garage will contact you for confirmation.`);
        navigate('/my-bookings');
      } else {
        const errorMessage = result.message || 'Failed to create booking';
        console.error('❌ Booking failed:', errorMessage);
        alert(`Booking failed: ${errorMessage}`);
      }
    } catch (error) {
      console.error('❌ Booking error:', error);
      alert('Error creating booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotal = () => {
    return selectedServices.reduce((total, service) => total + (service.price || 0), 0);
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getNextWeekDate = () => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek.toISOString().split('T')[0];
  };

  // Function to format price display
  const formatPrice = (price) => {
    if (price === 0 || price === undefined) {
      return 'Price on request';
    }
    return `₹${price}`;
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <FaSpinner className="spinner-border text-danger mb-3" size={30} />
        <p>Loading garage information...</p>
        <small className="text-muted">Garage ID: {garageId}</small>
      </div>
    );
  }

  if (error && !garage) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <FaExclamationTriangle className="text-warning mb-3" size={50} />
          <h3 className="text-danger">Error Loading Garage</h3>
          <p className="text-muted">{error}</p>
          <div className="mt-4">
            <button className="btn btn-danger me-3" onClick={() => navigate('/AutoGarageHomepage')}>
              Back to Home
            </button>
            <button className="btn btn-outline-secondary" onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!garage) {
    return (
      <div className="container py-5 text-center">
        <FaExclamationTriangle className="text-warning mb-3" size={50} />
        <h3>Garage Not Found</h3>
        <p className="text-muted">The garage you're looking for doesn't exist or has been removed.</p>
        <button className="btn btn-danger mt-3" onClick={() => navigate('/AutoGarageHomepage')}>
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <button 
        className="btn btn-outline-secondary mb-4"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft className="me-2" />
        Back
      </button>

      {error && (
        <div className="alert alert-warning mb-4">
          <FaExclamationTriangle className="me-2" />
          {error} Showing demo data for testing.
        </div>
      )}

      <div className="row">
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-header bg-danger text-white">
              <h4 className="mb-0">
                <FaWrench className="me-2" />
                Book Services at {garage.name}
              </h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmitBooking}>
                {/* Service Selection */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">
                      <FaWrench className="me-2" />
                      Select Services
                    </h5>
                    <span className="badge bg-primary">
                      {selectedServices.length} service(s) selected
                    </span>
                  </div>
                  
                  {/* Available Services */}
                  <div className="mb-4">
                    <h6 className="text-muted mb-3">Available Services</h6>
                    
                    {services.length > 0 ? (
                      <div className="row">
                        {services.map(service => (
                          <div key={service._id} className="col-md-6 mb-3">
                            <div 
                              className={`card service-option ${selectedServices.some(s => s._id === service._id) ? 'border-danger shadow' : 'border-light'}`}
                              style={{ 
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                minHeight: '140px'
                              }}
                              onClick={() => handleServiceToggle(service)}
                            >
                              <div className="card-body">
                                <div className="form-check mb-2">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={selectedServices.some(s => s._id === service._id)}
                                    onChange={() => handleServiceToggle(service)}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  <label className="form-check-label fw-bold text-dark">
                                    {service.name}
                                  </label>
                                </div>
                                
                                {service.description && (
                                  <p className="card-text text-muted small mb-2">
                                    {service.description}
                                  </p>
                                )}
                                
                                <div className="d-flex justify-content-between align-items-center mt-2">
                                  <span className="badge bg-light text-dark">
                                    <FaClock className="me-1" size={12} />
                                    {service.duration}
                                  </span>
                                  <span className={`fw-bold ${service.price > 0 ? 'text-success' : 'text-warning'}`}>
                                    <FaDollarSign className="me-1" />
                                    {formatPrice(service.price)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <FaWrench className="text-muted mb-3" size={50} />
                        <h6 className="text-muted">No Services Available</h6>
                        <p className="text-muted small">
                          This garage hasn't added any services yet. 
                          You can still book by adding a custom service below.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Custom Service */}
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="text-muted mb-0">Need a different service?</h6>
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => setShowCustomService(true)}
                      >
                        <FaPlus className="me-1" />
                        Add Custom Service
                      </button>
                    </div>

                    {showCustomService && (
                      <div className="card border-primary">
                        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                          <span>Describe Your Service Requirement</span>
                          <button
                            type="button"
                            className="btn btn-sm btn-light"
                            onClick={() => setShowCustomService(false)}
                          >
                            <FaTimes />
                          </button>
                        </div>
                        <div className="card-body">
                          <div className="mb-3">
                            <label className="form-label">Service Description *</label>
                            <textarea
                              className="form-control"
                              rows="3"
                              placeholder="Describe the service you need in detail..."
                              value={customService}
                              onChange={(e) => setCustomService(e.target.value)}
                              required
                            />
                            <small className="text-muted">
                              Examples: "My car is making strange noise from engine", 
                              "AC is not cooling properly", "Need complete car checkup",
                              "Brakes are making squeaking noise"
                            </small>
                          </div>
                          <div className="d-flex gap-2">
                            <button
                              type="button"
                              className="btn btn-success"
                              onClick={handleAddCustomService}
                            >
                              Add Custom Service
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              onClick={() => setShowCustomService(false)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Selected Services */}
                  {selectedServices.length > 0 && (
                    <div className="mb-4">
                      <h6 className="text-success mb-3">
                        <FaCheckCircle className="me-2" />
                        Selected Services ({selectedServices.length})
                      </h6>
                      <div className="row">
                        {selectedServices.map(service => (
                          <div key={service._id} className="col-12 mb-2">
                            <div className="card border-success bg-light">
                              <div className="card-body py-3">
                                <div className="d-flex justify-content-between align-items-center">
                                  <div className="flex-grow-1">
                                    <div className="d-flex align-items-center mb-1">
                                      <strong className="text-dark">{service.name}</strong>
                                      {service.isCustom && (
                                        <span className="badge bg-info ms-2">Custom</span>
                                      )}
                                    </div>
                                    {service.description && (
                                      <p className="text-muted small mb-2">
                                        {service.description}
                                      </p>
                                    )}
                                    <div className="d-flex gap-3">
                                      <span className="badge bg-light text-dark">
                                        <FaClock className="me-1" size={12} />
                                        {service.duration}
                                      </span>
                                      <span className={`badge ${service.price > 0 ? 'bg-success text-white' : 'bg-warning text-dark'}`}>
                                        <FaDollarSign className="me-1" size={12} />
                                        {formatPrice(service.price)}
                                      </span>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger ms-3"
                                    onClick={() => handleRemoveService(service._id)}
                                    title="Remove Service"
                                  >
                                    <FaTimes />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Vehicle Information */}
                <div className="mb-4">
                  <h5 className="mb-3">
                    <FaCar className="me-2" />
                    Vehicle Information
                  </h5>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Make *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={userVehicle.make}
                        onChange={(e) => setUserVehicle({...userVehicle, make: e.target.value})}
                        required
                        placeholder="e.g., Toyota, Honda, Hyundai"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Model *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={userVehicle.model}
                        onChange={(e) => setUserVehicle({...userVehicle, model: e.target.value})}
                        required
                        placeholder="e.g., Camry, Civic, Creta"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Year *</label>
                      <input
                        type="number"
                        className="form-control"
                        value={userVehicle.year}
                        onChange={(e) => setUserVehicle({...userVehicle, year: e.target.value})}
                        min="1990"
                        max={new Date().getFullYear()}
                        required
                        placeholder="e.g., 2020"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">License Plate *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={userVehicle.licensePlate}
                        onChange={(e) => setUserVehicle({...userVehicle, licensePlate: e.target.value.toUpperCase()})}
                        required
                        placeholder="e.g., MH01AB1234"
                      />
                    </div>
                  </div>
                </div>

                {/* Date and Time Selection */}
                <div className="mb-4">
                  <h5 className="mb-3">
                    <FaCalendarAlt className="me-2" />
                    Select Date & Time
                  </h5>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Preferred Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={getTomorrowDate()}
                        max={getNextWeekDate()}
                        required
                      />
                      <small className="text-muted">
                        Select a date between tomorrow and next week
                      </small>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Preferred Time *</label>
                      <select
                        className="form-select"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        required
                      >
                        <option value="">Select Time Slot</option>
                        {timeSlots.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                      <small className="text-muted">
                        Garage hours: {garage.openingHours?.open} - {garage.openingHours?.close}
                      </small>
                    </div>
                  </div>
                </div>

                {/* Special Instructions */}
                <div className="mb-4">
                  <label className="form-label">Additional Instructions</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Any special requirements, notes, or specific issues for the garage..."
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                  />
                  <small className="text-muted">
                    Let the garage know about any specific issues, sounds, or requirements
                  </small>
                </div>

                <button
                  type="submit"
                  className="btn btn-danger btn-lg w-100 py-3"
                  disabled={isLoading || selectedServices.length === 0 || !selectedDate || !selectedTime}
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="spinner-border spinner-border-sm me-2" />
                      Creating Booking...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle className="me-2" />
                      Confirm Booking for {selectedServices.length} Service(s)
                      {calculateTotal() > 0 && ` - ₹${calculateTotal()}`}
                    </>
                  )}
                </button>

                <div className="text-center mt-3">
                  <small className="text-muted">
                    * The garage will contact you to confirm the booking and discuss final pricing
                  </small>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="col-lg-4">
          <div className="card shadow-sm sticky-top" style={{top: '20px'}}>
            <div className="card-header bg-light">
              <h5 className="mb-0">Booking Summary</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">{garage.name}</h6>
                <div className="d-flex align-items-center">
                  <FaStar className="text-warning me-1" />
                  <span>{garage.rating || '4.0'}</span>
                </div>
              </div>
              
              <p className="text-muted mb-3">
                <FaMapMarkerAlt className="me-2" />
                {garage.location}, {garage.city}
              </p>

              <p className="small text-muted mb-3">
                {garage.address}
                {garage.pincode && ` - ${garage.pincode}`}
              </p>

              {garage.contactNumber && (
                <p className="small text-muted mb-3">
                  <strong>Contact:</strong> {garage.contactNumber}
                </p>
              )}

              {selectedServices.length > 0 && (
                <>
                  <hr />
                  <h6>Selected Services ({selectedServices.length})</h6>
                  {selectedServices.map((service, index) => (
                    <div key={service._id} className="mb-2">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <strong className="small">{service.name}</strong>
                          {service.isCustom && (
                            <div className="text-muted very-small">
                              Custom: {service.description}
                            </div>
                          )}
                          <div className="text-muted very-small">
                            {service.duration}
                          </div>
                        </div>
                        <div className="text-end">
                          <div className={`fw-bold ${service.price > 0 ? 'text-success' : 'text-warning'}`}>
                            {formatPrice(service.price)}
                          </div>
                        </div>
                      </div>
                      {index < selectedServices.length - 1 && <hr className="my-2" />}
                    </div>
                  ))}
                  
                  {selectedDate && selectedTime && (
                    <div className="mb-2 mt-3">
                      <div className="d-flex justify-content-between">
                        <span>Preferred Date & Time</span>
                        <span className="text-end">
                          <div>{selectedDate}</div>
                          <div>{selectedTime}</div>
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <hr />
                  <div className="d-flex justify-content-between fw-bold fs-5">
                    <span>Estimated Total</span>
                    <span className="text-danger">₹{calculateTotal()}</span>
                  </div>
                  {calculateTotal() === 0 && (
                    <small className="text-muted">
                      * Custom services require price confirmation from garage
                    </small>
                  )}
                </>
              )}

              {selectedServices.length === 0 && (
                <div className="text-center py-4">
                  <FaWrench size={32} className="text-muted mb-2" />
                  <p className="text-muted small mb-0">No services selected yet</p>
                  <p className="text-muted very-small">
                    Select services from the left to see booking summary
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Garage Information */}
          <div className="card mt-4">
            <div className="card-header bg-light">
              <h6 className="mb-0">Garage Information</h6>
            </div>
            <div className="card-body">
              {garage.openingHours && (
                <div className="mb-3">
                  <strong>Opening Hours:</strong><br />
                  <small className="text-muted">
                    {garage.openingHours.open} - {garage.openingHours.close}<br />
                    {garage.openingHours.days}
                  </small>
                </div>
              )}
              
              {garage.services && garage.services.length > 0 && (
                <div>
                  <strong>Specialties:</strong><br />
                  <div className="d-flex flex-wrap gap-1 mt-1">
                    {garage.services.slice(0, 6).map((service, idx) => (
                      <span key={idx} className="badge bg-light text-dark border small">
                        {service}
                      </span>
                    ))}
                    {garage.services.length > 6 && (
                      <span className="badge bg-light text-dark border small">
                        +{garage.services.length - 6} more
                      </span>
                    )}
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

export default BookingPage;