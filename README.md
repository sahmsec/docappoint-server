# DocAppoint Server

Express.js backend API for the DocAppoint doctor appointment booking system.

## Features

- RESTful API for doctors and appointments
- JWT-based authentication with secure middleware
- MongoDB database with Mongoose ODM
- Password hashing with bcryptjs
- Rate limiting on auth routes
- Helmet.js security headers
- CORS configured for cross-origin requests

## Tech Stack

- Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- express-rate-limit
- helmet
- cors

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas cluster (or local MongoDB)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Configure your environment variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_random_secret_key_min_32_chars
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   SERVER_URL=http://localhost:5000
   CLIENT_URL=http://localhost:3000
   NODE_ENV=development
   ```

4. Run the server:
   ```bash
   npm run dev
   ```

5. Seed demo doctors (optional):
   ```bash
   curl -X POST http://localhost:5000/api/doctors/seed
   ```

## API Endpoints

### Doctors (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/doctors` | Get all doctors (supports `?search=` and `?sort=`) |
| GET | `/api/doctors/:id` | Get single doctor |
| POST | `/api/doctors/seed` | Seed demo doctors |

### Appointments (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/appointments` | Get user's appointments |
| POST | `/api/appointments` | Create appointment |
| PUT | `/api/appointments/:id` | Update appointment (read-only: doctorName, userEmail) |
| DELETE | `/api/appointments/:id` | Delete appointment |

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user (JWT protected) |
| PUT | `/api/auth/profile` | Update profile (JWT protected) |
| POST | `/api/auth/google` | Google OAuth login/register |

## Security

- HTTP-only cookies for session management
- JWT verification middleware on protected routes
- Rate limiting on authentication endpoints
- Helmet.js for security headers
- CORS whitelist for client origin
- Password hashing with bcryptjs (salt rounds: 10)
- User-scoped queries — users can only access their own data

## Deployment

Recommended platform: **Render**

1. Create a new Web Service on Render
2. Connect your repository
3. Set environment variables in Render Dashboard
4. Build Command: `npm install`
5. Start Command: `npm start`

## License

MIT License


