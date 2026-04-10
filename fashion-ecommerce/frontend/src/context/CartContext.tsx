import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { cartAPI } from '../api'
import { useAuth } from './AuthContext'

interface CartItem {
  id: number
  productId: number
  productName: string
  productImage: string
  quantity: number
  price: number
  size?: string
  color?: string
}

interface Cart {
  id: number | null
  cartItems: CartItem[]
  totalPrice: number
}

interface CartContextType {
  cart: Cart | null
  cartCount: number
  isLoading: boolean
  fetchCart: () => Promise<void>
  addToCart: (productId: number, quantity: number, size?: string, color?: string) => Promise<void>
  removeFromCart: (cartItemId: number) => Promise<void>
  clearCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { isLoggedIn, user } = useAuth()

  const fetchCart = useCallback(async () => {
    const isAdmin = user?.role === 'ADMIN' || user?.role === 'ROLE_ADMIN'
    
    if (!isLoggedIn || isAdmin) {
      setCart(null)
      return
    }
    
    setIsLoading(true)
    try {
      const response = await cartAPI.getCart()
      // Backend returns ApiResponse<CartDTO>
      const cartData = response.data
      setCart(cartData)
    } catch (error) {
      console.error('Failed to fetch cart:', error)
    } finally {
      setIsLoading(false)
    }
  }, [isLoggedIn])

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  const addToCart = async (productId: number, quantity: number, size?: string, color?: string) => {
    try {
      const response = await cartAPI.addToCart(productId, quantity, size, color)
      setCart(response.data)
    } catch (error) {
      console.error('Failed to add to cart:', error)
      throw error
    }
  }

  const removeFromCart = async (cartItemId: number) => {
    try {
      await cartAPI.removeFromCart(cartItemId)
      await fetchCart()
    } catch (error) {
      console.error('Failed to remove from cart:', error)
      throw error
    }
  }

  const clearCart = async () => {
    try {
      await cartAPI.clearCart()
      await fetchCart()
    } catch (error) {
      console.error('Failed to clear cart:', error)
      throw error
    }
  }

  const cartCount = cart?.cartItems.reduce((acc, item) => acc + item.quantity, 0) || 0

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        isLoading,
        fetchCart,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
