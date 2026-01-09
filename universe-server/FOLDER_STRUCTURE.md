# UniVerse Server - Folder Structure Guide

This document explains the purpose of each folder in the backend.

## 📁 Folder Structure

```
universe-server/
├── config/          # Database & app configuration
├── controllers/     # Route handler logic
├── middleware/      # Express middleware (auth, error handling)
├── models/          # Mongoose schemas/models
├── routes/          # API route definitions
├── services/        # Business logic layer
├── utils/           # Helper/utility functions
├── validators/      # Request validation (Joi schemas)
├── index.js         # Server entry point
├── .env             # Environment variables (DO NOT COMMIT)
└── .env.example     # Environment template
```

---

## 📦 Folder Details

### `/config`

Database connection and application configuration.

```
config/
├── db.js            # MongoDB connection setup
├── cors.js          # CORS configuration
└── jwt.js           # JWT settings
```

### `/controllers`

Handle incoming requests and send responses. Keep them thin!

```
controllers/
├── authController.js
├── eventController.js
└── userController.js
```

### `/middleware`

Express middleware for request processing.

```
middleware/
├── authMiddleware.js    # JWT verification
├── errorMiddleware.js   # Global error handler
└── uploadMiddleware.js  # File upload handling
```

### `/models`

Mongoose schemas defining database structure.

```
models/
├── User.js
├── Event.js
└── Ticket.js
```

### `/routes`

API endpoint definitions. Connect URLs to controllers.

```
routes/
├── authRoutes.js
├── eventRoutes.js
└── userRoutes.js
```

### `/services`

Business logic layer. Controllers call services.

```
services/
├── authService.js       # Login/register logic
├── eventService.js      # Event CRUD logic
└── emailService.js      # Email sending
```

### `/utils`

Helper functions and utilities.

```
utils/
├── generateToken.js     # JWT token generation
├── sendEmail.js         # Email helper
└── helpers.js           # Misc utilities
```

### `/validators`

Request validation using Joi or similar.

```
validators/
├── authValidator.js     # Login/register validation
├── eventValidator.js    # Event data validation
└── userValidator.js     # User update validation
```

---

## 🎯 Quick Reference

| Task                      | Location       |
| ------------------------- | -------------- |
| Define API endpoint       | `/routes`      |
| Handle request/response   | `/controllers` |
| Database schema           | `/models`      |
| Business logic            | `/services`    |
| Validate input            | `/validators`  |
| Auth check/error handling | `/middleware`  |
| Reusable helper           | `/utils`       |
| DB/JWT/CORS config        | `/config`      |

---

## 🔄 Request Flow

```
Request → Routes → Middleware → Controller → Service → Model → Database
                                    ↓
Response ← Controller ← Service ← Model ←
```

---

## 📋 Naming Conventions

- **Files**: camelCase (`eventController.js`)
- **Models**: PascalCase singular (`Event.js`)
- **Routes**: plural (`/api/events`)
- **Controllers**: `[resource]Controller.js`
- **Services**: `[resource]Service.js`
