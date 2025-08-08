[README.md](https://github.com/user-attachments/files/21677905/README.md)
# Backend — Tour Reservation Management System

API REST para gestionar **clientes**, **tours** y **reservaciones** de una agencia de tours. Desarrollado con **Node.js + Express** y **MongoDB (Atlas)**. Incluye autenticación con JWT y rutas protegidas.

> Repositorio: `AdrielSolano/Backend-TourReservationSystem`  
> Frontend de referencia (Vercel): https://frontend-tour-reservation-system.vercel.app/

---

## 🚀 Características
- Autenticación (login/register) con **JWT**.
- CRUD de **Customers**, **Tours** y **Reservations**.
- **Fechas disponibles** embebidas en `Tour` (`availableDates: [Date]`).
- **Populate** para devolver detalles de cliente y tour en las reservaciones.
- **Paginación** en listados (`page`, `limit`).
- **Validaciones** con Mongoose (campos requeridos, fechas futuras, `maxPeople`, etc.).
- CORS configurado para frontend en Vercel.

---

## 🛠️ Stack
- **Node.js** + **Express**
- **MongoDB Atlas** + **Mongoose**
- **JWT** para autenticación
- **CORS** para front en Vercel
- Despliegue: **Vercel** / Render / Railway (opcional)

---

## 📁 Estructura (resumen)
```
.
├─ config/
│  └─ db.js
├─ src/
│  ├─ models/
│  │  ├─ User.js
│  │  ├─ Customer.js
│  │  ├─ Tour.js
│  │  └─ Reservation.js
│  ├─ controllers/
│  │  ├─ authController.js
│  │  ├─ customersController.js
│  │  ├─ toursController.js
│  │  └─ reservationsController.js
│  ├─ routes/
│  │  ├─ auth.js
│  │  ├─ customers.js
│  │  ├─ tours.js
│  │  └─ reservations.js
│  └─ middleware/
│     └─ auth.js
├─ app.js                # modo servidor Express clásico
├─ api/index.js          # handler serverless (Vercel)
├─ package.json
└─ .env (no se versiona)
```

---

## 🔐 Variables de entorno
Crea un archivo **.env** en la raíz:
```
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/tour-reservation?retryWrites=true&w=majority
JWT_SECRET=<una_clave_secreta_larga_y_segura>
PORT=5000
```
> ✅ En Atlas, habilita tu IP o “Allow access from anywhere” para desarrollo.

---

## ▶️ Ejecución local

### 1) Requisitos
- Node.js 18+
- Cuenta y cluster en **MongoDB Atlas**

### 2) Instalar dependencias
```bash
npm install
```

### 3) Levantar servidor (Express)
```bash
npm run dev   # con nodemon, si está configurado
# o
node app.js
```
API por defecto en: `http://localhost:5000/api`

### 4) CORS (frontend)
Si tu frontend está en Vercel, en `app.js` o `api/index.js` asegúrate de permitir el **origin** correcto, por ejemplo:
```js
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://frontend-tour-reservation-system.vercel.app"
  ],
  credentials: true
}));
```

---

## ☁️ Despliegue en Vercel (opcional)
Este proyecto incluye un handler serverless en `api/index.js`. Pasos rápidos:
1. `vercel` (CLI) o dashboard → Importar repositorio
2. **Build & Output Settings** (si aplica):
   - Framework: *Other*
   - Output: *(vacío)*
3. Variables de entorno en Vercel: `MONGODB_URI`, `JWT_SECRET`
4. Endpoint base quedará como: `https://<tu-app-backend>.vercel.app/api`

**Ejemplo de `api/index.js`:**
```js
require('dotenv').config();
const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const connectDB = require('../config/db');

const authRoutes = require('../src/routes/auth');
const customerRoutes = require('../src/routes/customers');
const tourRoutes = require('../src/routes/tours');
const reservationRoutes = require('../src/routes/reservations');

const app = express();
connectDB();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://frontend-tour-reservation-system.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/reservations', reservationRoutes);

module.exports = app;
module.exports.handler = serverless(app);
```

---

## 🔑 Autenticación
- **Registro:** `POST /api/auth/register`
- **Login:** `POST /api/auth/login` → devuelve `token` (JWT)
- Rutas protegidas usan header:  
  `Authorization: Bearer <token>`

---

## 📚 Endpoints principales (resumen)

### Auth
```
POST   /api/auth/register
POST   /api/auth/login
```

### Customers (protegidos)
```
GET    /api/customers?page=1&limit=10
GET    /api/customers/:id
POST   /api/customers
PUT    /api/customers/:id
DELETE /api/customers/:id
```

### Tours (protegidos)
```
GET    /api/tours?page=1&limit=10
GET    /api/tours/:id
POST   /api/tours
PUT    /api/tours/:id
DELETE /api/tours/:id
```
> Campo `availableDates: [Date]`, `isActive: Boolean`, `maxPeople: Number`

### Reservations (protegidos)
```
GET    /api/reservations?page=1&limit=10
GET    /api/reservations/:id
POST   /api/reservations
PUT    /api/reservations/:id
DELETE /api/reservations/:id
```
- **Lógica**: `totalPrice = tour.price * people`
- **Populate**: devuelve `customer` y `tour` completos
- **Validaciones**: fecha futura, `people` > 0 y ≤ `tour.maxPeople`

---

## 🧪 Ejemplos (curl)

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login   -H "Content-Type: application/json"   -d '{"email":"demo@demo.com","password":"123456"}'
```

### Crear Customer
```bash
curl -X POST http://localhost:5000/api/customers   -H "Authorization: Bearer <TOKEN>"   -H "Content-Type: application/json"   -d '{
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan@example.com",
    "phone": "555-123-4567",
    "address": "Calle 1 #123"
  }'
```

### Crear Tour
```bash
curl -X POST http://localhost:5000/api/tours   -H "Authorization: Bearer <TOKEN>"   -H "Content-Type: application/json"   -d '{
    "name": "Tour Cenotes",
    "description": "Visita a 3 cenotes",
    "duration": "4h",
    "price": 1200,
    "maxPeople": 10,
    "isActive": true,
    "availableDates": ["2025-08-15", "2025-08-20"]
  }'
```

### Crear Reservation
```bash
curl -X POST http://localhost:5000/api/reservations   -H "Authorization: Bearer <TOKEN)"   -H "Content-Type: application/json"   -d '{
    "customerId": "<ObjectId>",
    "tourId": "<ObjectId>",
    "date": "2025-08-15",
    "people": 2,
    "status": "pending"
  }'
```

---

## 🧩 Convenciones de respuesta
```json
{
  "data": { "customers": [/* ... */] },
  "message": "OK"
}
```
- En algunos controladores la respuesta utiliza objetos anidados tipo:
  `{ "data": { "<resourcePlural>": [...] } }`

---

## ⚠️ Errores comunes
- `ECONNREFUSED` / `MongoNetworkError`: revisa `MONGODB_URI` y la IP permitida en Atlas.
- CORS bloqueado: agrega tu dominio del frontend al `origin` de `cors()`.
- `401 Unauthorized`: falta o es inválido el header `Authorization`.

---

## 🧭 Roadmap (ideas)
- Refresh tokens y expiración silenciosa.
- Búsqueda/filtrado avanzado por fechas y precio.
- Soft delete y auditoría (createdBy, updatedBy).
- Pruebas (Jest/Supertest), CI/CD.

---

## 📄 Licencia
MIT
