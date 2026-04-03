import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from '../utils/axios'

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await axios.post('/auth/register', formData)
      login(res.data.user, res.data.token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0d0d1a] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">⚡ Flash Auction</h1>
          <p className="text-slate-500 mt-2 text-sm">Create your account and start bidding</p>
        </div>

        <div className="bg-dark-100 border border-white/10 rounded-2xl p-8">
          <h2 className="text-white text-2xl font-bold mb-6">Create Account</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-slate-400 text-sm mb-1.5 block">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Navya Jain"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-dark-200 border border-white/10 text-white placeholder-slate-600 px-4 py-3 rounded-xl outline-none focus:border-primary transition text-sm"
              />
            </div>
            <div>
              <label className="text-slate-400 text-sm mb-1.5 block">Email</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-dark-200 border border-white/10 text-white placeholder-slate-600 px-4 py-3 rounded-xl outline-none focus:border-primary transition text-sm"
              />
            </div>
            <div>
              <label className="text-slate-400 text-sm mb-1.5 block">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Min 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-dark-200 border border-white/10 text-white placeholder-slate-600 px-4 py-3 rounded-xl outline-none focus:border-primary transition text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:opacity-90 disabled:opacity-50 text-white py-3 rounded-xl font-semibold text-sm transition mt-2"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-slate-500 text-sm text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register