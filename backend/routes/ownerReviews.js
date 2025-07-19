import express from 'express';
import mongoose from 'mongoose';
import OwnerReview from '../models/OwnerReview.js';

const router = express.Router();

// GET all reviews for an owner
router.get('/:ownerId', async (req, res) => {
  try {
    const reviews = await OwnerReview.find({ ownerId: req.params.ownerId }).sort({ createdAt: -1 });
    res.json({ reviews });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch owner reviews', error: err.message });
  }
});

// POST a new review for an owner
router.post('/:ownerId', async (req, res) => {
  try {
    const { rating, comment, reviewerName } = req.body;
    if (!rating || !comment) {
      return res.status(400).json({ message: 'Rating and comment are required.' });
    }
    const review = new OwnerReview({
      ownerId: req.params.ownerId,
      reviewerName: reviewerName || 'Anonymous User',
      rating,
      comment
    });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ message: 'Failed to submit owner review', error: err.message });
  }
});

export default router;
