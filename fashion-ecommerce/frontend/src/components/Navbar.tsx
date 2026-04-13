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
  const [isSearchOpen, setIsSearchOpen] = useState(false)
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
      setIsSearchOpen(false)
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
        <Link to="/" className="text-3xl font-bold font-serif tracking-wider hover:text-accent transition-colors shrink-0" aria-label="LUXE Home Page">
          LUXE
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center mx-4 overflow-hidden">
          {!isSearchOpen && (
            <>
              <Link to="/products" className="hover:text-accent transition-colors font-medium whitespace-nowrap">Collections</Link>
              <Link to="/products?category=men" className="hover:text-accent transition-colors whitespace-nowrap">Men</Link>
              <Link to="/products?category=women" className="hover:text-accent transition-colors whitespace-nowrap">Women</Link>
              <Link to="/products?category=accessories" className="hover:text-accent transition-colors whitespace-nowrap">Accessories</Link>
            </>
          )}
        </div>

        {/* Right Section: Search & Icons */}
        <div className="flex items-center gap-4 flex-1 justify-end">
          {/* Search Bar */}
          <div className="flex items-center relative gap-2">
            <div className={`flex items-center bg-gray-100 dark:bg-gray-800 rounded-full transition-all duration-300 ease-in-out overflow-hidden ${isSearchOpen ? 'w-48 md:w-64 px-4 py-2 opacity-100' : 'w-0 opacity-0'}`}>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus={isSearchOpen}
                className="bg-transparent outline-none w-full text-sm"
              />
            </div>
            
            <button 
              onClick={() => {
                if (isSearchOpen && searchQuery.trim()) {
                  handleSearch()
                } else {
                  setIsSearchOpen(!isSearchOpen)
                }
              }}
              className="hover:text-accent transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle search"
            >
              <Search size={20} className="text-gray-500 hover:text-accent transition-colors" />
            </button>

            {isSearchOpen && (
              <button 
                onClick={() => {
                  setIsSearchOpen(false)
                  setSearchQuery('')
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                title="Close search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <button 
              onClick={toggleTheme} 
              className="hover:text-accent transition-colors p-2"
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {isLoggedIn ? (
              <Link to="/profile" className="hover:text-accent transition-colors p-2" title="Profile">
                <User size={20} />
              </Link>
            ) : (
              <Link to="/login" className="hover:text-accent transition-colors p-2" title="Login">
                <LogIn size={20} />
              </Link>
            )}
            
            {isAdmin ? (
              <Link to="/admin/orders" className="hover:text-accent transition-colors p-2" title="Orders">
                <ClipboardList size={20} />
              </Link>
            ) : (
              <Link to="/cart" className="hover:text-accent transition-colors relative p-2" title="Cart">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="md:hidden p-2"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
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
