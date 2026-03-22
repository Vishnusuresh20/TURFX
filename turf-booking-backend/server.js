const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const crypto = require('crypto');

const connectDB = require('./config/db');

// Load environment variables from .env file
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/bookings', require('./routes/bookings'));

// Cashfree configuration variables will be loaded from process.env
const CASHFREE_BASE_URL = 'https://api.cashfree.com/pg';

// Basic Health Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Turf Booking Backend is running!' });
});

// Create Order API
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount, currency = "INR", customer_id, customer_email, customer_phone } = req.body;
    
    // Generate a unique order ID for Cashfree
    const order_id = `order_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const payload = {
      order_amount: amount,
      order_currency: currency,
      order_id: order_id,
      customer_details: {
        customer_id: customer_id || "cust_guest",
        customer_email: customer_email || "guest@turfx.com",
        customer_phone: customer_phone || "9999999999"
      },
      order_meta: {
        // We will tell Cashfree to redirect back to our frontend /payment page with the order_id in the URL
        return_url: `https://turfx-c.vercel.app/payment?order_id=${order_id}&cf_id={order_id}`
      }
    };

    const response = await axios.post(`${CASHFREE_BASE_URL}/orders`, payload, {
      headers: {
        'x-client-id': process.env.CASHFREE_APP_ID,
        'x-client-secret': process.env.CASHFREE_SECRET_KEY,
        'x-api-version': '2023-08-01',
        'Content-Type': 'application/json'
      }
    });

    res.json({
      order_id: response.data.order_id,
      payment_session_id: response.data.payment_session_id
    });
  } catch (err) {
    console.error("Cashfree Order Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Internal Server Error", details: err.response?.data });
  }
});

const Booking = require('./models/Booking');
const { sendWhatsAppMessage } = require('./utils/whatsappBot');

// Verify Payment API
app.post('/api/verify-payment', async (req, res) => {
  try {
    const { 
      order_id,
      userId, slotId, date, time, hour, price, whatsappNumber
    } = req.body;

    // Securely ask Cashfree servers directly if this order was actually paid
    const response = await axios.get(`${CASHFREE_BASE_URL}/orders/${order_id}`, {
      headers: {
        'x-client-id': process.env.CASHFREE_APP_ID,
        'x-client-secret': process.env.CASHFREE_SECRET_KEY,
        'x-api-version': '2023-08-01'
      }
    });

    const orderStatus = response.data.order_status;

    if (orderStatus === 'PAID') {
      // Payment Verified successfully!
      // Save the booking to MongoDB
      const newBooking = new Booking({
        user: userId,
        slotId, date, time, hour, price,
        status: 'Confirmed',
        razorpayOrderId: order_id, // Keeping the same schema field name to avoid breaking the frontend
        razorpayPaymentId: "cashfree_verified"
      });
      await newBooking.save();

      if (whatsappNumber) {
        const textMsg = `✅ *TURF-X Booking Confirmed!*\n\nHi there!\nYour turf slot is successfully locked in for *${date}* at *${time}*.\n\nBooking ID: ${order_id.slice(-6)}\nAmount Paid: ₹${price}\n\nSee you on the pitch! ⚽`;
        sendWhatsAppMessage(whatsappNumber, textMsg).catch(e => console.error("WhatsApp Error:", e));
      }

      return res.status(200).json({ status: 'success', message: 'Payment verified and slot booked successfully' });
    } else {
      return res.status(400).json({ status: 'failure', message: 'Order is not marked as PAID in Cashfree.' });
    }
  } catch (err) {
    console.error("Verification Error:", err.response?.data || err.message);
    if (err.code === 11000) {
      return res.status(400).json({ status: 'failure', message: 'This slot is already booked for this date!' });
    }
    res.status(500).send("Internal Server Error");
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
