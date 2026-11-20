import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { nextCookies } from "better-auth/next-js";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MongoDB_URI as string);
const db = client.db("gear_nest");

const baseURL = process.env.BETTER_AUTH_URL || "http://localhost:3000";

const googleProvider =
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
      }
    : {};

export const auth = betterAuth({
  baseURL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(db, { client }),
  trustedOrigins: [baseURL],
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: true,
  },
  socialProviders: googleProvider,
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: true,
      },
      phone: {
        type: "string",
        required: false,
        input: true,
      },
      address: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const requested = (user as { role?: string }).role;
          const role = requested === "owner" ? "owner" : "customer";
          return { data: { ...user, role } };
        },
      },
    },
  },
  plugins: [
    jwt({
      jwt: {
        issuer: baseURL,
        audience: baseURL,
        expirationTime: "1h",
        definePayload: ({ user }) => ({
          role: (user as { role?: string }).role ?? "customer",
          email: user.email,
          name: user.name,
        }),
      },
    }),
    nextCookies(),
  ],
});

export type Auth = typeof auth;
