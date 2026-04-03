import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-dark-100 border-b border-white/10 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-primary flex items-center gap-2">
          ⚡ Flash Auction
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/" className="text-slate-300 hover:text-white text-sm transition">
            Auctions
          </Link>
          {user ? (
            <>
              <Link to="/dashboard" className="text-slate-300 hover:text-white text-sm transition">
                Dashboard
              </Link>
              {user.role === 'admin' && (
                <Link to="/create-auction"
                  className="text-slate-300 hover:text-white text-sm transition">
                  + Create
                </Link>
              )}
              <span className="text-slate-500 text-sm">Hi, {user.name}</span>
              <button
                onClick={handleLogout}
                className="border border-primary text-primary hover:bg-primary hover:text-white px-4 py-1.5 rounded-lg text-sm transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-300 hover:text-white text-sm transition">
                Login
              </Link>
              <Link to="/register"
                className="bg-primary hover:opacity-90 text-white px-4 py-1.5 rounded-lg text-sm transition">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar