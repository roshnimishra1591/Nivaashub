import express from 'express';
import Payment from '../models/Payment.js';
import Property from '../models/Property.js';
import User from '../models/User.js';
import Member from '../models/Member.js';
const router = express.Router();

// GET /api/admin/payments
// Query params: status, search
router.get('/', async (req, res) => {
  try {
    const { status, search } = req.query;
    let filter = {};
    if (status && status !== 'all') filter.status = status;
    if (search) {
      filter.$or = [
        { transactionId: { $regex: search, $options: 'i' } },
        { payerName: { $regex: search, $options: 'i' } },
        { propertyName: { $regex: search, $options: 'i' } }
      ];
    }
    // Populate payer (User or Member) and property
    const payments = await Payment.find(filter)
      .sort({ createdAt: -1 })
      .populate({ path: 'payerId', model: function(doc) { return doc.payerModel; } })
      .populate('propertyId');
    // Map to include member payment data
    const mapped = payments.map(payment => {
      let payer = payment.payerId;
      let payerName = payment.payerName || (payer ? (payer.name || payer.memberName || payer.email) : 'N/A');
      let propertyName = payment.propertyName || (payment.propertyId ? payment.propertyId.title : 'N/A');
      // If payer is a Member, show membership payment info
      let membershipPlan = undefined;
      let memberPaymentMethod = undefined;
      let memberPaymentDetails = undefined;
      if (payer && payer.memberName) {
        membershipPlan = payer.membershipPlan;
        memberPaymentMethod = payer.paymentMethod;
        memberPaymentDetails = payer.paymentDetails;
      }
      return {
        _id: payment._id,
        transactionId: payment.transactionId,
        amount: payment.amount,
        payerName,
        payerEmail: payer ? (payer.email) : undefined,
        propertyName,
        status: payment.status,
        paymentMethod: payment.paymentMethod || memberPaymentMethod,
        paymentDetails: payment.paymentDetails || memberPaymentDetails,
        membershipPlan,
        createdAt: payment.createdAt,
      };
    });
    res.json({ payments: mapped });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch payments', error: err.message });
  }
});

export default router;
