import express from 'express';
import mongoose from 'mongoose';
import Review from '../models/Review.js';
import Property from '../models/Property.js';

const router = express.Router();

// GET property with the most reviews, but return a random review on each refresh
router.get('/top-reviewed', async (req, res) => {
  try {
    // Aggregate to find property with most reviews
    const top = await Review.aggregate([
      { $group: { _id: '$propertyId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);
    if (!top.length) return res.json({ property: null, reviews: [] });
    const propertyId = top[0]._id;
    const property = await Property.findById(propertyId);
    const reviews = await Review.find({ propertyId }).sort({ createdAt: -1 });
    // Shuffle reviews and return them in a random order each time
    const shuffled = reviews.sort(() => Math.random() - 0.5);
    res.json({ property, reviews: shuffled });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch top reviewed property', error: err.message });
  }
});

export default router;
