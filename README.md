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

# 🎥 Demo

> **Coming Soon**

Add screenshots or a short GIF of:

- Dashboard
- Listing Agent
- Pricing Agent
- Reply Agent
- History Page

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

It then performs lightweight intent classification with **confidence scoring**, **ambiguity detection**, and **clarification fallback** before routing the request to the appropriate specialized AI agent.

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

The Pricing Agent currently uses a curated local dataset with **SequenceMatcher-based fuzzy matching** to identify similar products before generating pricing recommendations.

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
- User-level data isolation

Every database table is associated with a **user_id**, ensuring each seller can only access their own listings, pricing reports, and replies.

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
│   ├── database.py
│   ├── history.py
│   ├── listing_agent.py
│   ├── pricing_agent.py
│   ├── reply_agent.py
│   ├── router_agent.py
│   └── products.json
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

| Endpoint | Description |
|------------|-------------|
| GET `/generate` | Generate product listing |
| GET `/pricing` | Generate pricing strategy |
| GET `/reply` | Generate customer reply |
| GET `/router` | Route request to the correct AI agent |
| GET `/dashboard/stats` | User analytics |
| GET `/history/listings` | Listing history |
| GET `/history/pricing` | Pricing history |
| GET `/history/replies` | Reply history |

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
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url

NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
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
- [ ] Docker deployment
- [ ] CI/CD pipeline
- [ ] Automated unit tests for Router Agent and Pricing calculations
- [ ] Response caching for repeated prompts

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
