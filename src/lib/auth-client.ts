"use client";

import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

const baseURL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const authClient = createAuthClient({
  baseURL,
  plugins: [
    inferAdditionalFields({
      user: {
        role: { type: "string", required: false, defaultValue: "customer" },
        phone: { type: "string", required: false },
        address: { type: "string", required: false },
      },
    }),
  ],
});

export type Session = typeof authClient.$Infer.Session;
