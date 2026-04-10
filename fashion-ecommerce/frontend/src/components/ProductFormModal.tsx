import { useState, useEffect } from 'react'
import { X, Save, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { categoryAPI } from '../api'
import toast from 'react-hot-toast'

interface ProductFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  product?: any // If provided, we are editing
}

export default function ProductFormModal({ isOpen, onClose, onSuccess, product }: ProductFormModalProps) {
  const [categories, setCategories] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    categoryId: '',
    brand: '',
    stockQuantity: '',
    imageUrl: '',
    isFeatured: false,
    isActive: true
  })

  useEffect(() => {
    fetchCategories()
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        discountPrice: product.discountPrice?.toString() || '',
        categoryId: product.categoryId?.toString() || '',
        brand: product.brand || '',
        stockQuantity: product.stockQuantity?.toString() || '',
        imageUrl: product.imageUrl || '',
        isFeatured: product.isFeatured || false,
        isActive: product.isActive ?? true
      })
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        discountPrice: '',
        categoryId: '',
        brand: '',
        stockQuantity: '',
        imageUrl: '',
        isFeatured: false,
        isActive: true
      })
    }
  }, [product, isOpen])

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll()
      setCategories(response.data || [])
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const dataToSubmit = {
        ...formData,
        price: parseFloat(formData.price),
        discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
        stockQuantity: parseInt(formData.stockQuantity),
        categoryId: parseInt(formData.categoryId)
      }

      const { productAPI } = await import('../api')
      if (product) {
        await productAPI.updateProduct(product.id, dataToSubmit)
        toast.success('Product updated successfully!')
      } else {
        await productAPI.createProduct(dataToSubmit)
        toast.success('Product created successfully!')
      }
      onSuccess()
      onClose()
    } catch (err: any) {
      console.error('Failed to save product:', err)
      toast.error(err.response?.data?.message || 'Failed to save product')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b flex items-center justify-between bg-gray-50 dark:bg-gray-800">
              <h2 className="text-2xl font-bold font-serif">
                {product ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="overflow-y-auto p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Product Name</label>
                  <input
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-accent outline-none transition-all"
                    placeholder="e.g. Silk Evening Dress"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Brand</label>
                  <input
                    required
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-accent outline-none transition-all"
                    placeholder="e.g. Luxe Fashion"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Category</label>
                  <select
                    required
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-accent outline-none transition-all"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Price ($)</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-accent outline-none transition-all"
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Discount Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="discountPrice"
                    value={formData.discountPrice}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-accent outline-none transition-all"
                    placeholder="Optional"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Stock Quantity</label>
                  <input
                    required
                    type="number"
                    name="stockQuantity"
                    value={formData.stockQuantity}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-accent outline-none transition-all"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Image URL</label>
                <div className="flex gap-4">
                  <input
                    required
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-accent outline-none transition-all"
                    placeholder="https://images.unsplash.com/..."
                  />
                  {formData.imageUrl && (
                    <div className="w-12 h-12 rounded-lg border overflow-hidden">
                      <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Description</label>
                <textarea
                  required
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-accent outline-none transition-all resize-none"
                  placeholder="Tell us about this product..."
                />
              </div>

              <div className="flex gap-8 py-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    className="w-5 h-5 rounded accent-black"
                  />
                  <span className="font-medium group-hover:text-accent transition-colors">Featured Product</span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="w-5 h-5 rounded accent-black"
                  />
                  <span className="font-medium group-hover:text-accent transition-colors">Active / Visible</span>
                </label>
              </div>

              <div className="pt-6 border-t flex gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-4 rounded-xl border-2 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-[2] py-4 rounded-xl bg-black text-white font-bold hover:bg-gray-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                  {product ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
