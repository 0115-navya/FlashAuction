import { createContext, useContext, useState, useEffect } from 'react'
import axios from '../utils/axios'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  // On app load, fetch current user if token exists
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await axios.get('/auth/me')
          setUser(res.data)
        } catch (error) {
          // Token expired or invalid
          localStorage.removeItem('token')
          setToken(null)
          setUser(null)
        }
      }
      setLoading(false)
    }
    fetchUser()
  }, [token])

  const login = (userData, userToken) => {
    localStorage.setItem('token', userToken)
    setToken(userToken)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook — makes using context easier
export const useAuth = () => useContext(AuthContext)