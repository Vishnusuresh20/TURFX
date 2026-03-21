const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.log("If MongoDB is not installed locally, please provide a MongoDB Atlas URI in the .env file.");
    // Do not exit process, just log error, to not crash backend entirely during setup phase
  }
};

module.exports = connectDB;
