import express from 'express';
import mongoose from 'mongoose';
import Property from '../models/Property.js';
import User from '../models/User.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Booking Schema
const bookingSchema = new mongoose.Schema({
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookedAt: { type: Date, default: Date.now }
});

// THIS IS THE CRUCIAL CHANGE:
// Check if the model already exists before compiling it.
const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

// POST /api/bookings - Book a property
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { propertyId } = req.body;
    const userId = req.user._id;
    if (!propertyId || !userId) return res.status(400).json({ message: 'propertyId and userId required' });
    // Check if already booked
    const exists = await Booking.findOne({ propertyId, userId });
    if (exists) return res.status(400).json({ message: 'Already booked' });
    const booking = new Booking({ propertyId, userId });
    await booking.save();
    res.status(201).json({ message: 'Property booked', booking });
  } catch (err) {
    res.status(500).json({ message: 'Booking failed', error: err.message });
  }
});

// GET /api/bookings/user/:userId - Get all bookings for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId }).populate('propertyId');
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user bookings', error: err.message });
  }
});

// GET /api/bookings/user/me - Get all bookings for the current user
router.get('/user/me', authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id }).populate('propertyId');
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user bookings', error: err.message });
  }
});

// GET /api/bookings/owner/:ownerId - Get all bookings for properties owned by owner
router.get('/owner/:ownerId', async (req, res) => {
  try {
    // Find all properties owned by this owner
    const properties = await Property.find({ owner: req.params.ownerId });
    const propertyIds = properties.map(p => p._id);
    const bookings = await Booking.find({ propertyId: { $in: propertyIds } }).populate('propertyId userId');
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch owner bookings', error: err.message });
  }
});

export default router;