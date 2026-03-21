const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config({ path: './.env' });
const connectDB = require('./config/db');
const User = require('./models/User');

const runDebug = async () => {
  await connectDB();

  const adminUser = await User.findOne({ email: 'admin@turfbook.com' });
  
  const token = jwt.sign({ id: adminUser._id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  try {
    const response = await fetch('http://localhost:5001/api/bookings/all', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const data = await response.json();
    console.log(`Backend API Returned Status: ${response.status}`);
    console.log(`Backend API Returned Bookings Length: ${data.length}`);
    console.log(JSON.stringify(data[0], null, 2));

  } catch (e) {
    console.log("Fetch failed:", e);
  }

  process.exit();
};

runDebug();
