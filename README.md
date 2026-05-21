# DocAppoint Server

Express.js backend API for the **DocAppoint** doctor appointment booking platform.

## Features

- RESTful API for doctors, appointments, and reviews
- Better Auth for email/password login, Google OAuth, and session cookies
- MongoDB with Mongoose ODM
- Rate limiting on auth routes
- Helmet.js security headers
- CORS whitelist with multi-origin support
- User-scoped queries — users can only access their own data

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Runtime** | Node.js 18+ |
| **Framework** | Express.js |
| **Database** | MongoDB, Mongoose |
| **Authentication** | Better Auth, @better-auth/mongo-adapter |
| **Security** | Helmet, express-rate-limit, CORS |
| **Environment** | dotenv |
| **Dev Tools** | Nodemon |

## Project Structure

```
├── server.js                       # App entry point
└── src/
    ├── config/
    │   ├── auth.js                 # Better Auth configuration (Google OAuth, session)
    │   ├── db.js                   # MongoDB connection
    │   ├── dns.js                  # DNS fallback for Atlas SRV resolution
    │   └── allowedOrigins.js       # CORS origin whitelist builder
    ├── middleware/
    │   └── authSession.js          # Session validation middleware
    ├── models/
    │   ├── Doctor.js               # Doctor schema
    │   ├── Appointment.js          # Appointment schema
    │   └── Review.js               # Review schema
    └── routes/
        ├── doctors.js              # Doctor CRUD + seed
        ├── appointments.js         # Appointment CRUD (protected)
        └── reviews.js              # Review CRUD (protected)
```

## Getting Started

### Prerequisites

- **Node.js 18+**
- **MongoDB Atlas** cluster (or local MongoDB)
- **Google Cloud Console** project (for OAuth)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sahmsec/docappoint-server.git
   cd docappoint-server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file** from the example:
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables:**
   ```env
   MONGODB_URI=your_mongodb_connection_string

   BETTER_AUTH_SECRET=generate_a_random_secret_at_least_32_chars_long
   BETTER_AUTH_URL=http://localhost:5000

   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret

   SERVER_URL=http://localhost:5000
   CLIENT_URL=http://localhost:3000
   CLIENT_URL_PREVIEW=
   ADDITIONAL_TRUSTED_ORIGINS=
   NODE_DNS_SERVERS=

   ALLOW_DOCTOR_SEED=true
   NODE_ENV=development
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Seed demo doctors** (optional):
   ```bash
   curl -X POST http://localhost:5000/api/doctors/seed
   ```

> **Note:** If MongoDB Atlas SRV resolution fails locally with `querySrv ECONNREFUSED`, set `NODE_DNS_SERVERS=8.8.8.8,1.1.1.1` in your `.env` file.

## API Endpoints

### Doctors — `/api/doctors` (Public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/doctors` | Get all doctors. Supports `?search=` (name) and `?sort=` (`rating`, `fee-low`, `fee-high`) |
| `GET` | `/api/doctors/:id` | Get a single doctor by ID |
| `POST` | `/api/doctors/seed` | Seed 6 demo doctors (blocked in production unless `ALLOW_DOCTOR_SEED=true`) |

### Appointments — `/api/appointments` (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/appointments` | Get all appointments for the logged-in user |
| `POST` | `/api/appointments` | Create a new appointment |
| `PUT` | `/api/appointments/:id` | Update an appointment (read-only fields: `doctorName`, `userEmail`) |
| `DELETE` | `/api/appointments/:id` | Delete an appointment |

### Reviews — `/api/reviews` (Mixed)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/reviews/:doctorId` | Public | Get all reviews for a doctor |
| `POST` | `/api/reviews` | Protected | Create a review (must have a booking with the doctor, one review per doctor) |
| `DELETE` | `/api/reviews/:id` | Protected | Delete own review |

### Auth — `/api/auth/*`

Better Auth owns all auth routes including sign-in, sign-up, session management, sign-out, and Google OAuth callback.

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Returns `{ status: "OK" }` |

## Security

- **HTTP-only cookies** for session management
- **Better Auth session validation** on all protected routes
- **Rate limiting** — 50 requests per 15 minutes on auth endpoints
- **Helmet.js** for security headers
- **CORS whitelist** — supports `CLIENT_URL`, `CLIENT_URL_PREVIEW`, and `ADDITIONAL_TRUSTED_ORIGINS`
- **User-scoped queries** — users can only read, update, and delete their own data
- **Trust proxy** enabled for Render / load balancer compatibility

## Deployment

**Recommended platform: [Render](https://render.com)**

1. Create a new **Web Service** on Render
2. Connect your GitHub repository
3. Set environment variables in the Render Dashboard:
   ```env
   MONGODB_URI=your_atlas_connection_string
   BETTER_AUTH_SECRET=your_production_secret
   BETTER_AUTH_URL=https://your-render-service.onrender.com
   SERVER_URL=https://your-render-service.onrender.com
   CLIENT_URL=https://your-vercel-domain.vercel.app
   NODE_ENV=production
   ALLOW_DOCTOR_SEED=false
   ```
4. **Build Command:** `npm install`
5. **Start Command:** `npm start`

### Google OAuth Setup (Production)

- **Authorized JavaScript origin:** `https://your-vercel-domain.vercel.app`
- **Authorized redirect URI:** `https://your-render-service.onrender.com/api/auth/callback/google`

> If you use a Vercel preview domain or additional frontend domains, add them to `CLIENT_URL_PREVIEW` or `ADDITIONAL_TRUSTED_ORIGINS`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with Nodemon (auto-reload) |
| `npm start` | Start production server |

## License

MIT License
