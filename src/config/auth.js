const { MongoClient } = require("mongodb");
const { betterAuth } = require("better-auth");
const { mongodbAdapter } = require("better-auth/adapters/mongodb");
const buildAllowedOrigins = require("./allowedOrigins");

const client = new MongoClient(process.env.MONGODB_URI);

const db = client.db();
const isProduction = process.env.NODE_ENV === "production";
const trustedOrigins = buildAllowedOrigins();

const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  secret: process.env.BETTER_AUTH_SECRET,

  baseURL:
    process.env.BETTER_AUTH_URL ||
    process.env.SERVER_URL ||
    "http://localhost:5000",

  basePath: "/api/auth",

  trustedOrigins,

  advanced: {
    useSecureCookies: isProduction,
    defaultCookieAttributes: {
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
    },
  },

  emailAndPassword: {
    enabled: true,
  },

  account: {
    accountLinking: {
      enabled: true,
      requireLocalEmailVerified: false,
      trustedProviders: ["google"],
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
});

module.exports = auth;
