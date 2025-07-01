import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner', required: true },
  title: { type: String, required: true },
  description: String,
  address: String,
  price: { type: Number, required: true },
  images: [String],
  type: { type: String, default: 'Apartment' },
  bedrooms: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now }
});

const Property = mongoose.model('Property', propertySchema);

export default Property;
