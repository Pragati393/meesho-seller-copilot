# 🛍️ Meesho Seller Co-Pilot: AI Multi-Agent Assistant for E-commerce Sellers

An AI-powered **multi-agent SaaS application** that helps Meesho sellers generate SEO-optimized product listings, competitor-aware pricing strategies, and professional customer replies—all from one intelligent dashboard.

Built using **Next.js**, **FastAPI**, **Google Gemini AI**, and **Supabase**, the application features authentication, multi-tenant data isolation, AI-powered routing, analytics, and history management.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688)
![Python](https://img.shields.io/badge/Python-3.13-blue)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)
![Gemini](https://img.shields.io/badge/Google-Gemini_AI-orange)
![License](https://img.shields.io/badge/License-MIT-yellow)

---



# 🧩 Problem Statement

Small sellers on e-commerce platforms like **Meesho** often spend significant time manually:

- Writing attractive product listings
- Deciding competitive selling prices
- Responding to customer queries

Without AI assistance, these repetitive tasks reduce productivity and sales opportunities.

**Meesho Seller Co-Pilot** automates these workflows using specialized AI agents while ensuring every seller's data remains secure and isolated.

---

# ✨ Key Features

## 🤖 AI Seller Assistant (Router Agent)

The Router Agent acts as the central intelligence of the application.

It accepts natural language requests such as:

> "Generate a listing for a cotton kurti."

or

> "Suggest a selling price for this product."

It then performs lightweight keyword-based intent classification with **score comparison**, **ambiguity detection** (ties), and **clarification fallback** before routing the request to the appropriate specialized AI agent.

Instead of making incorrect assumptions, the Router Agent asks the user to choose the correct agent whenever the request is ambiguous.

---

## 📦 Listing Agent

Generate complete product listings using Google Gemini AI.

Features:

- SEO-friendly product titles
- Product descriptions
- Key features
- Search keywords
- Markdown rendering
- One-click copy
- Saved automatically to Supabase

---

## 💰 Pricing Agent

Provides AI-assisted pricing recommendations using competitor data.

Features:

- Amazon price comparison
- Flipkart price comparison
- Meesho average price
- Profit calculation
- Profit margin analysis
- Three pricing strategies
  - Aggressive
  - Balanced
  - Premium
- Gemini-generated pricing explanation
- Automatic history storage

The Pricing Agent currently uses a small curated local dataset (`products.json`, 10 products; these are **estimated prices, not live scraped data**) with **SequenceMatcher-based fuzzy matching** to identify similar products before generating pricing recommendations. A match needs a keyword hit (typo-tolerant) or strong name similarity; otherwise the API returns 404 instead of pricing the wrong product.

**Why SequenceMatcher over embeddings?** For a catalogue this small it adds no extra API call, model, or vector store, so there is no added latency or infrastructure, and results are deterministic and unit-testable. Embeddings would be the right call once the catalogue grows beyond what a linear scan handles.

---

## 💬 Reply Agent

Automatically generates professional customer support replies for:

- Returns
- Refunds
- Delivery delays
- Product questions
- Complaints

Replies are generated using Gemini AI and stored in Supabase for future reference.

---

## 📊 Dashboard & Analytics

Interactive dashboard displaying:

- Total Listings Generated
- Pricing Reports Created
- Customer Replies Generated

Statistics are fetched dynamically for the currently logged-in seller.

---

## 📜 History Module

Every AI output is permanently stored.

Users can view:

- Listing History
- Pricing History
- Reply History

Each record includes:

- Timestamp
- Generated content
- One-click copy functionality

---

## 🔐 Authentication & Multi-Tenancy

Authentication is handled using **Supabase Auth**.

Features:

- Email authentication
- Protected routes
- Persistent login sessions
- Server-verified, per-user data isolation

**How tenant isolation works:** the frontend sends the Supabase access token as `Authorization: Bearer <jwt>`. The FastAPI backend validates it with Supabase Auth (`auth.py`) and uses the verified user id as the tenant key on every query. Clients never send a `user_id`, so one seller cannot read another's listings, pricing reports, or replies (covered by `test_client_supplied_user_id_is_ignored`).

> The backend uses the Supabase service-role key (which bypasses RLS), so the `user_id` filter is enforced in application code. A defence-in-depth next step is enabling Postgres Row Level Security and querying with the user's JWT.

---

# 🤖 AI Agent Architecture

Seller Co-Pilot consists of four specialized AI agents.

### Router Agent

- Intent classification
- Confidence scoring
- Ambiguity detection
- Agent routing

### Listing Agent

- Product listing generation
- SEO optimization

### Pricing Agent

- Competitor price analysis
- Profit estimation
- Pricing recommendation

### Reply Agent

- Customer communication
- Professional AI-generated replies

---

# 🏗️ System Architecture

```text
                   User
                     │
                     ▼
            Next.js Frontend
                     │
                     ▼
             FastAPI Backend
                     │
         ┌───────────┼────────────┐
         ▼           ▼            ▼
 Listing Agent  Pricing Agent  Reply Agent
         │           │            │
         └───────────┼────────────┘
                     │
               Router Agent
                     │
              Google Gemini AI
                     │
             Supabase PostgreSQL
```

---

# 🛠️ Tech Stack

| Layer | Technology |
|--------|------------|
| Frontend | Next.js, React, TypeScript, Tailwind CSS |
| Backend | FastAPI, Python |
| Database | Supabase PostgreSQL |
| Authentication | Supabase Auth |
| AI | Google Gemini 2.5 Flash |
| Markdown Rendering | React Markdown |

---

# 📂 Project Structure

```text
meesho-seller-copilot/

│
├── backend/
│   ├── main.py
│   ├── auth.py
│   ├── gemini_client.py
│   ├── database.py
│   ├── history.py
│   ├── listing_agent.py
│   ├── pricing_agent.py
│   ├── reply_agent.py
│   ├── router_agent.py
│   ├── products.json
│   └── tests/
│
├── frontend/
│   ├── app/
│   │   ├── dashboard/
│   │   ├── listing-agent/
│   │   ├── pricing-agent/
│   │   ├── reply-agent/
│   │   ├── history/
│   │   └── components/
│   │
│   └── lib/
│
├── .env.example
├── .gitignore
└── README.md
```

---

# 📡 API Endpoints

All endpoints except `/router` and `/health` require `Authorization: Bearer <supabase access token>`. Errors use proper HTTP status codes (401 unauthenticated, 404 unknown product, 422 invalid input, 503 AI provider unavailable).

| Endpoint | Body / description |
|------------|-------------|
| POST `/generate` | `{ "product": str }` — generate product listing |
| POST `/pricing` | `{ "product": str, "cost_price": float > 0 }` — pricing strategy |
| POST `/reply` | `{ "message": str }` — customer reply |
| GET `/router?query=` | Route a request to the right agent (public, stateless) |
| GET `/dashboard/stats` | Analytics for the authenticated user |
| GET `/history/listings` | Listing history |
| GET `/history/pricing` | Pricing history |
| GET `/history/replies` | Reply history |
| GET `/health` | Liveness check |

---

# 🧪 Tests

```bash
cd backend
pip install -r requirements-dev.txt
pytest
```

24 offline tests (Supabase and Gemini are mocked) cover router intent/ambiguity logic, pricing math and fuzzy matching, authentication, tenant isolation, input validation, and error mapping.

---

# 🚀 Getting Started

## Prerequisites

- Node.js (v18+)
- Python 3.10+
- Supabase Project
- Google Gemini API Key

---

## 1. Clone Repository

```bash
git clone https://github.com/Pragati393/meesho-seller-copilot.git

cd meesho-seller-copilot
```

---

## 2. Backend Setup

```bash
cd backend

python -m venv venv

source venv/bin/activate
# Windows
# venv\Scripts\activate

pip install -r requirements.txt

uvicorn main:app --reload
```

---

## 3. Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

## 4. Environment Variables

### Backend `.env`

```env
GEMINI_API_KEY=your_gemini_api_key

SUPABASE_URL=your_supabase_url

SUPABASE_KEY=your_supabase_service_role_key
```

---

### Frontend `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8000

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url

NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

### Docker

```bash
# root .env needs NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY; backend/.env the backend keys
docker compose up --build
```

> Never commit actual `.env` files to GitHub. Only commit `.env.example`.

---

# 📸 Screenshots

## Dashboard

_Add screenshot_

---

## Listing Agent

_Add screenshot_

---

## Pricing Agent

_Add screenshot_

---

## Reply Agent

_Add screenshot_

---

## History Module

_Add screenshot_

---

# 🗺️ Roadmap

- [ ] Live Amazon & Flipkart competitor price scraping
- [ ] AI Image Generation Agent
- [ ] Voice-enabled seller assistant
- [ ] Multilingual listing generation
- [ ] Multilingual customer replies
- [ ] CI/CD pipeline
- [ ] Postgres Row Level Security as a second isolation layer
- [ ] Rate limiting on AI endpoints
- [ ] CI pipeline running the test suite
- [ ] Response caching for repeated prompts
- [ ] Replace `SequenceMatcher` with embeddings once the catalogue outgrows a linear scan

---

# 👩‍💻 Author

**Pragati**

B.Tech, Electronics & Communication Engineering

National Institute of Technology Raipur

GitHub:

https://github.com/Pragati393

---

# 📄 License

This project is licensed under the **MIT License**.

---

# ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.
