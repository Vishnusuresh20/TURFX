import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';

const AppContext = createContext();
const API_URL = 'https://turfx-rken.onrender.com/api';

// Create base template for slots (21 slots: 6 AM to 2 AM)
const createInitialSlots = () => Array.from({ length: 21 }, (_, i) => {
  const hour24 = i + 6;
  const period = hour24 < 12 || hour24 >= 24 ? 'AM' : 'PM';
  let hour12 = hour24 % 12;
  if (hour12 === 0) hour12 = 12;

  return {
    id: i,
    time: `${hour12}:00 ${period}`,
    hour: hour24,
    isBooked: false, 
    price: 1
  };
});

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('turf_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [slots, setSlots] = useState(createInitialSlots());
  const [bookings, setBookings] = useState([]);

  // Set axios headers globally
  useEffect(() => {
    if (user && user.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      setUser(res.data);
      localStorage.setItem('turf_user', JSON.stringify(res.data));
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await axios.post(`${API_URL}/auth/register`, { name, email, password });
      setUser(res.data);
      localStorage.setItem('turf_user', JSON.stringify(res.data));
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('turf_user');
  };

  const resetPassword = async (email, newPassword) => {
    try {
      const res = await axios.post(`${API_URL}/auth/reset-password`, { email, newPassword });
      return { success: true, message: res.data.message };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Password reset failed' };
    }
  };

  const fetchAvailableSlots = useCallback(async (date) => {
    try {
      const res = await axios.get(`${API_URL}/bookings/${date}`);
      const bookedIds = res.data; // Array of booked slotIds
      
      const newSlots = createInitialSlots().map(slot => ({
        ...slot,
        isBooked: bookedIds.includes(slot.id)
      }));
      setSlots(newSlots);
    } catch (err) {
      console.error('Failed to fetch available slots', err);
    }
  }, []);

  const fetchMyBookings = useCallback(async () => {
    if (user) {
      try {
        const res = await axios.get(`${API_URL}/bookings/my-bookings/${user.id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setBookings(res.data);
      } catch (err) {
        console.error('Failed to fetch my bookings', err);
      }
    }
  }, [user]);

  const [allBookings, setAllBookings] = useState([]);

  const fetchAllBookings = useCallback(async () => {
    if (user && user.role === 'admin') {
      try {
        const res = await axios.get(`${API_URL}/bookings/all`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setAllBookings(res.data);
      } catch (err) {
        console.error('Failed to fetch all bookings', err);
      }
    }
  }, [user]);

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await axios.put(`${API_URL}/bookings/${bookingId}/status`, 
        { status },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      // Refresh list
      fetchAllBookings();
      return true;
    } catch (err) {
      console.error('Failed to update booking status', err);
      return false;
    }
  };

  const value = {
    user,
    slots,
    bookings,
    allBookings,
    login,
    register,
    logout,
    resetPassword,
    fetchAvailableSlots,
    fetchMyBookings,
    fetchAllBookings,
    updateBookingStatus
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
