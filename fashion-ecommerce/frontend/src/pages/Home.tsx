import Hero from '../components/Hero'
import ProductCard from '../components/ProductCard'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { productAPI } from '../api'

interface Product {
  id: number
  name: string
  price: number
  image?: string
  imageUrl?: string
  rating: number
  imageHover?: string
}

import SEO from '../components/SEO'

export default function Home() {
  const navigate = useNavigate()
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      setIsLoading(true)
      const response = await productAPI.getFeatured()
      setFeaturedProducts(Array.isArray(response) ? response : response.data?.content || response.content || [])
    } catch (err) {
      console.error('Failed to fetch featured products:', err)
      // Fallback to regular products if featured endpoint fails
      try {
        const allProducts = await productAPI.getAll(0, 4)
        setFeaturedProducts(Array.isArray(allProducts) ? allProducts : allProducts.data?.content || allProducts.content || [])
      } catch (error) {
        console.error('Failed to fetch products:', error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const COLLECTIONS = [
    { id: 1, name: 'Men', image: 'https://images.unsplash.com/photo-1552062407-c551eeda4bae?w=500&q=80', slug: 'men' },
    { id: 2, name: 'Women', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&q=80', slug: 'women' },
    { id: 3, name: 'Accessories', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&q=80', slug: 'accessories' },
  ]

  return (
    <div className="min-h-screen">
      <SEO 
        title="Home" 
        description="Shop the latest premium collections at LUXE. Free shipping on orders over $100."
      />
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-10">
            <motion.div
              className="text-center"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
              <p className="text-gray-600 dark:text-gray-400">On orders over $100</p>
            </motion.div>

            <motion.div
              className="text-center"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600 dark:text-gray-400">Handpicked collections</p>
            </motion.div>

            <motion.div
              className="text-center"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-4xl mb-4">💳</div>
              <h3 className="text-xl font-semibold mb-2">Secure Checkout</h3>
              <p className="text-gray-600 dark:text-gray-400">Multiple payment options</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-serif font-bold mb-4">Featured Collection</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Discover our curated selection of premium fashion</p>
          </motion.div>

          <div className="grid md:grid-cols-4 grid-cols-2 gap-6 mb-12">
            {isLoading ? (
              <p className="text-gray-600 dark:text-gray-400">Loading featured products...</p>
            ) : (
              featuredProducts.length > 0 ? (
                featuredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => navigate(`/products/${product.id}`)}
                    className="cursor-pointer"
                  >
                    <ProductCard {...product} />
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-600 dark:text-gray-400">No featured products available</p>
              )
            )}
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate('/products')}
              className="btn-primary"
            >
              View All Products
            </button>
          </div>
        </div>
      </section>

      {/* Collections */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-serif font-bold mb-12 text-center">Shop by Category</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {COLLECTIONS.map((collection) => (
              <motion.div
                key={collection.id}
                className="relative overflow-hidden rounded-lg cursor-pointer group h-80"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                onClick={() => navigate(`/products?category=${collection.slug}`)}
              >
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="absolute inset-0 flex items-end justify-start p-6">
                  <h3 className="text-3xl font-serif font-bold text-white">{collection.name}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center">
            <h2 className="text-4xl font-serif font-bold mb-4">Subscribe to Updates</h2>
            <p className="text-gray-300 mb-8">Get exclusive offers and early access to new collections</p>

            <div className="flex gap-2 mb-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button className="btn-primary bg-accent text-black hover:bg-yellow-600">
                Subscribe
              </button>
            </div>

            <p className="text-sm text-gray-400">We respect your privacy. Unsubscribe at any time.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
