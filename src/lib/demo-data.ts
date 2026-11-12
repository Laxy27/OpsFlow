import { addDays } from "./dates";
import type { Order, OrderStatus } from "./types";

/**
 * Demo dataset for a fictional print & branding studio.
 *
 * All customers, products and amounts are invented for demonstration
 * purposes. They do not represent real businesses or real customer data.
 *
 * Dates are stored as "days before the seed date" so the demo always looks
 * current: when the data is first seeded (or reset), the newest order is
 * dated today and the oldest roughly twelve weeks ago.
 */
type DemoRecord = [
  daysAgo: number,
  customer: string,
  product: string,
  quantity: number,
  unitPrice: number,
  status: OrderStatus,
];

const DEMO_RECORDS: DemoRecord[] = [
  [83, "Harbor & Pine Bakery", "Custom Printed Mailer Boxes", 250, 2.85, "completed"],
  [81, "Brightline Fitness", "Embroidered Polo Shirts", 24, 32, "completed"],
  [79, "Copperleaf Dental", "Business Card Print Run (500)", 4, 48, "completed"],
  [77, "Summit Ridge Outfitters", "Vinyl Banner (3x6 ft)", 3, 89, "completed"],
  [75, "Meadowbrook Realty", "Yard Sign Set", 40, 14.5, "completed"],
  [72, "Ironclad Brewing", "Product Label Rolls", 12, 64, "completed"],
  [70, "Juniper Lane Florals", "Logo Design Package", 1, 1200, "cancelled"],
  [68, "Lumen Yoga Studio", "Tri-fold Brochures (1,000)", 2, 185, "completed"],
  [65, "Redwood Legal Group", "Letterhead & Envelope Set", 5, 120, "completed"],
  [63, "Silverfin Seafood", "Custom Printed Mailer Boxes", 500, 2.6, "completed"],
  [60, "Kestrel Analytics", "Trade Show Booth Graphics", 1, 2450, "completed"],
  [58, "Bluebird Pediatrics", "Appointment Reminder Cards", 10, 36, "completed"],
  [56, "Tidewater Events", "Event Signage Bundle", 2, 780, "completed"],
  [53, "Old Mill Hardware", "Vinyl Banner (3x6 ft)", 6, 89, "completed"],
  [51, "Cedar & Sage Spa", "Gift Card Printing (250)", 3, 95, "cancelled"],
  [49, "Maple Street Books", "Branded Tote Bags", 150, 6.4, "completed"],
  [46, "Harbor & Pine Bakery", "Product Label Rolls", 8, 64, "completed"],
  [44, "Brightline Fitness", "Window Decals", 10, 42, "cancelled"],
  [42, "Summit Ridge Outfitters", "Catalog Design & Layout", 1, 1850, "completed"],
  [39, "Copperleaf Dental", "Branded Notebooks", 200, 4.75, "completed"],
  [37, "Ironclad Brewing", "Event Signage Bundle", 1, 780, "completed"],
  [35, "Meadowbrook Realty", "Business Card Print Run (500)", 12, 48, "completed"],
  [32, "Kestrel Analytics", "Packaging Design Consultation (hourly)", 6, 150, "completed"],
  [30, "Juniper Lane Florals", "Custom Printed Mailer Boxes", 300, 2.85, "completed"],
  [28, "Silverfin Seafood", "Menu Board Printing", 4, 135, "cancelled"],
  [25, "Lumen Yoga Studio", "Embroidered Polo Shirts", 18, 32, "completed"],
  [23, "Redwood Legal Group", "Tri-fold Brochures (1,000)", 3, 185, "completed"],
  [21, "Tidewater Events", "Trade Show Booth Graphics", 1, 2450, "completed"],
  [18, "Bluebird Pediatrics", "Window Decals", 6, 42, "completed"],
  [16, "Old Mill Hardware", "Product Label Rolls", 15, 64, "completed"],
  [14, "Maple Street Books", "Bookmark Print Run (1,000)", 2, 78, "processing"],
  [12, "Cedar & Sage Spa", "Branded Tote Bags", 100, 6.4, "processing"],
  [10, "Harbor & Pine Bakery", "Logo Design Package", 1, 1200, "processing"],
  [9, "Brightline Fitness", "Vinyl Banner (3x6 ft)", 4, 89, "completed"],
  [7, "Summit Ridge Outfitters", "Custom Printed Mailer Boxes", 400, 2.7, "processing"],
  [5, "Ironclad Brewing", "Branded Notebooks", 120, 4.75, "pending"],
  [4, "Kestrel Analytics", "Letterhead & Envelope Set", 2, 120, "completed"],
  [3, "Copperleaf Dental", "Yard Sign Set", 25, 14.5, "pending"],
  [1, "Tidewater Events", "Event Signage Bundle", 3, 780, "pending"],
  [0, "Juniper Lane Florals", "Gift Card Printing (250)", 2, 95, "pending"],
];

const FIRST_DEMO_ID = 1001;

/** Builds the demo orders relative to `seedDate` (YYYY-MM-DD). */
export function createDemoOrders(seedDate: string): Order[] {
  return DEMO_RECORDS.map(
    ([daysAgo, customer, product, quantity, unitPrice, status], index) => ({
      id: `ORD-${FIRST_DEMO_ID + index}`,
      customer,
      product,
      quantity,
      unitPrice,
      orderDate: addDays(seedDate, -daysAgo),
      status,
    }),
  );
}
