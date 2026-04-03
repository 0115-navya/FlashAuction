import Auction from '../models/Auction.js'
import Bid from '../models/Bid.js'

const auctionSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`)

    // User joins an auction room
    socket.on('join_auction', (auctionId) => {
      socket.join(auctionId)
      console.log(`Socket ${socket.id} joined auction: ${auctionId}`)
    })

    // User leaves an auction room
    socket.on('leave_auction', (auctionId) => {
      socket.leave(auctionId)
      console.log(`Socket ${socket.id} left auction: ${auctionId}`)
    })

    // Real-time bid placement
    socket.on('place_bid', async ({ auctionId, amount, bidderId, bidderName }) => {
      try {
        const auction = await Auction.findById(auctionId)

        // Validations
        if (!auction) {
          socket.emit('bid_error', { message: 'Auction not found' })
          return
        }
        if (auction.status !== 'active') {
          socket.emit('bid_error', { message: 'Auction is not active' })
          return
        }
        if (amount <= auction.currentPrice) {
          socket.emit('bid_error', {
            message: `Bid must be higher than ₹${auction.currentPrice}`
          })
          return
        }
        if (auction.createdBy.toString() === bidderId) {
          socket.emit('bid_error', { message: 'Cannot bid on your own auction' })
          return
        }

        // Save bid to DB
        const bid = await Bid.create({
          auction: auctionId,
          bidder: bidderId,
          amount
        })

        // Update auction current price
        auction.currentPrice = amount
        await auction.save()

        // Broadcast to everyone in this auction room
        const bidData = {
          _id: bid._id,
          amount: bid.amount,
          bidder: { _id: bidderId, name: bidderName },
          createdAt: bid.createdAt||new Date().toISOString(),
          currentPrice: amount
        }

        // Emit to ALL users in the room (including sender)
        io.to(auctionId).emit('bid_placed', bidData)

        console.log(`New bid: ₹${amount} on auction ${auctionId} by ${bidderName}`)

      } catch (error) {
        socket.emit('bid_error', { message: 'Server error placing bid' })
        console.error('Socket bid error:', error)
      }
    })

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`)
    })
  })
}

export default auctionSocket