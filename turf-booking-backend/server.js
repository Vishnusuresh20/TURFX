const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Razorpay = require('razorpay');
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

// Initialize Razorpay (Requires RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Basic Health Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Turf Booking Backend is running!' });
});

// Create Order API
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount, currency = "INR", receipt } = req.body;
    
    // In a real app, you would verify the amount against the database here (e.g. Turf price = 900)
    // to prevent malicious users from sending {"amount": 1} from the frontend.
    
    const options = {
      amount: amount * 100, // Razorpay expects amount in standard subunit (paise)
      currency,
      receipt
    };
    
    const order = await razorpay.orders.create(options);
    if (!order) {
      return res.status(500).send("Error creating order");
    }
    
    // Inject the public key so the frontend never has to guess it
    res.json({
      ...order,
      key_id: process.env.RAZORPAY_KEY_ID
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

const Booking = require('./models/Booking');
const { sendWhatsAppMessage } = require('./utils/whatsappBot');

// Verify Payment API
app.post('/api/verify-payment', async (req, res) => {
  try {
    const { 
      razorpay_order_id, razorpay_payment_id, razorpay_signature,
      userId, slotId, date, time, hour, price, whatsappNumber
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment Verified successfully!
      // Save the booking to MongoDB
      const newBooking = new Booking({
        user: userId,
        slotId,
        date,
        time,
        hour,
        price,
        status: 'Confirmed',
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id
      });
      await newBooking.save();

      if (whatsappNumber) {
        const textMsg = `✅ *TURF-X Booking Confirmed!*\n\nHi there!\nYour turf slot is successfully locked in for *${date}* at *${time}*.\n\nBooking ID: ${razorpay_order_id.slice(-6)}\nAmount Paid: ₹${price}\n\nSee you on the pitch! ⚽`;
        sendWhatsAppMessage(whatsappNumber, textMsg).catch(e => console.error("WhatsApp Error:", e));
      }

      return res.status(200).json({ status: 'success', message: 'Payment verified and slot booked successfully' });
    } else {
      return res.status(400).json({ status: 'failure', message: 'Invalid signature sent!' });
    }
  } catch (err) {
    console.error(err);
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
