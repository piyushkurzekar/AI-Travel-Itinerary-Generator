# TripAI — AI Travel Itinerary Generator

A full-stack MERN application that lets users upload travel documents (PDFs, images), extract booking details using OCR/AI, and generate personalized day-by-day travel itineraries powered by Google Gemini.

---

## Features

- **JWT Authentication** — Register, login, logout with HTTP-only cookie sessions
- **Document Upload** — Drag-and-drop PDF/image upload (up to 5 files, 10MB each)
- **AI Extraction** — Gemini extracts flights, hotels, and booking info from documents
- **Editable Review** — Review and correct AI-extracted data before generating
- **AI Itinerary Generation** — Day-by-day plan with activities, meals, budget, tips
- **MongoDB Storage** — All itineraries saved per user
- **Public Sharing** — Shareable public link (no login required to view)
- **WhatsApp Sharing** — One-click WhatsApp share
- **PDF Download** — Download itinerary as PDF (via jsPDF)
- **Trip History** — Search, filter (upcoming/past/shared), sort, paginate
- **Dashboard Stats** — Total trips, upcoming, shared, documents count
- **Responsive UI** — Mobile-first design with Tailwind CSS v4

---

## Tech Stack

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT (HTTP-only cookies)
- bcryptjs (password hashing)
- Multer (file upload)
- Cloudinary (file storage)
- pdf-parse (PDF text extraction)
- Tesseract.js (image OCR)
- Google Gemini API (`@google/generative-ai`)
- Helmet, CORS, express-rate-limit

### Frontend
- React 19 + Vite 8
- React Router v7
- Axios (with interceptors)
- Tailwind CSS v4 (`@tailwindcss/vite`)
- React Dropzone
- React Hot Toast
- Lucide React (icons)
- jsPDF (PDF download)

---

## Project Structure

```
assesment/
├── server/                    # Express backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js          # MongoDB connection
│   │   │   ├── cloudinary.js  # Cloudinary config
│   │   │   └── env.js         # Environment variable loader
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── upload.controller.js
│   │   │   ├── itinerary.controller.js
│   │   │   ├── share.controller.js
│   │   │   └── dashboard.controller.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Itinerary.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── upload.routes.js
│   │   │   ├── itinerary.routes.js
│   │   │   ├── share.routes.js
│   │   │   └── dashboard.routes.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   ├── upload.middleware.js
│   │   │   ├── error.middleware.js
│   │   │   ├── notFound.middleware.js
│   │   │   └── rateLimit.middleware.js
│   │   ├── services/
│   │   │   ├── ai.service.js        # Gemini API
│   │   │   ├── document.service.js  # Orchestrates extraction
│   │   │   ├── pdf.service.js       # pdf-parse
│   │   │   ├── ocr.service.js       # Tesseract.js
│   │   │   └── storage.service.js   # Cloudinary
│   │   ├── validators/
│   │   │   ├── auth.validator.js
│   │   │   └── itinerary.validator.js
│   │   ├── utils/
│   │   │   ├── ApiError.js
│   │   │   ├── ApiResponse.js
│   │   │   ├── asyncHandler.js
│   │   │   ├── generateToken.js
│   │   │   ├── generateShareId.js
│   │   │   └── cleanAIResponse.js
│   │   ├── app.js             # Express app setup
│   │   └── server.js          # Entry point
│   ├── uploads/               # Temp upload directory
│   ├── .env.example
│   └── package.json
│
└── client/                    # React frontend
    ├── src/
    │   ├── api/
    │   │   ├── axios.js       # Axios instance
    │   │   ├── auth.api.js
    │   │   ├── upload.api.js
    │   │   ├── itinerary.api.js
    │   │   └── dashboard.api.js
    │   ├── components/
    │   │   ├── common/        # Navbar, Loader, Button, Modal, etc.
    │   │   ├── auth/          # ProtectedRoute
    │   │   ├── upload/        # FileDropzone, UploadedFileCard, UploadProgress
    │   │   └── itinerary/     # ItineraryCard, DayCard, ActivityItem, ShareModal, BudgetSummary
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── layouts/
    │   │   ├── AuthLayout.jsx
    │   │   └── DashboardLayout.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── UploadBooking.jsx
    │   │   ├── ReviewDetails.jsx
    │   │   ├── ItineraryDetails.jsx
    │   │   ├── ItineraryHistory.jsx
    │   │   ├── SharedItinerary.jsx
    │   │   ├── Profile.jsx
    │   │   └── NotFound.jsx
    │   ├── routes/
    │   │   └── AppRoutes.jsx
    │   ├── utils/
    │   │   ├── formatDate.js
    │   │   ├── copyToClipboard.js
    │   │   └── downloadItineraryPdf.js
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env.example
    ├── vercel.json
    └── package.json
```

---

## Local Setup

### Prerequisites
- Node.js >= 18
- MongoDB Atlas account (or local MongoDB)
- Google Gemini API key
- Cloudinary account

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd assesment
```

### 2. Backend setup
```bash
cd server
npm install
cp .env.example .env
# Fill in your .env values
npm run dev
```

### 3. Frontend setup
```bash
cd ../client
npm install
cp .env.example .env
# Set VITE_API_BASE_URL=http://localhost:5000/api
npm run dev
```

App runs at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Health check: http://localhost:5000/api/health

---

## Environment Variables

### Backend (`server/.env`)
```
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
NODE_ENV=development
```

### Frontend (`client/.env`)
```
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## API Documentation

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Register new user |
| POST | `/api/auth/login` | — | Login, sets cookie |
| POST | `/api/auth/logout` | — | Clears cookie |
| GET | `/api/auth/me` | ✓ | Get current user |

