import axiosInstance from './axiosInstance'

export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await axiosInstance.post('/auth/login', { email, password })
    return response.data
  },

  register: async (name: string, email: string, password: string, confirmPassword: string) => {
    const response = await axiosInstance.post('/auth/register', {
      name,
      email,
      password,
      confirmPassword,
    })
    return response.data
  },

  validateToken: async () => {
    const response = await axiosInstance.get('/auth/validate')
    return response.data
  },
}

export const productAPI = {
  getAll: async (page: number = 0, size: number = 20, sort: string = 'createdAt', direction: string = 'DESC') => {
    const response = await axiosInstance.get('/products', {
      params: { page, size, sort, direction },
    })
    return response.data
  },

  getById: async (id: number) => {
    const response = await axiosInstance.get(`/products/${id}`)
    return response.data
  },

  getByCategory: async (categoryId: number, page: number = 0, size: number = 20) => {
    const response = await axiosInstance.get(`/products/category/${categoryId}`, {
      params: { page, size },
    })
    return response.data
  },

  search: async (keyword: string, page: number = 0, size: number = 20) => {
    const response = await axiosInstance.get('/products/search', {
      params: { keyword, page, size },
    })
    return response.data
  },

  filter: async (minPrice: number, maxPrice: number, page: number = 0, size: number = 20) => {
    const response = await axiosInstance.get('/products/filter', {
      params: { minPrice, maxPrice, page, size },
    })
    return response.data
  },

  getFeatured: async () => {
    const response = await axiosInstance.get('/products/featured')
    return response.data
  },

  getTrending: async () => {
    const response = await axiosInstance.get('/products/trending')
    return response.data
  },
  
  createProduct: async (productData: any) => {
    const response = await axiosInstance.post('/products', productData)
    return response.data
  },
  
  updateProduct: async (id: number, productData: any) => {
    const response = await axiosInstance.put(`/products/${id}`, productData)
    return response.data
  },
  
  deleteProduct: async (id: number) => {
    const response = await axiosInstance.delete(`/products/${id}`)
    return response.data
  },

  getProductCount: async () => {
    const response = await axiosInstance.get('/products/count')
    return response.data
  },
}

export const cartAPI = {
  getCart: async () => {
    const response = await axiosInstance.get('/cart')
    return response.data
  },

  addToCart: async (productId: number, quantity: number, size?: string, color?: string) => {
    const response = await axiosInstance.post('/cart/add', {
      productId,
      quantity,
      size,
      color,
    })
    return response.data
  },

  removeFromCart: async (cartItemId: number) => {
    const response = await axiosInstance.delete(`/cart/item/${cartItemId}`)
    return response.data
  },

  clearCart: async () => {
    const response = await axiosInstance.delete('/cart/clear')
    return response.data
  },
}

export const orderAPI = {
  createOrder: async (data: { shippingAddress: string, paymentMethod: string, couponCode?: string }) => {
    const response = await axiosInstance.post('/orders', data)
    return response.data
  },

  getMyOrders: async (page: number = 0, size: number = 10) => {
    const response = await axiosInstance.get('/orders/my-orders', {
      params: { page, size },
    })
    return response.data
  },

  getOrderById: async (orderId: number) => {
    const response = await axiosInstance.get(`/orders/${orderId}`)
    return response.data
  },
  
  getAllOrders: async (page: number = 0, size: number = 10) => {
    const response = await axiosInstance.get('/orders/admin/all', {
      params: { page, size },
    })
    return response.data
  },

  getUserStats: async () => {
    const response = await axiosInstance.get('/orders/admin/user-stats')
    return response.data
  },
  
  acceptOrder: async (orderId: number) => {
    const response = await axiosInstance.put(`/orders/admin/${orderId}/accept`)
    return response.data
  },

  rejectOrder: async (orderId: number, reason: string) => {
    const response = await axiosInstance.put(`/orders/admin/${orderId}/reject`, null, {
      params: { reason }
    })
    return response.data
  },

  getOrdersByStatus: async (status: string, page: number = 0, size: number = 10) => {
    const response = await axiosInstance.get('/orders/admin/by-status', {
      params: { status, page, size }
    })
    return response.data
  },

  getOrderTracking: async (orderId: number) => {
    const response = await axiosInstance.get(`/orders/${orderId}/tracking`)
    return response.data
  },
}

export const categoryAPI = {
  getAll: async () => {
    const response = await axiosInstance.get('/categories')
    return response.data
  },

  getBySlug: async (slug: string) => {
    const response = await axiosInstance.get(`/categories/${slug}`)
    return response.data
  },
}
export const userAPI = {
  getMe: async () => {
    const response = await axiosInstance.get('/users/me')
    return response.data
  },

  updateProfile: async (userData: any) => {
    const response = await axiosInstance.put('/users/profile', userData)
    return response.data
  },

  changePassword: async (passwordData: any) => {
    const response = await axiosInstance.put('/users/change-password', passwordData)
    return response.data
  },
}

export const wishlistAPI = {
  getWishlist: async (page: number = 0, size: number = 10) => {
    const response = await axiosInstance.get('/wishlist', {
      params: { page, size },
    })
    return response.data
  },

  addToWishlist: async (productId: number) => {
    const response = await axiosInstance.post(`/wishlist/${productId}`)
    return response.data
  },

  removeFromWishlist: async (productId: number) => {
    const response = await axiosInstance.delete(`/wishlist/${productId}`)
    return response.data
  },

  checkWishlist: async (productId: number) => {
    const response = await axiosInstance.get(`/wishlist/check/${productId}`)
    return response.data
  },
}
