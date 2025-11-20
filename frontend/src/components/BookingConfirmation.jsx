// components/BookingConfirmation.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCheckCircle, FaArrowLeft, FaPrint, FaEnvelope } from 'react-icons/fa';

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const booking = location.state?.booking;

  const handlePrint = () => {
    window.print();
  };

  const handleEmailReceipt = () => {
    // In a real app, this would send an email
    alert('Receipt will be sent to your email!');
  };

  if (!booking) {
    return (
      <div className="container py-5 text-center">
        <h3>Booking information not found</h3>
        <button 
          className="btn btn-danger mt-3"
          onClick={() => navigate('/my-bookings')}
        >
          View My Bookings
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* Header */}
          <div className="text-center mb-5">
            <FaCheckCircle size={80} className="text-success mb-3" />
            <h1 className="text-success">Booking Confirmed!</h1>
            <p className="lead">Your service has been successfully booked</p>
          </div>

          {/* Booking Details Card */}
          <div className="card shadow-lg">
            <div className="card-header bg-success text-white">
              <h4 className="mb-0">Booking Details</h4>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h6>Booking Information</h6>
                  <p><strong>Booking ID:</strong> #{booking._id?.slice(-8) || 'N/A'}</p>
                  <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {booking.time}</p>
                  <p><strong>Status:</strong> 
                    <span className="badge bg-warning text-dark ms-2">
                      {booking.status?.toUpperCase() || 'PENDING'}
                    </span>
                  </p>
                </div>
                
                <div className="col-md-6">
                  <h6>Garage Information</h6>
                  <p><strong>Garage:</strong> {booking.garage?.name}</p>
                  <p><strong>Location:</strong> {booking.garage?.location}</p>
                  <p><strong>Address:</strong> {booking.garage?.address}</p>
                  <p><strong>Contact:</strong> {booking.garage?.contactNumber}</p>
                </div>
              </div>

              <hr />

              <div className="row">
                <div className="col-md-6">
                  <h6>Service Details</h6>
                  <p><strong>Service:</strong> {booking.serviceName}</p>
                  <p><strong>Price:</strong> ₹{booking.servicePrice || booking.totalAmount}</p>
                </div>
                
                <div className="col-md-6">
                  <h6>Vehicle Information</h6>
                  {booking.vehicleInfo && (
                    <>
                      <p><strong>Vehicle:</strong> {booking.vehicleInfo.make} {booking.vehicleInfo.model}</p>
                      <p><strong>Year:</strong> {booking.vehicleInfo.year}</p>
                      <p><strong>License:</strong> {booking.vehicleInfo.licensePlate}</p>
                    </>
                  )}
                </div>
              </div>

              {booking.specialInstructions && (
                <>
                  <hr />
                  <h6>Special Instructions</h6>
                  <p>{booking.specialInstructions}</p>
                </>
              )}

              <hr />
              
              <div className="row">
                <div className="col-12">
                  <div className="alert alert-info">
                    <h6>Important Notes:</h6>
                    <ul className="mb-0">
                      <li>Please arrive at the garage 10 minutes before your scheduled time</li>
                      <li>Bring your vehicle registration documents</li>
                      <li>Payment will be collected at the garage after service completion</li>
                      <li>Contact the garage directly for any changes or cancellations</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card-footer">
              <div className="d-flex justify-content-between">
                <button 
                  className="btn btn-outline-secondary"
                  onClick={() => navigate('/my-bookings')}
                >
                  <FaArrowLeft className="me-2" />
                  Back to Bookings
                </button>
                
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-outline-primary"
                    onClick={handlePrint}
                  >
                    <FaPrint className="me-2" />
                    Print Receipt
                  </button>
                  
                  <button 
                    className="btn btn-primary"
                    onClick={handleEmailReceipt}
                  >
                    <FaEnvelope className="me-2" />
                    Email Receipt
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="card mt-4">
            <div className="card-header">
              <h5 className="mb-0">What's Next?</h5>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-md-4 mb-3">
                  <div className="p-3">
                    <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                         style={{width: '60px', height: '60px'}}>
                      <span className="text-primary fw-bold">1</span>
                    </div>
                    <h6>Visit the Garage</h6>
                    <p className="small text-muted">Go to the garage at your scheduled time with your vehicle</p>
                  </div>
                </div>
                
                <div className="col-md-4 mb-3">
                  <div className="p-3">
                    <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                         style={{width: '60px', height: '60px'}}>
                      <span className="text-primary fw-bold">2</span>
                    </div>
                    <h6>Get Service</h6>
                    <p className="small text-muted">Our professional mechanics will service your vehicle</p>
                  </div>
                </div>
                
                <div className="col-md-4 mb-3">
                  <div className="p-3">
                    <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                         style={{width: '60px', height: '60px'}}>
                      <span className="text-primary fw-bold">3</span>
                    </div>
                    <h6>Pay & Review</h6>
                    <p className="small text-muted">Pay at garage and share your experience</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>
        {`
          @media print {
            .btn, .card-footer, .alert-info {
              display: none !important;
            }
            
            .card {
              border: none !important;
              box-shadow: none !important;
            }
            
            .card-header {
              background: white !important;
              color: black !important;
              border-bottom: 2px solid #000 !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default BookingConfirmation;