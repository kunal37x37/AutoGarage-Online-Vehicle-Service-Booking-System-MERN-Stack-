// components/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaEdit, 
  FaSave, 
  FaTimes,
  FaKey,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('autogarage_token');
      const response = await fetch(`${API_BASE}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setFormData({
          name: data.user.name || '',
          email: data.user.email || '',
          phone: data.user.phone || '',
        });
      } else {
        showMessage('error', 'Failed to load profile data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      showMessage('error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('autogarage_token');
      const response = await fetch(`${API_BASE}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsEditing(false);
        showMessage('success', 'Profile updated successfully');
      } else {
        const errorData = await response.json();
        showMessage('error', errorData.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showMessage('error', 'Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage('error', 'New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showMessage('error', 'Password must be at least 6 characters long');
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem('autogarage_token');
      const response = await fetch(`${API_BASE}/api/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      if (response.ok) {
        showMessage('success', 'Password updated successfully');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        const errorData = await response.json();
        showMessage('error', errorData.message || 'Failed to update password');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      showMessage('error', 'Error updating password');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <FaSpinner className="spinner spinner-border text-danger mb-3" style={{width: '3rem', height: '3rem'}} />
        <p className="fs-5">Loading your profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-5 text-center">
        <FaExclamationTriangle className="text-warning mb-3" size={50} />
        <h3>Profile Not Found</h3>
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Message Alert */}
      {message.text && (
        <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`}>
          <div className="d-flex align-items-center">
            {message.type === 'success' && <FaCheckCircle className="me-2" />}
            {message.type === 'error' && <FaExclamationTriangle className="me-2" />}
            {message.text}
          </div>
          <button type="button" className="btn-close" onClick={() => setMessage({ type: '', text: '' })}></button>
        </div>
      )}

      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          {/* Profile Header */}
          <div className="card shadow-sm mb-4">
            <div className="card-body text-center">
              <div className="mb-3">
                <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center" style={{width: '80px', height: '80px'}}>
                  <FaUser className="text-white" size={30} />
                </div>
              </div>
              <h4 className="mb-1">{user.name}</h4>
              <p className="text-muted mb-3">{user.email}</p>
              
              {/* Navigation Tabs */}
              <div className="d-flex justify-content-center border-bottom">
                <button
                  className={`btn btn-link text-decoration-none ${activeTab === 'profile' ? 'text-danger border-bottom border-danger border-2' : 'text-dark'}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <FaUser className="me-2" />
                  Profile
                </button>
                <button
                  className={`btn btn-link text-decoration-none ${activeTab === 'password' ? 'text-danger border-bottom border-danger border-2' : 'text-dark'}`}
                  onClick={() => setActiveTab('password')}
                >
                  <FaKey className="me-2" />
                  Password
                </button>
              </div>
            </div>
          </div>

          {/* Profile Information Tab */}
          {activeTab === 'profile' && (
            <div className="card shadow-sm">
              <div className="card-header bg-light d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Profile Information</h5>
                <button
                  className={`btn ${isEditing ? 'btn-secondary' : 'btn-outline-primary'}`}
                  onClick={() => setIsEditing(!isEditing)}
                  disabled={saving}
                >
                  {isEditing ? (
                    <><FaTimes className="me-1" /> Cancel</>
                  ) : (
                    <><FaEdit className="me-1" /> Edit</>
                  )}
                </button>
              </div>
              <div className="card-body">
                <form onSubmit={handleProfileUpdate}>
                  <div className="mb-3">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      className="form-control"
                      value={user.email}
                      disabled
                    />
                    <small className="text-muted">Email cannot be changed</small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">User Type</label>
                    <input
                      type="text"
                      className="form-control"
                      value={user.userType === 'garage_owner' ? 'Garage Owner' : 'Customer'}
                      disabled
                    />
                  </div>

                  {isEditing && (
                    <div className="d-flex gap-2">
                      <button 
                        type="submit" 
                        className="btn btn-danger"
                        disabled={saving}
                      >
                        {saving ? (
                          <>
                            <FaSpinner className="spinner-border spinner-border-sm me-2" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <FaSave className="me-2" />
                            Save Changes
                          </>
                        )}
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            name: user.name || '',
                            email: user.email || '',
                            phone: user.phone || '',
                          });
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}

          {/* Password Change Tab */}
          {activeTab === 'password' && (
            <div className="card shadow-sm">
              <div className="card-header bg-light">
                <h5 className="mb-0">Change Password</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handlePasswordUpdate}>
                  <div className="mb-3">
                    <label className="form-label">Current Password *</label>
                    <div className="input-group">
                      <input
                        type={showPassword.current ? "text" : "password"}
                        className="form-control"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        required
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => togglePasswordVisibility('current')}
                      >
                        {showPassword.current ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">New Password *</label>
                    <div className="input-group">
                      <input
                        type={showPassword.new ? "text" : "password"}
                        className="form-control"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                        placeholder="Enter new password"
                        minLength="6"
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => togglePasswordVisibility('new')}
                      >
                        {showPassword.new ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    <small className="text-muted">Password must be at least 6 characters long</small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Confirm New Password *</label>
                    <div className="input-group">
                      <input
                        type={showPassword.confirm ? "text" : "password"}
                        className="form-control"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => togglePasswordVisibility('confirm')}
                      >
                        {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-danger"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <FaSpinner className="spinner-border spinner-border-sm me-2" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <FaKey className="me-2" />
                        Update Password
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;