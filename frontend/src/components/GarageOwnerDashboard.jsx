// components/GarageOwnerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaChartBar,
  FaCalendarAlt,
  FaUsers,
  FaDollarSign,
  FaTools,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaCar,
  FaPlus
} from 'react-icons/fa';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

const GarageOwnerDashboard = () => {
  const [stats, setStats] = useState({});
  const [recentBookings, setRecentBookings] = useState([]);
  const [garages, setGarages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('autogarage_token');
      
      // Fetch stats
      const statsResponse = await fetch(`${API_BASE}/api/dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const statsData = await statsResponse.json();
      if (statsResponse.ok) {
        setStats(statsData);
      }

      // Fetch recent bookings
      const bookingsResponse = await fetch(`${API_BASE}/api/bookings/garage-bookings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const bookingsData = await bookingsResponse.json();
      if (bookingsResponse.ok) {
        setRecentBookings(bookingsData.slice(0, 5)); // Show only 5 recent bookings
      }

      // Fetch user's garages
      const garagesResponse = await fetch(`${API_BASE}/api/garages/my-garages`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const garagesData = await garagesResponse.json();
      if (garagesResponse.ok) {
        setGarages(garagesData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: { class: 'bg-success', icon: <FaCheckCircle /> },
      pending: { class: 'bg-warning', icon: <FaClock /> },
      completed: { class: 'bg-primary', icon: <FaCheckCircle /> },
      cancelled: { class: 'bg-danger', icon: <FaTimesCircle /> },
      in_progress: { class: 'bg-info', icon: <FaClock /> }
    };

    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`badge ${config.class} d-flex align-items-center gap-1`}>
        {config.icon} {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <h2 className="fw-bold mb-4">Garage Owner Dashboard</h2>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="mb-0">{stats.totalBookings || 0}</h4>
                  <p className="mb-0">Total Bookings</p>
                </div>
                <div className="align-self-center">
                  <FaCalendarAlt size={30} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card bg-warning text-dark">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="mb-0">{stats.pendingBookings || 0}</h4>
                  <p className="mb-0">Pending</p>
                </div>
                <div className="align-self-center">
                  <FaClock size={30} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="mb-0">{stats.completedBookings || 0}</h4>
                  <p className="mb-0">Completed</p>
                </div>
                <div className="align-self-center">
                  <FaCheckCircle size={30} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="mb-0">stats.totalRevenue-cooming soon</h4>
                  <p className="mb-0">Revenue</p>
                </div>
                <div className="align-self-center">
                  <FaDollarSign size={30} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card bg-secondary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="mb-0">{stats.totalGarages || 0}</h4>
                  <p className="mb-0">My Garages</p>
                </div>
                <div className="align-self-center">
                  <FaCar size={30} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card bg-dark text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="mb-0">{stats.totalServices || 0}</h4>
                  <p className="mb-0">Services</p>
                </div>
                <div className="align-self-center">
                  <FaTools size={30} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      // In the Quick Actions section, update the buttons:

{/* Quick Actions */}
<div className="row mb-4">
  <div className="col-12">
    <div className="card shadow-sm">
      <div className="card-header bg-light">
        <h5 className="mb-0">Quick Actions</h5>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-3 mb-3">
            <Link to="/manage-services" className="btn btn-outline-primary w-100">
              <FaTools className="me-2" />
              Manage Services
            </Link>
          </div>
          <div className="col-md-3 mb-3">
            <Link to="/my-garages" className="btn btn-outline-success w-100">
              <FaCar className="me-2" />
              My Garages
            </Link>
          </div>
          <div className="col-md-3 mb-3">
            <Link to="/my-bookings" className="btn btn-outline-info w-100">
              <FaCalendarAlt className="me-2" />
              View Bookings
            </Link>
          </div>
          <div className="col-md-3 mb-3">
            <Link to="/add-garage" className="btn btn-outline-warning w-100">
              <FaPlus className="me-2" />
              Add Garage
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

      {/* Recent Bookings & Garages */}
      <div className="row">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <h5 className="mb-0 d-flex align-items-center">
                <FaCalendarAlt className="me-2" />
                Recent Bookings
              </h5>
            </div>
            <div className="card-body">
              {recentBookings.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Customer</th>
                        <th>Service</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.map(booking => (
                        <tr key={booking._id}>
                          <td>{booking.customer?.name}</td>
                          <td>{booking.serviceName}</td>
                          <td>{formatDate(booking.date)}</td>
                          <td>₹{booking.totalAmount}</td>
                          <td>{getStatusBadge(booking.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <FaCalendarAlt size={48} className="text-muted mb-3" />
                  <p className="text-muted">No recent bookings</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <h5 className="mb-0 d-flex align-items-center">
                <FaCar className="me-2" />
                My Garages
              </h5>
            </div>
            <div className="card-body">
              {garages.length > 0 ? (
                <div className="list-group">
                  {garages.map(garage => (
                    <div key={garage._id} className="list-group-item">
                      <h6 className="mb-1">{garage.name}</h6>
                      <p className="mb-1 text-muted small">{garage.location}, {garage.city}</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="badge bg-primary">{garage.services?.length || 0} services</span>
                        <span className={`badge ${garage.isVerified ? 'bg-success' : 'bg-warning'}`}>
                          {garage.isVerified ? 'Verified' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <FaCar size={48} className="text-muted mb-3" />
                  <p className="text-muted">No garages added yet</p>
                  <Link to="/AutoGarageHomepage" className="btn btn-sm btn-outline-danger">
                    Add Your First Garage
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GarageOwnerDashboard;