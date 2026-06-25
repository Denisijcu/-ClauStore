# ClauStore 🛍️✨
**E-commerce de camisetas y objetos sublimados con personalización IA**

Built by Vertex Coders LLC | Stack: Angular 19 + FastAPI + PostgreSQL

---

## Stack
- **Frontend**: Angular 19 (standalone components, signals)
- **Backend**: FastAPI + SQLAlchemy + Alembic
- **Database**: PostgreSQL
- **Images**: Cloudinary
- **Auth**: JWT
- **Payments**: Zelle (manual + screenshot upload)
- **AI Prompts**: Groq API (free tier) with fallback
- **Deploy**: Netlify (frontend) + Railway (backend)

---

## Features
- ✅ Landing page vibrante y profesional
- ✅ Home, Categorías, Galerías, About, Contact
- ✅ Admin panel completo (productos, categorías, galería, órdenes)
- ✅ Galería de diseños predefinidos
- ✅ Usuario sube su propio logo/imagen
- ✅ IA genera prompt profesional → usuario va a Gemini
- ✅ Carrito persistente (localStorage)
- ✅ Checkout con pago Zelle + upload de comprobante
- ✅ Admin confirma pago manualmente
- ✅ JWT auth + admin guard

---

## Backend Setup

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your credentials

# Run migrations
alembic upgrade head

# Start dev server
uvicorn app.main:app --reload --port 8000
```

**API Docs**: http://localhost:8000/docs

---

## Frontend Setup

```bash
cd frontend
npm install
ng serve
# App: http://localhost:4200
```

---

## Docker (Full Stack)

```bash
docker-compose up --build
```

---

## Environment Variables (backend/.env)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `SECRET_KEY` | JWT secret (change in production!) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `ZELLE_EMAIL` | Zelle payment email |
| `ZELLE_PHONE` | Zelle payment phone |
| `GROQ_API_KEY` | Groq API key (free at console.groq.com) |

---

## Admin Setup
After running migrations, create admin user via API:
```bash
# 1. Register normally via POST /api/auth/register
# 2. Set is_admin=true in DB:
psql -U postgres -d claustore -c "UPDATE users SET is_admin=true WHERE email='admin@claustore.com';"
```

---

## API Endpoints

### Auth
- `POST /api/auth/register` — Register user
- `POST /api/auth/login` — Login (returns JWT)
- `GET /api/auth/me` — Current user

### Products
- `GET /api/products/` — List products (filter by category, featured, search)
- `GET /api/products/{id}` — Product detail
- `POST /api/products/` — Create (admin)
- `PUT /api/products/{id}` — Update (admin)
- `DELETE /api/products/{id}` — Delete (admin)

### Categories
- `GET /api/categories/` — List categories
- `POST /api/categories/` — Create (admin)
- `PUT /api/categories/{id}` — Update (admin)

### Gallery
- `GET /api/gallery/` — List designs
- `POST /api/gallery/` — Upload design (admin)

### Orders
- `POST /api/orders/` — Create order
- `GET /api/orders/my-orders` — User's orders
- `POST /api/orders/{id}/upload-payment` — Upload Zelle screenshot
- `GET /api/orders/admin/all` — All orders (admin)
- `PUT /api/orders/admin/{id}/confirm-payment` — Confirm payment (admin)

### AI
- `POST /api/ai/generate-prompt` — Generate image prompt from idea

---

## Deploy

### Frontend (Netlify)
```bash
ng build --configuration production
# Upload dist/ folder to Netlify
# Set environment.prod.ts apiUrl to your Railway backend URL
```

### Backend (Railway)
```bash
# Connect Railway to your GitHub repo
# Set environment variables in Railway dashboard
# Railway auto-detects Dockerfile
```

---

## Built with ❤️ by Vertex Coders LLC
Denis Ijcu | Miami, FL | vertexcoders.com
