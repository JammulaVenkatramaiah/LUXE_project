import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Hero() {
  const navigate = useNavigate()

  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1441984904556-0ac8d3d96e8d?w=1920&q=80&auto=format)',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center text-white max-w-3xl mx-auto px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className="text-6xl md:text-7xl font-serif font-bold mb-6 tracking-wider"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Elevate Your Style
        </motion.h1>

        <motion.p
          className="text-lg md:text-2xl mb-8 text-gray-200 font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Discover timeless elegance and contemporary fashion
        </motion.p>

        <motion.div
          className="flex gap-6 justify-center flex-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <button
            onClick={() => navigate('/products')}
            className="btn-primary bg-white text-black hover:bg-gray-200"
          >
            Shop Now
          </button>
          <button className="btn-secondary border-white text-white hover:bg-white hover:text-black">
            View Collections
          </button>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="text-white text-center">
          <p className="text-sm mb-2">Scroll to explore</p>
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white rounded-full mt-2"></div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
