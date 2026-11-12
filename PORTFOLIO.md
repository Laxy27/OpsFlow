# OpsFlow: Portfolio Materials

## Upwork portfolio title

**OpsFlow: Order & Revenue Dashboard for Small Businesses (Next.js + TypeScript)**

## Project description

OpsFlow is a clean, responsive operations dashboard that helps a small business track customer orders, see revenue and spot bottlenecks at a glance. It includes live KPI cards, weekly revenue and order-volume charts, a full order management table with search, filters and sorting, and one-click CSV export for spreadsheets. I built it with Next.js, TypeScript, Tailwind CSS and shadcn/ui, with a focus on reliable business logic, accessibility and a polished B2B SaaS look.

## The business problem

Many small businesses run their order pipeline from spreadsheets, email threads and memory. That makes it hard to answer simple questions quickly:

- How much revenue have we actually completed?
- Which orders are still waiting to be started?
- Is order volume going up or down?
- Can I hand my accountant a clean export?

Spreadsheets get out of sync, totals get typed by hand, and nobody has a single view of the business.

## The solution

OpsFlow gives the owner one place to manage orders and see the numbers that matter:

- A **dashboard** with four KPIs (orders, revenue, pending orders, completion rate), all calculated from the actual order data, plus weekly revenue and volume charts
- An **orders workspace** to add, edit, update status and delete orders, with totals calculated automatically and the form checked as you type
- **Search, status filters and sorting** to find any order in seconds, with the view kept in the URL so it can be shared
- **CSV export** of exactly what's on screen, formatted to open correctly in Excel
- **Instant updates**: changing an order's status updates the KPIs and charts right away

The portfolio version stores data in the browser so anyone can try it without signing up. The architecture keeps all data access in one module, so adding a real backend later only touches that layer.

## Features demonstrated

- Modern React and Next.js App Router architecture
- Strict TypeScript domain modeling (orders, statuses, filters)
- Shared state with `useSyncExternalStore`, one source of truth for all screens
- Calculated KPIs with clearly defined business rules
- Data visualization with Recharts: tooltips, accessible data tables, consistent color usage
- Create, edit, update and delete with confirmation dialogs and honest success/error toasts
- Form validation with inline, accessible error messages
- Search, filter and sort, kept in the URL
- RFC 4180 CSV export that opens correctly in Excel and is safe from formula injection
- `localStorage` persistence with validation, recovery from damaged data and a fallback when storage is blocked
- Responsive layout: sidebar on desktop, drawer navigation and card lists on mobile
- Accessibility: keyboard navigation, focus states, labels, skip link, screen-reader-friendly charts
- Loading skeletons, empty states, validation states and storage warnings
- 66 unit tests covering KPI calculations, filtering, CSV, storage and validation
- Lint, typecheck, test and build all pass

## Technologies used

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · shadcn/ui · Radix UI · Recharts · Lucide Icons · Sonner · Vitest · Vercel

## Suggested screenshots

1. **Dashboard hero** at 1440px wide: KPI cards plus both charts, with the revenue tooltip hovered
2. **Orders table**: the "Completed" filter active with a search term typed in
3. **New order dialog**: filled in, showing the calculated total
4. **Validation state**: the form showing inline error messages
5. **Status change**: the status menu open on a row
6. **Delete confirmation** dialog
7. **Mobile views** side by side: dashboard, the orders card list and the open navigation drawer
8. **CSV in Excel**: the exported file open in a spreadsheet

Tip: click **Reset demo data** before taking screenshots so the numbers look consistent.

## 60-second demo video script

| Time | On screen | Voice-over |
| --- | --- | --- |
| 0:00–0:07 | Dashboard, full view | "This is OpsFlow, an operations dashboard I built for small businesses that track orders and revenue." |
| 0:07–0:17 | Hover the KPI cards, then the revenue chart tooltip | "The KPIs and weekly charts are all calculated from the actual orders. Revenue counts completed orders only, so the numbers stay honest." |
| 0:17–0:30 | Click **New order**, fill in the form, show the total updating, click **Create order** | "Adding an order is quick. The form checks every field and calculates the total as you type." |
| 0:30–0:38 | Open the new order's status menu, choose **Completed**, switch to the Dashboard | "When I mark it completed, revenue and the completion rate update straight away." |
| 0:38–0:48 | Orders page: type a search, click a status filter, change the sort, click **Export CSV** | "Search, status filters and sorting find any order in seconds, and the current view exports to a clean CSV that opens in Excel." |
| 0:48–0:55 | Refresh the page; resize to mobile and open the menu | "Everything is saved in the browser and survives a refresh, and the whole app works on mobile." |
| 0:55–1:00 | Back to the dashboard | "OpsFlow is built with Next.js, TypeScript and Tailwind, and fully tested. Thanks for watching." |
