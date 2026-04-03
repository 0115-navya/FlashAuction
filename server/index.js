import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import auctionSocket from './socket/auctionSocket.js';
import auctionRoutes from './routes/auctionRoutes.js';

dotenv.config();

const app = express();

// ✅ Middleware FIRST
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// ✅ Routes
app.use('/api/auctions', auctionRoutes);

// ✅ Create server AFTER app setup
const server = createServer(app);

// ✅ Socket
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

auctionSocket(io);

// ✅ DB + server start
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    const PORT = process.env.PORT || 5000;

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Mongo DB connection failed:", err);
    process.exit(1);
  });

