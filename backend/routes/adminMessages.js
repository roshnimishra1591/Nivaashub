import express from 'express';
import mongoose from 'mongoose';

// Simple Message schema (customize as needed)
const messageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  email: { type: String },
  subject: { type: String },
  content: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

const router = express.Router();

// GET /api/admin/messages - get all messages (admin only)
router.get('/', async (req, res) => {
  try {
    // You may want to add admin authentication here
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json({ messages });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch messages', error: err.message });
  }
});

// PUT /api/admin/messages/:id/read - mark as read
router.put('/:id/read', async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!message) return res.status(404).json({ message: 'Message not found' });
    res.json({ message: 'Marked as read', data: message });
  } catch (err) {
    res.status(500).json({ message: 'Failed to mark as read', error: err.message });
  }
});

// POST /api/admin/messages - create a new message
router.post('/', async (req, res) => {
  try {
    const { sender, email, subject, content } = req.body;
    if (!sender || !content) {
      return res.status(400).json({ message: 'Sender and content are required.' });
    }
    const message = new Message({ sender, email, subject, content });
    await message.save();
    res.status(201).json({ message: 'Message sent successfully', data: message });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send message', error: err.message });
  }
});

export default router;
