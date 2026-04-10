import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, Package, MapPin, Calendar } from 'lucide-react'

export default function OrderSuccess() {
  const { id } = useParams()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center pt-10">
      <motion.div
        className="text-center max-w-2xl mx-auto px-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Check Icon */}
        <motion.div
          className="mb-8"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.6 }}
        >
          <CheckCircle size={80} className="text-green-500 mx-auto" />
        </motion.div>

        <h1 className="text-4xl font-serif font-bold mb-4">Order Confirmed!</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Thank you for your purchase. Your order has been successfully placed.
        </p>

        {/* Order Details */}
        <motion.div
          className="bg-gray-50 dark:bg-gray-900 rounded-lg p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-3 text-lg font-semibold">
              <Package size={24} />
              Order Number: #{id}
            </div>

            <div className="grid md:grid-cols-2 gap-8 pt-6 border-t">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Calendar size={20} className="text-accent" />
                  <div className="text-left">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Expected Delivery</p>
                    <p className="font-semibold">December 20, 2024</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <MapPin size={20} className="text-accent" />
                  <div className="text-left">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Shipping To</p>
                    <p className="font-semibold">123 Main Street, NY 10001</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Order Summary */}
        <motion.div
          className="bg-gray-50 dark:bg-gray-900 rounded-lg p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-bold mb-6">Order Summary</h3>

          <div className="space-y-4 mb-6 pb-6 border-b">
            <div className="flex justify-between">
              <span>Premium Cotton T-Shirt x2</span>
              <span>$79.98</span>
            </div>
            <div className="flex justify-between">
              <span>Slim Fit Jeans x1</span>
              <span>$74.99</span>
            </div>
          </div>

          <div className="space-y-4 mb-6 pb-6 border-b">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>$399.97</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>$32.00</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>FREE</span>
            </div>
          </div>

          <div className="flex justify-between text-xl font-bold">
            <span>Total</span>
            <span>$431.97</span>
          </div>
        </motion.div>

        {/* Buttons */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={() => navigate('/products')}
            className="btn-primary w-full"
          >
            Continue Shopping
          </button>
          <button className="btn-secondary w-full">
            Track My Order
          </button>
        </motion.div>

        {/* Email Notification */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-6">
          A confirmation email has been sent to <span className="font-semibold">john@example.com</span>
        </p>
      </motion.div>
    </div>
  )
}
