# DocAppoint Server

Express.js backend API for the DocAppoint doctor appointment booking system.

## Features

- RESTful API for doctors and appointments
- Better Auth for email/password login, Google OAuth, and session cookies
- MongoDB database with Mongoose ODM
- Rate limiting on auth routes
- Helmet.js security headers
- CORS configured for cross-origin requests

## Tech Stack

- Express.js
- MongoDB + Mongoose
- Better Auth
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
   BETTER_AUTH_SECRET=your_random_secret_key_min_32_chars
   BETTER_AUTH_URL=http://localhost:5000
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   SERVER_URL=http://localhost:5000
   CLIENT_URL=http://localhost:3000
   CLIENT_URL_PREVIEW=
   ADDITIONAL_TRUSTED_ORIGINS=
   ALLOW_DOCTOR_SEED=true
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
Better Auth owns the `/api/auth/*` routes, including email/password sign-in, sign-up, session, sign-out, and Google OAuth callback handling.

## Security

- HTTP-only cookies for session management
- Better Auth session validation on protected routes
- Rate limiting on authentication endpoints
- Helmet.js for security headers
- CORS whitelist for client origin
- User-scoped queries — users can only access their own data

## Deployment

Recommended platform: **Render**

1. Create a new Web Service on Render
2. Connect your repository
3. Set environment variables in Render Dashboard
4. Build Command: `npm install`
5. Start Command: `npm start`

Required production values:

- `BETTER_AUTH_URL=https://your-render-service.onrender.com`
- `SERVER_URL=https://your-render-service.onrender.com`
- `CLIENT_URL=https://your-production-vercel-domain.vercel.app` or your custom frontend domain
- `NODE_ENV=production`

Google Cloud OAuth setup:

- Authorized JavaScript origin: `https://your-production-vercel-domain.vercel.app`
- Authorized redirect URI: `https://your-render-service.onrender.com/api/auth/callback/google`

If you use a Vercel preview domain or an additional frontend domain, add it to `CLIENT_URL_PREVIEW` or `ADDITIONAL_TRUSTED_ORIGINS`.

## License

MIT License
