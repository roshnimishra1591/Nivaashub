import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  transactionId: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  payerId: { type: mongoose.Schema.Types.ObjectId, refPath: 'payerModel', required: true },
  payerModel: { type: String, enum: ['User', 'Member'], required: true },
  payerName: { type: String },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  propertyName: { type: String },
  status: { type: String, enum: ['completed', 'pending', 'failed'], default: 'pending' },
  paymentMethod: { type: String },
  paymentDetails: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now }
});

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
