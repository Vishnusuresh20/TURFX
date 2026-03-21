import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { CalendarDays, Clock, CheckCircle, CreditCard, Ticket } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const { user, bookings, fetchMyBookings } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchMyBookings();
    }
  }, [user, navigate, fetchMyBookings]);

  if (!user) return null;

  // Bookings are now directly fetched from the backend so we don't need to filter
  const userBookings = bookings;

  return (
    <div className="dashboard-page container">
      <div className="dashboard-header">
        <h1>My <span className="text-gradient">Bookings</span></h1>
        <p>Welcome back, {user.name}! Here is your booking history.</p>
      </div>

      {userBookings.length === 0 ? (
        <div className="empty-state card">
          <Ticket size={64} className="empty-icon" />
          <h2>No Bookings Yet</h2>
          <p>You haven't booked any turf slots yet. Book your first game now!</p>
          <button className="btn-primary" onClick={() => navigate('/book')}>
            Book a Slot
          </button>
        </div>
      ) : (
        <div className="bookings-list">
          {/* Sorting bookings to show latest first based on simple reverse */}
          {[...userBookings].reverse().map((booking) => (
            <div key={booking._id || booking.id} className="booking-card card">
              <div className="booking-card-header">
                <div>
                  <span className="booking-id">Booking ID: #{(booking._id || booking.id).toString().slice(-6)}</span>
                  <div className="booking-status">
                    <CheckCircle size={16} /> 
                    {booking.status}
                  </div>
                </div>
                <div className="booking-price">
                  ₹{booking.price}
                </div>
              </div>

              <div className="booking-card-body">
                <div className="detail-item">
                  <CalendarDays size={20} className="detail-icon" />
                  <div>
                    <span className="detail-label">Date</span>
                    <span className="detail-value">{booking.date}</span>
                  </div>
                </div>
                
                <div className="detail-item">
                  <Clock size={20} className="detail-icon" />
                  <div>
                    <span className="detail-label">Time Slot</span>
                    <span className="detail-value">{booking.time}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <CreditCard size={20} className="detail-icon" />
                  <div>
                    <span className="detail-label">Payment</span>
                    <span className="detail-value">Paid</span>
                  </div>
                </div>
              </div>
              
              <div className="booking-card-footer">
                <button className="btn-outline btn-sm">Get Directions</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
