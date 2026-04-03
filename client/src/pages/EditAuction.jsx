import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from '../utils/axios'

const EditAuction = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [formData, setFormData] = useState({
    title: '', description: '', image: '',
    startingPrice: '', startTime: '', endTime: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  // Load existing auction data
  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const res = await axios.get(`/auctions/${id}`)
        const a = res.data.auction
        setFormData({
          title: a.title,
          description: a.description,
          image: a.image || '',
          startingPrice: a.startingPrice,
          startTime: new Date(a.startTime).toISOString().slice(0, 16),
          endTime: new Date(a.endTime).toISOString().slice(0, 16)
        })
      } catch (err) {
        setError('Failed to load auction')
      } finally {
        setFetching(false)
      }
    }
    fetchAuction()
  }, [id])

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await axios.put(`/auctions/${id}`, formData)
      navigate(`/auction/${id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, border: '2px solid rgba(255,45,85,0.2)', borderTop: '2px solid #ff2d55', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  const inputClass = "w-full bg-dark-200 border border-white/10 text-white placeholder-slate-600 px-4 py-3 rounded-xl outline-none focus:border-primary transition text-sm"
  const labelClass = "text-slate-500 text-xs font-medium block mb-2 tracking-widest"

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', padding: '3rem 1.5rem' }} className="bg-grid">
      <div style={{ maxWidth: 640, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <button
            onClick={() => navigate(`/auction/${id}`)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#4a5568',
              cursor: 'pointer',
              fontSize: '0.875rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontFamily: 'Outfit, sans-serif'
            }}
            className="hover:text-white transition-colors"
          >
            ← Back to Auction
          </button>
          <h1 style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 800,
            fontSize: '2.2rem',
            color: 'white',
            letterSpacing: '-1px'
          }}>Edit Auction</h1>
          <p style={{ color: '#4a5568', marginTop: 6, fontSize: '0.9rem' }}>
            Update auction details
          </p>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '24px',
          padding: '2.5rem',
          backdropFilter: 'blur(20px)'
        }}>
          {error && (
            <div style={{
              background: 'rgba(255,45,85,0.08)',
              border: '1px solid rgba(255,45,85,0.2)',
              borderRadius: '10px',
              padding: '0.75rem 1rem',
              color: '#ff2d55',
              fontSize: '0.85rem',
              marginBottom: '1.5rem'
            }}>⚠ {error}</div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            <div>
              <label className={labelClass}>TITLE</label>
              <input className={inputClass} type="text" name="title"
                placeholder="Auction title"
                value={formData.title} onChange={handleChange} required />
            </div>

            <div>
              <label className={labelClass}>DESCRIPTION</label>
              <textarea className={`${inputClass} resize-none`}
                name="description"
                placeholder="Describe the item..."
                value={formData.description} onChange={handleChange}
                required rows={4} />
            </div>

            <div>
              <label className={labelClass}>IMAGE URL</label>
              <input className={inputClass} type="url" name="image"
                placeholder="https://example.com/image.jpg"
                value={formData.image} onChange={handleChange} />
              {/* Image preview */}
              {formData.image && (
                <div style={{
                  marginTop: '0.75rem',
                  height: 160,
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.08)'
                }}>
                  <img
                    src={formData.image}
                    alt="Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => e.target.style.display = 'none'}
                  />
                </div>
              )}
            </div>

            <div>
              <label className={labelClass}>STARTING PRICE (₹)</label>
              <input className={inputClass} type="number" name="startingPrice"
                placeholder="5000"
                value={formData.startingPrice} onChange={handleChange}
                min="1" required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className={labelClass}>START TIME</label>
                <input className={inputClass} type="datetime-local" name="startTime"
                  value={formData.startTime} onChange={handleChange} required />
              </div>
              <div>
                <label className={labelClass}>END TIME</label>
                <input className={inputClass} type="datetime-local" name="endTime"
                  value={formData.endTime} onChange={handleChange} required />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => navigate(`/auction/${id}`)}
                style={{
                  flex: 1,
                  padding: '0.85rem',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  color: '#4a5568',
                  cursor: 'pointer',
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s'
                }}
                className="hover:text-white hover:border-white/20"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ flex: 2, fontSize: '0.95rem' }}
              >
                {loading ? 'Saving...' : '✓ Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditAuction