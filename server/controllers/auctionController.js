import Auction from "../models/Auction.js";
import Bid from "../models/Bid.js";

export const createAuction = async (req, res) => {
  try {
    const { title, description, image, startingPrice, startTime, endTime } =
      req.body;

    if (!title || !description || !startingPrice || !startTime || !endTime) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (new Date(endTime) <= new Date(startTime)) {
      return res
        .status(400)
        .json({ message: "End time must be after start time" });
    }

    const auction = await Auction.create({
      title,
      description,
      image,
      startingPrice,
      currentPrice: startingPrice, // currentPrice starts at startingPrice
      startTime,
      endTime,
      createdBy: req.user._id,
    });

    res.status(201).json(auction);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
    console.error("Error creating auction:", error);
  }
};

export const getAllAuctions = async (req, res) => {
  try {
    const now = new Date();
    // Auto-update status based on current time
    await Auction.updateMany(
      { endTime: { $lte: now }, status: { $ne: "ended" } },
      { status: "ended" },
    );
    await Auction.updateMany(
      { startTime: { $lte: now }, endTime: { $gt: now }, status: "upcoming" },
      { status: "active" },
    );

    const auctions = await Auction.find()
      .populate("createdBy", "name email")
      .populate("winner", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(auctions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAuctionById = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("winner", "name email");

    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    // Get all bids for this auction
    const bids = await Bid.find({ auction: req.params.id })
      .populate("bidder", "name")
      .sort({ amount: -1 });

    res.status(200).json({ auction, bids });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const placeBid = async (req, res) => {
  try {
    const { amount } = req.body;
    const { id: auctionId } = req.params;

    if (!amount) {
      return res.status(400).json({ message: "Bid amount is required" });
    }

    const auction = await Auction.findById(auctionId);
    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }
    if (auction.status !== "active") {
      return res.status(400).json({ message: "Auction is not active" });
    }
    if (amount <= auction.currentPrice) {
      return res.status(400).json({
        message: `Bid must be higher than current price: ₹${auction.currentPrice}`,
      });
    }
    if (auction.createdBy.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot bid on your own auction" });
    }

    // Create the bid
    const bid = await Bid.create({
      auction: auctionId,
      bidder: req.user._id,
      amount,
    });
    // Update auction current price
    auction.currentPrice = amount;
    await auction.save();

    const io = req.app.get("io");
    if (io) {
      io.to(auctionId).emit("bid_placed", {
        _id: bid._id,
        amount: bid.amount,
        currentPrice: auction.currentPrice,
        bidder: { _id: req.user._id, name: req.user.name },
        createdAt: bid.createdAt,
      });
    }
    res.status(201).json({
      bid,
      currentPrice: auction.currentPrice,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
    console.error("Error placing bid:", error);
  }
};

export const getMyBids = async (req, res) => {
  try {
    const bids = await Bid.find({ bidder: req.user._id })
      .populate("auction", "title currentPrice status endTime image")
      .sort({ createdAt: -1 });

    res.status(200).json(bids);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const updateAuction = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id)
    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' })
    }
    if (auction.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' })
    }
    const updated = await Auction.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    )
    res.status(200).json(updated)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

