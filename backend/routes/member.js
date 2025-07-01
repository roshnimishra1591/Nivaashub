import express from 'express';
import Member from '../models/Member.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
const router = express.Router();

// Add a new member (called after payment)
router.post('/add', async (req, res) => {
  try {
    const {
      memberName,
      email,
      phoneNumber,
      address,
      membershipPlan,
      amountPaid,
      paymentMethod,
      paymentDetails
    } = req.body;
    if (!memberName || !email || !membershipPlan || !amountPaid || !paymentMethod) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    // Ensure the email exists in the users collection
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User does not exist' });
    }
    let member = await Member.findOne({ email });
    if (member) {
      return res.status(400).json({ message: 'Already a member' });
    }
    member = new Member({
      memberName: user.name, // Always use the name from User
      email: user.email,     // Always use the email from User
      phoneNumber,
      address,
      membershipPlan,
      amountPaid,
      paymentMethod,
      paymentDetails
    });
    await member.save();
    // Set isMember to true for the user
    user.isMember = true;
    await user.save();
    res.json({ success: true, message: 'Membership successful', member });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Check membership status by email
router.get('/status', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ member: false });
  const member = await Member.findOne({ email });
  // Also update isMember in User collection for consistency
  const user = await User.findOne({ email });
  if (user) {
    user.isMember = !!member;
    await user.save();
  }
  if (member) {
    res.json({ member: true, membershipPlan: member.membershipPlan, joinedAt: member.joinedAt });
  } else {
    res.json({ member: false });
  }
});

// Cleanup orphan members: Remove members whose user does not exist
router.post('/cleanup-orphan-members', async (req, res) => {
  try {
    const members = await Member.find({});
    let deletedCount = 0;
    for (const member of members) {
      const user = await User.findOne({ email: member.email });
      if (!user) {
        await Member.deleteOne({ _id: member._id });
        deletedCount++;
      }
    }
    res.json({ success: true, deletedCount });
  } catch (err) {
    res.status(500).json({ message: 'Cleanup failed' });
  }
});

// Watch for user deletions and remove orphan members automatically
// Only set up the watcher once
if (mongoose.connection.readyState === 1) {
  const userModel = mongoose.model('User');
  userModel.watch().on('change', async (change) => {
    if (change.operationType === 'delete') {
      const deletedEmail = change.documentKey && change.documentKey._id
        ? (await userModel.findById(change.documentKey._id)).email
        : null;
      if (deletedEmail) {
        await Member.deleteOne({ email: deletedEmail });
      } else {
        // Fallback: scan all members and remove those without a user
        const members = await Member.find({});
        for (const member of members) {
          const user = await userModel.findOne({ email: member.email });
          if (!user) {
            await Member.deleteOne({ _id: member._id });
          }
        }
      }
    }
  });
}

export default router;
