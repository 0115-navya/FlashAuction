import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../utils/axios'

const CreateAuction = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '', description: '', image: '',
    startingPrice: '', startTime: '', endTime: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await axios.post('/auctions/create-auction', formData)
      navigate(`/auction/${res.data._id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create auction')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full bg-dark-200 border border-white/10 text-white placeholder-slate-600 px-4 py-3 rounded-xl outline-none focus:border-primary transition text-sm"
  const labelClass = "text-slate-400 text-sm mb-1.5 block"

  return (
    <div className="min-h-screen bg-[#0d0d1a] py-10 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-white text-3xl font-bold">Create Auction</h1>
          <p className="text-slate-500 mt-1 text-sm">List a new item for bidding</p>
        </div>

        <div className="bg-dark-100 border border-white/10 rounded-2xl p-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={labelClass}>Auction Title *</label>
              <input type="text" name="title" placeholder="e.g. Vintage item"
                value={formData.title} onChange={handleChange}
                required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Description *</label>
              <textarea name="description" placeholder="Describe the item..."
                value={formData.description} onChange={handleChange}
                required rows={4}
                className={`${inputClass} resize-none`} />
            </div>
            <div>
              <label className={labelClass}>Image URL *</label>
              <input type="url" name="image" placeholder="https://example.com/image.jpg"
                value={formData.image} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Starting Price (₹) *</label>
              <input type="number" name="startingPrice" placeholder="e.g. 5000"
                value={formData.startingPrice} onChange={handleChange}
                min="1" required className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Start Time *</label>
                <input type="datetime-local" name="startTime"
                  value={formData.startTime} onChange={handleChange}
                  required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>End Time *</label>
                <input type="datetime-local" name="endTime"
                  value={formData.endTime} onChange={handleChange}
                  required className={inputClass} />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => navigate('/created-auction')}
                className="flex-1 border border-white/10 text-slate-400 hover:border-white/30 hover:text-white py-3 rounded-xl text-sm font-medium transition">
                Cancel
              </button>
              <button type="submit" disabled={loading}
                className="flex-2 flex-grow-[2] bg-primary hover:opacity-90 disabled:opacity-50 text-white py-3 rounded-xl font-bold text-sm transition">
                {loading ? 'Creating...' : '⚡ Create Auction'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateAuction