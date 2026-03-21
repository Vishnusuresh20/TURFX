import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Modal from '../components/Modal';
import { Calendar as CalendarIcon, Clock, CreditCard } from 'lucide-react';
import './Booking.css';

const Booking = () => {
  const { user, slots, fetchAvailableSlots } = useAppContext();
  const navigate = useNavigate();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch true availability whenever the date changes
  useEffect(() => {
    fetchAvailableSlots(date);
  }, [date, fetchAvailableSlots]);

  const handleSlotClick = (slot) => {
    if (slot.isBooked) return;
    setSelectedSlot(slot);
    setIsModalOpen(true);
  };

  const proceedToPayment = () => {
    // We will navigate to the payment page passing the slot details
    navigate('/payment', { 
      state: { 
        slot: selectedSlot, 
        date: date 
      } 
    });
  };

  const getMinDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 14); // Allow booking 2 weeks in advance
    return d.toISOString().split('T')[0];
  };

  if (!user) return null; // Prevent flicker while redirecting

  return (
    <div className="booking-page container">
      <div className="booking-header">
        <h1>Book a <span className="text-gradient">Slot</span></h1>
        <p>Select your preferred date and time for the game.</p>
      </div>

      <div className="booking-container">
        {/* Date Selection */}
        <div className="date-picker-section card">
          <div className="section-title">
            <CalendarIcon className="icon-green" />
            <h2>Select Date</h2>
          </div>
          <input 
            type="date" 
            className="input-field date-input"
            value={date}
            min={getMinDate()}
            max={getMaxDate()}
            onChange={(e) => {
              setDate(e.target.value);
              setSelectedSlot(null); // Reset selected slot on date change
            }}
          />
        </div>

        {/* Slots Grid */}
        <div className="slots-section card">
          <div className="section-title">
            <Clock className="icon-green" />
            <h2>Available Time Slots</h2>
          </div>
          
          <div className="slots-info">
            <span className="info-badge available">Available</span>
            <span className="info-badge booked">Booked</span>
            <span className="info-badge selected">Selected</span>
          </div>

          <div className="slots-grid">
            {slots.map((slot) => {
              // Note: In a real app, 'isBooked' would be checked against the specific 'date' and 'slotId'.
              // Here we just use the global 'isBooked' tag from the mock data for simplicity.
              const isSelected = selectedSlot?.id === slot.id;
              let slotClass = 'slot-btn';
              if (slot.isBooked) slotClass += ' booked';
              else if (isSelected) slotClass += ' selected';
              else slotClass += ' available';

              return (
                <button
                  key={slot.id}
                  className={slotClass}
                  onClick={() => handleSlotClick(slot)}
                  disabled={slot.isBooked}
                >
                  <span className="slot-time">{slot.time}</span>
                  <span className="slot-price">₹{slot.price}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Confirm Booking"
      >
        {selectedSlot && (
          <div className="booking-summary">
            <div className="summary-details">
              <div className="summary-row">
                <span className="summary-label">Date</span>
                <span className="summary-value">{date}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Time</span>
                <span className="summary-value">{selectedSlot.time}</span>
              </div>
              <div className="summary-row total-row">
                <span className="summary-label">Total Amount</span>
                <span className="summary-value total-price">₹{selectedSlot.price}</span>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={proceedToPayment}>
                <CreditCard size={18} /> Proceed to Pay
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Booking;
