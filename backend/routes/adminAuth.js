import express from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
const router = express.Router();

// Only allow login for hardcoded admin
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (email === 'roshnimishra1591@gmail.com' && password === 'roshni123') {
    let admin = await Admin.findOne({ email });
    if (!admin) {
      admin = new Admin({ email, password });
      await admin.save();
    }
    const token = jwt.sign({ id: admin._id, type: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return res.json({ token });
  }
  return res.status(401).json({ message: 'Invalid admin credentials' });
});

// Admin stats and tenants endpoint (with user data)
router.get('/stats', async (req, res) => {
  try {
    const [houses, tenants, bookings, owners] = await Promise.all([
      (await import('../models/Property.js')).default.countDocuments(),
      (await import('../models/Member.js')).default.countDocuments(),
      (await import('../models/Booking.js')).default.countDocuments(),
      (await import('../models/Owner.js')).default.countDocuments(),
    ]);
    // Example tenants list (latest 5)
    const latestTenants = await (await import('../models/Member.js')).default.find().sort({ joinedAt: -1 }).limit(5);
    res.json({
      stats: {
        Houses: houses,
        Tenants: tenants,
        Bookings: bookings,
        Owners: owners,
      },
      tenants: latestTenants.map(t => ({
        _id: t._id,
        name: t.name,
        email: t.email,
        date: t.joinedAt,
        paymentInfo: t.paymentInfo,
      })),
    });
  } catch (err) {
    console.error('Error in /api/admin/stats:', err);
    res.status(500).json({ message: 'Failed to fetch admin stats', error: err.message });
  }
});

export default router;
