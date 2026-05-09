# Virasat Connect — Complete Setup Guide

## Prerequisites

Before starting, make sure you have these installed:

| Tool | Min Version | Check |
|---|---|---|
| Node.js | 18+ | `node -v` |
| npm | 9+ | `npm -v` |
| MySQL | 8.0+ | `mysql --version` |
| Git (optional) | any | `git --version` |

---

## Project Structure

```
virasat-connect/
├── package.json              ← Root: runs both servers together
├── README.md
│
├── server/                   ← Node.js + Express API (port 5000)
│   ├── index.js              ← App entry point
│   ├── schema.sql            ← ⚠️  Run this FIRST
│   ├── .env.example          ← Copy to .env and fill in values
│   ├── package.json
│   ├── config/
│   │   └── db.js             ← MySQL connection pool
│   ├── middleware/
│   │   ├── auth.js           ← JWT verification
│   │   └── upload.js         ← Multer image upload config
│   ├── routes/
│   │   ├── auth.js           ← /api/auth/* (register, login, me)
│   │   ├── products.js       ← /api/products/*
│   │   └── upload.js         ← /api/upload
│   └── uploads/              ← Created automatically on first upload
│
└── client/                   ← React + Vite + Tailwind (port 5173)
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── package.json
    └── src/
        ├── main.jsx
        ├── App.jsx            ← All routes defined here
        ├── api.js             ← Axios instance with JWT interceptor
        ├── index.css          ← Tailwind + custom component classes
        ├── context/
        │   └── AuthContext.jsx
        ├── components/
        │   ├── Navbar.jsx
        │   ├── ProtectedRoute.jsx
        │   ├── FairTradeCalculator.jsx
        │   ├── ImageUploader.jsx
        │   └── ShareBar.jsx
        └── pages/
            ├── HomePage.jsx
            ├── LoginPage.jsx
            ├── RegisterPage.jsx
            ├── DashboardPage.jsx   ← Protected
            └── ProductStoryPage.jsx ← Public + printable certificate
```

---

## Step 1 — MySQL Setup

### Option A: MySQL already installed

```bash
# Start MySQL if not running
# macOS (Homebrew):
brew services start mysql

# Ubuntu/Debian:
sudo systemctl start mysql

# Windows: open Services and start "MySQL80"
```

### Option B: Install MySQL fresh

```bash
# macOS
brew install mysql
brew services start mysql
mysql_secure_installation   # follow prompts, set a root password

# Ubuntu/Debian
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo mysql_secure_installation
```

### Create the database and tables

```bash
# From the project root — run the schema file
mysql -u root -p < server/schema.sql
```

You will be prompted for your MySQL root password. When it completes with no errors, verify:

```bash
mysql -u root -p -e "USE virasat_connect; SHOW TABLES;"
```

Expected output:
```
+---------------------------+
| Tables_in_virasat_connect |
+---------------------------+
| artisans                  |
| products                  |
+---------------------------+
```

The schema also inserts a **test artisan** you can use immediately:
- Email: `razia@example.com`
- Password: `password123`

---

## Step 2 — Configure Environment Variables

```bash
cd server
cp .env.example .env
```

Open `server/.env` in any editor and fill in these values:

```env
# Server
PORT=5000
NODE_ENV=development

# MySQL — match your local setup
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD_HERE
DB_NAME=virasat_connect

# JWT Secret — run this command to generate a strong one:
# node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=PASTE_YOUR_GENERATED_SECRET_HERE
JWT_EXPIRES_IN=7d

# Frontend URL (keep as-is for local dev)
CLIENT_URL=http://localhost:5173
```

**Generating a secure JWT secret (do this now):**

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and paste it as `JWT_SECRET` in your `.env`.

---

## Step 3 — Install Dependencies

```bash
# From the project ROOT (not inside server/ or client/)
npm install           # installs concurrently for the root

cd server
npm install           # installs express, mysql2, bcrypt, jwt, multer, etc.

cd ../client
npm install           # installs react, vite, tailwind, qrcode.react, etc.

cd ..                 # back to root
```

Or as a single chain:

```bash
npm install && cd server && npm install && cd ../client && npm install && cd ..
```

---

## Step 4 — Run the Project

### Start both servers together (recommended)

```bash
# From project root
npm run dev
```

This starts:
- **API server** → http://localhost:5000
- **React frontend** → http://localhost:5173

### Or start them separately (two terminals)

