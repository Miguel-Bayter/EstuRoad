# EstuRoad API

REST API for EstuRoad — career recommendation platform for Colombian high school students.

## Stack

- **Runtime**: Node.js 20 + ES Modules
- **Framework**: Express 4
- **Database**: MongoDB 7 via Mongoose 8
- **Security**: Helmet, express-rate-limit, httpOnly session cookie, Joi validation
- **Data source**: SNIES / OLE Colombia (340+ careers, 6 macro-regions)

---

## Endpoints

### Carreras

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/carreras` | List all careers (supports `?tipo=`, `?region=`, `?limit=`) |
| `GET` | `/api/carreras/:slug` | Get career by slug |
| `POST` | `/api/carreras/recomendaciones` | Ranked career recommendations for a profile |

**POST /api/carreras/recomendaciones — body**
```json
{
  "perfil": {
    "ciudad": "Medellín",
    "regionId": "andina",
    "estrato": 3,
    "presupuesto": 2000000,
    "intereses": ["tech", "ingenieria"],
    "riasec": ["I", "R", "C"],
    "habilidades": ["Pensamiento lógico"],
    "trabajar": "No, solo estudiar",
    "mudarse": 50,
    "regionesDisponibles": ["andina", "caribe"],
    "promedio": 4.2
  }
}
```

**Response**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "slug": "ing-sistemas",
      "nombre": "Ingeniería de Sistemas",
      "score": 87,
      "empleabilidad": 88,
      ...
    }
  ]
}
```

---

### Perfiles

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/perfiles` | None | Create a new profile, returns `publicId` |
| `GET` | `/api/perfiles/:id` | None | Recover a session by `publicId` (rate-limited: 10/15min) |
| `PATCH` | `/api/perfiles/:id` | Session cookie | Update own profile |

**POST /api/perfiles — body**
```json
{
  "ciudad": "Bogotá",
  "regionId": "andina",
  "estrato": 4,
  "presupuesto": 3500000,
  "intereses": ["tech"],
  "riasec": ["I", "R"],
  "habilidades": ["Análisis de datos"],
  "trabajar": "No, solo estudiar",
  "mudarse": 30,
  "regionesDisponibles": [],
  "promedio": 4.5,
  "modalidad": "presencial"
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "publicId": "col-bog-a3f2",
    "ciudad": "Bogotá"
  }
}
```

A `Set-Cookie: session=...; HttpOnly; Secure; SameSite=Strict` header is included. The session token never appears in the response body.

---

## Authentication

Profile mutations use an **httpOnly session cookie** (not `Authorization` header or `localStorage`):

- Cookie is issued on `POST /api/perfiles`
- `PATCH /api/perfiles/:id` verifies the cookie via HMAC against `SESSION_SECRET`
- Cross-profile writes return `403 Forbidden`

---

## Validation

All write endpoints validate input with **Joi**. Example error:

```json
{
  "success": false,
  "error": "\"estrato\" must be less than or equal to 6"
}
```

---

## Environment variables

Copy `.env.example` and fill in your values:

```bash
cp .env.example .env
```

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB connection string |
| `SESSION_SECRET` | Yes | HMAC secret for session tokens (min 32 chars) |
| `FRONTEND_URL` | Yes | CORS allowed origin (e.g. `http://localhost:5173`) |
| `PORT` | No | Server port (default: `3001`) |
| `NODE_ENV` | No | `development` or `production` |

---

## Local setup

```bash
# Install dependencies
cd server && npm install

# Create env file
cp .env.example .env
# Edit .env with your MONGODB_URI and SESSION_SECRET

# Seed the database with career data
npm run seed

# Start development server (nodemon)
npm run dev
```

The API will be available at `http://localhost:3001`.

---

## Security notes

| Issue | Mitigation |
|-------|-----------|
| Unauthorized profile edits | `PATCH` requires matching session cookie (HMAC) |
| Token in localStorage | Cookie is `HttpOnly` — inaccessible from JS |
| Input injection | Joi schema validates all write inputs |
| Misconfigured headers | Helmet with explicit CSP, HSTS |
| Session enumeration | `GET /perfiles/:id` is rate-limited to 10/15min |
| Missing audit trail | All creates/updates emit a structured audit log |
