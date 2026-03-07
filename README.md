# 🚑 Smart Emergency

**AI-Assisted Emergency Help Platform** — Find the nearest hospital in seconds based on your symptoms and location.

---

## 📁 Project Structure

```
smart-emergency/
├── server.js                  # Express backend entry point
├── package.json
├── .env.example               # Environment variable template
├── README.md
│
├── models/
│   ├── Hospital.js            # Hospital MongoDB schema
│   └── Admin.js               # Admin user schema
│
├── routes/
│   ├── hospitals.js           # Hospital CRUD + nearby search API
│   └── admin.js               # Admin login/auth API
│
├── middleware/
│   └── auth.js                # JWT authentication middleware
│
├── public/                    # Frontend (HTML/CSS/JS/Bootstrap)
│   ├── index.html             # Home page
│   ├── symptoms.html          # Symptom selection
│   ├── hospitals.html         # Nearby hospitals list
│   ├── hospital-details.html  # Single hospital detail + map
│   ├── map.html               # Full map view (Leaflet.js)
│   ├── emergency-contacts.html# Emergency numbers (India)
│   ├── css/
│   │   └── style.css          # Global styles
│   └── js/
│       ├── main.js            # Shared utilities
│       ├── symptoms.js        # Symptom logic + AI keyword analysis
│       ├── hospitals.js       # Hospital list + filter logic
│       ├── hospital-details.js# Details page logic
│       └── map.js             # Leaflet map logic
│
└── admin/                     # Admin panel
    ├── login.html
    ├── dashboard.html
    ├── hospitals.html         # Manage hospitals
    ├── add-hospital.html      # Add/Edit hospital
    └── admin.css
```

---

## 🚀 Local Setup

### 1. Clone and install

```bash
git clone https://github.com/your-username/smart-emergency.git
cd smart-emergency
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env with your MongoDB URI and secrets
```

### 3. Run locally

```bash
npm run dev       # uses nodemon
# or
npm start
```

Open: `http://localhost:3000`

---

## 🌐 Deploy on Render

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/smart-emergency.git
git push -u origin main
```

### Step 2: Create MongoDB Atlas
1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create free cluster
3. Create database user
4. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/smart-emergency`
5. Whitelist IP: `0.0.0.0/0`

### Step 3: Deploy on Render
1. Go to [render.com](https://render.com) → New → **Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `smart-emergency`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

### Step 4: Set Environment Variables on Render
```
MONGODB_URI = mongodb+srv://...
JWT_SECRET  = your_random_secret_string
ADMIN_EMAIL = admin@smartemergency.com
ADMIN_PASSWORD = Admin@123
```

---

## 🔑 Admin Panel

URL: `https://your-app.onrender.com/admin/login.html`

Default credentials (change in `.env`):
- Email: `admin@smartemergency.com`
- Password: `Admin@123`

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Bootstrap 5, Vanilla JS |
| Map | Leaflet.js + OpenStreetMap |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken) |
| Hosting | Render (backend) + MongoDB Atlas |

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/hospitals` | Get all hospitals |
| GET | `/api/hospitals/nearby?lat=&lng=&department=&radius=` | Get nearby hospitals |
| GET | `/api/hospitals/:id` | Get hospital by ID |
| POST | `/api/hospitals` | Add hospital (admin) |
| PUT | `/api/hospitals/:id` | Update hospital (admin) |
| DELETE | `/api/hospitals/:id` | Delete hospital (admin) |
| POST | `/api/admin/login` | Admin login |
| GET | `/api/admin/verify` | Verify JWT token |

---

## ⚡ Emergency Numbers (India)
- **108** — Ambulance
- **112** — National Emergency
- **102** — Medical Emergency
- **100** — Police
- **101** — Fire Brigade

---

## 👤 Author
Built as a BCA portfolio project demonstrating full-stack development, geolocation APIs, map integration, and REST API design.
