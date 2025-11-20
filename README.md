# 🚗 AutoGarage – Online Vehicle Service & Booking System (MERN Stack)

![GitHub stars](https://img.shields.io/github/stars/your-username/AutoGarage?style=flat&color=yellow)
![GitHub forks](https://img.shields.io/github/forks/your-username/AutoGarage?style=flat&color=orange)
![GitHub license](https://img.shields.io/badge/License-MIT-green.svg)
![Tech](https://img.shields.io/badge/MERN-FullStack-blue)

AutoGarage is a **full-stack MERN web application** that enables users to search nearby garages, view services, and book appointments online.  
Garage owners get a dedicated dashboard to manage garages, services, and customer bookings.

---

## 📌 Features

### 👤 User Features
- Login / Register (JWT Auth)
- Search garages with filters
- View garage details
- Book services
- Track booking status
- Manage profile

### 🧑‍🔧 Garage Owner Features
- Add & manage garage
- Add/Edit/Delete services
- Manage customer bookings
- Owner dashboard
- Messaging module

### 🛠 System Features
- Complete MERN implementation
- JWT authentication with protected routes
- RESTful API architecture
- MongoDB Atlas cloud database
- Responsive UI with Bootstrap

---

## 🛠 Tech Stack

### **Frontend**
- React.js  
- React Router  
- Bootstrap 5  
- Axios  

### **Backend**
- Node.js  
- Express.js  
- JWT Authentication  
- Multer (for file uploads)

### **Database**
- MongoDB Atlas  
- Mongoose ODM  

### **Tools**
- Postman  
- Git & GitHub  
- VS Code  

---

## 📁 Project Folder Structure

### **Frontend**
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
### **Backend**
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

## 🔐 Authentication Flow
Register → Login → JWT Token → Protected Routes →Role-Based Dashboard (User / Garage Owner)

---

## 🔌 REST API Endpoints

### **Auth**
POST /api/auth/register
POST /api/auth/login
GET /api/users/me

### **Garages**
GET /api/garages
GET /api/garages/:id
POST /api/garages
PUT /api/garages/:id

### **Bookings**
POST /api/bookings
GET /api/bookings/user
GET /api/bookings/garage
PUT /api/bookings/:id/status

### **Messages**
POST /api/messages
GET /api/messages/:id


---

## ▶️ How To Run The Project

### **1. Backend Setup**
```bash
cd backend
npm install
npm start
# OR
npm run dev
```
### **2. Frontend Setup**
```bash
cd frontend
npm install
npm start
npm run build
```
