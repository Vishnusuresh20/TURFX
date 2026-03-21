import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Settings, Calendar, Search, CheckCircle } from 'lucide-react';
import './Admin.css';

const Admin = () => {
  const { user, allBookings, fetchAllBookings, updateBookingStatus } = useAppContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Protect Admin Route
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role !== 'admin') {
      navigate('/dashboard'); // unauthorized user redirected to their dashboard
    } else {
      fetchAllBookings();
    }
  }, [user, navigate, fetchAllBookings]);

  if (!user || user.role !== 'admin') return null;

  // Filter bookings (search by user name, email, or date)
  const filteredBookings = (allBookings || []).filter(b => 
    (b.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.user?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.date || '').includes(searchTerm)
  );

  return (
    <div className="admin-page container">
      
      <div className="admin-header">
        <div className="admin-title">
          <Settings className="admin-icon" size={32} />
          <div>
             <h1>Admin <span className="text-gradient">Panel</span></h1>
             <p>Manage all user bookings</p>
          </div>
        </div>

        <div className="stats-row">
           <div className="stat-card card">
               <div className="stat-info">
                 <span className="stat-val">{allBookings.length}</span>
                 <span className="stat-label">Total Bookings</span>
               </div>
               <Calendar size={24} className="stat-icon" />
           </div>
           
           <div className="stat-card card">
               <div className="stat-info">
                 <span className="stat-val">{allBookings.filter(b => b.status?.toLowerCase() === 'confirmed').length}</span>
                 <span className="stat-label">Confirmed</span>
               </div>
               <CheckCircle size={24} className="stat-icon text-success" />
           </div>
        </div>
      </div>

      <div className="admin-content card">
        <div className="admin-content-header">
           <h2>All Bookings</h2>
           <div className="search-bar input-wrapper">
              <Search size={18} className="input-icon" />
              <input 
                type="text" 
                className="input-field with-icon" 
                placeholder="Search by name, email, date..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
        </div>

        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Date & Time</th>
                <th>Price</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map(booking => (
                <tr key={booking._id}>
                  <td>
                    <div className="slot-bold">{booking.user?.name || 'Unknown User'}</div>
                    <div style={{ fontSize: '0.8rem', color: '#8892b0' }}>{booking.user?.email || 'N/A'}</div>
                  </td>
                  <td>
                    <div className="slot-bold">{booking.date}</div>
                    <div style={{ fontSize: '0.8rem', color: '#8892b0' }}>{booking.time}</div>
                  </td>
                  <td>₹{booking.price}</td>
                  <td>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem',
                      backgroundColor: booking.status?.toLowerCase() === 'confirmed' ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 90, 90, 0.1)',
                      color: booking.status?.toLowerCase() === 'confirmed' ? '#00ff88' : '#ff5a5a'
                    }}>
                      {booking.status || 'Confirmed'}
                    </span>
                  </td>
                  <td>
                    {booking.status?.toLowerCase() !== 'cancelled' ? (
                      <button 
                        className="btn-toggle btn-block"
                        onClick={() => updateBookingStatus(booking._id, 'Cancelled')}
                      >
                        Cancel
                      </button>
                    ) : (
                      <button 
                        className="btn-toggle btn-free"
                        onClick={() => updateBookingStatus(booking._id, 'Confirmed')}
                      >
                        Confirm
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              
              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4">No bookings found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Admin;
