# Setup Instructions

Complete step-by-step guide to set up the Fashion E-Commerce application locally.

## 📋 Prerequisites

Before starting, ensure you have:
- **Node.js** 16+ with npm (for frontend)
- **Java** 17+ JDK (for backend)
- **MySQL** 8.0+ server
- **Git** for version control
- **Postman** or similar for API testing (optional)

## 💻 System Requirements

- **RAM**: Minimum 4GB, Recommended 8GB
- **Storage**: Minimum 1GB free space
- **CPU**: Dual-core or better
- **OS**: Windows, macOS, or Linux

## 🗄️ Database Setup

### Windows

1. **Install MySQL Server**
   ```bash
   # Download from https://dev.mysql.com/downloads/mysql/
   # Run installer and follow wizard
   ```

2. **Start MySQL Service**
   ```bash
   # MySQL should start automatically or start manually:
   net start MySQL80
   ```

3. **Connect to MySQL**
   ```bash
   mysql -u root -p
   # Enter password if set
   ```

### macOS

```bash
# Install using Homebrew
brew install mysql

# Start MySQL service
brew services start mysql

# Connect
mysql -u root
```

### Linux (Ubuntu)

```bash
# Install MySQL
sudo apt-get update
sudo apt-get install mysql-server

# Start service
sudo systemctl start mysql

# Connect
mysql -u root -p
```

### Create Database

```sql
-- Login to MySQL
mysql -u root -p

-- Create database
CREATE DATABASE fashion_ecommerce;
USE fashion_ecommerce;

-- Import schema
SOURCE /path/to/database/schema.sql;

-- Import sample data
SOURCE /path/to/database/sample_data.sql;

-- Verify
SHOW TABLES;
```

## 🎨 Frontend Setup

### 1. Navigate to Frontend Directory

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Environment File

```bash
# Create .env file in frontend directory
cat > .env << EOF
VITE_API_URL=http://localhost:8080/api
VITE_APP_NAME=LUXE Fashion
EOF
```

### 4. Verify Installation

```bash
npm list react react-dom react-router-dom tailwindcss
```

### 5. Start Development Server

```bash
npm run dev
```

Expected output:
```
  VITE v5.0.8  ready in 1234 ms

  ➜  Local:   http://localhost:3000/
  ➜  press h to show help
```

Frontend is now available at: **http://localhost:3000**

### 6. Build for Production

```bash
npm run build
npm run preview
```

## ☕ Backend Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Configure Database Connection

Edit `src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/fashion_ecommerce?useSSL=false&serverTimezone=UTC
    username: root
    password: your_mysql_password
    driver-class-name: com.mysql.cj.jdbc.Driver

  jpa:
    hibernate:
      ddl-auto: validate  # Use 'validate' to prevent schema changes
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQL8Dialect
```

### 3. Build Project

```bash
# Clean and build
mvn clean package

# Or skip tests during build
mvn clean package -DskipTests
```

### 4. Run Application

```bash
# Option 1: Run with Maven
mvn spring-boot:run

# Option 2: Run JAR directly
java -jar target/ecommerce-api-1.0.0.jar
```

Expected output:
```
2024-01-20 10:30:45.123  INFO 12345 --- [main] c.f.e.FashionECommerceApplication : Starting FashionECommerceApplication
...
2024-01-20 10:30:48.456  INFO 12345 --- [main] c.f.e.FashionECommerceApplication : Started in 3.333 seconds
```

Backend API is now available at: **http://localhost:8080/api**

## 🧪 Testing the Setup

### Test Database Connection

```bash
# From backend directory
mvn test
```

### Test Frontend

1. Open http://localhost:3000
2. Try to navigate through the app
3. Check browser console for errors

### Test API Endpoints

```bash
# Test authentication
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@fashion.com",
    "password": "admin@123"
  }'

# Test products
curl http://localhost:8080/api/products

# Test categories
curl http://localhost:8080/api/categories
```

## 🔑 Sample Credentials

After running `sample_data.sql`:

**Admin Account**
- Email: `admin@fashion.com`
- Password: `$2a$10$slYQmyNdGzin7olVN3p1H.5q8E8aZ8Z8aZ8E8aZ8Z8Z8aZ8a8a8a` (password123)

**Regular Users**
- Email: `john@example.com` / Password: `password123`
- Email: `jane@example.com` / Password: `password123`

## 📱 Development Workflow

### 1. Start MySQL
```bash
# Windows
net start MySQL80

# macOS
brew services start mysql

# Linux
sudo systemctl start mysql
```

### 2. Start Backend
```bash
cd backend
mvn spring-boot:run
```

### 3. Start Frontend (New Terminal)
```bash
cd frontend
npm run dev
```

### 4. Open Browser
Navigate to: **http://localhost:3000**

## 🐛 Troubleshooting

### MySQL Connection Error
```
java.sql.SQLNonTransientConnectionException: Cannot get a connection, pool error

Solution:
- Ensure MySQL is running: mysql -u root -p
- Check connection details in application.yml
- Verify database name and credentials
```

### Port Already in Use
```
Address already in use: bind

Solution:
# Find process using port
lsof -i :8080  (macOS/Linux)
netstat -ano | findstr :8080  (Windows)

# Kill process or use different port
```

### Node Modules Error
```
Module not found: Can't resolve 'react'

Solution:
rm -rf node_modules package-lock.json
npm install
```

### Java Version Mismatch
```
Unsupported class version 61.0

Solution:
# Update JAVA_HOME or ensure Java 17+
java -version
```

## 📦 Dependencies

### Frontend Key Dependencies
- react@18.2.0
- react-router-dom@6.20.0
- tailwindcss@3.3.6
- framer-motion@10.16.16
- axios@1.6.2

### Backend Key Dependencies
- spring-boot@3.2.0
- spring-security@6.2.0
- jjwt@0.12.3
- mysql-connector-java@8.2.0

## 🚀 Optimization Tips

### Frontend
```bash
# Enable production mode
export NODE_ENV=production
npm run build

# Minify bundle size
npm run build --report
```

### Backend
```yaml
# In application.yml for production
server:
  compression:
    enabled: true
  http2:
    enabled: true

spring:
  jpa:
    properties:
      hibernate:
        jdbc:
          batch_size: 20
        order_inserts: true
```

## 📚 Next Steps

1. Read [API Documentation](./API.md)
2. Read [Deployment Guide](./DEPLOYMENT.md)
3. Explore sample data in database
4. Create first user account
5. Make your first purchase

## ✅ Checklist

- [ ] MySQL installed and running
- [ ] Database schema created
- [ ] Sample data loaded
- [ ] Backend dependencies installed
- [ ] Backend running on port 8080
- [ ] Frontend dependencies installed
- [ ] Frontend running on port 3000
- [ ] Can login with admin account
- [ ] Can view products
- [ ] Can add items to cart

## 📞 Getting Help

If you encounter issues:
1. Check error messages carefully
2. Review the troubleshooting section
3. Check application logs
4. Review GitHub issues
5. Contact support team

---

**Happy coding! 🚀**
