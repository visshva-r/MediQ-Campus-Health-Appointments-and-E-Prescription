# 🏥 MediQ — Campus Health Appointments & E-Prescription

MediQ is a **full-stack web application** that allows campus students to book doctor appointments, view secure e-prescriptions, and manage health schedules — all in one streamlined platform.

## 🌐 Live Demo
**[Visit MediQ on Vercel](https://mediq-campus-health-appointments-an.vercel.app/)**

---

## 🚀 Key Engineering Highlights
* **Version Migration & Security:** Successfully migrated the application to **Next.js 15**, resolving critical security vulnerabilities (CVE-2025-66478) and adapting to strict React server-component rendering rules.
* **Secure Cloud Storage:** Implemented enterprise-grade file uploads for e-prescriptions using **Supabase Storage** and secure **Signed URLs**, bypassing server payload limits.
* **Database Optimization:** Structured robust ORM connections using **Prisma Singleton** patterns to prevent connection pooling exhaustion in serverless Vercel environments.
* **Automated Uptime:** Integrated continuous monitoring via **UptimeRobot** (HEAD requests) to prevent Supabase database pausing and guarantee 100% resume-ready availability.

---

## ✨ Features
✅ **Role-Based Access Control:** Secure dashboards dynamically rendered for Students, Doctors, and Admins.
✅ **Secure Authentication:** Google OAuth integration via NextAuth.js.
✅ **Appointment Management:** Real-time booking, confirming, completing, and cancelling of doctor slots.
✅ **E-Prescriptions:** Direct-to-cloud PDF/Image uploads for doctors to securely attach to patient records.
✅ **Responsive UI:** Fully mobile-optimized interface built with TailwindCSS.

---

## 🧠 Tech Stack
| Layer | Technology |
|:------|:------------|
| **Frontend** | Next.js 15 (App Router), React, TypeScript |
| **Styling** | TailwindCSS |
| **Backend** | Next.js API Routes (Serverless) |
| **Database** | Supabase (PostgreSQL) |
| **Storage** | Supabase Storage Buckets |
| **ORM** | Prisma |
| **Auth** | NextAuth.js (Google OAuth) |
| **Hosting** | Vercel |

---

## 🛠️ Local Setup

**1. Clone the repository**

```bash
git clone https://github.com/visshva-r/MediQ-Campus-Health-Appointments-and-E-Prescription.git
cd MediQ-Campus-Health-Appointments-and-E-Prescription
```

**2. Configure environment variables**

Copy `.env.example` to `.env.local` and fill in values from your Supabase + Google OAuth dashboards.

```bash
cp .env.example .env.local
```

### Supabase database URLs (important for Vercel)

In **Supabase → Project Settings → Database → Connection string**:

| Variable | Which string to copy | Notes |
|----------|----------------------|--------|
| `DATABASE_URL` | **Transaction pooler** (port **6543**) | Append `?pgbouncer=true&connection_limit=1` at the end |
| `DIRECT_URL` | **Direct connection** URI (port **5432**) | Used for `npx prisma db push` / migrations locally |

Example (replace `YOUR_PROJECT_REF` and password):

```bash
DATABASE_URL=postgresql://postgres.YOUR_PROJECT_REF:PASSWORD@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
DIRECT_URL=postgresql://postgres:PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres
```

Also set on **Vercel → Project → Settings → Environment Variables** (Production + Preview), then **Redeploy**.

> Make sure you have a **`prescriptions`** storage bucket in Supabase with public read access, matching the configuration in `src/lib/signedUpload.ts`.

**3. Install dependencies and run**

```bash
npm install
npm run dev
```

The app will be at **http://localhost:3000**.

**4. Optional: Lint, build, and tests**

```bash
npm run lint          # ESLint (no errors)
npm run build         # Production build
npm run test:e2e      # Playwright e2e tests (starts dev server, requires DATABASE_URL)
```

## 🔒 Supabase Security (RLS)

If you use Supabase, the database linter may report security errors like **“RLS Disabled in Public”** and **“Sensitive Columns Exposed”** for tables in the `public` schema (including NextAuth tables like `Account`, `Session`, etc.).

This repo includes a script to fix those linter findings by enabling (and forcing) RLS:

- Run `supabase/rls.sql` in the **Supabase SQL Editor**

Notes:
- With RLS enabled and **no policies**, the default behavior is **deny** for `anon`/`authenticated` via PostgREST.
- Server-side access via Prisma using your `DATABASE_URL` is unaffected.

## 🩺 Troubleshooting: `tenant/user postgres... not found`

If Vercel logs show:

```text
FATAL: (ENOTFOUND) tenant/user postgres.YOUR_PROJECT_REF not found
```

This means **`DATABASE_URL` on Vercel is wrong or outdated** (not an app code bug). Fix it:

1. Open **Supabase Dashboard** → confirm the project is **Active** (not paused — free tier pauses after inactivity; click **Restore** if needed).
2. **Project Settings → Database → Connection string**
3. Copy **Transaction pooler** (port 6543), replace `[YOUR-PASSWORD]`, add `?pgbouncer=true&connection_limit=1`.
4. In **Vercel → Settings → Environment Variables**, update `DATABASE_URL` (and add `DIRECT_URL` if missing).
5. **Deployments → Redeploy** the latest deployment (env changes do not apply until redeploy).

Password special characters (`@`, `#`, `%`) must be **URL-encoded** in the connection string.