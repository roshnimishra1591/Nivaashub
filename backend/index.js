import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import ownerAuthRouter from './routes/ownerAuth.js';
import adminAuthRouter from './routes/adminAuth.js';
import memberRouter from './routes/member.js';
import authRoutes from './routes/auth.js';
import adminTenantsRouter from './routes/adminTenants.js';
import adminOwnersRouter from './routes/adminOwners.js';
import adminPropertiesRouter from './routes/adminProperties.js';
import adminPaymentsRouter from './routes/adminPayments.js';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/nivaashub', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Auth routes
app.use('/api/auth', authRoutes);
app.use('/api/owner', ownerAuthRouter);
app.use('/api/admin', adminAuthRouter);
app.use('/api/member', memberRouter);
app.use('/api/admin/tenants', adminTenantsRouter);
app.use('/api/admin/owners', adminOwnersRouter);
app.use('/api/admin/properties', adminPropertiesRouter);
app.use('/api/admin/payments', adminPaymentsRouter);

// Serve uploaded images statically
app.use('/uploads', express.static(path.resolve('uploads')));

// Placeholder for other routes (About, Contact, Rooms, Services)
app.get('/api/about', (req, res) => res.json({ message: 'About Us info' }));
app.get('/api/contact', (req, res) => res.json({ message: 'Contact info' }));
app.get('/api/rooms', (req, res) => res.json({ message: 'Rooms info' }));
app.get('/api/services', (req, res) => res.json({ message: 'Services info' }));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
