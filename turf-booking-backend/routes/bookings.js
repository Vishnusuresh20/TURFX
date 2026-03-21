const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { protect, admin } = require('../middleware/authMiddleware');

// @route   GET /api/bookings/all
// @desc    Get all bookings (Admin only)
// @access  Private/Admin
router.get('/all', protect, admin, async (req, res) => {
  try {
    const bookings = await Booking.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/bookings/my-bookings/:userId
// @desc    Get all bookings for a specific user
// @access  Public (should ideally be protected with auth middleware)
router.get('/my-bookings/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    // ensure chronological sorting (newest first)
    const bookings = await Booking.find({ user: userId }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/bookings/:id/status
// @desc    Update booking status (Admin only)
// @access  Private/Admin
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (booking) {
      booking.status = status;
      // Also update slot status somewhere if needed, but for now just update booking
      const updatedBooking = await booking.save();
      res.json(updatedBooking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/bookings/:date
// @desc    Get all bookings for a specific date
// @access  Public (or could be private if required)
router.get('/:date', async (req, res) => {
  try {
    const { date } = req.params;
    
    // Find all confirmed bookings for this date
    const bookings = await Booking.find({ date, status: 'Confirmed' });
    
    // Return array of booked slot IDs
    const bookedSlotIds = bookings.map(b => b.slotId);
    
    res.json(bookedSlotIds);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
