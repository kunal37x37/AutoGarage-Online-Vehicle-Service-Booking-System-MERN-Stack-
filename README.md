# 🚗 AutoGarage – Online Vehicle Service & Booking System (MERN Stack)

![GitHub stars](https://img.shields.io/github/stars/your-username/AutoGarage?style=flat&color=yellow)
![GitHub forks](https://img.shields.io/github/forks/your-username/AutoGarage?style=flat&color=orange)
![GitHub license](https://img.shields.io/badge/License-MIT-brightgreen)
![Tech](https://img.shields.io/badge/TechStack-MERN-blue)

AutoGarage is a **full-stack MERN application** that allows users to search nearby garages, explore services, and book appointments online.  
Garage owners get a complete dashboard to manage garages, services, bookings, and customers.  
This system is built using **React.js, Node.js, Express.js, and MongoDB Atlas**.

---

# 📌 Table of Contents

- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [📸 Screenshots](#-screenshots)
- [🎥 Demo Video](#-demo-video)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Folder Structure](#-folder-structure)
- [API Endpoints](#-api-endpoints)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [Workflow](#-workflow)
- [Security Features](#-security-features)
- [Future Enhancements](#-future-enhancements)
- [License](#-license)
- [Author](#-author)

---

# 📘 Project Overview

AutoGarage is a **real-world MERN application** developed as an internship project.  
It provides an **end-to-end vehicle service booking flow** from both **User** and **Garage Owner** roles.

Users can:
- Search garages  
- Read service details  
- Book appointments  
- Track booking status  

Garage owners can:
- Add garages  
- Manage services  
- Manage bookings  
- Handle customer communication  

This system is designed with **clean UI, secure authentication, scalable backend, and cloud database support**.

---

# 🎯 Key Features

## 👤 User Features
- Register / Login / Logout  
- Search garages with filters  
- View garage details + owner details  
- Service booking with date/time  
- MyBookings list + detailed booking page  
- Update user profile  
- Real-time messaging with garage owner  

## 🧑‍🔧 Garage Owner Features
- Register/Login as Owner  
- Add and Publish Garage  
- Add/Edit/Delete Services  
- Manage bookings from customers  
- Update booking status (Pending → Accepted → Completed)  
- Manage garage details  
- Messaging module  

## ⚙ System Features
- MERN-based full-stack architecture  
- REST API design  
- JWT authentication + role-based access  
- MongoDB Atlas cloud storage  
- Multer image handling  
- Responsive UI using Bootstrap  
- Clean and scalable folder structure  

---

# 🧩 System Architecture
Frontend (React.js) → REST API (Express.js) → Database (MongoDB Atlas)


### 🟦 Frontend  
- React Components  
- Axios API Calls  
- Bootstrap UI  
- Authentication (JWT stored in localStorage)  

### 🟥 Backend  
- Node.js + Express.js  
- JWT Authentication  
- Role-based API protection  
- Multer file uploading  
- Controllers & Routes  

### 🟩 Database  
- MongoDB Atlas  
- Mongoose Schemas  
- Relationship linking (User → Garage → Bookings)

---

# 🛠 Tech Stack

### **Frontend**
- React.js  
- React Router  
- Bootstrap 5  
- Axios  

### **Backend**
- Node.js  
- Express.js  
- JWT Auth  
- Multer  

### **Database**
- MongoDB Atlas  
- Mongoose  

### **Tools**
- VS Code  
- GitHub  
- Postman  

---

# 📁 Folder Structure

### 🟦 Frontend
```md
frontend/
  src/
    components/
      AddGarage.jsx
      AutoGarageApp.jsx
      AutoGarageHomepage.jsx
      AutoGarageLanding.jsx
      BookingConfirmation.jsx
      BookingPage.jsx
      GarageDetails.jsx
      GarageOwnerDashboard.jsx
      GarageServices.jsx
      ManageServices.jsx
      MessagesPage.jsx
      MyBookings.jsx
      MyGarages.jsx
      UserProfile.jsx
    styles/
      AutoGarageHomepage.css
    App.js
    index.js
```
### 🟥 Backend
```md
backend/
  middleware/
    admin.js
    auth.js
    garageOwner.js
    services.js
  models/
    Booking.js
    Garage.js
    Message.js
    User.js
  routes/
    admin.js
    auth.js
    bookings.js
    garages.js
    messages.js
    users.js
  uploads/
  server.js
```


---

# 🌐 API Endpoints

### Auth
### **Auth**
POST /api/auth/register<br>
POST /api/auth/login<br>
GET /api/users/me<br>

### **Garages**
GET /api/garages<br>
GET /api/garages/:id<br>
POST /api/garages<br>
PUT /api/garages/:id<br>

### **Bookings**
POST /api/bookings<br>
GET /api/bookings/user<br>
GET /api/bookings/garage<br>
PUT /api/bookings/:id/status<br>

### **Messages**
POST /api/messages<br>
GET /api/messages/:id<br>


---

## ▶️ Installation & Setup

### **1. Clone the Repository**
```bash
git clone https://github.com/kunal37x37/AutoGarage-Online-Vehicle-Service-Booking-System-MERN-Stack-/edit/main/README.md
cd AutoGarage
```
### **2. Backend Setup**
```bash
cd backend
npm install
npm start        # OR npm run dev
```
### **3. Frontend Setup**
```bash
cd frontend
npm install
npm start      
```

## 🔑 Environment Variables
### **Backend (.env)**
```bash
PORT=5000
MONGO_URI=your_mongodb_atlas_url
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
```
### **Frontend (.env)**
```bash
REACT_APP_API_URL=http://localhost:5000/api      
```

## 📊 Database Collections
- Users
- Garages
- Services
- Bookings
- Messages

## 🏗 Workflow
User → Search Garage → View Details → Book Service → Confirm Booking → Track Status<br>
<br>
Garage Owner → Add Garage → Add Services → Manage Bookings → Update Status

## 🚀 Future Enhancements
- Payment Gateway Integration
- Admin Dashboard
- Push Notifications
- Google Maps API for location tracking
- AI-based service recommendation
- Message Page

## 📜 License
This project is licensed under the MIT License.

## 👨‍💻 Author
Patel Kunal Kiranbhai<br>
GitHub:https://github.com/kunal37x37/AutoGarage-Online-Vehicle-Service-Booking-System-MERN-Stack-
