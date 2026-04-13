import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, CreditCard, Truck, Loader2 } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { orderAPI } from '../api'
import toast from 'react-hot-toast'
import SEO from '../components/SEO'

export default function Checkout() {
  const navigate = useNavigate()
  const { cart, clearCart } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    couponCode: '',
    paymentMethod: 'Credit Card'
  })

  if (!cart || cart.cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-20 text-center">
        <h2 className="text-2xl font-serif mb-4">Your cart is empty</h2>
        <button onClick={() => navigate('/products')} className="btn-primary">Shop Now</button>
      </div>
    )
  }

  const cartTotal = cart.totalPrice
  const tax = cartTotal * 0.05
  const shipping = cartTotal > 100 ? 0 : 10
  const discount = formData.couponCode === 'WELCOME10' ? 10 : 0
  const finalTotal = cartTotal + tax + shipping - discount

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const fullAddress = `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}, ${formData.phone}`
      const response = await orderAPI.createOrder({
        shippingAddress: fullAddress,
        paymentMethod: formData.paymentMethod,
        couponCode: formData.couponCode || undefined
      })
      
      const orderData = response.data || response;
      toast.success('Order placed successfully!')
      await clearCart()
      navigate(`/order-success/${orderData.orderNumber}`)
    } catch (err: any) {
      console.error('Checkout failed:', err)
      if (err.code === 'ECONNABORTED') {
        toast.error('The request timed out, but your order might have been processed. Please check your email or "My Orders" before trying again.', { duration: 6000 })
      } else {
        toast.error(err.response?.data?.message || 'Failed to place order. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-10">
      <SEO 
        title="Secure Checkout" 
        description="Proceed with your premium fashion purchase. Our secure checkout ensures a safe and seamless shopping experience."
      />
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-serif font-bold mb-10">Checkout</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Shipping Information */}
              <motion.div
                className="bg-gray-50 dark:bg-gray-900 p-8 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Truck size={24} />
                  Shipping Information
                </h2>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    className="input-field"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    className="input-field"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className="input-field w-full mb-4"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  className="input-field w-full mb-4"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />

                <input
                  type="text"
                  name="address"
                  placeholder="Street Address"
                  className="input-field w-full mb-4"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />

                <div className="grid md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    className="input-field"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    className="input-field"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="text"
                    name="zipCode"
                    placeholder="Zip Code"
                    className="input-field"
                    value={formData.zipCode}
                    onChange={handleChange}
                    required
                  />
                </div>
              </motion.div>

              {/* Payment Information */}
              <motion.div
                className="bg-gray-50 dark:bg-gray-900 p-8 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <CreditCard size={24} />
                  Payment Information
                </h2>

                <input
                  type="text"
                  name="cardNumber"
                  placeholder="Card Number"
                  className="input-field w-full mb-4"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  required
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="expiryDate"
                    placeholder="MM/YY"
                    className="input-field"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="text"
                    name="cvv"
                    placeholder="CVV"
                    className="input-field"
                    value={formData.cvv}
                    onChange={handleChange}
                    required
                  />
                </div>
              </motion.div>

              {/* Coupon Code */}
              <motion.div
                className="bg-gray-50 dark:bg-gray-900 p-8 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-lg font-bold mb-4">Have a coupon?</h2>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="couponCode"
                    placeholder="Enter coupon code"
                    className="input-field flex-1"
                    value={formData.couponCode}
                    onChange={handleChange}
                  />
                  <button type="button" className="btn-secondary">Apply</button>
                </div>
              </motion.div>

              {/* Place Order Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full text-lg py-4 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : <Lock size={20} />}
                Place Order - ${finalTotal.toFixed(2)}
              </motion.button>
            </form>
          </div>

          {/* Order Summary */}
          <motion.div
            className="bg-gray-50 dark:bg-gray-900 p-8 rounded-lg h-fit sticky top-24"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4 mb-4 pb-4 border-b">
              {cart.cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm gap-4">
                  <div className="flex-1">
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-gray-500">Qty: {item.quantity} • {item.size}</p>
                  </div>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 mb-6 pb-6 border-b">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (5%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount (WELCOME10)</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
