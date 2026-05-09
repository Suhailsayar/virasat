# 🪡 Virasat-Connect

### *Every thread has a story. Every maker deserves to be heard.*

---

## What is this?

Virasat-Connect is a platform built for the artisans who wake up before sunrise, sit at their looms, and spend weeks crafting something beautiful — only to have it sold without anyone knowing their name.

We fix that.

When an artisan registers a product on Virasat-Connect, they get a **Digital Birth Certificate** — a unique QR code that tells the world exactly who made it, how long it took, what it's made of, and the story behind it. Scan the QR code on your phone and you're taken directly to that artisan's story page.

No middlemen. No anonymous "handmade" labels. Just real people, real craft, real stories.

---

## The Problem We're Solving

India has millions of artisans — weavers, woodworkers, potters, embroiderers — whose skills have been passed down for generations. But in the age of fast fashion and mass production, their work gets undervalued, their identity gets stripped away, and buyers have no way to verify authenticity.

Virasat-Connect gives artisans a digital identity and gives buyers a way to trust what they're buying.

---

## Features

**For Artisans**
- Register handmade products with their full story
- Get a unique product ID (e.g. `VC-2024-PA-4821`) and QR code instantly
- Use the built-in **Fair-Trade Calculator** to figure out what their work is actually worth — based on a living wage, not a race to the bottom

**For Buyers**
- Scan any QR code to see the full product story
- Meet the maker — their craft, their village, their years of experience
- View a beautiful **Certificate of Authenticity** with a gold border that can be printed or shared

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js (Vite) + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MySQL (hosted on Filess.io) |
| Auth | JWT tokens |
| QR Codes | qrcode.react |
| Frontend Deploy | Vercel |
| Backend Deploy | Render |

---

## Live Demo

| | URL |
|-|-----|
| 🌐 Frontend | https://virasat-xi.vercel.app |
| ⚙️ Backend API | https://virasat-t2tm.onrender.com |
| 🔍 Health Check | https://virasat-t2tm.onrender.com/api/health |

---

## Running Locally

**Prerequisites:** Node.js v18+, MySQL

### Backend

```bash
cd server
npm install
```

Create a `.env` file:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=virasat_connect
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
PORT=4000
CLIENT_URL=http://localhost:5173
```

Load the database schema:

```bash
mysql -u root -p < schema.sql
```

Start the server:

```bash
node index.js
```

### Frontend

```bash
cd client
npm install
npm run dev
```

Open http://localhost:5173

---

## Database Schema

Two tables. Simple and clean.

- **artisans** — stores the maker's profile (name, craft, village, bio, years of experience)
- **products** — stores each registered product, linked to its artisan, with a unique certificate ID

Every product has a foreign key back to its artisan, so the story page always knows who made it.

---

## The Fair-Trade Calculator

One of the small things we're most proud of. Artisans often underprice their work because they don't have a reference point.

The calculator takes:
- Hours worked
- Material cost

And suggests a fair selling price based on a **₹130/hour living wage**, plus overhead and a reasonable artisan margin. It's not a magic number — it's a starting point for a fair conversation.

---

## API Endpoints

```
POST   /api/auth/register          Register a new artisan
POST   /api/auth/login             Login
GET    /api/products               List products for an artisan
POST   /api/products               Register a new product
GET    /api/products/:uid          Get product + artisan details by certificate ID
GET    /api/health                 Health check
```

---

## Built At

This project was built as an MVP during a 48-hour hackathon. The goal was simple: make something that could actually help real people, not just impress judges.

---

## What's Next

- Photo uploads for products
- Artisan verification badges
- WhatsApp sharing for QR codes
- Multi-language support (Hindi, Kashmiri, Urdu)
- Marketplace integration so buyers can purchase directly

---

## The Name

**Virasat** (विरासत) means *heritage* or *legacy* in Urdu and Hindi.

Because that's what this is about — making sure the legacy of Indian craftsmanship doesn't get lost in a world that's forgotten how to slow down.

---

*Made with respect for the hands that make things.*
