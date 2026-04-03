import express, { json } from 'express';
import { createServer } from 'http';
import {Server} from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';


import authRoutes from './routes/authRoutes.js';
import auctionRoutes from './routes/auctionRoutes.js';
import dotenv from 'dotenv';
import auctionSocket from './socket/auctionSocket.js';
dotenv.config();
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});
auctionSocket(io)
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
   server.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.log("Mongo DB connection failed!", err);
  });
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(json());


app.use('/api/auth', authRoutes);
app.use('/api/auctions', auctionRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Auction API');
});

