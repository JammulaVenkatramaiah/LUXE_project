# Deployment Guide

Complete guide to deploy the Fashion E-Commerce application to production environments.

## 🌐 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     CDN / CloudFront                    │
└────────────┬────────────────────────────────────────────┘
             │
      ┌──────┴───────────────────────────────┐
      │                                      │
      ▼                                      ▼
┌──────────────────────┐            ┌──────────────────────┐
│  Frontend            │            │  Backend API         │
│  (Vercel/Netlify)    │            │  (AWS/Render)        │
│  - React App         │            │  - Spring Boot       │
│  - Static Files      │            │  - REST API          │
└──────────────────────┘            └──────────┬───────────┘
                                               │
                                        ┌──────┴──────────┐
                                        │                 │
                                        ▼                 ▼
                                    ┌─────────┐      ┌─────────────┐
                                    │ MySQL   │      │ File Storage│
                                    │ (RDS)   │      │ (S3/GCS)    │
                                    └─────────┘      └─────────────┘
```

## 🚀 Frontend Deployment

### Option 1: Vercel Deployment

**Step 1: Build Production Bundle**
```bash
cd frontend
npm run build
```

**Step 2: Create Vercel Account**
- Go to https://vercel.com
- Sign up with GitHub/GitLab/Bitbucket

**Step 3: Deploy**
```bash
npm install -g vercel
vercel
# Follow the prompts
```

**Step 4: Configure Environment Variables**
```
VITE_API_URL=https://your-api-domain.com/api
```

**Step 5: Custom Domain**
- In Vercel Dashboard → Settings → Domains
- Add your custom domain

### Option 2: Netlify Deployment

**Step 1: Build Bundle**
```bash
npm run build
```

**Step 2: Connect GitHub Repository**
- Go to https://netlify.com
- Click "New site from Git"
- Connect GitHub account
- Select repository

**Step 3: Configure Build Settings**
```
Build Command: npm run build
Publish Directory: dist
```

**Step 4: Set Environment Variables**
- Deploy settings → Environment
- Add: `VITE_API_URL=https://your-api-domain.com/api`

### Option 3: AWS S3 + CloudFront

**Step 1: Build**
```bash
npm run build
```

**Step 2: Create S3 Bucket**
```bash
aws s3 mb s3://your-domain-name
```

**Step 3: Upload Files**
```bash
aws s3 sync dist/ s3://your-domain-name/
```

**Step 4: Create CloudFront Distribution**
- AWS Console → CloudFront
- Create distribution
- Origin: S3 bucket
- Default root object: index.html

**Step 5: Configure Custom Domain**
- Route53 → Create alias record
- Point to CloudFront distribution

## ☕ Backend Deployment

### Option 1: AWS EC2 Deployment

**Step 1: Launch EC2 Instance**
```bash
# Choose Ubuntu 22.04 LTS
# Instance type: t3.medium (minimum)
# Security group: Allow ports 22, 80, 443, 8080

# Connect via SSH
ssh -i your-key.pem ubuntu@your-instance-ip
```

**Step 2: Install Dependencies**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Java 17
sudo apt install openjdk-17-jdk -y
java -version

# Install Maven
sudo apt install maven -y
mvn -version

# Install MySQL
sudo apt install mysql-server -y
```

**Step 3: Upload & Run Application**
```bash
# Copy JAR file
scp -i your-key.pem target/ecommerce-api-1.0.0.jar ubuntu@your-instance-ip:/home/ubuntu/

# Connect and run
ssh -i your-key.pem ubuntu@your-instance-ip

# Create application service
sudo nano /etc/systemd/system/ecommerce.service
```

**ecommerce.service Content:**
```ini
[Unit]
Description=Fashion E-Commerce API
After=syslog.target network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu
ExecStart=/usr/bin/java -jar ecommerce-api-1.0.0.jar
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

**Step 4: Enable Service**
```bash
sudo systemctl enable ecommerce
sudo systemctl start ecommerce
sudo systemctl status ecommerce
```

**Step 5: Setup Reverse Proxy (Nginx)**
```bash
sudo apt install nginx -y

# Configure Nginx
sudo nano /etc/nginx/sites-available/default
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Step 6: SSL Certificate (Let's Encrypt)**
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

### Option 2: Render Deployment

**Step 1: Create Render Account**
- Go to https://render.com
- Sign up and create new account

**Step 2: Create Web Service**
- Dashboard → New → Web Service
- Connect GitHub repository

**Step 3: Configure**
```
Build Command: mvn clean package
Start Command: java -jar target/ecommerce-api-1.0.0.jar
```

**Step 4: Environment Variables**
- Add all variables from `application.yml`

**Step 5: Deploy**
- Render automatically deploys on push

### Option 3: AWS Elastic Beanstalk

**Step 1: Install EB CLI**
```bash
pip install awsebcli
```

**Step 2: Initialize**
```bash
cd backend
eb init -p java -r your-region
```

**Step 3: Create Environment**
```bash
eb create ecommerce-env
```

**Step 4: Deploy**
```bash
eb deploy
eb open
```

## 🗄️ Database Deployment

### Option 1: AWS RDS MySQL

**Step 1: Create RDS Instance**
- AWS Console → RDS → Databases → Create database
- Engine: MySQL 8.0
- Instance class: db.t3.micro (free tier)
- Storage: 20GB
- Public accessibility: No (for security)

**Step 2: Configure Security Group**
- Allow MySQL port (3306) from your EC2 instance

**Step 3: Initialize Database**
```bash
# From your application server
mysql -h your-rds-endpoint.aws.com -u admin -p

