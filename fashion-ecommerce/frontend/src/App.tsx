import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ChatWidget from './components/chat/ChatWidget'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import Profile from './pages/Profile'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import AdminDashboard from './pages/Admin/Dashboard'
import AdminOrders from './pages/Admin/AdminOrders'
import { useAuth } from './context/AuthContext'
import './App.css'

function App() {
  const [isDark, setIsDark] = useState(false)
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'ROLE_ADMIN'

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    setIsDark(savedTheme === 'dark')
    applyTheme(savedTheme === 'dark')
  }, [])

  const applyTheme = (dark: boolean) => {
    if (dark) {
      document.body.classList.add('dark-mode')
      document.body.classList.remove('light-mode')
    } else {
      document.body.classList.add('light-mode')
      document.body.classList.remove('dark-mode')
    }
  }

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
    applyTheme(newTheme)
  }

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className={`${isDark ? 'dark' : ''} min-h-screen`}>
        <Navbar isDark={isDark} toggleTheme={toggleTheme} />
        
        <main className="pt-20 pb-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={isAdmin ? <Navigate to="/admin/orders" replace /> : <Cart />} />
            <Route path="/checkout" element={isAdmin ? <Navigate to="/admin/orders" replace /> : <Checkout />} />
            <Route path="/order-success/:id" element={<OrderSuccess />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
          </Routes>
        </main>

        <Footer />
        <ChatWidget />
        <Toaster position="top-right" />
      </div>
    </Router>
  )
}

export default App
