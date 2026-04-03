import { Link } from 'react-router-dom'

const AuctionCard = ({ auction }) => {
  const statusConfig = {
    active:   { label: 'LIVE', class: 'bg-green-500/20 text-green-400 border-green-500/30' },
    upcoming: { label: 'SOON', class: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    ended:    { label: 'ENDED', class: 'bg-red-500/20 text-red-400 border-red-500/30' }
  }

  const status = statusConfig[auction.status]

  const timeLeft = () => {
    const now = new Date()
    const end = new Date(auction.endTime)
    const diff = end - now
    if (diff <= 0) return 'Ended'
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    if (hours > 24) return `${Math.floor(hours / 24)}d left`
    if (hours > 0) return `${hours}h ${minutes}m left`
    return `${minutes}m left`
  }

  return (
    <div className="bg-dark-100 border border-white/10 rounded-2xl overflow-hidden hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 group">
      {/* Image */}
      <div className="relative h-48 bg-dark-200 overflow-hidden">
        {auction.image ? (
          <img src={auction.image} alt={auction.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
        ) : (
          <div className="flex items-center justify-center h-full text-5xl opacity-30">🏷️</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-100/80 to-transparent" />
        <span className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full border ${status.class}`}>
          {status.label}
        </span>
        {auction.status === 'active' && (
          <span className="absolute top-3 left-3 flex items-center gap-1.5 text-xs text-green-400">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            Live
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-5">
        <h3 className="text-white font-semibold text-lg mb-1 truncate">{auction.title}</h3>
        <p className="text-slate-500 text-sm mb-4 line-clamp-2">{auction.description}</p>

        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="text-slate-600 text-xs mb-1">Current Price</p>
            <p className="text-primary font-bold text-xl">
              ₹{auction.currentPrice.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-slate-600 text-xs mb-1">Time Left</p>
            <p className="text-white font-semibold text-sm">{timeLeft()}</p>
          </div>
        </div>

        <Link
          to={`/auction/${auction._id}`}
          className={`block text-center py-2.5 rounded-xl text-sm font-semibold transition ${
            auction.status === 'active'
              ? 'bg-primary hover:opacity-90 text-white'
              : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
          }`}
        >
          {auction.status === 'active' ? '⚡ Bid Now' : 'View Details'}
        </Link>
      </div>
    </div>
  )
}

export default AuctionCard