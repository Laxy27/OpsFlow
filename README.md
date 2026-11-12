# OpsFlow

**A simple, modern business operations dashboard.**

OpsFlow is a lightweight dashboard for a small business that needs to track customer orders, monitor revenue and manage day-to-day operations. It is a front-end portfolio project: a polished, fully working MVP built with Next.js, TypeScript and Tailwind CSS, with data saved in the browser.

> **Demo notice:** OpsFlow runs entirely in your browser. It ships with ~40 fictional sample orders for an imaginary print & branding studio. None of it is real customer data. Changes are saved to your browser's `localStorage` and can be reset at any time.

<!-- Screenshot: add docs/screenshots/dashboard.png and replace this comment with: ![OpsFlow dashboard](docs/screenshots/dashboard.png) -->

---

## Features

### Dashboard
- **Four KPI cards**, all calculated from the current order data:
  - **Total orders**: every order, in any status
  - **Total revenue**: the value of **completed** orders only
  - **Pending orders**: orders not yet started, with the processing count shown beside them
  - **Completion rate**: completed ÷ (all orders − cancelled)
- **Revenue chart**: completed revenue per week over the last 13 weeks
- **Order volume chart**: orders placed per week over the last 13 weeks
- **Recent orders** and an **orders-by-status** breakdown. Each status row links to a filtered order list.
- Everything updates as soon as an order is added, edited, deleted or changes status

### Order management
- Responsive data table on desktop that becomes a card list on mobile
- **Add** and **edit** orders in a form that validates each field and shows the total as you type
- **Change status** in place from a status menu on each row
- **Delete** with a confirmation dialog
- **Search** by customer, product or order ID
- **Filter** by status, with a count beside each status
- **Sort** by newest, oldest, highest or lowest amount
- Filters and sorting are kept in the URL, so a filtered view can be bookmarked or shared
- **Export CSV** of the currently filtered orders

### Data and reliability
- `localStorage` persistence: changes survive page refreshes
- Demo data is loaded only on the first visit and is never duplicated
- **Reset demo data** action, with a confirmation step
- Damaged saved data is detected, replaced with the demo data and reported to the user
- If storage is blocked (e.g. some private browsing modes), the app keeps working in memory and shows a clear warning
- Changes made in one tab show up in your other open OpsFlow tabs

### Quality
- Strict TypeScript, ESLint, and 66 unit tests for the business logic
- Accessible: semantic HTML, labeled controls, full keyboard support, visible focus states, a skip link, and hidden data tables that let screen readers read the charts
- No hydration mismatches: browser-only data loads after hydration and shows loading skeletons until then

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS 4 |
| UI components | [shadcn/ui](https://ui.shadcn.com) (Radix UI primitives) |
| Charts | [Recharts 3](https://recharts.org) |
| Icons | [Lucide](https://lucide.dev) |
| Notifications | [Sonner](https://sonner.emilkowal.ski) |
| Testing | [Vitest](https://vitest.dev) |
| Persistence | Browser `localStorage` |

No backend, no database, no authentication and no paid services.

## Getting started

### Prerequisites
- Node.js **22.12 or newer** (Node 24 LTS recommended)
- npm

### Installation

```bash
git clone https://github.com/Laxy27/OpsFlow.git opsflow
cd opsflow
npm install
```

### Running locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Available scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run the TypeScript compiler without emitting files |
| `npm test` | Run the unit tests once |
| `npm run test:watch` | Run the tests in watch mode |
| `npm run check` | Lint, typecheck, test and build in one go |

## Architecture overview

```
src/
├── app/                    Routes (App Router)
│   ├── layout.tsx          Root layout: font, app shell, toaster
│   ├── page.tsx            Dashboard route
│   └── orders/page.tsx     Orders route
├── components/
│   ├── layout/             Sidebar, mobile header, demo notice, page header
│   ├── dashboard/          KPI cards, charts, recent orders, status breakdown
│   ├── orders/             Table, toolbar, filters, form and delete dialogs
│   └── ui/                 shadcn/ui components
├── hooks/
│   └── use-orders.ts       React hook that subscribes to the order store
└── lib/                    Framework-free logic (unit tested)
    ├── types.ts            Order, status and filter types
    ├── demo-data.ts        Fictional sample dataset
    ├── orders.ts           Create / update / delete helpers, totals, IDs
    ├── metrics.ts          KPI and chart calculations
    ├── filters.ts          Search, filter, sort, URL params
    ├── csv.ts              CSV generation and download
    ├── validation.ts       Form and stored-record validation
    ├── storage.ts          localStorage load/save with validation
    ├── order-store.ts      Single source of truth for order data
    ├── dates.ts / format.ts Date and number formatting helpers
tests/                      Vitest unit tests
```

**Key design decisions**

- **Single source of truth.** All order data lives in one small external store (`lib/order-store.ts`). Components read it through `useSyncExternalStore`, so the dashboard, the orders table and the sidebar count always agree.
- **Business logic is plain TypeScript.** Calculations, filtering, CSV and validation live in `lib/` with no React code, so they are easy to read and unit test.
- **Totals are derived, never stored.** An order's total is always `quantity × unit price`, rounded to cents, so it can't fall out of sync.
- **Hydration-safe persistence.** The server and the browser's first render both show a loading state, and saved data loads right after hydration.
- **Dates are plain calendar dates** (`YYYY-MM-DD`) and are calculated in UTC, so time zones can't shift orders between days or weeks.
- **CSV opens cleanly in Excel.** RFC 4180 quoting, CRLF line endings and a UTF-8 BOM. Cells that start with `=`, `+`, `-` or `@` are neutralized so spreadsheets can't run them as formulas.

## Demo limitations

- Data is stored in **one browser only**. It isn't shared between devices or browsers, and clearing site data removes it.
- There is no authentication or multi-user support. Anyone using the browser can see and change the data.
- `localStorage` holds roughly 5 MB, far more than this demo needs.
- Revenue is assigned to the week of the **order date** (there is no separate completion date).
- Amounts are in USD only.
- Demo dates are generated relative to the day the data is first loaded or reset, so the charts always show recent activity.

## Screenshots

> Placeholders: capture these from the running app and save them in `docs/screenshots/`.

| Screen | File |
| --- | --- |
| Dashboard (desktop) | `docs/screenshots/dashboard.png` |
| Orders table with filters | `docs/screenshots/orders.png` |
| New / edit order dialog | `docs/screenshots/order-form.png` |
| Mobile dashboard and orders | `docs/screenshots/mobile.png` |

## Deployment

OpsFlow is a static-friendly Next.js app with no environment variables, so it deploys to Vercel with default settings. See **[DEPLOYMENT.md](DEPLOYMENT.md)** for step-by-step instructions.

Quick version:

```bash
npm i -g vercel
vercel        # preview deployment
vercel --prod # production deployment
```

## License

This project is for portfolio purposes. All sample data is fictional.