### Uploads
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/uploads/extract` | ✓ | Upload documents, extract booking details |

### Itineraries
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/itineraries/generate` | ✓ | Generate AI itinerary |
| GET | `/api/itineraries` | ✓ | List user itineraries (search/filter/sort/page) |
| GET | `/api/itineraries/:id` | ✓ | Get single itinerary |
| PUT | `/api/itineraries/:id` | ✓ | Update itinerary |
| DELETE | `/api/itineraries/:id` | ✓ | Delete itinerary |

### Sharing
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/itineraries/:id/share` | ✓ | Enable sharing, generate shareId |
| POST | `/api/itineraries/:id/share/regenerate` | ✓ | Generate new share link |
| PATCH | `/api/itineraries/:id/share/disable` | ✓ | Disable sharing |
| GET | `/api/shared/:shareId` | — | Get public shared itinerary |

### Dashboard
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/dashboard/stats` | ✓ | Get stats (counts, recent itineraries) |

---

## How Authentication Works

1. User registers/logs in → server creates JWT signed with `JWT_SECRET`
2. JWT is set as an **HTTP-only cookie** (not accessible from JS)
3. On each protected request, `auth.middleware.js` reads the cookie, verifies the JWT, and attaches `req.user`
4. Frontend `AuthContext` calls `GET /api/auth/me` on load to restore session
5. On logout, the cookie is cleared server-side

---

## Document Extraction Flow

```
User uploads file(s)
        ↓
Multer saves to /uploads (temp)
        ↓
document.service.js loops through files:
  → PDF?  → pdf.service.js (pdf-parse)
  → Image? → ocr.service.js (Tesseract.js)
        ↓
Text combined from all documents
        ↓
ai.service.js sends to Gemini with structured prompt
        ↓
Gemini returns JSON with flights/hotels/travelerName/dates
        ↓
cleanAIResponse.js strips markdown code fences, parses JSON
        ↓
Result + Cloudinary URLs returned to frontend
        ↓
Local temp files deleted
```

---

## AI Itinerary Generation Flow

```
User reviews/confirms booking details + preferences
        ↓
Frontend sends confirmed data to POST /api/itineraries/generate
        ↓
itinerary.controller.js → ai.service.generateItinerary()
        ↓
Gemini prompt includes:
  - Confirmed booking data (flights, hotels, dates)
  - User preferences (pace, budget, interests)
  - Rules (no activities before arrival, etc.)
        ↓
Gemini returns structured JSON (days, tips, budget, packing)
        ↓
Validated & saved to MongoDB with user._id
        ↓
Itinerary._id returned → frontend redirects to /itinerary/:id
```

---

## Sharing Functionality

1. User clicks Share on an itinerary
2. `POST /api/itineraries/:id/share` → generates a 16-char UUID-based `shareId`, sets `isPublic: true`
3. Public URL: `<frontend>/shared/<shareId>`
4. `GET /api/shared/:shareId` returns the itinerary **without** private data (no user info, no document URLs)
5. User can regenerate the link (old link becomes invalid), or disable sharing

---

## Deployment

### Backend → Render
1. Push to GitHub
2. Create Render Web Service, point to `/server`
3. Set environment variables in Render dashboard
4. Build: `npm install` | Start: `node src/server.js`

### Frontend → Vercel
1. Push to GitHub
2. Import project in Vercel, set root to `/client`
3. Set `VITE_API_BASE_URL=https://your-render-app.onrender.com/api`
4. `vercel.json` handles SPA routing rewrites

### Database → MongoDB Atlas
- Create a free cluster
- Whitelist Render's IPs (or 0.0.0.0/0 for development)
- Copy connection string to `MONGODB_URI`

---

## Security Decisions

- **HTTP-only cookies** — JWT is inaccessible to JavaScript, preventing XSS token theft
- **bcryptjs (cost 12)** — Strong password hashing
- **Helmet** — Sets secure HTTP headers
- **CORS** — Restricted to `CLIENT_URL` only
- **Rate limiting** — Auth (20/15min), AI (30/hr), Upload (50/hr)
- **Input validation** — express-validator on auth and itinerary routes
- **MIME + extension check** — Both checked on upload, not just extension
- **Ownership verification** — Every itinerary mutation checks `user: req.user._id`
- **No secrets committed** — All sensitive values in .env (gitignored)

---

## Known Limitations

- Tesseract.js OCR can be slow (~5-15s per image); Gemini Vision would be faster
- PDF parsing may fail on scanned/image-based PDFs (use OCR path instead)
- Gemini free tier has rate limits; heavy usage may hit quota
- No itinerary editing UI (only via API); the review page is pre-generation
- No email verification on registration
- jsPDF download is basic text-only formatting

---

## Future Improvements

- [ ] Gemini Vision for image extraction (faster, more accurate)
- [ ] Email verification + password reset
- [ ] Edit individual itinerary days
- [ ] Map links for activity locations (Google Maps)
- [ ] Dark mode toggle
- [ ] Email itinerary sharing
- [ ] Multi-language support
- [ ] Collaborative editing

---

## Live Application

- **Frontend:** `[Your Vercel URL]`
- **Backend:** `[Your Render URL]`
- **GitHub:** `[Your Repository URL]`

---

## License

MIT
