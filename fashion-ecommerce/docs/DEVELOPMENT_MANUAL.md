# Local Development Manual (Manual Code Execution)

This guide explains how to run the Fashion Ecommerce project manually on your host machine while using Docker ONLY for heavy infrastructure like the Database and Search engine. 

## Prerequisites
- **Docker Desktop** (Installed and running)
- **Java 17+** (JDK)
- **Node.js 18+** & **npm**
- **Maven** (A local version is provided in `apache-maven-3.9.9`)

---

## Step 1: Start Infrastructure (Docker)
Open a terminal in the project root and run:
```bash
docker-compose up -d
```
This starts **MySQL** (port 3307) and **Elasticsearch** (port 9200). 
To stop them: `docker-compose down`.

---

## Step 2: Run Backend (Spring Boot)
Navigate to the `backend` directory and choose one of the following methods:

### Option A: Professional Mode (WITH DOCKER)
Use this now that you have Docker Desktop installed. It uses MySQL and Elasticsearch.
**On Windows:**
```powershell
.\mvnw.cmd spring-boot:run
```

### Option B: Standalone Mode (NO DOCKER)
Use this if you want to run without starting any containers. It uses an in-memory database.
**On Windows:**
```powershell
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=local
```

---

## Step 3: Run Frontend (React/Vite)
Navigate to the `frontend` directory and run:
```bash
npm install
npm run dev
```

The frontend application will be available at: `http://localhost:3000`

---

## Key Configurations
- **MySQL Port**: 3307 (Mapped to 3306 inside container)
- **Database Init**: Files in `database/` are automatically executed on first container start.
- **Environment**: Backend `application.yml` is already configured to talk to the local Docker MySQL.
