import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { Filter, Plus, Edit2, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { productAPI, categoryAPI } from '../api'
import { useAuth } from '../context/AuthContext'
import ProductFormModal from '../components/ProductFormModal'
import toast from 'react-hot-toast'
import SEO from '../components/SEO'

export default function Products() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState([0, 500])
  const [sortBy, setSortBy] = useState('createdAt')
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchKeyword, setSearchKeyword] = useState<string | null>(null)

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const category = params.get('category')
    const search = params.get('search')

    if (category) {
      setSelectedCategory(category.charAt(0).toUpperCase() + category.slice(1).toLowerCase())
    } else {
      setSelectedCategory(null)
    }

    setSearchKeyword(search)
  }, [location.search])

  useEffect(() => {
    fetchProducts()
  }, [sortBy, selectedCategory, priceRange, searchKeyword])

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      setError('')
      const direction = sortBy === 'price-low' ? 'ASC' : 'DESC'
      const sort = sortBy === 'price-low' || sortBy === 'price-high' ? 'price' : 'createdAt'

      let response;
      if (searchKeyword) {
        response = await productAPI.search(searchKeyword, 0, 50)
      } else if (selectedCategory) {
        // Find category ID if possible, otherwise use search as fallback
        const categories = await categoryAPI.getAll();
        const category = categories.data?.find((c: any) => c.name.toLowerCase() === selectedCategory.toLowerCase());
        if (category) {
          response = await productAPI.getByCategory(category.id, 0, 50);
        } else {
          // Fallback to all if category not found by name
          response = await productAPI.getAll(0, 50, sort, direction);
        }
      } else {
        response = await productAPI.getAll(0, 50, sort, direction);
      }

      let filtered = []
      if (response && response.data && Array.isArray(response.data.content)) {
        filtered = response.data.content
      } else if (response && Array.isArray(response.content)) {
        filtered = response.content
      } else if (Array.isArray(response)) {
        filtered = response
      }

      if (priceRange[0] > 0 || priceRange[1] < 500) {
        filtered = filtered.filter((p: any) => p.price >= priceRange[0] && p.price <= priceRange[1])
      }

      setProducts(filtered)
    } catch (err) {
      console.error('Failed to fetch products:', err)
      setError('Failed to load products. Please try again.')
      setProducts([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (product: any, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingProduct(product)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.deleteProduct(id)
        toast.success('Product deleted successfully')
        fetchProducts()
      } catch (err) {
        console.error('Failed to delete product:', err)
        toast.error('Failed to delete product')
      }
    }
  }

  const handleAddNew = () => {
    setEditingProduct(null)
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen pt-10">
      <SEO 
        title={searchKeyword ? `Search: ${searchKeyword}` : selectedCategory ? `${selectedCategory} Collection` : 'Our Collection'}
        description={`Explore our curated selection of ${selectedCategory || 'premium fashion'}. High-quality pieces for your unique lifestyle.`}
      />
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-serif font-bold mb-2">
              {searchKeyword ? `Search Results for "${searchKeyword}"` : 'Our Collection'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {searchKeyword ? `Found ${products.length} matching products` : 'Curated pieces for your unique style'}
            </p>
            {searchKeyword && (
              <button
                onClick={() => navigate('/products')}
                className="mt-4 text-sm font-semibold text-slate-900 dark:text-white underline underline-offset-4 hover:text-accent transition-colors"
              >
                Clear search and view all products
              </button>
            )}
          </div>

          {isAdmin && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddNew}
              className="btn-primary flex items-center gap-2 px-6 py-3 rounded-full"
            >
              <Plus size={20} />
              Add New Product
            </motion.button>
          )}
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filter */}
          <motion.div
            className={`md:w-64 ${isFilterOpen || 'hidden'} md:block`}
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg sticky top-24">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Filter size={20} />
                Filters
              </h3>

              {/* Category Filter */}
              <div className="mb-8">
                <h4 className="font-semibold mb-4">Category</h4>
                <div className="space-y-2">
                  {['Men', 'Women', 'Kids', 'Accessories'].map((cat) => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategory === cat}
                        onChange={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                        className="rounded"
                      />
                      <span>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-8">
                <h4 className="font-semibold mb-4">Price Range</h4>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Sort */}
              <div>
                <h4 className="font-semibold mb-4">Sort By</h4>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-field"
                >
                  <option value="createdAt">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Filter Toggle for Mobile */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="md:hidden mb-6 btn-secondary"
            >
              <Filter size={18} className="mr-2 inline" />
              {isFilterOpen ? 'Hide' : 'Show'} Filters
            </button>

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">Loading products...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <p className="text-red-500">{error}</p>
              </div>
            )}

            {/* Products */}
            {!isLoading && !error && Array.isArray(products) && (
              <div className="grid md:grid-cols-3 grid-cols-2 gap-6">
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => navigate(`/products/${product.id}`)}
                    className="cursor-pointer group relative"
                  >
                    <ProductCard {...product} image={product.imageUrl} />

                    {isAdmin && (
                      <div className="absolute top-2 left-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <button
                          onClick={(e) => handleEdit(product, e)}
                          className="p-2 bg-white/90 backdrop-blur shadow-md rounded-full text-blue-600 hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={(e) => handleDelete(product.id, e)}
                          className="p-2 bg-white/90 backdrop-blur shadow-md rounded-full text-red-600 hover:bg-red-600 hover:text-white transition-all transform hover:scale-110"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}

            {!isLoading && !error && Array.isArray(products) && products.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400 text-lg">No products found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchProducts}
        product={editingProduct}
      />
    </div>
  )
}
