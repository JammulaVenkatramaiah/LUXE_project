# Fashion E-Commerce Application

A premium, modern fashion e-commerce platform built with React, Spring Boot, and MySQL. This application provides a complete shopping experience with advanced features like product filtering, wishlists, secure checkout, and admin management.

## 🎯 Features

### User Features
- ✅ User registration and JWT authentication
- ✅ Browse products with advanced filtering
- ✅ Search functionality with full-text search
- ✅ Product details with reviews and ratings
- ✅ Shopping cart management
- ✅ Wishlist functionality
- ✅ Secure checkout system
- ✅ Order history tracking
- ✅ Multiple payment options
- ✅ Coupon/discount code support

### Admin Features
- ✅ Admin dashboard
- ✅ Product CRUD operations
- ✅ Category management
- ✅ Order status management
- ✅ User management
- ✅ Sales analytics

### Design Features
- ✅ Dark/Light mode toggle
- ✅ Responsive mobile-first design
- ✅ Smooth animations with Framer Motion
- ✅ Modern UI with Tailwind CSS
- ✅ Accessibility optimized

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router v6** - Navigation
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **Zustand** - State management
- **Vite** - Build tool

### Backend
- **Java 17** - Programming language
- **Spring Boot 3.2** - Framework
- **Spring Security** - Authentication & Authorization
- **Spring Data JPA** - ORM
- **JWT** - Token-based authentication
- **Maven** - Dependency management

### Database
- **MySQL 8.0** - Relational database
- **JPA Hibernate** - ORM

## 📁 Project Structure

```
fashion-ecommerce/
├── frontend/                    # React application
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── pages/              # Page components
│   │   ├── api/                # API services
│   │   ├── context/            # React context
│   │   ├── hooks/              # Custom hooks
│   │   ├── styles/             # Global styles
│   │   └── App.tsx             # Main App component
│   ├── public/                 # Static files
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── backend/                     # Spring Boot application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/fashion/ecommerce/
│   │   │   │   ├── entity/     # JPA entities
│   │   │   │   ├── dto/        # Data Transfer Objects
│   │   │   │   ├── repository/ # JPA repositories
│   │   │   │   ├── service/    # Business logic
│   │   │   │   ├── controller/ # REST endpoints
│   │   │   │   ├── security/   # Security config
│   │   │   │   ├── config/     # App configuration
│   │   │   │   ├── exceptions/ # Exception handling
│   │   │   │   └── utils/      # Utilities
│   │   │   └── resources/
│   │   │       └── application.yml
│   │   └── test/
│   └── pom.xml
│
├── database/
│   ├── schema.sql              # Database schema
│   └── sample_data.sql         # Sample data
│
└── docs/
    ├── API.md                  # API documentation
    ├── SETUP.md                # Setup instructions
    └── DEPLOYMENT.md           # Deployment guide
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Java 17+
- MySQL 8.0+
- Git

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
echo 'VITE_API_URL=http://localhost:8080/api' > .env

# Start development server
npm run dev
```

Frontend will be available at `http://localhost:3000`

### Backend Setup

```bash
cd backend

# Update database configuration in src/main/resources/application.yml
# Configure MySQL connection details

# Build the application
mvn clean package

# Run the application
mvn spring-boot:run
```

Backend API will be available at `http://localhost:8080/api`

### Database Setup

```bash
# Login to MySQL
mysql -u root -p

# Run schema
source database/schema.sql

# Load sample data
source database/sample_data.sql
```

## 📊 Database Schema

### Key Tables
- **users** - Customer and admin accounts
- **products** - Product catalog
- **categories** - Product categories
- **cart** - Shopping carts
- **cart_items** - Items in carts
- **orders** - Customer orders
- **order_items** - Items in orders
- **reviews** - Product reviews
- **wishlist** - Customer wishlists
- **coupons** - Discount coupons

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. User registers or logs in
2. Server generates JWT access token and refresh token
3. Client stores tokens in localStorage
4. JWT is sent in Authorization header for protected routes
5. Tokens are automatically injected in API requests

## 📝 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/validate` - Validate token

### Products
- `GET /api/products` - Get all products (paginated)
- `GET /api/products/{id}` - Get product details
- `GET /api/products/search?keyword={keyword}` - Search products
- `GET /api/products/filter?minPrice={min}&maxPrice={max}` - Filter by price
- `GET /api/products/featured` - Get featured products
- `GET /api/products/trending` - Get trending products

### Cart
- `GET /api/cart` - Get current cart
- `POST /api/cart/add` - Add to cart
- `DELETE /api/cart/item/{id}` - Remove from cart
- `DELETE /api/cart/clear` - Clear cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders/{id}` - Get order details

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/{slug}` - Get category by slug

## 🎨 UI/UX Features

### Design System
- **Color Palette**: Black (#1a1a1a), Gold accent (#d4a574), White
- **Typography**: Playfair Display for headings, Sora for body
- **Spacing**: Consistent 8px / 16px grid
- **Components**: Reusable, modular components

### Animations
- Page transitions with Framer Motion
- Hover effects on products and buttons
- Smooth scroll animations
- Loading states

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Touch-friendly buttons and navigation
- Fast loading with image optimization

## 🔄 State Management

The application uses:
- **React Context API** - Global app state
- **Local Storage** - Persist user authentication
- **Component State** - Local component state with hooks

## 🧪 Testing

### Backend Testing
```bash
cd backend
mvn test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🚢 Deployment

### Frontend Deployment (Vercel/Netlify)
```bash
# Build for production
npm run build

# Deploy to Vercel
npm install -g vercel
vercel
```

### Backend Deployment (AWS/Render)
```bash
# Create JAR file
mvn clean package

# Deploy to AWS EC2 / Render
# Update application.yml for production database
```

### Database Deployment
- AWS RDS MySQL
- PlanetScale (MySQL as a Service)
- DigitalOcean Managed Database

## 📚 Documentation

- [API Documentation](./docs/API.md)
- [Setup Instructions](./docs/SETUP.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

- **Frontend Developer** - React specialist
- **Backend Developer** - Spring Boot specialist
- **UI/UX Designer** - Design & Brand specialist
- **DevOps Engineer** - Deployment & Infrastructure

## 📞 Support

For issues and questions:
- Email: support@luxe-fashion.com
- Issues: GitHub Issues
- Documentation: See /docs folder

---

**Made with ❤️ by the LUXE Fashion Team**
