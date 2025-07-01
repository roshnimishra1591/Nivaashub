# Nivaashub Backend

## Setup

1. Install dependencies:
   ```sh
   npm install express mongoose cors bcryptjs jsonwebtoken nodemon
   ```
2. Create a `.env` file in `backend/` with:
   ```env
   MONGO_URI=mongodb://localhost:27017/nivaashub
   JWT_SECRET=your_jwt_secret
   ```
3. Start the server:
   ```sh
   npm run dev
   ```

## API Endpoints
- POST `/api/auth/signup` — Signup
- POST `/api/auth/login` — Login
- GET `/api/about` — About Us
- GET `/api/contact` — Contact
- GET `/api/rooms` — Rooms
- GET `/api/services` — Services
