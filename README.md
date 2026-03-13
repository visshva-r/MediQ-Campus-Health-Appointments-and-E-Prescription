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
git clone [https://github.com/visshva-r/MediQ-Campus-Health-Appointments-and-E-Prescription.git](https://github.com/visshva-r/MediQ-Campus-Health-Appointments-and-E-Prescription.git)
cd MediQ-Campus-Health-Appointments-and-E-Prescription
```

**2. Configure environment variables**

Create a `.env.local` file in the project root with values for:

```bash
# NextAuth / Google OAuth
GOOGLE_ID=your-google-oauth-client-id
GOOGLE_SECRET=your-google-oauth-client-secret
NEXTAUTH_SECRET=any-long-random-string
NEXTAUTH_URL=http://localhost:3000

# Database (Supabase or any Postgres)
DATABASE_URL=postgresql://user:password@host:5432/mediq

# Supabase Storage (for prescriptions)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
# Prefer service role for signed uploads; in local dev you can also reuse ANON
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-or-local-key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

> Make sure you have a **`prescriptions`** storage bucket in Supabase with public read access, matching the configuration in `src/lib/signedUpload.ts`.

**3. Install dependencies and run**

```bash
npm install
npm run dev