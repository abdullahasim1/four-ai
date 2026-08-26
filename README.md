# Four AI — AI-Powered Voice & Image Generation Platform

Four AI is a full-stack **Next.js (App Router)** application that provides
AI-powered tools for voice generation, text-to-speech, voice changing, and image
generation — frontend and backend in a single deployable app.

- **Frontend**: React 19 + Next.js 15 + Tailwind CSS 4 + Framer Motion
- **Backend**: Next.js Route Handlers (`app/api/**`) with Neon PostgreSQL,
  bcrypt password hashing, and a server-side Hugging Face proxy

## Live Demo

https://four-ai-dev.vercel.app/

---

## Features

### AI Tools
- **Voice Generator** — type anything and hear it in natural browser voices,
  with speed control and quick-start presets
- **Text to Speech** — full TTS studio: language/voice selection, speed,
  per-voice previews and use-case presets
- **Voice Changer** — apply effects (robot, echo, reverb, distortion, tremolo,
  lowpass) to uploaded audio; processed locally in the browser, exported as WAV
- **Image Generator** — text-to-image via Stable Diffusion. The Hugging Face
  token stays on the server; the client calls our own `/api/generate/image`

### User Features
- Secure signup / login / logout (bcrypt-hashed passwords, DB-backed sessions)
- Email confirmation on signup — accounts must verify their address before logging in
- Forgot password flow (invalidates existing sessions)
- Profile management (name, phone, address, avatar upload with client-side resize)
- Settings: display name, email change (uniqueness-checked), password change
- Usage history synced to your account

### Admin Features
- Admin logs in via the normal login page (`ADMIN_EMAIL` env var grants the admin role)
- Live user list straight from PostgreSQL (search + stats)
- Ban / unban users — banning also kills their active sessions

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router), React 19, JavaScript |
| Styling | Tailwind CSS 4, Framer Motion, React Icons |
| Backend | Next.js Route Handlers (Node runtime) |
| Database | Neon PostgreSQL via `@neondatabase/serverless` (HTTP driver) |
| Security | bcryptjs, DB-backed bearer sessions, role-based admin access |
| AI | Hugging Face Inference API (server-side proxy), Web Speech API, Web Audio API |

---

## Project Structure

```
├── app/
│   ├── layout.jsx                 # Root layout (fonts, Toaster, metadata)
│   ├── page.jsx                   # Landing page (/)
│   ├── globals.css                # Tailwind 4 theme + design system
│   ├── (public)/                  # Marketing pages (Navbar + Footer)
│   │   ├── layout.jsx
│   │   ├── home/
│   │   ├── features/
│   │   ├── pricing/
│   │   ├── team/
│   │   └── explore-voice-library/
│   ├── login/ · signup/ · forgot-password/ · logout/
│   ├── (protected)/               # Auth-guarded pages (client guard + shell)
│   │   ├── layout.jsx
│   │   ├── voice-generator/ · text-to-speech/ · voicechanger/ · imagegenerator/
│   │   └── profile/ · settings/ · history/
│   ├── admin/dashboard/
│   └── api/                       # ★ Backend (Route Handlers)
│       ├── auth/signup|login|logout|forgot-password/route.js
│       ├── account/profile|email|password|history/route.js
│       ├── admin/users|ban-user/route.js
│       ├── generate/image/route.js    # Hugging Face proxy
│       └── test|db-test/route.js      # Health checks
├── components/                    # Navbar, Footer, PageShell, Toaster, tools…
├── lib/
│   ├── db.js                      # Neon SQL client + schema init
│   ├── session.js                 # Bearer-token auth helpers (server)
│   ├── auth-client.js             # localStorage session helpers (client)
│   ├── api.js                     # fetch wrapper for /api/*
│   ├── http.js                    # validation / rate-limit utils
│   ├── toast.js · useSpeech.js · wavEncoder.js
└── public/                        # logo + team images
```

## API Routes

All routes live under `/api` in this same app (same-origin — no CORS needed).

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/signup` | Register new user (sends confirmation email) | None |
| POST | `/api/auth/login` | Login (returns session token) | None |
| GET | `/api/auth/verify-email?token=` | Confirm email from the emailed link | None |
| POST | `/api/auth/resend-verification` | Resend confirmation email | None |
| POST | `/api/auth/logout` | Invalidate session | Bearer token |
| POST | `/api/auth/forgot-password` | Reset password | None |
| GET/PUT | `/api/account/profile` | Read / update profile | Bearer token |
| PUT | `/api/account/email` | Change email | Bearer token |
| PUT | `/api/account/password` | Change password | Bearer token |
| GET/POST | `/api/account/history` | Read / record activity history | Bearer token |
| GET | `/api/admin/users?search=` | List users | Bearer token (admin role) |
| POST | `/api/admin/ban-user` | Ban / unban a user | Bearer token (admin role) |
| POST | `/api/generate/image` | Generate an image from a prompt | Bearer token |

Health checks: `GET /api/test`, `GET /api/db-test`

## Database Schema

Created automatically on first API request:

```sql
users     (id, name, email UNIQUE, password /* bcrypt */, phone, address,
           avatar, banned, role /* 'user' | 'admin' */, created_at)
sessions  (token UUID PK, user_id -> users, created_at)
activities(id, user_id -> users, feature, description, created_at)
```

---

## Environment Variables

Create `.env.local` in the project root (see `.env.example`):

```env
DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require
ADMIN_EMAIL=admin@example.com
RESEND_API_KEY=re_xxxxxxxxxx
HUGGING_FACE_API_KEY=hf_xxxxxxxxxxxxxxxxxx
```

> No `VITE_*` variables needed anymore — frontend and backend are one app.

## Local Setup

```bash
npm install
cp .env.example .env.local     # fill in your values
npm run dev                    # http://localhost:3000
```

## Deployment (Vercel)

1. Create a free database at [neon.tech](https://neon.tech).
2. Import this repo into Vercel (auto-detected as Next.js — no config needed).
3. Add environment variables: `DATABASE_URL`, `ADMIN_EMAIL`, `HUGGING_FACE_API_KEY`.
4. Deploy. That's it — frontend and API deploy together.

## Image Generation Models

Tried in order until one succeeds (all proxied through the backend):

1. `stabilityai/stable-diffusion-2-1`
2. `stabilityai/stable-diffusion-xl-base-1.0`
3. `runwayml/stable-diffusion-v1-5`

## Voice Changer Effects

Normal · Robot · Slow · Fast · Echo · Distortion · Reverb · Tremolo · Lowpass

## Pages & Routes

| Route | Page | Access |
|-------|------|--------|
| `/` | Landing page | Public |
| `/home`, `/features`, `/pricing`, `/team` | Marketing pages | Public |
| `/explore-voice-library` | Voice library | Public |
| `/login`, `/signup`, `/forgot-password`, `/logout` | Auth | Public |
| `/voice-generator`, `/text-to-speech`, `/voicechanger`, `/imagegenerator` | AI tools | Auth required |
| `/profile`, `/settings`, `/history` | Account | Auth required |
| `/admin/dashboard` | Admin panel | Admin (role-based) |

## Team

| Name | Role |
|------|------|
| Saif Ur Rahman | Lead Developer |
| Abdullah Bin Asim | Frontend Developer |
| M Adeel Gujar | Backend Developer |
| Malik Mujahid Azam Lail | UI/UX Designer |

## License

This project is for educational and personal use.