```bash
# Terminal 1 — API
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

### Verify everything is working

Open these URLs in your browser:

| URL | Expected |
|---|---|
| http://localhost:5173 | Landing page loads |
| http://localhost:5000/api/health | `{"status":"ok"}` JSON response |

If the health check passes and the landing page loads — you're live.

---

## Step 5 — Test the Full Flow

### 5a. Login with seed account

1. Go to http://localhost:5173/login
2. Email: `razia@example.com` / Password: `password123`
3. You land on the Dashboard

### 5b. Register a new artisan (fresh account)

1. Go to http://localhost:5173/register
2. Fill in: Name, Email, Password (min 8 chars), Craft, Village, State
3. You are auto-logged in and redirected to the Dashboard

### 5c. Register a product

1. On the Dashboard, use the **Fair-Trade Calculator** (right sidebar)
   - Enter hours worked and material cost
   - Click "Calculate Fair Price"
   - Click "Apply This Price to Form"
2. Fill in Product Name, Materials, Story
3. Drag and drop or click to upload a product photo
4. Click **Register & Generate QR Certificate**
5. A modal appears with the QR code

### 5d. View the Story Page

1. Click **View Story** on any product card, or
2. Scan the QR code with your phone
3. The public story page loads at: `http://localhost:5173/product/<certificate-id>`

### 5e. Print the Certificate

1. On the story page, click **Print Certificate**
2. In the browser print dialog, select **Save as PDF**
3. You get a gold-border A4 certificate with QR code, artisan details, and product story

---

## API Reference

### Auth endpoints

```
POST   /api/auth/register     { name, email, password, craft, village, state, bio }
POST   /api/auth/login        { email, password }
GET    /api/auth/me           Authorization: Bearer <token>
```

### Product endpoints

```
POST   /api/products          { name, material, hours_worked, material_cost, final_price, story, image_url }
GET    /api/products/mine     Authorization: Bearer <token>
GET    /api/products/:certId  Public — no auth needed
GET    /api/products/calculator/estimate?hours=X&material_cost=Y
```

### Upload endpoint

```
POST   /api/upload            multipart/form-data, field: "image" (JPEG/PNG/WebP, max 5MB)
DELETE /api/upload/:filename  Authorization: Bearer <token>
```

Uploaded images are served statically at:
```
http://localhost:5000/uploads/<filename>
```

---

## Common Errors & Fixes

### `Error: connect ECONNREFUSED 127.0.0.1:3306`
MySQL is not running.
```bash
# macOS
brew services start mysql

# Ubuntu
sudo systemctl start mysql

# Windows
net start MySQL80
```

### `Access denied for user 'root'@'localhost'`
Wrong password in `.env`. Reset MySQL root password:
```bash
mysql -u root
ALTER USER 'root'@'localhost' IDENTIFIED BY 'newpassword';
FLUSH PRIVILEGES;
```
Then update `DB_PASSWORD` in `server/.env`.

### `Unknown database 'virasat_connect'`
You haven't run the schema yet.
```bash
mysql -u root -p < server/schema.sql
```

### `Port 5000 already in use`
Something else is on port 5000. Either kill it or change `PORT` in `server/.env` to `5001`. If you change it, also update `vite.config.js` proxy target to match.

### `vite: command not found`
You ran `npm install` in the wrong directory. Make sure you `cd client` first:
```bash
cd client && npm install
```

### Images not loading after upload
The Vite dev proxy must be running (it forwards `/uploads` to the Express server). Make sure you started the frontend with `npm run dev` from inside `client/`, and the backend is running on port 5000.

### JWT token expired / 401 errors
Token lasts 7 days by default. Clear browser localStorage and log in again:
```javascript
// In browser console
localStorage.clear()
```

---

## Fair-Trade Price Formula

```
Labour Cost     = hours_worked × ₹350/hr  (India living wage estimate)
Raw Total       = Labour Cost + Material Cost
Overhead        = Raw Total × 20%
Suggested Price = Raw Total + Overhead  (= Raw Total × 1.20)
```

Artisans can choose their own final price — the suggested price is a floor, not a ceiling.

---

## Design Tokens (for customisation)

| Token | Hex | Used for |
|---|---|---|
| `saffron` | `#E8631A` | CTAs, active states |
| `earth` | `#6B4226` | Text, navbar background |
| `cream` | `#FDF6EC` | Page background |
| `gold` | `#C9963B` | Borders, QR frame, certificate |
| `forest` | `#2D5016` | Success states, calculator |

Fonts: **Playfair Display** (headings) · **Lato** (body) · **Courier Prime** (certificate IDs)
All loaded from Google Fonts in `client/index.html`.

---

## Hackathon Demo Script (60 seconds)

1. Open http://localhost:5173 — show the landing page
2. Login as `razia@example.com` — dashboard loads
3. Use the Fair-Trade Calculator — type 72 hours, ₹1200 materials — show the ₹30,240 suggested price
4. Fill the product form — upload a photo — click Register
5. QR modal appears — tap WhatsApp share button — show pre-filled message
6. Click View Story — full-bleed product photo hero loads
7. Click Print Certificate — save as PDF — show the gold-border document to judges

That's the complete provenance chain: artisan → product → certificate → buyer.
