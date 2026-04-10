import { useNavigate, Link } from 'react-router-dom'
import { ShoppingCart, Heart, User, Menu, X, Search, Moon, Sun, LogIn, ClipboardList } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

interface NavbarProps {
  isDark: boolean
  toggleTheme: () => void
}

export default function Navbar({ isDark, toggleTheme }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const { isLoggedIn, user } = useAuth()
  const { cartCount } = useCart()
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'ROLE_ADMIN'

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setIsMenuOpen(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-black'} shadow-lg`} role="navigation" aria-label="Main Navigation">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-3xl font-bold font-serif tracking-wider hover:text-accent transition-colors" aria-label="LUXE Home Page">
          LUXE
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center">
          <Link to="/products" className="hover:text-accent transition-colors font-medium">Collections</Link>
          <Link to="/products?category=men" className="hover:text-accent transition-colors">Men</Link>
          <Link to="/products?category=women" className="hover:text-accent transition-colors">Women</Link>
          <Link to="/products?category=accessories" className="hover:text-accent transition-colors">Accessories</Link>
        </div>

        {/* Search Bar */}
        <div className="hidden lg:flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-transparent outline-none w-40 text-sm"
          />
          <Search size={18} className="text-gray-500 cursor-pointer hover:text-accent transition-colors" onClick={() => handleSearch()} />
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-6">
          <button 
            onClick={toggleTheme} 
            className="hover:text-accent transition-colors"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Light Mode" : "Dark Mode"}
          >
            {isDark ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
          </button>
          
          {/* Login/Register or Profile Icon */}
          {isLoggedIn ? (
            <Link to="/profile" className="hover:text-accent transition-colors" title="Profile" aria-label="User Profile">
              <User size={20} aria-hidden="true" />
            </Link>
          ) : (
            <Link to="/login" className="hover:text-accent transition-colors" title="Login" aria-label="Sign In">
              <LogIn size={20} aria-hidden="true" />
            </Link>
          )}
          
          <Link to="#" className="hover:text-accent transition-colors" aria-label="Wishlist" title="Wishlist">
            <Heart size={20} aria-hidden="true" />
          </Link>
          {isAdmin ? (
            <Link to="/admin/orders" className="hover:text-accent transition-colors" aria-label="View Orders" title="Order Requests">
              <ClipboardList size={20} aria-hidden="true" />
            </Link>
          ) : (
            <Link to="/cart" className="hover:text-accent transition-colors relative" aria-label={`View Cart, ${cartCount} items`} title="Shopping Cart">
              <ShoppingCart size={20} aria-hidden="true" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center" aria-hidden="true">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="md:hidden"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div id="mobile-menu" className={`md:hidden ${isDark ? 'bg-gray-800' : 'bg-gray-50'} border-t`} role="region" aria-label="Mobile menu links">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link to="/products" className="hover:text-accent transition-colors">Collections</Link>
            <Link to="/products?category=men" className="hover:text-accent transition-colors">Men</Link>
            <Link to="/products?category=women" className="hover:text-accent transition-colors">Women</Link>
            <Link to="/products?category=accessories" className="hover:text-accent transition-colors">Accessories</Link>
            {isLoggedIn ? (
              <Link to="/profile" className="btn-primary text-center">Profile</Link>
            ) : (
              <Link to="/login" className="btn-primary text-center">Sign In</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
