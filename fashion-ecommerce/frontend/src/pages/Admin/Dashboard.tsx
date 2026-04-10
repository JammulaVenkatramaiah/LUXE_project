import { useState, useEffect } from 'react'
import { Loader2, Package, Users, DollarSign, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { productAPI, orderAPI } from '../../api'
import { motion } from 'framer-motion'

export default function AdminDashboard() {
  const [productCount, setProductCount] = useState<number | null>(null)
  const [userStats, setUserStats] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [isAdminOrderLoading, setIsAdminOrderLoading] = useState(true)

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [prodRes, statsRes, ordersRes] = await Promise.all([
          productAPI.getProductCount(),
          orderAPI.getUserStats(),
          orderAPI.getAllOrders(0, 20)
        ])
        setProductCount(prodRes.data)
        setUserStats(statsRes.data || [])
        setOrders(ordersRes.data.content || [])
      } catch (err) {
        console.error('Failed to fetch admin dashboard data:', err)
      } finally {
        setIsAdminOrderLoading(false)
      }
    }
    fetchAdminData()
  }, [])

  if (isAdminOrderLoading) {
    return (
      <div className="min-h-screen pt-10 flex items-center justify-center">
        <Loader2 className="animate-spin text-accent" size={48} />
      </div>
    )
  }

  const totalUsers = userStats.length
  const totalRevenue = userStats.reduce((acc, user) => acc + user.totalSpent, 0)
  const pendingOrders = orders.filter(o => o.status === 'PENDING').length

  const stats = [
    { label: 'Total Products', value: productCount ?? '...', icon: Package, color: 'bg-blue-500' },
    { label: 'Total Customers', value: totalUsers, icon: Users, color: 'bg-green-500' },
    { label: 'Pending Requests', value: pendingOrders, icon: AlertCircle, color: 'bg-red-500' },
    { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'bg-amber-500' },
  ]

  return (
    <div className="min-h-screen pt-10">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-serif font-bold mb-10">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800"
            >
              <div className="flex items-center gap-4">
                <div className={`${stat.color} p-3 rounded-xl text-white`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-100 dark:border-gray-800 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">User Management</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b dark:border-gray-800">
                  <th className="pb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Customer</th>
                  <th className="pb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Email</th>
                  <th className="pb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Total Orders</th>
                  <th className="pb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Amount Paid</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-800">
                {userStats.length > 0 ? userStats.map((user) => (
                  <tr key={user.userId}>
                    <td className="py-4 font-medium">{user.name}</td>
                    <td className="py-4 text-gray-600 dark:text-gray-400">{user.email}</td>
                    <td className="py-4">{user.orderCount}</td>
                    <td className="py-4 font-semibold">${user.totalSpent.toFixed(2)}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500">No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-100 dark:border-gray-800 mb-8">
          <h2 className="text-xl font-bold mb-6">All Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b dark:border-gray-800">
                  <th className="pb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Order #</th>
                  <th className="pb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Customer ID</th>
                  <th className="pb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Total</th>
                  <th className="pb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Status</th>
                  <th className="pb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-800">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="py-4 font-medium">{order.orderNumber}</td>
                    <td className="py-4">{order.userId}</td>
                    <td className="py-4 font-semibold">${order.totalPrice?.toFixed(2)}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 text-gray-600 dark:text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/admin/orders" className="p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-accent hover:text-accent transition-all font-medium text-center">
              Manage Orders
            </Link>
            <button className="p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-accent hover:text-accent transition-all font-medium">
              Refresh Statistics
            </button>
            <button className="p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-accent hover:text-accent transition-all font-medium">
              Site Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
