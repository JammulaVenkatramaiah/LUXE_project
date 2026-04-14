import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { userAPI } from '../api'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User as UserIcon, Lock, Save, Key, ShoppingBag, Clock, CreditCard, Loader2, Heart, Trash2, ShoppingCart, Package, MapPin } from 'lucide-react'
import { orderAPI, wishlistAPI, cartAPI } from '../api'

export default function Profile() {
  const { user, isLoggedIn, updateUser, logout } = useAuth()
  const navigate = useNavigate()

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Order History State
  const [orders, setOrders] = useState<any[]>([])
  const [isOrdersLoading, setIsOrdersLoading] = useState(true)

  // Wishlist State
  const [wishlistItems, setWishlistItems] = useState<any[]>([])
  const [isWishlistLoading, setIsWishlistLoading] = useState(true)

  // Tracking Modal State
  const [trackingOrderId, setTrackingOrderId] = useState<number | null>(null)
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false)
  const [trackingEvents, setTrackingEvents] = useState<any[]>([])
  const [isTrackingLoading, setIsTrackingLoading] = useState(false)
  
  const location = useLocation()

  // Edit Profile Form
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    postalCode: user?.postalCode || '',
    country: user?.country || ''
  })

  // Change Password Form
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Sync edit form with user data when it changes
  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        postalCode: user.postalCode || '',
        country: user.country || ''
      })
    }
  }, [user])

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isLoggedIn) return
      try {
        const response = await orderAPI.getMyOrders()
        setOrders(response.data?.content || [])
      } catch (err) {
        console.error('Failed to fetch orders:', err)
      } finally {
        setIsOrdersLoading(false)
      }
    }

    const fetchWishlist = async () => {
      if (!isLoggedIn) return
      try {
        const response = await wishlistAPI.getWishlist()
        setWishlistItems(response.data?.content || [])
      } catch (err) {
        console.error('Failed to fetch wishlist:', err)
      } finally {
        setIsWishlistLoading(false)
      }
    }

    fetchOrders()
    fetchWishlist()
  }, [isLoggedIn])

  // Handle ?track= query parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const trackId = params.get('track')
    if (trackId && isLoggedIn) {
      handleTrackOrder(parseInt(trackId))
      // Clean up the URL
      navigate('/profile', { replace: true })
    }
  }, [location.search, isLoggedIn])

  const handleTrackOrder = async (orderId: number) => {
    setTrackingOrderId(orderId)
    setIsTrackingModalOpen(true)
    setIsTrackingLoading(true)
    try {
      const response = await orderAPI.getOrderTracking(orderId)
      setTrackingEvents(response.data || [])
    } catch (err) {
      console.error('Failed to fetch tracking:', err)
      toast.error('Failed to load tracking information')
    } finally {
      setIsTrackingLoading(false)
    }
  }

  const handleRemoveFromWishlist = async (productId: number) => {
    try {
      await wishlistAPI.removeFromWishlist(productId)
      setWishlistItems(wishlistItems.filter(item => item.product.id !== productId))
      toast.success('Removed from wishlist')
    } catch (err) {
      toast.error('Failed to remove item')
    }
  }

  const handleMoveToCart = async (productId: number) => {
    try {
      // Assuming context or API handles addToCart
      // For simplicity, using cartAPI directly here if context is not available for this action
      await cartAPI.addToCart(productId, 1)
      await wishlistAPI.removeFromWishlist(productId)
      setWishlistItems(wishlistItems.filter(item => item.product.id !== productId))
      toast.success('Moved to cart')
      // Refresh cart count if needed
      window.location.reload() // Simple way to refresh state across components
    } catch (err) {
      toast.error('Failed to move to cart')
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const response = await userAPI.updateProfile(editForm)
      const updatedUser = response.data || response;
      updateUser({
        name: updatedUser.name,
        phone: updatedUser.phone,
        address: updatedUser.address,
        city: updatedUser.city,
        state: updatedUser.state,
        postalCode: updatedUser.postalCode,
        country: updatedUser.country
      })
      toast.success('Profile updated successfully!')
      setIsEditModalOpen(false)
      return true
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match')
      return false
    }

    try {
      setIsLoading(true)
      await userAPI.changePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword
      })
      toast.success('Password changed successfully!')
      setIsPasswordModalOpen(false)
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
      return true
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to change password')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-4xl font-serif font-bold text-slate-900 dark:text-white mb-6">My Profile</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">You need to be logged in to view your profile.</p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-full border-2 border-slate-900 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-900 hover:text-white dark:border-slate-100 dark:text-slate-100 dark:hover:bg-slate-100 dark:hover:text-slate-900"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-slate-900 dark:text-white">My Profile</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Manage your account details and security settings.</p>
        </div>

        <div className="grid gap-8 xl:grid-cols-[2fr_1fr]">
          <section className="rounded-3xl bg-white dark:bg-slate-900 p-8 shadow-sm shadow-slate-200/50 dark:shadow-none transition-colors">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Account details</h2>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Your personal information is kept secure and only visible to you.</p>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                >
                  Edit profile
                </button>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50 p-6 dark:border-slate-700/70 dark:bg-slate-950">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 font-medium">Full name</p>
                  <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">{user?.name || 'Not provided'}</p>
                </div>
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50 p-6 dark:border-slate-700/70 dark:bg-slate-950">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 font-medium">Email</p>
                  <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">{user?.email || 'Not provided'}</p>
                </div>
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50 p-6 dark:border-slate-700/70 dark:bg-slate-950">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 font-medium">Phone</p>
                  <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">{user?.phone || 'Not provided'}</p>
                </div>
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50 p-6 dark:border-slate-700/70 dark:bg-slate-950">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 font-medium">Address</p>
                  <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-white whitespace-pre-line">
                    {user?.address ? `${user.address}\n${user.city}, ${user.state} ${user.postalCode}\n${user.country}` : 'Not provided'}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50 p-6 dark:border-slate-700/70 dark:bg-slate-950">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 font-medium">Role</p>
                  <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-white capitalize">{user?.role || 'User'}</p>
                </div>
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50 p-6 dark:border-slate-700/70 dark:bg-slate-950">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 font-medium">User ID</p>
                  <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">#{user?.id || 'N/A'}</p>
                </div>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl bg-white dark:bg-slate-900 p-8 shadow-sm shadow-slate-200/50 dark:shadow-none transition-colors">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Account Security</h2>
              <div className="mt-6 space-y-3">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="w-full rounded-full border-2 border-slate-900 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-900 hover:text-white dark:border-slate-100 dark:text-slate-100 dark:hover:bg-slate-100 dark:hover:text-slate-900 flex items-center justify-center gap-2"
                >
                  <UserIcon size={18} />
                  Edit account
                </button>
                <button
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="w-full rounded-full border-2 border-slate-900 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-900 hover:text-white dark:border-slate-100 dark:text-slate-100 dark:hover:bg-slate-100 dark:hover:text-slate-900 flex items-center justify-center gap-2"
                >
                  <Lock size={18} />
                  Change password
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
                >
                  Logout
                </button>
              </div>
            </div>

            <div className="rounded-3xl bg-slate-900 p-8 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <Shield size={64} className="text-white" />
              </div>
              <h2 className="text-xl font-semibold">Privacy Protected</h2>
              <p className="mt-3 text-sm text-slate-300">Your account data is encrypted and secure with us.</p>
              <button className="mt-6 inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-200">
                Privacy policy
              </button>
            </div>
          </aside>
        </div>

        {/* Order History Section */}
        <div className="mt-12">
          <div className="rounded-3xl bg-white dark:bg-slate-900 p-8 shadow-sm shadow-slate-200/50 dark:shadow-none transition-colors">
            <h2 className="text-2xl font-serif font-bold mb-8 flex items-center gap-3 text-slate-900 dark:text-white">
              <ShoppingBag className="text-slate-900 dark:text-white" />
              Order History
            </h2>

            {isOrdersLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-accent" size={32} />
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 transition-all hover:shadow-lg dark:border-slate-800 dark:bg-slate-950"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-900">
                          <ShoppingBag className="h-6 w-6 text-slate-500" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">Order #{order.orderNumber}</p>
                          <div className="mt-1 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1 font-semibold text-slate-900 dark:text-white">
                              <CreditCard size={12} />
                              ${order.totalPrice.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest ${order.status === 'DELIVERED'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : order.status === 'CANCELLED'
                              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                          }`}>
                          {order.status}
                        </span>
                        {order.status !== 'CANCELLED' && (
                          <button
                            onClick={() => handleTrackOrder(order.id)}
                            className="text-[10px] font-black uppercase tracking-wider text-slate-900 dark:text-white underline underline-offset-4 hover:text-accent transition-colors"
                          >
                            Track Order
                          </button>
                        )}
                        {order.status === 'CANCELLED' && (
                          <p className="text-[10px] text-red-500 font-medium italic">
                            Reason: {order.rejectReason || 'Order rejected by admin'}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 rounded-3xl border-2 border-dashed border-slate-100 dark:border-slate-800">
                <ShoppingBag size={48} className="mx-auto text-slate-200 dark:text-slate-800 mb-4" />
                <p className="text-slate-500 dark:text-slate-400 font-medium">You haven't placed any orders yet.</p>
                <Link to="/products" className="mt-6 inline-block btn-primary px-8">
                  Start Discovering
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Wishlist Section */}
        <div className="mt-12 mb-12">
          <div className="rounded-3xl bg-white dark:bg-slate-900 p-8 shadow-sm shadow-slate-200/50 dark:shadow-none transition-colors">
            <h2 className="text-2xl font-serif font-bold mb-8 flex items-center gap-3 text-slate-900 dark:text-white">
              <Heart className="text-red-500 fill-red-500" />
              My Wishlist
            </h2>

            {isWishlistLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-accent" size={32} />
              </div>
            ) : wishlistItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence>
                  {wishlistItems.map((wish: any) => (
                    <motion.div
                      key={wish.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="group relative bg-slate-50 dark:bg-slate-950 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 transition-all hover:shadow-xl"
                    >
                      <div className="aspect-[4/5] relative overflow-hidden">
                        <img
                          src={wish.product.imageUrl || '/placeholder.png'}
                          alt={wish.product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <button
                          onClick={() => handleRemoveFromWishlist(wish.product.id)}
                          className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-black/50 backdrop-blur-sm rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                          title="Remove from wishlist"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="p-4">
                        <h3 className="font-bold text-slate-900 dark:text-white truncate">{wish.product.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{wish.product.brand}</p>

                        <div className="flex items-center justify-between gap-2">
                          <span className="text-lg font-bold text-slate-900 dark:text-white">
                            ${(wish.product.discountPrice || wish.product.price).toFixed(2)}
                          </span>
                          <button
                            onClick={() => handleMoveToCart(wish.product.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all hover:bg-slate-800 dark:hover:bg-slate-200"
                          >
                            <ShoppingCart size={14} />
                            Move to Cart
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-16 rounded-3xl border-2 border-dashed border-slate-100 dark:border-slate-800">
                <Heart size={48} className="mx-auto text-slate-200 dark:text-slate-800 mb-4" />
                <p className="text-slate-500 dark:text-slate-400 font-medium">Your wishlist is empty.</p>
                <Link to="/products" className="mt-6 inline-block btn-primary px-8 text-sm">
                  Find something you love
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
              >
                <X size={24} />
              </button>

              <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3">
                <UserIcon className="text-slate-900 dark:text-white" />
                Edit Profile
              </h2>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full rounded-2xl border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white bg-slate-50 focus:ring-slate-900 py-3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full rounded-2xl border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white bg-slate-50 focus:ring-slate-900 py-3"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Street Address
                    </label>
                    <textarea
                      value={editForm.address}
                      onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                      className="w-full rounded-2xl border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white bg-slate-50 focus:ring-slate-900 py-3"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={editForm.city}
                      onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                      className="w-full rounded-2xl border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white bg-slate-50 focus:ring-slate-900 py-3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      value={editForm.state}
                      onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                      className="w-full rounded-2xl border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white bg-slate-50 focus:ring-slate-900 py-3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={editForm.postalCode}
                      onChange={(e) => setEditForm({ ...editForm, postalCode: e.target.value })}
                      className="w-full rounded-2xl border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white bg-slate-50 focus:ring-slate-900 py-3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      value={editForm.country}
                      onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                      className="w-full rounded-2xl border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white bg-slate-50 focus:ring-slate-900 py-3"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary py-4 rounded-2xl flex items-center justify-center gap-2 text-base mt-2"
                >
                  {isLoading ? 'Updating...' : (
                    <>
                      <Save size={20} />
                      Save Changes
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Change Password Modal */}
      <AnimatePresence>
        {isPasswordModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPasswordModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 p-8 shadow-2xl"
            >
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
              >
                <X size={24} />
              </button>

              <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3">
                <Key className="text-slate-900 dark:text-white" />
                Change Password
              </h2>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordForm.oldPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                    className="w-full rounded-2xl border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white bg-slate-50 focus:ring-slate-900"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full rounded-2xl border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white bg-slate-50 focus:ring-slate-900"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full rounded-2xl border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white bg-slate-50 focus:ring-slate-900"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary py-4 rounded-2xl mt-4 flex items-center justify-center gap-2 text-base"
                >
                  {isLoading ? 'Processing...' : (
                    <>
                      <Lock size={20} />
                      Update Password
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Order Tracking Modal */}
      <AnimatePresence>
        {isTrackingModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTrackingModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 p-8 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <button
                onClick={() => setIsTrackingModalOpen(false)}
                className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
              >
                <X size={24} />
              </button>

              <h2 className="text-2xl font-serif font-bold mb-8 flex items-center gap-3">
                <Package className="text-slate-900 dark:text-white" />
                Track Order #{trackingOrderId}
              </h2>

              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {isTrackingLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-4">
                    <Loader2 className="animate-spin text-slate-900 dark:text-white" size={40} />
                    <p className="text-sm font-medium text-gray-500">Fetching latest status...</p>
                  </div>
                ) : trackingEvents.length > 0 ? (
                  <div className="relative space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100 dark:before:bg-slate-800">
                    {trackingEvents.map((event, index) => (
                      <div key={event.id} className="relative pl-10">
                        <div className={`absolute left-0 top-1.5 h-[24px] w-[24px] rounded-full border-4 border-white dark:border-slate-900 z-10 ${
                          index === 0 ? 'bg-slate-900 dark:bg-white scale-125' : 'bg-slate-200 dark:bg-slate-700'
                        }`} />
                        <div>
                          <p className={`font-bold ${index === 0 ? 'text-slate-900 dark:text-white text-lg' : 'text-gray-600 dark:text-gray-400'}`}>
                            {event.status}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">{event.description}</p>
                          <div className="mt-2 flex items-center gap-4 text-xs font-semibold">
                            <span className="flex items-center gap-1 text-slate-400">
                              <MapPin size={12} />
                              {event.location}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="text-slate-400">
                              {new Date(event.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No tracking events found for this order.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Shield({ size, className }: { size: number, className: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

