import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Navbar from '../components/Navbar'
import { BrowserRouter } from 'react-router-dom'

// Mock context values
const mockAuthValue = {
  isLoggedIn: false,
  user: null,
  login: vi.fn(),
  logout: vi.fn()
}

const mockCartValue = {
  cart: null,
  cartCount: 0,
  addToCart: vi.fn(),
  removeFromCart: vi.fn(),
  isLoading: false
}

// Partially mock useAuth and useCart
vi.mock('../context/AuthContext', () => ({
  useAuth: () => mockAuthValue,
  AuthProvider: ({ children }: any) => <>{children}</>
}))

vi.mock('../context/CartContext', () => ({
  useCart: () => mockCartValue,
  CartProvider: ({ children }: any) => <>{children}</>
}))

const renderNavbar = (isDark = false, toggleTheme = vi.fn()) => {
  return render(
    <BrowserRouter>
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />
    </BrowserRouter>
  )
}

describe('Navbar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAuthValue.isLoggedIn = false
    mockAuthValue.user = null
    mockCartValue.cartCount = 0
  })

  it('renders logo correctly', () => {
    renderNavbar()
    expect(screen.getByText('LUXE')).toBeInTheDocument()
  })

  it('shows login icon when not logged in', () => {
    renderNavbar()
    expect(screen.getByLabelText('Sign In')).toBeInTheDocument()
  })

  it('shows profile icon when logged in', () => {
    mockAuthValue.isLoggedIn = true
    renderNavbar()
    expect(screen.getByLabelText('User Profile')).toBeInTheDocument()
  })

  it('toggles mobile menu on click', () => {
    renderNavbar()
    const menuBtn = screen.getByLabelText('Open menu')
    fireEvent.click(menuBtn)
    expect(screen.getByLabelText('Close menu')).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /mobile menu/i })).toBeInTheDocument()
  })

  it('calls toggleTheme when theme button is clicked', () => {
    const toggleTheme = vi.fn()
    renderNavbar(false, toggleTheme)
    const themeBtn = screen.getByLabelText('Switch to dark mode')
    fireEvent.click(themeBtn)
    expect(toggleTheme).toHaveBeenCalled()
  })

  it('displays cart count badge', () => {
    mockCartValue.cartCount = 5
    renderNavbar()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('shows admin order icon for admin users', () => {
    mockAuthValue.isLoggedIn = true
    mockAuthValue.user = { role: 'ADMIN' } as any
    renderNavbar()
    expect(screen.getByLabelText('View Orders')).toBeInTheDocument()
    expect(screen.queryByLabelText(/View Cart/)).not.toBeInTheDocument()
  })
})
