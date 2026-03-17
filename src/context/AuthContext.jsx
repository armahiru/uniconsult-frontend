import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import api from '../services/api'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')
      if (storedToken && storedUser) {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.error('Error loading auth state:', error)
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/api/auth/login', { email, password })
      
      if (data.success) {
        const userObj = {
          email: email,
          name: data.name,
          role: data.role
        }
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(userObj))
        setToken(data.token)
        setUser(userObj)
        toast.success('Login successful!')
        return { success: true, user: userObj }
      } else {
        toast.error(data.message)
        return data
      }
    } catch (error) {
      toast.error('Login failed')
      return { success: false }
    }
  }

  const register = async (userData) => {
    try {
      const { data } = await api.post('/api/auth/register', userData)
      if (data.success) {
        toast.success(data.message || 'Registration successful!')
        return data
      } else {
        toast.error(data.message)
        return data
      }
    } catch (error) {
      toast.error('Registration failed')
      return { success: false }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
    toast.success('Logged out successfully')
  }

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token,
    isStudent: user?.role === 'STUDENT',
    isLecturer: user?.role === 'LECTURER'
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
