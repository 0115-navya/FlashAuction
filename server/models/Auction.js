import { Schema, model } from 'mongoose';

const auctionSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: '',
    required: true
  },
  startingPrice: {
    type: Number,
    required: true,
    min: 1
  },
  currentPrice: {
    type: Number,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['upcoming', 'active', 'ended'],
    default: 'upcoming'
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  winner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, { timestamps: true });

export default model('Auction', auctionSchema);