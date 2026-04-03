import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from '../utils/axios'

const Dashboard = () => {
  const { user } = useAuth()
  const [bids, setBids] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMyBids = async () => {
      try {
        const res = await axios.get('/auctions/user/mybids')
        setBids(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchMyBids()
  }, [])

  const wonBids = bids.filter(b =>
    b.auction.status === 'ended' && b.auction.currentPrice === b.amount
  )
  const activeBids = bids.filter(b => b.auction.status === 'active')

  const statusConfig = {
    active:   'bg-green-500/20 text-green-400',
    upcoming: 'bg-amber-500/20 text-amber-400',
    ended:    'bg-red-500/20 text-red-400'
  }

  return (
    <div className="min-h-screen bg-[#0d0d1a] py-10 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-white text-3xl font-bold">My Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back, <span className="text-slate-300">{user?.name}</span></p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Total Bids', value: bids.length, color: 'text-white' },
            { label: 'Active Bids', value: activeBids.length, color: 'text-green-400' },
            { label: 'Auctions Won 🏆', value: wonBids.length, color: 'text-amber-400' }
          ].map((s, i) => (
            <div key={i} className="bg-dark-100 border border-white/10 rounded-2xl p-6 text-center">
              <p className={`text-4xl font-bold mb-2 ${s.color}`}>{s.value}</p>
              <p className="text-slate-500 text-sm">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Won Auctions */}
        {wonBids.length > 0 && (
          <div className="mb-10">
            <h2 className="text-white font-bold text-lg mb-4">🏆 Auctions Won</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {wonBids.map(bid => (
                <Link key={bid._id} to={`/auction/${bid.auction._id}`}
                  className="bg-dark-100 border border-amber-500/30 rounded-2xl p-5 hover:-translate-y-1 transition-all">
                  <h3 className="text-white font-semibold mb-1">{bid.auction.title}</h3>
                  <p className="text-slate-500 text-xs mb-3">Winning Bid</p>
                  <p className="text-primary font-bold text-xl">₹{bid.amount.toLocaleString()}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* All Bids Table */}
        <div>
          <h2 className="text-white font-bold text-lg mb-4">All My Bids</h2>
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : bids.length === 0 ? (
            <div className="bg-dark-100 border border-white/10 rounded-2xl p-12 text-center">
              <p className="text-slate-500 mb-4">You haven't placed any bids yet.</p>
              <Link to="/" className="bg-primary hover:opacity-90 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition">
                Browse Auctions
              </Link>
            </div>
          ) : (
            <div className="bg-dark-100 border border-white/10 rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-slate-500 text-xs font-medium px-6 py-4">Auction</th>
                    <th className="text-left text-slate-500 text-xs font-medium px-6 py-4">Your Bid</th>
                    <th className="text-left text-slate-500 text-xs font-medium px-6 py-4">Current</th>
                    <th className="text-left text-slate-500 text-xs font-medium px-6 py-4">Status</th>
                    <th className="text-left text-slate-500 text-xs font-medium px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {bids.map(bid => (
                    <tr key={bid._id} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className="px-6 py-4 text-white text-sm font-medium">{bid.auction.title}</td>
                      <td className="px-6 py-4 text-primary font-bold text-sm">₹{bid.amount.toLocaleString()}</td>
                      <td className="px-6 py-4 text-slate-400 text-sm">₹{bid.auction.currentPrice.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusConfig[bid.auction.status]}`}>
                          {bid.auction.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link to={`/auction/${bid.auction._id}`}
                          className="text-primary hover:underline text-xs font-semibold">
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard