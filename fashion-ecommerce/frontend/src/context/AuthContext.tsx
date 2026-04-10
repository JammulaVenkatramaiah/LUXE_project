import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authAPI, userAPI } from '../api'

interface User {
  id: string
  name: string
  email: string
  role: string
  phone?: string
  address?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
}

interface AuthContextType {
  user: User | null
  isLoggedIn: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, confirmPassword: string) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        setIsLoggedIn(true)
        try {
          const response = await userAPI.getMe()
          const fullUser = response.data ?? response
          const userObj = {
            id: String(fullUser.id),
            name: fullUser.name,
            email: fullUser.email,
            role: fullUser.role,
            phone: fullUser.phone,
            address: fullUser.address,
            city: fullUser.city,
            state: fullUser.state,
            postalCode: fullUser.postalCode,
            country: fullUser.country
          }
          setUser(userObj)
          localStorage.setItem('user', JSON.stringify(userObj))
        } catch (fetchError) {
          console.error('Failed to fetch user profile:', fetchError)
          // If profile fetch fails, fallback to localStorage but keep login state
          const savedUser = localStorage.getItem('user')
          if (savedUser) {
            setUser(JSON.parse(savedUser))
          }
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setUser(null)
      setIsLoggedIn(false)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password)
      const authData = response.data ?? response
      localStorage.setItem('token', authData.token)
      setIsLoggedIn(true)
      
      // Fetch full profile immediately
      try {
        const userResponse = await userAPI.getMe()
        const fullUser = userResponse.data ?? userResponse
        const userObj = {
          id: String(fullUser.id),
          name: fullUser.name,
          email: fullUser.email,
          role: fullUser.role,
          phone: fullUser.phone,
          address: fullUser.address,
          city: fullUser.city,
          state: fullUser.state,
          postalCode: fullUser.postalCode,
          country: fullUser.country
        }
        localStorage.setItem('user', JSON.stringify(userObj))
        setUser(userObj)
      } catch (err) {
        console.error('Failed to fetch full profile after login:', err)
      }
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const register = async (name: string, email: string, password: string, confirmPassword: string) => {
    try {
      const response = await authAPI.register(name, email, password, confirmPassword)
      const authData = response.data ?? response
      localStorage.setItem('token', authData.token)
      setIsLoggedIn(true)

      // Fetch full profile immediately
      try {
        const userResponse = await userAPI.getMe()
        const fullUser = userResponse.data ?? userResponse
        const userObj = {
          id: String(fullUser.id),
          name: fullUser.name,
          email: fullUser.email,
          role: fullUser.role,
          phone: fullUser.phone,
          address: fullUser.address,
          city: fullUser.city,
          state: fullUser.state,
          postalCode: fullUser.postalCode,
          country: fullUser.country
        }
        localStorage.setItem('user', JSON.stringify(userObj))
        setUser(userObj)
      } catch (err) {
        console.error('Failed to fetch full profile after register:', err)
      }
    } catch (error) {
      console.error('Register failed:', error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setIsLoggedIn(false)
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, isLoading, login, register, logout, checkAuth, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
