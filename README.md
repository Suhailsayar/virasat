# 🪔 Virasat Connect — Heritage Tracker

> A platform where artisans register handmade products and generate a **Digital Birth Certificate** via QR code to prove authenticity and tell their story.

---

## 🏗️ Project Structure

```
virasat-connect/
├── server/                  # Node.js + Express API
│   ├── config/db.js         # MySQL connection pool
│   ├── middleware/auth.js   # JWT verification middleware
│   ├── routes/
│   │   ├── auth.js          # POST /register, POST /login, GET /me
│   │   └── products.js      # POST /, GET /mine, GET /:certId, GET /calculator/estimate
│   ├── schema.sql           # ← RUN THIS FIRST
│   ├── index.js             # Express app entry point
│   └── .env.example         # Copy to .env and fill in values
│
├── client/                  # React + Vite + Tailwind
│   └── src/
│       ├── context/AuthContext.jsx   # JWT auth state
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── ProtectedRoute.jsx
│       │   └── FairTradeCalculator.jsx
│       └── pages/
│           ├── HomePage.jsx
│           ├── LoginPage.jsx
│           ├── RegisterPage.jsx
│           ├── DashboardPage.jsx       # Protected
│           └── ProductStoryPage.jsx    # Public + Printable Certificate
│
└── package.json             # Root: runs both with concurrently
```

---

## ⚡ Quick Setup (Step by Step)

### Step 1 — MySQL Database

```bash
# Make sure MySQL is running, then:
mysql -u root -p < server/schema.sql

# Verify it worked:
mysql -u root -p -e "USE virasat_connect; SHOW TABLES;"
# Should show: artisans, products
```

### Step 2 — Server Environment

```bash
cd server
cp .env.example .env
```

Open `.env` and fill in:
```
DB_PASSWORD=your_mysql_root_password
JWT_SECRET=run_this_to_generate: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Step 3 — Install Dependencies

```bash
# From project root:
npm install          # installs concurrently
npm run install:all  # installs server + client deps
```

### Step 4 — Run Everything

```bash
npm run dev
```

This starts:
- **API** → http://localhost:5000
- **Frontend** → http://localhost:5173

---

## 🌐 Routes & Features

| Route | Description |
|---|---|
| `/` | Landing page |
| `/register` | Artisan registration |
| `/login` | Artisan login |
| `/dashboard` | 🔒 Protected workspace: register products, view QR codes |
| `/product/:certificateId` | Public product story page + printable certificate |

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Body | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | name, email, password, craft, village, state, bio | — |
| POST | `/api/auth/login` | email, password | — |
| GET | `/api/auth/me` | — | Bearer token |

### Products
| Method | Endpoint | Body / Params | Auth |
|---|---|---|---|
| POST | `/api/products` | name, material, hours_worked, material_cost, final_price, story | Bearer token |
| GET | `/api/products/mine` | — | Bearer token |
| GET | `/api/products/:certificateId` | — | Public |
| GET | `/api/products/calculator/estimate?hours=X&material_cost=Y` | — | Public |

---

## 💰 Fair-Trade Price Formula

```
Labour Cost    = hours_worked × ₹350/hr (India living wage)
Raw Total      = Labour Cost + Material Cost
Suggested Price = Raw Total × 1.20 (20% overhead)
```

---

## 🖨️ Printing the Certificate

1. Open any product's story page: `/product/:certificateId`
2. Click **"Print Certificate"**
3. Browser print dialog opens — select "Save as PDF" for a digital copy
4. The certificate includes: artisan details, product credentials, story quote, QR code, and certificate ID

---

## 🚀 Hackathon Tips

1. **Judges test the QR code** — make sure the product story page loads fast
2. **The certificate is the wow moment** — demo it by printing to PDF live
3. **Seed data** — the schema includes a test artisan (email: razia@example.com, password: password123)
4. **If MySQL fails** — swap `server/config/db.js` with a Supabase connection string in under 5 minutes

---

## 🎨 Design System

| Token | Value | Use |
|---|---|---|
| `saffron` | `#E8631A` | CTAs, accents |
| `earth` | `#6B4226` | Text, navbar |
| `cream` | `#FDF6EC` | Background |
| `gold` | `#C9963B` | Borders, QR frame |
| `forest` | `#2D5016` | Success, calculator |
| Font Display | Playfair Display | Headings |
| Font Body | Lato | UI text |
| Font Mono | Courier Prime | Certificate IDs |
