# 📝 Task Manager

A full-stack **Task Management Application** built with a React frontend and a microservices-based backend architecture using Spring Boot.

## 🔧 Project Structure

task-manager/

├── task-manager/ frontend # React.js (Styled-Components, JWT Auth)

├── gatewayservice/ # Spring Cloud Gateway (API gateway)

├── registryservice/ # Eureka Service Registry

├── taskservice/ # Microservice for managing tasks

└── userservice/ # Microservice for user registration, login, MFA

## 🚀 Features

### ✅ Frontend (React)
- User authentication (login, register, OTP verification)
- JWT access token storage in session
- Refresh token stored in Cookies, automatic refresh of access token
- Create, view, and manage personal tasks
- Theme toggle (light/dark mode) 
- Client-side routing via `react-router-dom`
- Browser notifications
- Redux for storing the tasks locally
- Each 30 seconds synchronizes and sends updated data to the backend from redux 

### 🔗 Backend (Spring Boot Microservices)
Each backend service is an isolated Spring Boot application:

#### 🧭 Registry Service (Eureka)
- Service discovery via Netflix Eureka

#### 🌐 Gateway Service
- Acts as a single entry point
- Routes traffic to the correct microservice
- Handles CORS and request forwarding
- Verifies JWT tokens
- Rate limiter service

#### 👤 User Service
- User registration and login
- OTP verification (MFA)
- JWT token generation, both access and refresh
- User data persistence
- Email notifications

#### 📋 Task Service
- Task creation, deletion, and retrieval

---

## 🛠️ Technologies Used

### Frontend
- React.js
- React Router
- Axios for API calls

### Backend
- Spring Boot
- Spring Cloud (Eureka, Gateway)
- Spring Security (JWT)
- Spring Data JPA
- MySQL
- Maven

---

## 📦 Getting Started

### Prerequisites
- Node.js + npm
- Java 17+
- Maven
- MySQL

---

## 🔧 Installation

### 1. Clone the Repository

git clone https://github.com/ifonsecaz/task-manager-full-app.git

cd task-manager


### 2. Run the services
cd registryservice

./mvnw spring-boot:run

cd gatewayservice

./mvnw spring-boot:run

cd userservice

./mvnw spring-boot:run

cd taskservice

./mvnw spring-boot:run


### 3. Run the frontend

cd frontend

npm install

npm run dev

# !Important, you need to add the configuration to userservice with the email credentials to send OTP code and reminders