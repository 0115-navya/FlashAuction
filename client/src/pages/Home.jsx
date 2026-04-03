import { useState, useEffect } from 'react'
import axios from '../utils/axios'
import AuctionCard from '../components/AuctionCard'

const Home = () => {
  const [auctions, setAuctions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const res = await axios.get('/auctions')
        setAuctions(res.data)
      } catch (error) {
        console.error('Failed to fetch auctions', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAuctions()
  }, [])

  const filtered = filter === 'all'
    ? auctions
    : auctions.filter(a => a.status === filter)

  const filters = ['all', 'active', 'upcoming', 'ended']

  return (
    <div className="min-h-screen bg-[#0d0d1a]">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-dark-100 via-dark-200 to-dark-300 py-20 px-6 text-center">
        <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-block bg-primary/10 border border-primary/30 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
            Live Auctions
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            ⚡ Flash <span className="text-primary">Auctions</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-md mx-auto">
            Bid fast. Win big. Every second counts.
          </p>
        </div>
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Filters */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-full text-sm font-medium border transition ${
                filter === f
                  ? 'bg-primary border-primary text-white'
                  : 'border-white/10 text-slate-400 hover:border-white/30 hover:text-white'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-slate-500 py-20 text-lg">No auctions found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(auction => (
              <AuctionCard key={auction._id} auction={auction} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home