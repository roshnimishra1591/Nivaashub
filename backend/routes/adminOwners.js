import express from 'express';
import Owner from '../models/Owner.js';
const router = express.Router();

// Get all owners (with optional status/search filters)
router.get('/', async (req, res) => {
  try {
    const { status, search } = req.query;
    let filter = {};
    if (status === 'active') filter.isActive = true;
    if (status === 'inactive') filter.isActive = false;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    const owners = await Owner.find(filter);
    res.json({ owners });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch owners', error: err.message });
  }
});

export default router;
