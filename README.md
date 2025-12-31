
# 📌 Donation & Charity Management Portal

A full-stack web application that connects **donors** with **verified NGOs** for food, funds, and clothing donations. The system supports **donation posting, contribution confirmations, pickup scheduling, donation tracking, and optional donor leaderboards** — built using **Angular, Node.js (TypeScript), and MySQL**.

## 🚀 Tech Stack

**Frontend**
- Angular 16+
- Angular Material
- SCSS

**Backend**
- Node.js + Express (TypeScript)
- RESTful APIs

**Database**
- MySQL

## 🎯 Features

### 👥 User Roles
- **Donor** – Browse & contribute to donation requests, schedule pickups, view history  
- **NGO** – Create & manage donation requests, approve contributions  
- **Admin (optional)** – Monitor system, analytics & moderation

### 📦 Donation Management
- NGOs create donation requests with:
  - Type (food, funds, clothes, etc.)
  - Quantity / amount
  - Pickup date & location
  - Optional images & priority flag
- NGOs can **edit, cancel, or update status**

### 🤝 Contributions & Pickup Scheduling
- Donors browse active requests
- Filter by **type, location, date**
- Confirm contribution
- Schedule pickup (physical donations)
- View complete donation history

### 🏆 Optional Features
- Donor leaderboard
- Email / SMS notifications
- Analytics (Admin)

## 🧭 Suggested Angular Routes

| Path | Component | Description |
|------|---------|-------------|
| `/donations` | DonationListComponent | Browse donation requests |
| `/donations/:id` | DonationDetailsComponent | View donation details |
| `/donations/:id/contribute` | ContributionComponent | Confirm & schedule pickup |
| `/ngo/dashboard` | NGODashboardComponent | Manage NGO requests |
| `/donor/dashboard` | DonorDashboardComponent | View donation history |
| `/leaderboard` *(optional)* | LeaderboardComponent | Top donors |

## 🗄️ Database Schema (MySQL)

### `users`
```
id, name, role, contact_info, created_at
```

### `donations`
```
id, ngo_id, donation_type, quantity_or_amount,
location, pickup_date_time, status,
images, priority, created_at
```

> Simple relation: **Users ↔ Donations**

## 🔐 Validation Rules
- Donation type & quantity must not be empty
- Quantity / amount > 0
- Pickup date cannot be in the past
- Role must be valid (Donor / NGO / Admin)

## ⚙️ API Modules (Backend)
- `/api/users`
- `/api/donations`
- `/api/contributions`
- `/api/pickups`
- `/api/leaderboard` *(optional)*

Includes:
- Proper HTTP status codes
- Error handling & logging
- Schedule conflict handling

## 🛡️ Role-Based Access (Angular Guards)
- Unauthorized users are redirected to **Login / Not Authorized**
- Guards ensure secure role workflows

## 🏗️ Project Setup

### 🔧 Backend Setup
```bash
cd backend
npm install
npm run dev
```

### 🎨 Frontend Setup
```bash
cd frontend
npm install
ng serve
```

### 💾 Database Setup
```sql
Create MySQL database
Update DB credentials in backend config
Run migrations / schema script
```

## 📂 Recommended Folder Structure
```
/frontend
  /src/app
    /components
    /services
    /guards
/backend
  /src
    /controllers
    /routes
    /models
    /middleware
```

## 📝 Contribution Guidelines
- Use TypeScript for backend & frontend
- Follow Angular Material UI standards
- Commit meaningful messages

## 📮 Feedback & Enhancements
Feel free to submit issues or feature requests in the repository.
