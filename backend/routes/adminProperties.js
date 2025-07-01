import express from 'express';
import Property from '../models/Property.js';
const router = express.Router();

// Get all properties (with optional status/search filters)
router.get('/', async (req, res) => {
  try {
    const { status, search } = req.query;
    let filter = {};
    if (status && status !== 'all') filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }
    const properties = await Property.find(filter).populate('owner');
    res.json({ properties });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch properties', error: err.message });
  }
});

export default router;
