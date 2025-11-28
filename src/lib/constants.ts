// src/lib/constants.ts
export const API_BASE = process.env.NEXTAUTH_URL
  ? `${process.env.NEXTAUTH_URL}/api`
  : "http://localhost:3000/api";