# Run schema and data scripts
SOURCE schema.sql;
SOURCE sample_data.sql;
```

### Option 2: PlanetScale (MySQL as a Service)

**Step 1: Create Account**
- Go to https://planetscale.com
- Sign up free

**Step 2: Create Database**
- Create new database: `fashion_ecommerce`
- Get connection string

**Step 3: Connect**
```bash
mysql -h your-host.psdb.cloud -u your-user -p --ssl-mode=VERIFY_IDENTITY
```

**Step 4: Initialize**
```sql
SOURCE schema.sql;
SOURCE sample_data.sql;
```

## 📋 Production Configuration

### Backend Production Settings

**application-prod.yml:**
```yaml
spring:
  application:
    name: fashion-ecommerce-api
  
  datasource:
    url: jdbc:mysql://your-rds-endpoint:3306/fashion_ecommerce
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
    hikari:
      maximum-pool-size: 10
      minimum-idle: 5
  
  jpa:
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        jdbc:
          batch_size: 20
        order_inserts: true
  
  jackson:
    serialization:
      indent-output: false
      write-dates-as-timestamps: false

server:
  port: 8080
  servlet:
    context-path: /api
  compression:
    enabled: true
  http2:
    enabled: true

logging:
  level:
    root: INFO
    com.fashion.ecommerce: INFO
  file:
    name: logs/application.log

jwt:
  secret: ${JWT_SECRET}
  expiration: 86400000
```

### Frontend Production Build

**vite.config.ts:**
```typescript
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
        },
      },
    },
  },
})
```

## 🔒 Security Checklist

- [ ] Update sensitive configuration (JWT secret, DB password)
- [ ] Enable HTTPS/SSL on all endpoints
- [ ] Set up firewall rules
- [ ] Enable CORS only for your domain
- [ ] Use environment variables for secrets
- [ ] Enable database backups
- [ ] Set up monitoring and alerts
- [ ] Enable rate limiting
- [ ] Implement DDoS protection
- [ ] Regular security updates

## 📊 Monitoring & Logging

### AWS CloudWatch
```bash
# View logs
aws logs tail /aws/elasticbeanstalk/ecommerce-env --follow
```

### Application Health Checks
```java
@RestController
@RequestMapping("/health")
public class HealthController {
    @GetMapping
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP"));
    }
}
```

### Database Backups
- AWS RDS: Automatic daily backups (retention: 30 days)
- PlanetScale: Automatic backups

## 🔄 CI/CD Pipeline

### GitHub Actions Example

**.github/workflows/deploy.yml:**
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-java@v3
        with:
          java-version: '17'
      - run: cd backend && mvn clean package
      - run: scp -r target/ecommerce-api-1.0.0.jar user@prod-server:/app/

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: actions/upload-artifact@v3
        with:
          path: dist/
```

## 📈 Performance Optimization

### Database Optimization
```sql
-- Add indexes
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_orders_user ON orders(user_id);

-- Enable query caching
SET GLOBAL query_cache_size = 268435456;
```

### Caching Strategy
```java
@Configuration
@EnableCaching
public class CacheConfig {
    @Bean
    public CacheManager cacheManager() {
        return new ConcurrentMapCacheManager("products", "categories");
    }
}
```

### CDN Configuration
```
- Static files: CloudFront/Cloudflare
- API responses: No caching (use ETags)
- Product images: Cache 30 days
```

## 📞 Post-Deployment

1. **Health Checks**
   - Verify API endpoints responding
   - Check database connectivity
   - Monitor logs for errors

2. **Data Verification**
   - Sample data loaded
   - Users can login
   - Products visible
   - Orders can be placed

3. **Performance Testing**
   - Load testing with AB or JMeter
   - Monitor response times
   - Check error rates

4. **Backup Verification**
   - Test database backups
   - Verify restore procedures
   - Document recovery steps

## 🆘 Troubleshooting Deployment

### Service Not Starting
```bash
# Check logs
journalctl -u ecommerce -f

# Restart service
systemctl restart ecommerce
```

### Database Connection Issues
```bash
# Test connection
mysql -h endpoint -u user -p -e "SELECT 1;"

# Check security group rules
aws ec2 describe-security-groups
```

### High CPU Usage
```bash
# Monitor processes
top
ps aux | grep java

# Adjust JVM heap
java -Xmx2g -Xms1g -jar app.jar
```

---

**Deployment Complete! 🎉**
