import { Schema, model } from 'mongoose';

const bidSchema = new Schema({
  auction: {
    type: Schema.Types.ObjectId,
    ref: 'Auction',
    required: true
  },
  bidder: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 1
  }
}, { timestamps: true });

export default model('Bid', bidSchema);