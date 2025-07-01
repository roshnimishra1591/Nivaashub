import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isMember: { type: Boolean, default: false }, // Add isMember field
}, { timestamps: true });

export default mongoose.model('User', userSchema);
