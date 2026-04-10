import { useState, useEffect } from 'react'
import { 
  Loader2, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Package,
  ChevronDown, 
  ChevronUp, 
  User, 
  Mail, 
  MapPin,
  CreditCard,
  AlertCircle
} from 'lucide-react'
import { orderAPI } from '../../api'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED'

const STATUS_TABS: { label: string; value: OrderStatus | 'ALL' }[] = [
  { label: 'All Orders', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Confirmed', value: 'CONFIRMED' },
  { label: 'Shipped', value: 'SHIPPED' },
  { label: 'Out for Delivery', value: 'OUT_FOR_DELIVERY' },
  { label: 'Delivered', value: 'DELIVERED' },
  { label: 'Cancelled', value: 'CANCELLED' }
]

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<OrderStatus | 'ALL'>('ALL')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null)
  const [rejectModal, setRejectModal] = useState<{ isOpen: boolean; orderId: number | null; reason: string }>({
    isOpen: false,
    orderId: null,
    reason: ''
  })
  const [isActionLoading, setIsActionLoading] = useState(false)

  const fetchOrders = async () => {
    setLoading(true)
    try {
      let response
      if (activeTab === 'ALL') {
        response = await orderAPI.getAllOrders(page, 10)
      } else {
        response = await orderAPI.getOrdersByStatus(activeTab, page, 10)
      }
      setOrders(response.data.content || [])
      setTotalPages(response.data.totalPages || 0)
    } catch (err) {
      console.error('Failed to fetch orders:', err)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [activeTab, page])

  const handleAccept = async (orderId: number) => {
    setIsActionLoading(true)
    try {
      await orderAPI.acceptOrder(orderId)
      toast.success('Order accepted')
      fetchOrders()
    } catch (err) {
      toast.error('Failed to accept order')
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleReject = async () => {
    if (!rejectModal.orderId || !rejectModal.reason.trim()) {
      toast.error('Please provide a reason')
      return
    }
    setIsActionLoading(true)
    try {
      await orderAPI.rejectOrder(rejectModal.orderId, rejectModal.reason)
      toast.success('Order rejected')
      setRejectModal({ isOpen: false, orderId: null, reason: '' })
      fetchOrders()
    } catch (err) {
      toast.error('Failed to reject order')
    } finally {
      setIsActionLoading(false)
    }
  }



  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'SHIPPED': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
      case 'OUT_FOR_DELIVERY': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
      case 'DELIVERED': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'CANCELLED': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-serif font-bold text-slate-900 dark:text-white">Order Requests</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Manage and track incoming customer orders.</p>
          </div>
          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-4 py-2 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            <Search size={18} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Search order number..." 
              className="bg-transparent border-none outline-none text-sm w-40 md:w-64"
            />
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex overflow-x-auto gap-2 mb-8 no-scrollbar pb-2">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => { setActiveTab(tab.value); setPage(0); }}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.value
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-lg'
                  : 'bg-white text-slate-500 hover:bg-slate-100 dark:bg-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-accent" size={48} />
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm"
              >
                <div 
                  className="p-6 cursor-pointer flex flex-wrap items-center justify-between gap-4"
                  onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold">#{order.orderNumber}</span>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1"><User size={14} /> {order.userName}</span>
                      <span className="flex items-center gap-1"><Clock size={14} /> {new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xs text-gray-500 uppercase tracking-tighter">Total Amount</p>
                      <p className="text-xl font-bold font-serif">${order.totalPrice.toFixed(2)}</p>
                    </div>
                    {expandedOrderId === order.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                <AnimatePresence>
                  {expandedOrderId === order.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50"
                    >
                      <div className="p-8 grid md:grid-cols-2 gap-12">
                        {/* Order Details */}
                        <div className="space-y-8">
                          <div>
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Customer Information</h3>
                            <div className="flex flex-col gap-3 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                              <p className="flex items-center gap-3 text-sm font-medium"><Mail size={16} className="text-slate-400" /> {order.userEmail}</p>
                              <p className="flex items-start gap-3 text-sm font-medium"><MapPin size={16} className="text-slate-400 mt-0.5" /> {order.shippingAddress}</p>
                              <p className="flex items-center gap-3 text-sm font-medium"><CreditCard size={16} className="text-slate-400" /> {order.paymentMethod}</p>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Order Items ({order.orderItems?.length})</h3>
                            <div className="space-y-2">
                              {order.orderItems?.map((item: any) => (
                                <div key={item.id} className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                  <div>
                                    <p className="font-bold">{item.productName}</p>
                                    <p className="text-xs text-gray-500">
                                      Size: <span className="font-semibold text-slate-900 dark:text-white uppercase mr-3">{item.size || 'N/A'}</span>
                                      Color: <span className="font-semibold text-slate-900 dark:text-white uppercase">{item.color || 'N/A'}</span>
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-bold">${item.unitPrice.toFixed(2)}</p>
                                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Actions & Lifecycle */}
                        <div className="space-y-8">
                          <div>
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Management Actions</h3>
                            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-xl">
                              {order.status === 'PENDING' ? (
                                <div className="flex flex-col gap-4">
                                  <button
                                    onClick={() => handleAccept(order.id)}
                                    disabled={isActionLoading}
                                    className="w-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                                  >
                                    <CheckCircle2 size={24} />
                                    Accept Request
                                  </button>
                                  <button
                                    onClick={() => setRejectModal({ isOpen: true, orderId: order.id, reason: '' })}
                                    disabled={isActionLoading}
                                    className="w-full border-2 border-red-500 text-red-500 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-red-50 transition-all disabled:opacity-50"
                                  >
                                    <XCircle size={24} />
                                    Reject Order
                                  </button>
                                </div>
                              ) : order.status === 'CANCELLED' ? (
                                <div className="text-center py-6">
                                  <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
                                  <p className="font-bold text-red-500">Order has been cancelled</p>
                                </div>
                              ) : (
                                <div className="text-center py-6">
                                  <Clock size={48} className="mx-auto text-blue-500 mb-4" />
                                  <p className="font-bold text-blue-500">Order is being processed</p>
                                  <p className="text-sm text-gray-500 mt-2">Current stage: {order.status}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`w-10 h-10 rounded-xl font-bold transition-all ${page === i ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
            <Package size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-500 font-medium text-lg">No orders found.</p>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      <AnimatePresence>
        {rejectModal.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRejectModal({ isOpen: false, orderId: null, reason: '' })}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white dark:bg-slate-900 w-full max-w-md p-8 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <XCircle size={120} />
              </div>
              <h2 className="text-2xl font-serif font-bold mb-6">Reject Order</h2>
              <p className="text-sm text-gray-500 mb-6">Please provide a reason for rejecting this order. This will be visible to the customer.</p>
              
              <textarea
                value={rejectModal.reason}
                onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
                placeholder="Reason for rejection (e.g., Out of stock, invalid address)"
                className="w-full h-32 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 ring-red-500 outline-none resize-none text-sm mb-6"
              />

              <div className="flex gap-4">
                <button
                  onClick={() => setRejectModal({ isOpen: false, orderId: null, reason: '' })}
                  className="flex-1 py-4 border-2 border-slate-200 rounded-2xl text-sm font-bold uppercase tracking-widest hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={isActionLoading || !rejectModal.reason.trim()}
                  className="flex-1 bg-red-500 text-white py-4 rounded-2xl text-sm font-bold uppercase tracking-widest hover:bg-red-600 transition-all disabled:opacity-50"
                >
                  {isActionLoading ? 'Rejecting...' : 'Confirm Reject'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
