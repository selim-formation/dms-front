# DMS Demo Walkthrough (10-minute interview script)

Speak this page-by-page. Timings are guides, not hard stops.

---

## 0. One-line pitch (30s)
"Multi-tenant Document Management System — companies/departments manage documents, tasks, sharing, and team access, with role/permission-based control per tenant."

---

## 1. Login (30s)
- Email/password sign-in, "Remember me", "Forgot password?"
- SSO option: **Continue with Microsoft**
- "Last login method" hint shown to returning users
- Auth is a Sanctum **httpOnly cookie** (`/api/login`, `/api/me`) — no token stored in JS, XSS-safe
- Unauthenticated users hitting any protected URL get bounced to `/login?redirect=<original path>` and land back there after signing in

---

## 2. Home / Dashboard (1.5 min)
URL: `/{tenant}`
- Personalized greeting banner + quick **Upload Document** CTA
- KPI tiles: Total Documents, Users, Total Tasks, Renewal Documents (%)
- **Pinned Documents** rail (quick access)
- **Recent Documents** list w/ department + owner
- **Recent Tasks** list w/ status
- Analytics: Documents by Type, by Department, by Establishment/Operational (charts)

---

## 3. Documents (2 min)
URL: `/{tenant}/documents`
- Full-text search bar
- View tabs: **All / Types / Departments**
- **Advanced Filters** panel: Entity (Operational/Establishment), Renewal (One-Time/Renewable), Importance (low/medium/high)
- Document cards: title (Arabic/English), department + type chips, renewal + importance badges
- Per-card quick actions: **favorite (star)**, **pin**
- Click-through to document detail: metadata, download, comments panel, share dialog (create share w/ recipients)

---

## 4. Tasks (1 min)
URL: `/{tenant}/tasks`
- Search by title/description, Filter button
- Task cards: title, description, **priority** (High/Medium), **status** (To Do / In Progress / Completed), due date, assignee

---

## 5. Favorites & Pinned (1 min)
URLs: `/{tenant}/favorites`, `/{tenant}/pinned-documents`
- Personal shortcuts to frequently/important documents, with personal notes on favorites
- Empty states link straight back to **Browse Documents**

---

## 6. Document Shares (1 min)
URL: `/{tenant}/document-shares`
- Two tabs: **Shared by me** / **Shared with me**
- Tracks external/internal document sharing per user

---

## 7. Team (1 min)
URL: `/{tenant}/teams`
- Stats: Total Members, Active, Administrators
- Filter chips by department (Finance, HR, Legal Affairs, Logistics, Maintenance, Planning, Procurement, EHS...)
- Member cards: name, department, role badge (Manager/No role), email, doc count, shared count

---

## 8. Profile (1 min)
URL: `/{tenant}/profile`
- User info + join date
- Stat tiles: Documents, Favorites, Pinned, Tasks
- Tabbed activity history (Documents/Favorites/Pinned/Tasks) with approval status

---

## 9. Global chrome (30s)
- Top nav: Home / Documents / Tasks / Favorites / Pinned / Shares / Teams
- Currency toggle (EGP symbol), light/dark theme toggle, global search icon, notifications bell
- **Notifications** drawer: All / Reminders / Active Reminders tabs

---

## 10. Under the hood (closing, 1 min — only if asked)
- React + TanStack Router (file-based routes) + TanStack Query
- **Multi-tenant**: tenant slug in the URL, validated server-side, tenant switch persisted in a cookie
- **RBAC**: permission checks gate both nav visibility and direct-URL access (not just hidden buttons)
- Auth: Laravel Sanctum cookie session, CSRF-protected
- i18n: Arabic content/RTL alongside English UI labels
