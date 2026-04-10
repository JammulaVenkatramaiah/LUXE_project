import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Star, Heart, ShoppingCart, Truck, Shield, RotateCcw, Camera } from 'lucide-react'
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton, FacebookIcon, TwitterIcon, WhatsappIcon } from 'react-share'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { productAPI } from '../api'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import VirtualTryOn from '../components/features/VirtualTryOn'

interface Product {
  id: number
  name: string
  description: string
  price: number
  discountPrice?: number
  categoryName: string
  brand: string
  stockQuantity: number
  rating: number
  reviewCount: number
  imageUrl: string
  images?: string[]
  colors?: string[]
  sizes?: string[]
  sku?: string
  material?: string
  care?: string
  isFeatured: boolean
  isActive: boolean
}

import SEO from '../components/SEO'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isLoggedIn } = useAuth()
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState('M')
  const [selectedColor, setSelectedColor] = useState('Black')
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isTryOnOpen, setIsTryOnOpen] = useState(false)

  useEffect(() => {
    if (id) {
      fetchProduct(parseInt(id))
    }
  }, [id])

  const fetchProduct = async (productId: number) => {
    try {
      setIsLoading(true)
      setError('')
      const response = await productAPI.getById(productId)
      setProduct(response.data)
      setSelectedColor(response.data.color || 'Black')
    } catch (err) {
      console.error('Failed to fetch product:', err)
      setError('Failed to load product details')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      toast.error('Please log in to add items to cart')
      navigate('/login')
      return
    }

    if (!product) return

    try {
      await addToCart(product.id, quantity, selectedSize, selectedColor)
      toast.success('Item added to cart!')
    } catch (err) {
      console.error('Failed to add to cart:', err)
      toast.error('Failed to add item to cart')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-10 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Loading product details...</p>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen pt-10 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Product not found'}</p>
          <button onClick={() => navigate('/products')} className="btn-primary">
            Back to Products
          </button>
        </div>
      </div>
    )
  }

  const images = (product.images && product.images.length > 0) 
    ? product.images 
    : [product.imageUrl || '/placeholder.svg']
  const displayPrice = product.discountPrice || product.price || 0
  const originalPrice = product.price || 0
  const discount = originalPrice > displayPrice ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100) : 0

  return (
    <div className="min-h-screen pt-10">
      <SEO 
        title={product.name} 
        description={product.description} 
        image={product.imageUrl}
      />
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Images */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-square">
              <img
                src={images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {images.map((img: string, idx: number) => (
                <img
                  key={idx}
                  src={img}
                  alt={`View ${idx + 1}`}
                  className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                />
              ))}
            </div>
          </motion.div>

          {/* Product Details */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="mb-6">
              <h1 className="text-4xl font-serif font-bold mb-2">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={i < Math.floor(product.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">({product.reviewCount || 0} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold">${displayPrice.toFixed(2)}</span>
                {discount > 0 && (
                  <>
                    <span className="text-2xl text-gray-400 line-through">${originalPrice.toFixed(2)}</span>
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {discount}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-8 leading-relaxed">{product.description}</p>

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Color</h3>
                  <div className="flex gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 border-2 rounded-lg transition-all ${
                          selectedColor === color
                            ? 'border-black'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Size</h3>
                  <div className="flex gap-3 flex-wrap">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 border-2 rounded-lg font-semibold transition-all ${
                          selectedSize === size
                            ? 'bg-black text-white border-black'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-8">
                <h3 className="font-semibold mb-3">Quantity</h3>
                <div className="flex items-center gap-4">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 border rounded-lg hover:bg-gray-100">-</button>
                  <span className="text-lg font-semibold">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 border rounded-lg hover:bg-gray-100">+</button>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-4 mb-8">
                <div className="flex gap-4">
                  <motion.button
                    onClick={handleAddToCart}
                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ShoppingCart size={20} />
                    Add to Cart
                  </motion.button>
                  <motion.button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className="btn-secondary px-6 flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Heart size={20} className={isWishlisted ? 'fill-red-500 text-red-500' : ''} />
                  </motion.button>
                </div>
                
                {/* Virtual Try-On Button */}
                <motion.button
                  onClick={() => setIsTryOnOpen(true)}
                  className="w-full py-4 border-2 border-black dark:border-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                  whileHover={{ scale: 1.01 }}
                >
                  <Camera size={20} />
                  Virtual Try-On
                </motion.button>

                {/* Social Sharing */}
                <div className="flex flex-col gap-3 py-4 border-y border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Share with style</span>
                  <div className="flex gap-4">
                    <FacebookShareButton url={window.location.href}>
                      <FacebookIcon size={40} round />
                    </FacebookShareButton>
                    <TwitterShareButton url={window.location.href} title={product.name}>
                      <TwitterIcon size={40} round />
                    </TwitterShareButton>
                    <WhatsappShareButton url={window.location.href} title={product.name} separator=":: ">
                      <WhatsappIcon size={40} round />
                    </WhatsappShareButton>
                  </div>
                </div>
              </div>

              {/* Try-On Modal Space */}
              <AnimatePresence>
                {isTryOnOpen && (
                  <VirtualTryOn 
                    productImage={product.imageUrl} 
                    onClose={() => setIsTryOnOpen(false)} 
                  />
                )}
              </AnimatePresence>

              {/* Features */}
              <div className="space-y-4 pt-8 border-t">
                <div className="flex items-center gap-3">
                  <Truck size={20} />
                  <div>
                    <p className="font-semibold">Free Shipping</p>
                    <p className="text-sm text-gray-600">On orders over $100</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcw size={20} />
                  <div>
                    <p className="font-semibold">Easy Returns</p>
                    <p className="text-sm text-gray-600">30-day return policy</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield size={20} />
                  <div>
                    <p className="font-semibold">Secure Payment</p>
                    <p className="text-sm text-gray-600">100% secure transactions</p>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-3 mt-8 pt-8 border-t">
                {product.sku && <p><span className="font-semibold">SKU:</span> {product.sku}</p>}
                {product.material && <p><span className="font-semibold">Material:</span> {product.material}</p>}
                {product.care && <p><span className="font-semibold">Care:</span> {product.care}</p>}
                {product.brand && <p><span className="font-semibold">Brand:</span> {product.brand}</p>}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <motion.div
          className="mt-20 pt-20 border-t"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

          <div className="space-y-4">
            {[1, 2, 3].map((review) => (
              <div key={review} className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-semibold">John Doe</h4>
                    <div className="flex gap-1 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-gray-600">2 weeks ago</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  Excellent quality and perfect fit! The material is so comfortable and the shipping was fast. Highly recommended!
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
