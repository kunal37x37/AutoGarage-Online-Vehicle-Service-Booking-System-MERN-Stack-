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

Click below to watch the complete AutoGarage project demo:

https://github.com/your-username/AutoGarage/assets/123456789/your-video-id

> (This video is an MP4 uploaded directly into the GitHub repository)

## 🖼 Screenshots

| Landing Page| Landing page |
|------------|----------------|
| <img width="1874" height="861" alt="image" src="https://github.com/user-attachments/assets/4dfc4d30-1e08-41f0-9c9e-87753bfc5d32" />|<img width="1852" height="890" alt="image" src="https://github.com/user-attachments/assets/e3aa2ce9-1fdf-4e40-9936-424a13f65824" />|

|Home page | Home page| Home Page |
|------------|----------------|------------|
|<img width="1821" height="891" alt="image" src="https://github.com/user-attachments/assets/f98dafaa-692f-4aaf-bba1-55c098fb9368" />|<img width="1823" height="838" alt="image" src="https://github.com/user-attachments/assets/a76f9eae-6096-4589-a6ab-72b524cbc5d7" />|<img width="1819" height="849" alt="image" src="https://github.com/user-attachments/assets/5b834c99-941f-44e3-91ae-1402c8639e27" />|

|Signup page | Login Form/Logout page|Profile Page|
|------------|----------------|-------------|
|<img width="725" height="517" alt="image" src="https://github.com/user-attachments/assets/30130107-1fdd-42a2-a536-069ec31976ec" />|<img width="805" height="535" alt="image" src="https://github.com/user-attachments/assets/cdc1942a-8108-40a6-912a-942fd308ce80" />|<img width="776" height="495" alt="image" src="https://github.com/user-attachments/assets/19202a86-82b3-4f94-82f2-b6fc24976c67" />|

**User  Screenshots:** 
|User find Garage| Garage Details page|
|------------|----------------|
|<img width="1509" height="876" alt="image" src="https://github.com/user-attachments/assets/5a56d945-069f-41d8-8e39-d80c6361fa89" />|<img width="1200" height="868" alt="image" src="https://github.com/user-attachments/assets/e123d215-ab27-4fe7-ab97-a86d17b2de5b" />|

|Booking Page | MyBooking page|When user click Details button in MyBooking Page|
|------------|----------------|------------------|
|<img width="834" height="824" alt="image" src="https://github.com/user-attachments/assets/aa14443d-2ffc-4276-afc7-c281fe979d33" />|<img width="1358" height="582" alt="image" src="https://github.com/user-attachments/assets/d652775c-b512-47a7-85df-b4355bbb6b1f" />|<img width="817" height="744" alt="image" src="https://github.com/user-attachments/assets/f5422c47-2ed3-4559-b5c3-e88148b67573" />|

**Admin  Screenshots:** 

| Add Garage Page| MY Garge page:User can Edit and Update Garage|
|------------|----------------|
|<img width="641" height="884" alt="image" src="https://github.com/user-attachments/assets/01b90e9f-443d-4e8d-a25e-407236104e42" />| <img width="1529" height="861" alt="image" src="https://github.com/user-attachments/assets/1d92e8c8-4a37-4e19-a92f-5423549d86a1" />|

|  Garage Owner Dashboard Page| Edit Garage page |
|------------|----------------|
| <img width="1919" height="373" alt="image" src="https://github.com/user-attachments/assets/2992bca9-9492-40a3-a2ad-167da49d123f" />|<img width="612" height="879" alt="image" src="https://github.com/user-attachments/assets/303a1602-769f-4403-b235-ca4c6fe82fba" />|

|  Garage Booking Management Page|Garage Management Service Page|
|------------|----------------|
|<img width="1188" height="865" alt="image" src="https://github.com/user-attachments/assets/2e2dee62-569f-411d-8a30-24cb5f8069f0" />|<img width="841" height="510" alt="image" src="https://github.com/user-attachments/assets/d1b74fd8-a922-49da-9073-b5c0be4d5c77" />|

**Databases Screenshots:** 

| User Data | Services Data|
 |------------|----------------|
|<img width="1154" height="704" alt="image" src="https://github.com/user-attachments/assets/2a079fd2-0cc2-4738-82cd-43d9ee7da91b" />|<img width="1225" height="649" alt="image" src="https://github.com/user-attachments/assets/f713ae10-0d17-4ee9-a916-1a985ca55e8f" />|

| Garage Data | Booking Data|
|------------|----------------|
|<img width="1158" height="681" alt="image" src="https://github.com/user-attachments/assets/84a38ffd-a851-474c-9c8f-4976bf65c76c" />|<img width="1048" height="769" alt="image" src="https://github.com/user-attachments/assets/016f4e20-a159-4400-b499-f0103634e8c5" />|

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
GitHub:kunal37x37
Project Link:https://github.com/kunal37x37/AutoGarage-Online-Vehicle-Service-Booking-System-MERN-Stack-
