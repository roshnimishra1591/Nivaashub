// Route: GET /api/admin/tenants/recent
// Returns the 5 most recent tenants (members)
import express from 'express';
import Member from '../models/Member.js';
import User from '../models/User.js';
const router = express.Router();

router.get('/recent', async (req, res) => {
  try {
    const tenants = await Member.find().sort({ joinedAt: -1 }).limit(5);
    res.json({ tenants });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch recent tenants', error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    // Try Member collection first
    let tenant = await Member.findById(req.params.id);
    if (!tenant) {
      // Try User collection if not found in Member
      tenant = await User.findById(req.params.id);
    }
    if (!tenant) return res.status(404).json({ message: 'Tenant not found' });
    res.json({ tenant });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tenant', error: err.message });
  }
});

// Get all tenants (users with isMember: true) and all members, and also users who have not taken membership
router.get('/', async (req, res) => {
  try {
    const { status, search } = req.query;
    let userFilter = {};
    let memberFilter = {};
    if (status === 'active') {
      userFilter.isActive = true;
      memberFilter.isActive = true;
    }
    if (status === 'inactive') {
      userFilter.isActive = false;
      memberFilter.isActive = false;
    }
    if (search) {
      userFilter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
      memberFilter.$or = [
        { memberName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    // Get all users (members and non-members)
    const users = await User.find(userFilter);
    const members = await Member.find(memberFilter);
    // Normalize member fields to match user fields for frontend
    const normalizedMembers = members.map(m => ({
      _id: m._id,
      name: m.memberName,
      email: m.email,
      phone: m.phoneNumber,
      isActive: m.isActive !== undefined ? m.isActive : true,
      createdAt: m.joinedAt,
      ...m._doc
    }));
    // Filter users: if a member exists with the same email, do not include the user
    const memberEmails = new Set(normalizedMembers.map(m => m.email));
    const filteredUsers = users.filter(u => !memberEmails.has(u.email));
    const tenants = [
      ...normalizedMembers,
      ...filteredUsers
    ];
    res.json({ tenants });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tenants', error: err.message });
  }
});

export default router;
