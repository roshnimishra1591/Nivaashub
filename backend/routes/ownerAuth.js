import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Owner from '../models/Owner.js';
import Property from '../models/Property.js';
const router = express.Router();

// Owner Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const existing = await Owner.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Owner already exists' });
    const hashed = await bcrypt.hash(password, 10);
    const owner = new Owner({ name, email, password: hashed, phone });
    await owner.save();
    const token = jwt.sign({ id: owner._id, type: 'owner' }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Owner Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const owner = await Owner.findOne({ email });
    if (!owner) return res.status(400).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, owner.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: owner._id, type: 'owner' }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current owner info
router.get('/me', async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });
    const token = auth.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const owner = await Owner.findById(payload.id);
    if (!owner) return res.status(404).json({ message: 'Owner not found' });
    res.json({ owner });
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

// Update current owner info
router.put('/me', async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });
    const token = auth.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const owner = await Owner.findById(payload.id);
    if (!owner) return res.status(404).json({ message: 'Owner not found' });
    owner.name = req.body.name || owner.name;
    owner.email = req.body.email || owner.email;
    owner.phone = req.body.phone || owner.phone;
    await owner.save();
    res.json({ owner });
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

// Get all properties for the current owner
router.get('/properties', async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });
    const token = auth.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const properties = await Property.find({ owner: payload.id });
    res.json({ properties });
  } catch (err) {
    console.error('Error in /api/owner/properties:', err); // Log the error for debugging
    res.status(500).json({ message: 'Failed to fetch properties', error: err.message });
  }
});

// Get all bookings for the current owner
router.get('/bookings', async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });
    const token = auth.split(' ')[1];
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtErr) {
      console.error('JWT verification failed:', jwtErr);
      return res.status(401).json({ message: 'Invalid or expired token', error: jwtErr.message });
    }
    const Booking = (await import('../models/Booking.js')).default;
    // Find bookings for properties owned by this owner
    const properties = await Property.find({ owner: payload.id }).select('_id');
    const propertyIds = properties.map(p => p._id);
    if (propertyIds.length === 0) {
      return res.json({ bookings: [] });
    }
    const bookings = await Booking.find({ property: { $in: propertyIds } }).populate('property user');
    res.json({ bookings });
  } catch (err) {
    console.error('Error in /api/owner/bookings:', err);
    res.status(500).json({ message: 'Failed to fetch bookings', error: err.message });
  }
});

// Add property for owner (with image upload)
import multer from 'multer';
import path from 'path';

// Multer config for image upload (multiple images)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const uploadMulti = multer({ storage });

// Make sure uploads directory exists
import fs from 'fs';
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

router.post('/property', uploadMulti.array('images', 10), async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });
    const token = auth.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const { name, location, price, desc, type, bedrooms } = req.body;
    if (!req.files || req.files.length === 0) return res.status(400).json({ message: 'At least one image is required' });
    const property = new Property({
      owner: payload.id,
      title: name,
      address: location,
      price,
      description: desc,
      images: req.files.map(f => f.filename),
      type,
      bedrooms
    });
    await property.save();
    res.json({ property });
  } catch (err) {
    console.error('Error in /api/owner/property:', err);
    res.status(500).json({ message: 'Failed to add property', error: err.message });
  }
});

// Get all properties (public)
router.get('/all-properties', async (req, res) => {
  try {
    const properties = await Property.find({});
    res.json({ properties });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch properties', error: err.message });
  }
});

// Owner Forgot Password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });
  const owner = await Owner.findOne({ email });
  if (!owner) return res.status(200).json({ message: 'If this email exists, a reset link has been sent.' });
  // In production, generate a token and send email. Here, just respond OK.
  res.json({ message: 'If this email exists, a reset link has been sent.' });
});

export default router;
