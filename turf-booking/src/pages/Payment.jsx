import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { CreditCard, CheckCircle, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import './Payment.css';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAppContext();
  
  const [status, setStatus] = useState('idle'); // idle, processing, success, error
  const [errorDetails, setErrorDetails] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const slotData = location.state?.slot;
  const bookingDate = location.state?.date;

  useEffect(() => {
    if (!user || !slotData) {
      navigate('/book'); 
    }
  }, [user, slotData, navigate]);

  // Dynamically load the Razorpay checkout script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setStatus('processing');
    setErrorDetails('');

    try {
      const res = await loadRazorpayScript();
      if (!res) {
        setStatus('error');
        setErrorDetails('Failed to load Razorpay SDK. Check your internet connection.');
        return;
      }

      // Step 1: Tell Backend to generate a unique Razorpay Order ID for this transaction
      const orderResponse = await axios.post('http://localhost:5001/api/create-order', {
        amount: slotData.price,
        receipt: `rcpt_${user.id.substring(0, 5)}_${slotData.id}`
      });

      const orderData = orderResponse.data;

      // Step 2: Open Razorpay checkout window with the dynamically provided variables
      const options = {
        key: orderData.key_id, // Safely pulled directly from your backend .env file!
        amount: orderData.amount,
        currency: orderData.currency,
        name: "TURF-X",
        description: `Booking turf slot for ${bookingDate} at ${slotData.time}`,
        order_id: orderData.id,
        handler: async function (response) {
          try {
            // Step 3: Send success signature back to backend for verification
            const verifyCheck = await axios.post("http://localhost:5001/api/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId: user.id || user._id,
              slotId: slotData.id,
              date: bookingDate,
              time: slotData.time,
              hour: slotData.hour,
              price: slotData.price,
              whatsappNumber: phoneNumber
            });

            if (verifyCheck.data.status === 'success') {
              // Successfully validated and saved to MongoDB!
              setStatus('success');
              setTimeout(() => navigate('/dashboard'), 3000);
            } else {
              setStatus('error');
              setErrorDetails('Payment verification failed. If money was deducted, it will be refunded.');
            }
          } catch (err) {
            console.error("Verification error:", err);
            setStatus('error');
            setErrorDetails('Server error processing payment verification.');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#10b981", // Turf green
        },
      };

      const paymentObject = new window.Razorpay(options);
      
      paymentObject.on('payment.failed', function (response) {
        setStatus('error');
        setErrorDetails(response.error.description);
      });

      paymentObject.open();
      // Set to idle because Razorpay popup takes over
      setStatus('idle');
      
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
                <span>Secure Checkout by Razorpay</span>
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
