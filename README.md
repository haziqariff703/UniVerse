# 🚀 UniVerse: Campus Event Management System

## 📋 Project Overview

UniVerse is a MERN-stack application designed for UiTM Puncak Perdana students to manage and discover campus events. It features a comprehensive dashboard for students, organizers, and administrators, supporting event creation, registration, and community management.

## 👥 Team (Group 4)

- **Project Leader:** Muhammad Haziq Bin Ariff 'Ariffin
- **Member 2:** Muhammad Amirul Rasyid Bin Rosli
- **Member 3:** Muhamad Zulfadli Bin Jumaat
- **Member 4:** Safa Muhammad Raziq Bin Abd Rafar

## 🛠️ Tech Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** MongoDB Atlas (NoSQL)

---

## 🚀 Quick Start Guide (Evaluator Mode)

Follow these steps to get the system running locally.

### 1. Prerequisites

- **Node.js** (v16+)
- **Git**
- **MongoDB Atlas URI** (You need a connection string)

### 2. Clone & Setup

```bash
git clone https://github.com/haziqariff703/UniVerse.git
cd UniVerse
```

### 3. Backend Setup (Server)

Open a terminal for the **Server**:

```bash
cd universe-server
npm install
```

**Create a `.env` file in `universe-server/`:**

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=any_secret_key_for_testing
NODE_ENV=development
```

**Start the Server:**

```bash
npm run dev
# Output: "MongoDB Connected" & "Server running on port 5000"
```

### 4. Frontend Setup (Client)

Open a **NEW** terminal for the **Client**:

```bash
cd universe-client
npm install
```

**Create a `.env` file in `universe-client/`:**

```env
VITE_API_BASE_URL=http://localhost:5000
```

**Start the Client:**

```bash
npm run dev
# Output: Local URL (e.g., http://localhost:5173)
```

👉 **Access the App:** Open your browser and go to the link shown in the terminal (usually `http://localhost:5173`).

---

## 🔑 Login Credentials (for Testing)

Use these pre-configured accounts to test different roles:

| Role          | Email                    | Password      | Access Rights                               |
| :------------ | :----------------------- | :------------ | :------------------------------------------ |
| **Admin**     | `admin@universe.com`     | `password123` | Manage Users, Approvals, System Settings    |
| **Organizer** | `organizer@universe.com` | `password123` | Create Events, Manage Venues, View Scanners |
| **Student**   | `student@universe.com`   | `password123` | Browse Events, Register, View Profile       |

---

## 🧪 What to Test (Evaluator Checklist)

1.  **Authentication**: Try logging in with the credentials above.
2.  **Dashboard**: Check the distinct views for Student vs. Admin.
3.  **Events**:
    - **Organizer**: Create a new event.
    - **Student**: Register for that event.
    - **Admin**: View the event in the admin dashboard (if verification is enabled).
4.  **Profile**: Update user profile details.

## ⚠️ Troubleshooting

- **Database Connection Error**: Verify your `MONGO_URI` in `universe-server/.env`. ensure your IP is whitelisted in MongoDB Atlas.
- **CORS Error**: Ensure `VITE_API_BASE_URL` matches the server's running port (default `http://localhost:5000`).
