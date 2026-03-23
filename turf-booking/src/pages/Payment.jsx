import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { CreditCard, CheckCircle, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';
import { load } from '@cashfreepayments/cashfree-js';
import axios from 'axios';
import './Payment.css';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAppContext();
  
  const [status, setStatus] = useState('idle'); // idle, processing, success, error
  const [errorDetails, setErrorDetails] = useState('');
  
  // Extract URL parameters immediately
  const urlParams = new URLSearchParams(window.location.search);
  const orderIdParam = urlParams.get('order_id');

  // Attempt to load phone from param or localStorage
  const [phoneNumber, setPhoneNumber] = useState(localStorage.getItem('turfx_pending_phone') || '');

  // Safely restore volatile React Router state if it was wiped by the Cashfree redirect
  const getSlotData = () => {
    if (location.state?.slot) return location.state.slot;
    const stored = localStorage.getItem('turfx_pending_slot');
    return stored ? JSON.parse(stored) : null;
  };

  const getBookingDate = () => {
    if (location.state?.date) return location.state.date;
    return localStorage.getItem('turfx_pending_date') || null;
  };

  const slotData = getSlotData();
  const bookingDate = getBookingDate();

  useEffect(() => {
    // Only redirect away if we are missing state AND we aren't currently returning from a payment
    if (!user || (!slotData && !orderIdParam)) {
      navigate('/book'); 
    }
  }, [user, slotData, orderIdParam, navigate]);

  useEffect(() => {
    // If we land on this page from a Cashfree redirect, verify the payment automatically
    if (orderIdParam && user && slotData) {
      verifyCashfreePayment(orderIdParam);
    }
  }, [orderIdParam, user, slotData]);

  const verifyCashfreePayment = async (order_id) => {
    setStatus('processing');
    try {
      const verifyCheck = await axios.post("https://turfx-rken.onrender.com/api/verify-payment", {
        order_id: order_id,
        userId: user.id || user._id,
        slotId: slotData.id,
        date: bookingDate,
        time: slotData.time,
        hour: slotData.hour,
        price: slotData.price,
        whatsappNumber: phoneNumber
      });

      if (verifyCheck.data.status === 'success') {
        setStatus('success');
        
        // Clear local storage to prevent duplicate checks
        localStorage.removeItem('turfx_pending_slot');
        localStorage.removeItem('turfx_pending_date');
        localStorage.removeItem('turfx_pending_phone');

        setTimeout(() => navigate('/dashboard'), 3000);
      } else {
        setStatus('error');
        setErrorDetails('Payment verification failed. If money was deducted, it will be refunded.');
      }
    } catch (err) {
      console.error("Verification error:", err);
      setStatus('error');
      setErrorDetails(err.response?.data?.message || 'Server error processing payment verification.');
    }
  };

  const handlePayment = async () => {
    setStatus('processing');
    setErrorDetails('');

    // Pre-save state to localStorage before the Cashfree redirect wipes React memory!
    localStorage.setItem('turfx_pending_slot', JSON.stringify(slotData));
    localStorage.setItem('turfx_pending_date', bookingDate);
    localStorage.setItem('turfx_pending_phone', phoneNumber);

    try {
      const cashfree = await load({
        mode: "production", // Explicitly setting production because you generated PROD keys
      });

      // Step 1: Tell Backend to generate a unique Cashfree Order Token for this transaction
      const orderResponse = await axios.post('https://turfx-rken.onrender.com/api/create-order', {
        amount: slotData.price,
        customer_id: `cust_${user.id || user._id}`.substring(0, 40),
        customer_email: user.email,
        customer_phone: phoneNumber || "9999999999"
      });

      const paymentSessionId = orderResponse.data.payment_session_id;

      if (!paymentSessionId) {
        throw new Error("Failed to get payment session ID from Cashfree");
      }

      // Step 2: Open Cashfree checkout window
      const checkoutOptions = {
        paymentSessionId: paymentSessionId,
        redirectTarget: "_self", // Redirect back to this page
      };
      
      setStatus('idle'); // Cashfree UI takes over
      cashfree.checkout(checkoutOptions);
      
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorDetails('Failed to create payment order on the server.');
    }
  };

  if (!slotData) return null;

  if (status === 'success') {
    return (
      <div className="payment-page container text-center">
        <div className="status-card card success-card">
          <CheckCircle size={64} className="status-icon text-green" />
          <h2>Payment Successful!</h2>
          <p>Your slot has been successfully booked for {bookingDate} at {slotData.time}.</p>
          <p className="redirect-text">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="payment-page container text-center">
        <div className="status-card card error-card">
          <AlertCircle size={64} className="status-icon text-red" />
          <h2>Payment Failed</h2>
          <p>{errorDetails}</p>
          <button className="btn-primary" onClick={() => setStatus('idle')}>
            Retry Payment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page container">
      <div className="payment-container" style={{maxWidth: '600px', margin: '0 auto'}}>
        
        <div className="order-summary card" style={{position: 'static'}}>
          <h3>Order Summary</h3>
          <div className="summary-details">
            <div className="summary-row">
              <span>Date</span>
              <span className="summary-val">{bookingDate}</span>
            </div>
            <div className="summary-row">
              <span>Time Slot</span>
              <span className="summary-val">{slotData.time}</span>
            </div>
            <div className="summary-row">
              <span>Duration</span>
              <span className="summary-val">1 Hour</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row total">
              <span>Total Amount</span>
              <span className="total-val">₹{slotData.price}</span>
            </div>
          </div>
          
          <div className="payment-notice" style={{marginTop: '2rem', textAlign: 'center'}}>
             <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '1rem'}}>
                <ShieldCheck size={20} style={{color: 'var(--primary-green)'}}/>
                <span>Secure Checkout by Cashfree</span>
             </div>

             <div className="input-group" style={{marginBottom: '1.5rem', textAlign: 'left'}}>
               <label htmlFor="phoneNumber" style={{fontSize: '0.9rem', color: 'var(--text-secondary)'}}>WhatsApp Number (For Digital Receipt)</label>
               <input
                 type="tel"
                 id="phoneNumber"
                 className="input-field"
                 placeholder="e.g. 9876543210"
                 value={phoneNumber}
                 onChange={(e) => setPhoneNumber(e.target.value)}
                 style={{marginTop: '0.5rem'}}
               />
             </div>
             
             <button 
                className="btn-primary pay-btn" 
                onClick={handlePayment}
                disabled={status === 'processing'}
             >
                {status === 'processing' ? (
                  <><Loader2 className="spinner" size={18} /> Processing...</>
                ) : (
                  `Pay ₹${slotData.price} Now`
                )}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
