# ☕ The Coffee Express

> Fresh roasted. Delivered to your door.

A full-stack coffee truck delivery platform built in React. Four views in one app — customer, employee, merchant, and business — deployable on Vercel in minutes.

---

## What's Inside

### ☕ Customer View
- **Zone map** — areas light up green when a truck is loaded, inspected, and en route. Gray zones show as unavailable.
- **Order tab** — full menu with cart, fan favorites, and one-tap ordering by zone
- **Coffee Love tab** — auto-scrolling testimonials from verified purchasers only, with each customer's cup count displayed
- **Cups loyalty program** — every order earns 1 cup. At 20 cups, the customer earns a free drink automatically applied to their next order
- **Track tab** — order status tracker

### 🚐 Employee View
- Assigned truck and zone displayed on login
- **Daily inspection checklist** — photo-by-photo walkthrough (front, rear, sides, interior, stock) like a U-Haul pre-check
- Progress bar advances with each photo confirmation
- **Mark En Route** button — lights the zone green on the customer map
- Today's stops pulled live from pending orders in the driver's zone
- Full shift schedule: 5:00 AM arrival → 5:30 AM residential routes → 8:00 AM downtown park spot → 11:00 AM office routes → 2:30 PM return to base

### 🏪 Merchant View
- **Zone control panel** — flip any zone live or offline with one click
- **Orders table** — all orders with status cycling (pending → en route → delivered)
- **Fleet tab** — per-truck inspection status, odometer, last service, stock loaded
- **Staff tab** — full roster with roles, shifts, and contact info
- **Inventory tab** — stock levels with reorder alerts and ±adjustment controls

### 📊 Business / White Label View
- **Interactive profit model** — sliders for fleet size, drinks per shift, avg price, and work days
- Auto-calculates revenue, COGS, OpEx, net profit, and margin per truck and for the full fleet
- **Startup cost breakdown** — truck, equipment, licensing, branding, platform fee
- **Break-even calculator** — shows how many months to recoup startup investment
- **Revenue bar chart** — actual 2025 YTD revenue
- **White label licensing card** — $299/mo flat, no per-order fees, full branding customization

---

## Shift Model

| Time | Activity |
|------|----------|
| 5:00 AM | Drivers arrive at base, inspect truck, load stock |
| 5:30 AM | Depart — residential morning routes (zones go green) |
| 8:00 AM | Downtown park spot — walk-up service |
| 11:00 AM | Office & commercial routes |
| 2:00 PM | Return to base, restock, end-of-day report |
| 3:00 PM | Shift ends |

Drivers are home before school pickup and afternoon traffic.

---

## ☕ Cups Loyalty Program

- Every purchase = 1 cup
- Every **20 cups** = 1 free drink
- Free drink is automatically applied to the next order (lowest-priced item in cart)
- Cup counts are tracked per customer name and persisted in localStorage
- Testimonials on the Coffee Love tab show each customer's cup count
- Customers who have earned a free cup see a gold banner at checkout

---

## 💛 Coffee Love — Testimonial Scroller

- Auto-scrolling strip of verified customer testimonials
- Pauses on hover
- Only shows customers who have placed at least one order (verified purchasers)
- Each card displays the customer's name, zone, quote, and cup count
- Below the scroller, all testimonials are listed individually with a mini progress bar showing their cups toward the next free drink

---

## Deploying to Vercel

Uses the same base setup as the LiveStock template.

### `package.json`
```json
{
  "name": "the-coffee-express",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "web-vitals": "^3.0.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "DISABLE_ESLINT_PLUGIN=true react-scripts build"
  },
  "browserslist": {
    "production": [">0.2%", "not dead", "not op_mini all"],
    "development": ["last 1 chrome version"]
  }
}
```

### `vercel.json`
```json
{
  "installCommand": "npm install",
  "buildCommand": "npm run build"
}
```

### `src/index.js`
```js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
```

### Steps
1. Copy `CoffeeExpress.jsx` content into `src/App.js`
2. Replace `package.json` with the one above
3. Add `vercel.json` to the repo root
4. Replace `src/index.js` with the clean version above
5. Push to GitHub — Vercel auto-deploys

---

## Tech Stack

- **React 18** — hooks only, no external libraries
- **Zero UI dependencies** — all styles are inline JS objects
- **localStorage** — all data persisted per browser session
- **Google Fonts** — Playfair Display, Dancing Script, DM Sans
- **CSS animation** — testimonial scroller uses `@keyframes scrollLeft` injected via `<style>` tag

---

## White Label Licensing

| | |
|---|---|
| Monthly fee | $299/mo |
| Setup fee | $0 |
| Per-order commission | 0% |
| Includes | All 4 views, custom branding, your domain |

---

## Project Structure

```
src/
  App.js          ← Full platform (CoffeeExpress.jsx)
  index.js        ← Clean entry point
  index.css       ← Minimal global reset
public/
  index.html
package.json
vercel.json
README.md
```

---

*Built with React · Deployed on Vercel · The Coffee Express © 2025*
