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
- [Future Enhancements](#-future-enhancements)
- [License](#-license)
- [Author](#-author)
---

## 🎥 Demo Video

## 🖼 Screenshots

| Landing Page| Landing page |
|------------|----------------|
| <img width="1874" height="861" alt="image" src="https://github.com/user-attachments/assets/4dfc4d30-1e08-41f0-9c9e-87753bfc5d32" />|<img width="1852" height="890" alt="image" src="https://github.com/user-attachments/assets/e3aa2ce9-1fdf-4e40-9936-424a13f65824" />|

|Home page | Home page| Home Page |
|------------|----------------|------------|
|<img width="1821" height="891" alt="image" src="https://github.com/user-attachments/assets/f98dafaa-692f-4aaf-bba1-55c098fb9368" />|<img width="1823" height="838" alt="image" src="https://github.com/user-attachments/assets/a76f9eae-6096-4589-a6ab-72b524cbc5d7" />|<img width="1819" height="849" alt="image" src="https://github.com/user-attachments/assets/5b834c99-941f-44e3-91ae-1402c8639e27" />|

|Signup page | Login Form/Logout page|Profile Page|
|------------|----------------|-------------|
|<img width="725" height="524" alt="image" src="https://github.com/user-attachments/assets/4feb0ec4-34b0-4ae0-8ee4-2f612a7f1b33" />|<img width="782" height="532" alt="image" src="https://github.com/user-attachments/assets/696c32f8-dd61-4006-b476-625d50646496" />|<img width="783" height="498" alt="image" src="https://github.com/user-attachments/assets/bc9c24eb-9922-4099-af8d-ef80d8a5d000" />|

**User  Screenshots:** 
|User find Garage| MyBooking page|
|------------|----------------|
|<img width="495" height="105" alt="image" src="https://github.com/user-attachments/assets/b60e7ea3-43fd-45a9-ac99-47ecf8cf14eb" />|<img width="1079" height="900" alt="image" src="https://github.com/user-attachments/assets/7daa8713-d159-463a-939a-c2039deb0fce" />|

|Print Ticke image/E-Ticket | MyBooking page|
|------------|----------------|
|<img width="435" height="746" alt="image" src="https://github.com/user-attachments/assets/e2fad741-9554-4537-83a2-92aead94d7d0" />|<img width="1079" height="900" alt="image" src="https://github.com/user-attachments/assets/7daa8713-d159-463a-939a-c2039deb0fce" />|

**Admin  Screenshots:** 

| Register Page| Login page |
|------------|----------------|
| <img width="1123" height="639" alt="image" src="https://github.com/user-attachments/assets/11a50676-6dd3-437d-ae6f-fd569f40ddb0" /> | <img width="1032" height="545" alt="image" src="https://github.com/user-attachments/assets/ef9e361c-5499-4620-84b8-ce340283c13a" />|

|  Admin Dashboard Page| Add New Movie page |
|------------|----------------|
| <img width="1205" height="848" alt="image" src="https://github.com/user-attachments/assets/59f28fae-ce75-4137-9a73-23eb2f071b80" /> | <img width="1072" height="764" alt="image" src="https://github.com/user-attachments/assets/75889393-a393-46a6-9510-eb43aa9e88a6" />|

|  Manage Movies[Edit-update-active/inactive Movie] Page| Edit Movie page |
|------------|----------------|
| <img width="1090" height="880" alt="image" src="https://github.com/user-attachments/assets/24d7e4ac-4d08-4e7f-ab6f-8c62f2966bf4" /> |<img width="1059" height="707" alt="image" src="https://github.com/user-attachments/assets/73e9c8ca-b1e3-4241-aa8c-a14b87ecd233" />|

| Manage Showtimes[admin add/delete showtime] Page| Add Showtime Page|
|------------|----------------|
|<img width="1084" height="629" alt="image" src="https://github.com/user-attachments/assets/963b6c3b-8fbb-4dd3-96c5-fab5d2e131e5" />|<img width="1052" height="572" alt="image"   src="https://github.com/user-attachments/assets/009461b6-9a2e-4984-a78a-dc17e2f95904" />|

 | Admin ShowBooking Page | Admin Home Page|
 |------------|----------------|
|<img width="1022" height="889" alt="image" src="https://github.com/user-attachments/assets/c8d8641c-860f-4624-936b-60a63c79d4a3" />|<img width="1117" height="761" alt="image" src="https://github.com/user-attachments/assets/0cf38e03-d8ef-42a8-8d6b-694a366792da" />|



**Databases Screenshots:** 

| User Data | Movies Data|
 |------------|----------------|
|<img width="1239" height="364" alt="image" src="https://github.com/user-attachments/assets/2d0e1337-ba4f-468e-92f2-97ce79c6fcd9" />|<img width="1249" height="285" alt="image" src="https://github.com/user-attachments/assets/d2f1b0b8-6351-42cb-9564-91db4036979a" />|

| Showtime Data | Booking Data|
 |------------|----------------|
|<img width="1003" height="534" alt="image" src="https://github.com/user-attachments/assets/35bef293-b9e2-47e5-9d5f-169d9903b18f" />|<img width="1449" height="665" alt="image" src="https://github.com/user-attachments/assets/e6a316d3-19de-4c4b-8ec7-f080d075b183" />|

---

# 📘 Project Overview

AutoGarage is a **real-world MERN application** developed as an internship project/study perspective.  
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

## ▶ Installation & Setup

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

# 📜 License
This project is licensed under the MIT License.

# 👨‍💻 Author
Patel Kunal Kiranbhai<br>
GitHub:https://github.com/kunal37x37/AutoGarage-Online-Vehicle-Service-Booking-System-MERN-Stack-
