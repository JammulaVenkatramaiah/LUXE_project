import { useNavigate } from 'react-router-dom'
import { Trash2, Plus, Minus } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import SEO from '../components/SEO'

export default function Cart() {
  const navigate = useNavigate()
  const { isLoggedIn } = useAuth()
  const { cart, isLoading, removeFromCart, addToCart } = useCart()

  const cartItems = cart?.cartItems || []
  const subtotal = cart?.totalPrice || 0
  const tax = subtotal * 0.08
  const shipping = subtotal > 100 ? 0 : 10
  const total = subtotal + tax + shipping

  const handleQuantityChange = async (item: any, newQuantity: number) => {
    if (newQuantity < 1) return
    
    try {
      // Update quantity: remove and re-add with new quantity
      // (Backend should ideally have an updateQuantity endpoint)
      await removeFromCart(item.id)
      await addToCart(item.productId, newQuantity, item.size, item.color)
    } catch (err) {
      console.error('Failed to update cart:', err)
    }
  }

  const handleRemoveItem = async (id: number) => {
    try {
      await removeFromCart(id)
    } catch (err) {
      console.error('Failed to remove item:', err)
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen pt-10">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-serif font-bold mb-10">Shopping Cart</h1>
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-2xl text-gray-600 dark:text-gray-400 mb-6">Please log in to view your cart</p>
            <button
              onClick={() => navigate('/login')}
              className="btn-primary"
            >
              Log In
            </button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-10">
      <div className="container mx-auto px-4">
        <SEO 
          title="Your Shopping Cart" 
          description="Review your stylish selections and proceed to checkout. Free shipping on orders over $100."
        />
        <h1 className="text-4xl font-serif font-bold mb-10">Shopping Cart</h1>

        {isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Loading cart...</p>
          </div>
        )}

        {!isLoading && cartItems.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-2xl text-gray-600 dark:text-gray-400 mb-6">Your cart is empty</p>
            <button
              onClick={() => navigate('/products')}
              className="btn-primary"
            >
              Continue Shopping
            </button>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="md:col-span-2">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    className="flex gap-6 bg-gray-50 dark:bg-gray-900 p-6 rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    {/* Image */}
                    <img
                      src={item.productImage || '/placeholder.svg'}
                      alt={item.productName}
                      className="w-24 h-24 object-cover rounded-lg"
                    />

                    {/* Details */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{item.productName}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Size: {item.size || 'N/A'} | Color: {item.color || 'N/A'}
                      </p>
                      <p className="font-bold text-lg">${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
                    </div>

                    {/* Quantity & Remove */}
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>

                      <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg">
                        <button
                          onClick={() => handleQuantityChange(item, item.quantity - 1)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item, item.quantity + 1)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <button
                onClick={() => navigate('/products')}
                className="mt-8 text-accent hover:underline"
              >
                ← Continue Shopping
              </button>
            </div>

            {/* Order Summary */}
            <motion.div
              className="bg-gray-50 dark:bg-gray-900 p-8 rounded-lg h-fit sticky top-24"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 pb-6 border-b">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold mb-6">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="btn-primary w-full mb-3"
              >
                Proceed to Checkout
              </button>

              <button onClick={() => navigate('/products')} className="btn-secondary w-full">
                Continue Shopping
              </button>

              {subtotal > 0 && subtotal <= 100 && (
                <p className="text-sm text-accent mt-4 text-center">
                  Free shipping on orders over $100! Add ${(100 - subtotal).toFixed(2)} more
                </p>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
