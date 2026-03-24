# ⚽ TURF-X | Premium Sports Booking Platform

TURF-X is a modern, full-stack web application designed for seamless booking of premium artificial grass sports turfs. It natively handles real-time calendar reservations, integrated banking gateways, a secure user dashboard, and an administrative control panel.

![Turf-X Banner](https://images.unsplash.com/photo-1518605368461-1ee12522ce22?q=80&w=2000&auto=format&fit=crop) 

## 🌐 Live Demo
**Production Preview:** [https://turfx-c.vercel.app](https://turfx-c.vercel.app)

---

## ✨ Core Features
- **Dynamic Booking System**: Users can browse, select, and safely reserve 1-hour turf slots up to two weeks in advance.
- **Real-Time Payment Gateway**: Native integration with the **Cashfree Payments Checkout SDK** for processing secure UPI, Net Banking, and Credit Card transit.
- **Admin Control Panel**: Dedicated dashboard for turf owners to track active bookings, manage revenue, and manually override or cancel slots.
- **WhatsApp Bot Integration**: Engineered backend trigger via `whatsapp-web.js` directly texts customers their digital receipts!
- **User Authentication**: Secure JWT-based backend routing ensures payments and bookings are strictly tied to logged-in accounts.

---

## 🛠️ Technology Stack
### Frontend (Client UI)
- **Vite + React (JSX)**: Ultra-fast client rendering.
- **React Router DOM**: Client-side single-page routing mechanisms.
- **Vanilla CSS3**: Highly optimized, modern Glassmorphism architecture (Zero CSS frameworks required).
- **Cashfree JS SDK**: Embedded Drop-in checkout module.

### Backend (API Server)
- **Node.js & Express**: Secure, isolated REST API endpoints.
- **MongoDB Atlas & Mongoose**: Hosted NoSQL Cloud Database retaining user metrics, slot metadata, and transaction states.
- **Axios**: Synchronous API polling to the official Cashfree verification servers.
- **Crypto & JWT**: Advanced password hashing and routing authorization.

---

## How It Works
1. **Frontend Architecture:** The user explores `/book` dynamically loaded from the `AppContext.jsx` state manager.
2. **Order Instantiation:** Pressing checkout triggers the backend Express server `POST /api/create-order` to ping Cashfree.
3. **Redirection Loop:** The user safely pays through the gateway, then bounces back to `/payment?order_id=xyz`.
4. **State Caching:** The React application intercepts the redirect, pulls metadata safely from `localStorage`, and triggers `POST /api/verify-payment`.
5. **Database Finalization:** The backend checks the Cashfree order status natively, officially registers the user into MongoDB, and clears the slot timeline!

---

## 👨‍💻 Local Development
1. Clone the repository: `git clone https://github.com/Vishnusuresh20/TURFX.git`
2. Install dependencies for the backend (`cd turf-booking-backend` & `npm install`)
3. Install dependencies for the frontend (`cd turf-booking` & `npm install`)
4. Create `.env` files dynamically supplying your specific MongoDB URI and Cashfree Keys.
5. Deploy `npm run dev` in both folders and navigate to `http://localhost:5173`!

*Designed and engineered completely from scratch for premium digital sports management.*
