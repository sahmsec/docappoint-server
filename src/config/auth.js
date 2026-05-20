const { MongoClient } = require("mongodb");

const { betterAuth } = require("better-auth");

const {
  mongodbAdapter,
} = require("better-auth/adapters/mongodb");

const client = new MongoClient(process.env.MONGODB_URI);

const db = client.db();

const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  secret: process.env.BETTER_AUTH_SECRET,

  baseURL:
    process.env.SERVER_URL || "http://localhost:5000",

  basePath: "/api/auth",

  trustedOrigins: [
    process.env.CLIENT_URL || "http://localhost:3000",
    "http://localhost:3000", 
    "http://localhost:3001"
  ],

  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
    defaultCookieAttributes: {
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  },

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
});

module.exports = auth;