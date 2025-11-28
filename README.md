# NextBlog — Full-Stack Blog Platform (Next.js 16 App Router)

![Next.js](https://img.shields.io/badge/Next.js-14%2B-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?style=flat&logo=typescript)
![NextAuth](https://img.shields.io/badge/NextAuth-v5-green?style=flat)
![MongoDB](https://img.shields.io/badge/MongoDB-secure-brightgreen?style=flat&logo=mongodb)
![Zod](https://img.shields.io/badge/Zod-Validation-orange?style=flat)
![Tailwind](https://img.shields.io/badge/Tailwind-Responsive-38B2AC?style=flat&logo=tailwind-css)
![Tests](https://img.shields.io/badge/Tests-Jest%20%26%20RTL-red?style=flat)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

## Tech Stack (Senior Full-Stack Level)

- **Next.js 16+** (App Router + Server Components)
- **TypeScript** (strict mode, zero `any`)
- **NextAuth v5** (Credentials + JWT + bcrypt)
- **MongoDB + Mongoose** (proper connection pooling)
- **Zod** (shared validation — frontend + backend)
- **Tailwind CSS** (clean, responsive UI)
- **Jest + React Testing Library** (unit & integration tests)
- **RESTful API** design
- **Server Actions ready** (future-proof)

## Features

- Secure authentication (bcrypt hashed passwords)
- Create, Read, Update, Delete posts
- Single `/create` page handles both **Create** and **Edit** (`?edit=id`)
- Shared Zod validation (no invalid data ever saved)
- Ownership protection (users can only edit/delete their posts)
- Responsive dashboard with pagination
- Clean, minimal, professional UI
- 100% TypeScript strict
- Full test coverage
- Deploy-ready for Vercel

## Project Structure (2025 Standard)

```bash
src/
├── app/                # App Router
│   ├── (auth)/login/
│   ├── create/         # Single page: create + edit
│   ├── dashboard/
│   └── api/posts/      # RESTful routes
├── components/         # Reusable UI
├── lib/                # Auth, DB connection
├── models/             # Mongoose models
├── schemas/            # Zod schemas (shared)
├── types/              # TypeScript interfaces
└── tests/              # Jest tests
```

## How to run

```bash
git clone https://github.com/yourusername/nextjs-protected-blog
cd nextjs-protected-blog
cp .env.example .env.local
npm install
npm run dev
```
