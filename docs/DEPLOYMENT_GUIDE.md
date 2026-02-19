# 🚀 UniVerse Deployment Guide: Vercel + Render (Split Hosting)

## How Split Hosting Works

Your system has **two separate apps** that talk to each other:

```
┌─────────────────────┐         ┌─────────────────────┐
│   VERCEL (Free)     │  HTTP   │   RENDER (Free)     │
│                     │ ──────► │                     │
│   universe-client   │         │   universe-server   │
│   (React Frontend)  │ ◄────── │   (Express Backend) │
│                     │  JSON   │                     │
│   Port: 443 (HTTPS) │         │   Port: 10000       │
└─────────────────────┘         └─────────────────────┘
        │                               │
        │ User sees this                │ Connects to this
        ▼                               ▼
   universe.vercel.app          MongoDB Atlas (Cloud DB)
```

**Why split?**

- Vercel is optimized for React (instant CDN, free SSL).
- Render gives your Express server a "real" persistent process.
- MongoDB Atlas is already in the cloud — both connect to it.

---

## 📋 Prerequisites Before You Start

1. ✅ A **GitHub account** (your repo: `haziqariff703/UniVerse`)
2. ✅ A **MongoDB Atlas** connection string (you already have this)
3. ✅ A **Vercel account** — [vercel.com](https://vercel.com) (sign up with GitHub)
4. ✅ A **Render account** — [render.com](https://render.com) (sign up with GitHub)

---

## PART 1: Deploy Backend on Render

### Step 1: Go to Render Dashboard

1. Open [dashboard.render.com](https://dashboard.render.com).
2. Click **"New +"** button (top right).
3. Select **"Web Service"**.

### Step 2: Connect Your GitHub Repo

1. Click **"Connect a repository from GitHub"**.
2. If first time: Authorize Render to access your GitHub.
3. Find and select **`haziqariff703/UniVerse`**.
4. Click **"Connect"**.

### Step 3: Configure the Service

Fill in these settings **exactly**:

| Setting            | Value                                              |
| :----------------- | :------------------------------------------------- |
| **Name**           | `universe-server`                                  |
| **Region**         | `Singapore (Southeast Asia)` ← closest to Malaysia |
| **Branch**         | `main`                                             |
| **Root Directory** | `universe-server`                                  |
| **Runtime**        | `Node`                                             |
| **Build Command**  | `npm install`                                      |
| **Start Command**  | `npm start`                                        |

### Step 4: Select Free Plan

1. Scroll down to **"Instance Type"**.
2. Select **"Free"** ($0/month).

### Step 5: Add Environment Variables

1. Scroll down to **"Environment Variables"**.
2. Click **"Add Environment Variable"** for each:

| Key                   | Value                                         |
| :-------------------- | :-------------------------------------------- |
| `MONGO_URI`           | `mongodb+srv://your_actual_connection_string` |
| `JWT_SECRET`          | `your_actual_secret_key`                      |
| `NODE_ENV`            | `production`                                  |
| `TRUST_PROXY_HOPS`    | `1`                                           |
| `RATE_LIMIT_MAX`      | `300`                                         |
| `RATE_LIMIT_WINDOW_MS`| `600000`                                      |

> Do **not** manually set `PORT` on Render. Render injects the correct runtime port automatically.

> ⚠️ **IMPORTANT**: Use your REAL MongoDB Atlas URI here. The same one from your local `.env` file.

### Step 6: Deploy!

1. Click **"Create Web Service"**.
2. Wait 2-5 minutes. Watch the logs.
3. You will see: `UniVerse Database Connected!` and `Server running on port 10000`.
4. **Copy your Render URL** — it will look like: `https://universe-server-xxxx.onrender.com`

### Step 7: Test Your Backend

Open your browser and go to:

```
https://universe-server-xxxx.onrender.com
```

You should see: **"UniVerse Backend is Online and Optimized!"**

✅ **Backend is LIVE!**

---

## PART 2: Deploy Frontend on Vercel

### Step 1: Go to Vercel Dashboard

1. Open [vercel.com/dashboard](https://vercel.com/dashboard).
2. Click **"Add New..."** → **"Project"**.

### Step 2: Import Your GitHub Repo

1. Find and select **`haziqariff703/UniVerse`**.
2. Click **"Import"**.

### Step 3: Configure the Project

Fill in these settings:

| Setting              | Value                                           |
| :------------------- | :---------------------------------------------- |
| **Project Name**     | `universe-client`                               |
| **Framework Preset** | `Vite` (should auto-detect)                     |
| **Root Directory**   | Click "Edit" → type `universe-client` → confirm |
| **Build Command**    | npm run build                                   |
| **Output Directory** | dist                                            |

### Step 4: Add Environment Variable

1. Expand **"Environment Variables"**.
2. Add:

| Key                 | Value                                       |
| :------------------ | :------------------------------------------ |
| `VITE_API_BASE_URL` | `https://universe-server-xxxx.onrender.com` |

> ⚠️ Replace `xxxx` with your actual Render subdomain from Part 1, Step 6.
> ⚠️ **NO trailing slash!** ✅ `https://universe-server.onrender.com` ❌ `https://universe-server.onrender.com/`

### Step 5: Deploy!

1. Click **"Deploy"**.
2. Wait 1-2 minutes.
3. Vercel will give you a URL like: `https://universe-client.vercel.app`

### Step 6: Test Your Frontend

1. Open `https://universe-client.vercel.app` in your browser.
2. Try logging in with: `admin@universe.com` / `password123`.

✅ **Frontend is LIVE!**

---

## ⚠️ CRITICAL: Hardcoded URL Issue

> **Before deploying**, the frontend has `http://localhost:5000` hardcoded in 70+ files.
> These MUST be replaced with a centralized environment variable.
>
> The fix involves updating `universe-client/src/api/axios.js` to use `import.meta.env.VITE_API_BASE_URL`,
> and replacing all direct `fetch("http://localhost:5000/...")` calls to use a shared constant.
>
> **Without this fix, the frontend will NOT connect to the backend on Render.**

---

## 🔄 Post-Deployment Checklist

- [ ] Backend shows "UniVerse Backend is Online and Optimized!" on Render URL.
- [ ] Frontend loads on Vercel URL.
- [ ] Login works (Admin/Organizer/Student).
- [ ] Events page loads with data.
- [ ] Images display correctly (venues, speakers).

---

## 🐛 Troubleshooting

| Problem                           | Solution                                                                          |
| :-------------------------------- | :-------------------------------------------------------------------------------- |
| **Backend takes 50s to load**     | Normal for Render free tier. First request "wakes up" the server.                 |
| **CORS error in browser console** | Update `cors()` in `index.js` to whitelist your Vercel domain.                    |
| **Images not loading**            | Ensure `helmet` has `crossOriginResourcePolicy: "cross-origin"`.                  |
| **"Cannot connect to server"**    | Check that `VITE_API_BASE_URL` env var in Vercel matches your Render URL exactly. |
| **MongoDB connection fails**      | Whitelist `0.0.0.0/0` in MongoDB Atlas Network Access (allows Render's IP).       |

---

## 📝 Cost Summary

| Service                  | Cost                       |
| :----------------------- | :------------------------- |
| Vercel (Frontend)        | **FREE**                   |
| Render (Backend)         | **FREE** (with cold start) |
| MongoDB Atlas (Database) | **FREE** (M0 tier, 512MB)  |
| **Total**                | **$0/month**               |
