import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  memberName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String },
  address: { type: String },
  membershipPlan: { type: String, required: true },
  amountPaid: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  paymentDetails: { type: mongoose.Schema.Types.Mixed }, // Store any payment info (card, esewa, khalti, etc)
  joinedAt: { type: Date, default: Date.now },
});

const Member = mongoose.model('Member', memberSchema);
export default Member;
