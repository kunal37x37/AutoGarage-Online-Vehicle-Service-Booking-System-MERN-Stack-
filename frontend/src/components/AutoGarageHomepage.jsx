import React, { useState, useEffect } from 'react';
import {
  FaCar, FaTools, FaCalendarCheck, FaDollarSign,
  FaHome, FaExternalLinkAlt, FaStar, FaMapMarkerAlt,
  FaShieldAlt, FaHeadset, FaWrench, FaOilCan,
  FaCarBattery, FaTachometerAlt, FaCheckCircle,
  FaClock, FaPhoneAlt, FaEnvelope, FaUser,
  FaArrowRight, FaQuoteLeft, FaCog, FaSearch,
  FaSignInAlt, FaUserPlus, FaComment, FaCreditCard,
  FaBell, FaMap, FaFilter, FaTimes, FaBars,
  FaPlus, FaSpinner
} from 'react-icons/fa';
import { useNavigate, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/AutoGarageHomepage.css';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

const AutoGarageHomepage = () => {
  const [user, setUser] = useState(null);
  const [garages, setGarages] = useState([]);
  const [services] = useState([
    { id: 1, name: 'General Maintenance', icon: <FaWrench />, description: 'Regular checkups to keep your car running smoothly' },
    { id: 2, name: 'Oil Change', icon: <FaOilCan />, description: 'Professional oil change services with quality products' },
    { id: 3, name: 'Battery Replacement', icon: <FaCarBattery />, description: 'Expert battery testing and replacement' },
    { id: 4, name: 'Engine Diagnostics', icon: <FaTachometerAlt />, description: 'Advanced diagnostics for engine issues' },
    { id: 5, name: 'Brake Service', icon: <FaCog />, description: 'Complete brake inspection and repair' },
    { id: 6, name: 'AC Service', icon: <FaCog />, description: 'Cooling system maintenance and repair' }
  ]);

  const [testimonials] = useState([
    { id: 1, name: 'Rajesh Kumar', comment: 'Best service in town! They fixed my car in no time.', rating: 5 },
    { id: 2, name: 'Priya Singh', comment: 'Professional mechanics and fair pricing. Highly recommended!', rating: 5 },
    { id: 3, name: 'Vikram Patel', comment: 'Convenient doorstep service saved me so much time.', rating: 4 },
    { id: 4, name: 'Anjali Sharma', comment: 'Transparent pricing and quality work. Will use again.', rating: 5 }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [garagesLoading, setGaragesLoading] = useState(true);
  
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    name: '', email: '', password: '', confirmPassword: '', userType: 'customer', phone: ''
  });

  const navigate = useNavigate();

  // Fetch garages from backend
  const fetchGarages = async () => {
    try {
      setGaragesLoading(true);
      const params = new URLSearchParams();
      if (selectedLocation) params.append('location', selectedLocation);
      if (selectedService) params.append('service', selectedService);
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(`${API_BASE}/api/garages?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setGarages(data);
      } else {
        console.error('Error fetching garages:', data.message);
        setGarages(getMockGarages());
      }
    } catch (error) {
      console.error('Error fetching garages:', error);
      setGarages(getMockGarages());
    } finally {
      setGaragesLoading(false);
    }
  };

  // Mock garages fallback
  const getMockGarages = () => {
    return [
      { 
        _id: 1, 
        name: 'City Auto Care', 
        rating: 4.8, 
        reviews: 124, 
        location: 'Mumbai',
        city: 'Mumbai',
        pincode: '400001',
        address: '123 MG Road, Mumbai',
        services: ['Oil Change', 'General Maintenance', 'Battery Replacement'], 
        openingHours: {
          open: '09:00',
          close: '18:00',
          days: 'Monday - Saturday'
        },
        image: 'https://images.unsplash.com/photo-1621463223706-5ad2e3e8f7d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
      }
    ];
  };

  // Check user authentication
  const checkAuth = async () => {
    const token = localStorage.getItem('autogarage_token');
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
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
  };

  useEffect(() => {
    checkAuth();
    fetchGarages();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchGarages();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm, selectedLocation, selectedService]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginForm.email,
          password: loginForm.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('autogarage_token', data.token);
        setUser(data.user);
        setShowLoginModal(false);
        setLoginForm({ email: '', password: '' });
        alert('Login successful!');
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (registerForm.password !== registerForm.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    if (registerForm.password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: registerForm.name,
          email: registerForm.email,
          password: registerForm.password,
          userType: registerForm.userType,
          phone: registerForm.phone
        })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('autogarage_token', data.token);
        setUser(data.user);
        setShowRegisterModal(false);
        setRegisterForm({ 
          name: '', email: '', password: '', confirmPassword: '', 
          userType: 'customer', phone: '' 
        });
        alert('Registration successful!');
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('autogarage_token');
    setUser(null);
    navigate('/');
  };

  const handleBookService = (garageId) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    navigate(`/booking/${garageId}`);
  };

 // AutoGarageHomepage.jsx में message button
const handleMessageGarage = (garageId) => {
  if (!user) {
    setShowLoginModal(true);
    return;
  }
  navigate(`/messages/garage/${garageId}`);
};

// Garage card में
<button
  className="btn btn-outline-secondary btn-sm"
  onClick={() => handleMessageGarage(garage.id)}
>
  <FaComment className="me-1" /> Message Garage
</button>

  const handleViewGarageDetails = (garageId) => {
    navigate(`/garage/${garageId}`);
  };

  const filteredGarages = garages.filter(garage => {
    const matchesSearch = garage.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         garage.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         garage.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         garage.services.some(service => 
                           service.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    
    const matchesLocation = selectedLocation ? garage.location === selectedLocation : true;
    const matchesService = selectedService ? garage.services.includes(selectedService) : true;

    return matchesSearch && matchesLocation && matchesService;
  });

  const renderStars = (rating) => {
    const floored = Math.round(rating);
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar key={index} className={index < floored ? 'text-warning' : 'text-muted'} />
    ));
  };

  return (
    <div className="autogarage-homepage">
      {/* Header */}
      <header className="home-header sticky-top py-3 shadow-sm">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              <FaCar className="logo-icon fs-2 text-danger" />
              <span className="logo-text fs-3 fw-bold">AutoGarage</span>
            </div>

            <nav className={`d-none d-md-flex align-items-center gap-4 ${showMobileMenu ? 'mobile-menu-open' : ''}`}>
              <Link className="nav-link" to="/AutoGarageHomepage#services">Services</Link>
              <Link className="nav-link" to="/AutoGarageHomepage#garages">Find Garages</Link>
              <Link className="nav-link" to="/AutoGarageHomepage#booking">How It Works</Link>
              <Link className="nav-link" to="/AutoGarageHomepage#testimonials">Testimonials</Link>

              {user ? (
                <div className="dropdown">
                  <button
                    className="btn btn-outline-danger dropdown-toggle d-flex align-items-center gap-1"
                    type="button"
                    id="userDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <FaUser /> {user.name}
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="userDropdown">
                    <li><Link className="dropdown-item" to="/my-bookings">My Bookings</Link></li>
                    <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                    {user.userType === 'garage_owner' && (
                      <>
                        <li><Link className="dropdown-item" to="/garage-dashboard">Garage Dashboard</Link></li>
                        <li><Link className="dropdown-item" to="/my-garages">My Garages</Link></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li>
                          <Link className="dropdown-item" to="/add-garage">
                            <FaPlus className="me-1" /> Add Garage
                          </Link>
                        </li>
                      </>
                    )}
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                  </ul>
                </div>
              ) : (
                <div className="d-flex gap-2">
                  <button className="btn btn-outline-danger d-flex align-items-center gap-1" onClick={() => setShowLoginModal(true)}>
                    <FaSignInAlt /> Login
                  </button>
                  <button className="btn btn-danger d-flex align-items-center gap-1" onClick={() => setShowRegisterModal(true)}>
                    <FaUserPlus /> Register
                  </button>
                </div>
              )}
            </nav>

            <div className="d-md-none">
              <button className="btn btn-outline-danger" onClick={() => setShowMobileMenu(!showMobileMenu)}>
                <FaBars />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="mobile-menu d-md-none">
          <div className="container py-3">
            <div className="d-flex justify-content-end mb-3">
              <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowMobileMenu(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="d-flex flex-column gap-3">
              <Link className="nav-link" to="/AutoGarageHomepage#services" onClick={() => setShowMobileMenu(false)}>Services</Link>
              <Link className="nav-link" to="/AutoGarageHomepage#garages" onClick={() => setShowMobileMenu(false)}>Find Garages</Link>
              <Link className="nav-link" to="/AutoGarageHomepage#booking" onClick={() => setShowMobileMenu(false)}>How It Works</Link>
              <Link className="nav-link" to="/AutoGarageHomepage#testimonials" onClick={() => setShowMobileMenu(false)}>Testimonials</Link>

              {user ? (
                <>
                  <Link className="nav-link" to="/my-bookings" onClick={() => setShowMobileMenu(false)}>My Bookings</Link>
                  <Link className="nav-link" to="/user-profile" onClick={() => setShowMobileMenu(false)}>Profile</Link>
                  {user.userType === 'garage_owner' && (
                    <>
                      <Link className="nav-link" to="/garage-dashboard" onClick={() => setShowMobileMenu(false)}>Garage Dashboard</Link>
                      <Link className="nav-link" to="/my-garages" onClick={() => setShowMobileMenu(false)}>My Garages</Link>
                      <Link 
                        className="btn btn-outline-danger" 
                        to="/add-garage"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        <FaPlus className="me-1" /> Add Garage
                      </Link>
                    </>
                  )}
                  <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
                </>
              ) : (
                <div className="d-flex flex-column gap-2">
                  <button className="btn btn-outline-danger" onClick={() => { setShowLoginModal(true); setShowMobileMenu(false); }}>
                    Login
                  </button>
                  <button className="btn btn-danger" onClick={() => { setShowRegisterModal(true); setShowMobileMenu(false); }}>
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hero Banner */}
      <section className="home-hero py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h1 className="display-4 fw-bold mb-3">Book Car Services Anytime, Anywhere</h1>
              <p className="lead mb-4">Find the best local garages, choose services that fit your needs, and book appointments with ease.</p>
              <div className="d-flex flex-wrap gap-3">
                <a href="#garages" className="btn btn-danger btn-lg">Find Garages Near You</a>
                <a href="#services" className="btn btn-outline-dark btn-lg">Explore Services</a>
              </div>
            </div>
            <div className="col-lg-6">
              <img
                src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Car Service"
                className="img-fluid rounded shadow"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services-section py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Our Services</h2>
            <p className="text-muted">Comprehensive car services to keep your vehicle in top condition</p>
          </div>
          <div className="row g-4">
            {services.map(service => (
              <div key={service.id} className="col-md-6 col-lg-4">
                <div className="service-card card h-100 shadow-sm border-0">
                  <div className="card-body text-center p-4">
                    <div className="service-icon text-danger mb-3">
                      {service.icon}
                    </div>
                    <h5 className="card-title">{service.name}</h5>
                    <p className="card-text text-muted">{service.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section id="garages" className="search-section py-5 bg-light">
        <div className="container">
          <h2 className="text-center fw-bold mb-4">Find Local Garages</h2>

          <div className="row justify-content-center mb-4">
            <div className="col-md-8">
              <div className="input-group">
                <span className="input-group-text"><FaSearch /></span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search for garages by name, location, or service..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-md-6">
              <label htmlFor="locationFilter" className="form-label">Filter by Location</label>
              <select
                className="form-select"
                id="locationFilter"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="">All Locations</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Chennai">Chennai</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Kolkata">Kolkata</option>
                <option value="Pune">Pune</option>
              </select>
            </div>
            <div className="col-md-6">
              <label htmlFor="serviceFilter" className="form-label">Filter by Service</label>
              <select
                className="form-select"
                id="serviceFilter"
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
              >
                <option value="">All Services</option>
                {services.map(service => (
                  <option key={service.id} value={service.name}>{service.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Garages Grid */}
          {garagesLoading ? (
            <div className="text-center py-5">
              <FaSpinner className="spinner-border text-danger mb-3" size={30} />
              <p>Loading garages...</p>
            </div>
          ) : (
            <div className="row g-4">
              {filteredGarages.length > 0 ? (
                filteredGarages.map(garage => (
                  <div key={garage._id || garage.id} className="col-md-6 col-lg-3">
                    <div className="garage-card card h-100 shadow-sm">
                      <img 
                        src={garage.image || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'} 
                        className="card-img-top" 
                        alt={garage.name} 
                        style={{height: '200px', objectFit: 'cover'}} 
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
                        }}
                      />
                      <div className="card-body">
                        <h5 className="card-title">{garage.name}</h5>
                        <div className="d-flex align-items-center mb-2">
                          <div className="me-2">{renderStars(garage.rating || 4.0)}</div>
                          <span className="text-muted small">({garage.reviews || 0} reviews)</span>
                        </div>
                        <p className="card-text">
                          <FaMapMarkerAlt className="text-danger me-2" />
                          {garage.location}, {garage.city}
                        </p>
                        <p className="card-text small text-muted mb-1">{garage.address}</p>
                        
                        {/* Pincode Display */}
                        {garage.pincode && (
                          <p className="card-text small text-muted">
                            <strong>Pincode:</strong> {garage.pincode}
                          </p>
                        )}
                        
                        {/* Opening Hours Display */}
                        {garage.openingHours && (
                          <p className="card-text small text-muted mb-2">
                            <FaClock className="me-1" size={12} />
                            <strong>Timing:</strong> {garage.openingHours.open} - {garage.openingHours.close} ({garage.openingHours.days})
                          </p>
                        )}
                        
                        <div className="mb-3">
                          <h6 className="mb-2">Services Offered:</h6>
                          <div className="d-flex flex-wrap gap-1">
                            {(garage.services || []).slice(0, 3).map((service, idx) => (
                              <span key={idx} className="badge bg-light text-dark border">{service}</span>
                            ))}
                            {(garage.services || []).length > 3 && (
                              <span className="badge bg-light text-dark border">+{(garage.services || []).length - 3} more</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="card-footer bg-white border-0 pt-0">
                        <div className="d-grid gap-2">
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleBookService(garage._id || garage.id)}
                          >
                            Book Now
                          </button>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-outline-secondary btn-sm flex-fill"
                              onClick={() => handleMessageGarage(garage._id || garage.id)}
                            >
                              <FaComment className="me-1" /> Message
                            </button>
                            <button
                              className="btn btn-outline-info btn-sm"
                              onClick={() => handleViewGarageDetails(garage._id || garage.id)}
                              title="View Details"
                            >
                              <FaExternalLinkAlt />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12 text-center py-5">
                  <h4>No garages found matching your criteria</h4>
                  <p className="text-muted">Try adjusting your search filters</p>
                  {user?.userType === 'garage_owner' && (
                    <Link 
                      to="/add-garage" 
                      className="btn btn-danger mt-2"
                    >
                      <FaPlus className="me-2" />
                      Add Your Garage
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section id="booking" className="how-it-works py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">How It Works</h2>
            <p className="text-muted">Book your car service in just a few simple steps</p>
          </div>

          <div className="row text-center">
            <div className="col-md-4 mb-4">
              <div className="step-card p-4">
                <div className="step-number bg-danger text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3">1</div>
                <h4>Sign Up & Login</h4>
                <p>Create an account or login to get started with booking services</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="step-card p-4">
                <div className="step-number bg-danger text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3">2</div>
                <h4>Find & Choose</h4>
                <p>Search for local garages and choose the services you need</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="step-card p-4">
                <div className="step-number bg-danger text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3">3</div>
                <h4>Book & Pay</h4>
                <p>Select date and time, then complete secure payment</p>
              </div>
            </div>
          </div>

          <div className="row text-center mt-4">
            <div className="col-md-4 mb-4">
              <div className="step-card p-4">
                <div className="step-number bg-danger text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3">4</div>
                <h4>Communicate</h4>
                <p>Message the garage directly for any special requests</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="step-card p-4">
                <div className="step-number bg-danger text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3">5</div>
                <h4>Get Service</h4>
                <p>Your car gets serviced at the chosen time and location</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="step-card p-4">
                <div className="step-number bg-danger text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3">6</div>
                <h4>Rate & Review</h4>
                <p>Share your experience to help others make better choices</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">What Our Customers Say</h2>
            <p className="text-muted">Real experiences from our satisfied customers</p>
          </div>
          <div className="row g-4">
            {testimonials.map(testimonial => (
              <div key={testimonial.id} className="col-md-6 col-lg-3">
                <div className="testimonial-card card h-100 shadow-sm border-0">
                  <div className="card-body">
                    <div className="text-warning mb-3">
                      {renderStars(testimonial.rating)}
                    </div>
                    <p className="card-text">"{testimonial.comment}"</p>
                  </div>
                  <div className="card-footer bg-transparent border-0">
                    <strong>{testimonial.name}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5 bg-danger text-white">
        <div className="container text-center">
          <h2 className="fw-bold mb-3">Ready to Get Your Car Serviced?</h2>
          <p className="mb-4">Join thousands of satisfied customers who trust AutoGarage for their vehicle needs</p>
          {user ? (
            user.userType === 'garage_owner' ? (
              <Link to="/add-garage" className="btn btn-light btn-lg">
                <FaPlus className="me-2" />
                Add Your Garage
              </Link>
            ) : (
              <a href="#garages" className="btn btn-light btn-lg">Book a Service Now</a>
            )
          ) : (
            <button className="btn btn-light btn-lg" onClick={() => setShowRegisterModal(true)}>Get Started - It's Free</button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer py-5 bg-dark text-light">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <FaCar className="fs-3 text-danger" />
                <span className="fs-4 fw-bold">AutoGarage</span>
              </div>
              <p className="text-muted">Book car services anytime, anywhere with India's most trusted auto service platform.</p>
            </div>

            <div className="col-md-2">
              <h5 className="text-danger mb-3">Quick Links</h5>
              <ul className="list-unstyled">
                <li><Link to="/AutoGarageHomepage#services" className="text-light text-decoration-none">Services</Link></li>
                <li><Link to="/AutoGarageHomepage#garages" className="text-light text-decoration-none">Find Garages</Link></li>
                <li><Link to="/AutoGarageHomepage#booking" className="text-light text-decoration-none">How It Works</Link></li>
              </ul>
            </div>

            <div className="col-md-3">
              <h5 className="text-danger mb-3">For Garage Owners</h5>
              <ul className="list-unstyled">
                <li><Link to="/add-garage" className="text-light text-decoration-none">Register Your Garage</Link></li>
                <li><Link to="/garage-dashboard" className="text-light text-decoration-none">Manage Bookings</Link></li>
                <li><Link to="/my-garages" className="text-light text-decoration-none">My Garages</Link></li>
                <li><Link to="/AutoGarageHomepage" className="text-light text-decoration-none">Owner Login</Link></li>
              </ul>
            </div>

            <div className="col-md-3">
              <h5 className="text-danger mb-3">Contact Info</h5>
              <p className="mb-1"><FaPhoneAlt className="me-2" /> +91 0000000000</p>
              <p className="mb-1"><FaEnvelope className="me-2" /> support@autogarage.com</p>
              <p><FaMapMarkerAlt className="me-2" /> Across India</p>
            </div>
          </div>

          <div className="text-center mt-4 pt-3 border-top border-secondary">
            <p className="text-muted mb-0">&copy; 2024 AutoGarage. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Login to Your Account</h5>
              <button type="button" className="btn-close" onClick={() => setShowLoginModal(false)}></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="loginEmail" className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    id="loginEmail"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="loginPassword" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="loginPassword"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn btn-danger w-100"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="spinner-border spinner-border-sm me-2" />
                      Logging in...
                    </>
                  ) : (
                    'Login'
                  )}
                </button>
              </form>
              <div className="text-center mt-3">
                <p>Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); setShowLoginModal(false); setShowRegisterModal(true); }}>Register</a></p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {showRegisterModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Create an Account</h5>
              <button type="button" className="btn-close" onClick={() => setShowRegisterModal(false)}></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <label htmlFor="registerName" className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="registerName"
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="registerEmail" className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    id="registerEmail"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="registerPhone" className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    id="registerPhone"
                    value={registerForm.phone}
                    onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="registerPassword" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="registerPassword"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="registerConfirmPassword" className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="registerConfirmPassword"
                    value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="userType" className="form-label">I am a:</label>
                  <select
                    className="form-select"
                    id="userType"
                    value={registerForm.userType}
                    onChange={(e) => setRegisterForm({ ...registerForm, userType: e.target.value })}
                  >
                    <option value="customer">Customer</option>
                    <option value="garage_owner">Garage Owner</option>
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
                      Registering...
                    </>
                  ) : (
                    'Register'
                  )}
                </button>
              </form>
              <div className="text-center mt-3">
                <p>Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); setShowRegisterModal(false); setShowLoginModal(true); }}>Login</a></p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutoGarageHomepage;