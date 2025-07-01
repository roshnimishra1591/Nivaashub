import mongoose from 'mongoose';

const ownerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  properties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
});

const Owner = mongoose.model('Owner', ownerSchema);
export default Owner;
