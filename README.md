# Smart Tailoring Management System

Smart Tailoring Management System (Haib Tailor) is a black-and-white themed platform that connects customers with professional tailors, enabling bespoke orders, real-time order tracking, messaging, and payment workflows. The app includes dedicated experiences for customers, tailors, and admins to coordinate orders, manage profiles, and oversee platform health.

## Tech Stack
- **Framework:** Next.js 16 (App Router) with React 19
- **Styling:** Tailwind CSS (v4) with custom design system
- **UI:** Radix UI components and Lucide icons
- **Build/Tooling:** pnpm, TypeScript, ESLint (flat config)

## Key Features
- **Customer Experience:** Tailor search with maps, order placement and tracking, saved measurements, wallet/payments, reviews, and messaging.
- **Tailor Workspace:** Profile and service management, order pipeline, pricing, portfolio and fabrics, measurement adjustments, reviews, and analytics.
- **Admin Controls:** User and tailor approvals, order oversight, refunds, commissions, platform settings, analytics, and notification management.
- **Common Utilities:** JWT-style session mock, payment mocks, email templates, notifications, and MapLibre/OpenStreetMap integration hooks.

## Getting Started
1. **Install dependencies**
   ```bash
   pnpm install
   ```
2. **Run the dev server**
   ```bash
   pnpm dev
   ```
   The app will be available at `http://localhost:3000`.

   > **Note:** The default dev command now uses Webpack (`next dev --webpack`) to avoid Turbopack source-map warnings seen with some setups. If you want to try Turbopack, run `pnpm dev:turbo`.
3. **Lint the project**
   ```bash
   pnpm lint
   ```
4. **Build for production**
   ```bash
   pnpm build
   ```

## Project Structure
- `app/` – Next.js App Router pages for customers, tailors, admins, auth, and APIs.
- `components/` – Reusable UI and feature modules (dashboards, messaging, design gallery, maps, payments, etc.).
- `lib/` – Shared utilities for auth, email, payments, security, and typing.
- `styles/` – Global Tailwind CSS configuration.
- `public/` – Static assets and icons.

## Notes
- Authentication, payments, and data flows are currently mocked for UI/UX completeness; replace with real services before production.
- Map features load MapLibre/OpenStreetMap assets from CDNs; ensure network access when testing maps.
