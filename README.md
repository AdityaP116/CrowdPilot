# 🏟️ CrowdPilot — Real-Time Stadium Crowd Management

<div align="center">

![CrowdPilot](https://img.shields.io/badge/CrowdPilot-Live%20Demo-6366F1?style=for-the-badge&logo=react)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite)
![Google Cloud](https://img.shields.io/badge/Google%20Cloud-Run-4285F4?style=for-the-badge&logo=googlecloud)
![Docker](https://img.shields.io/badge/Docker-nginx%3Aalpine-2496ED?style=for-the-badge&logo=docker)

**A premium, real-time crowd management and density tracking web application for large-scale sporting venues.**

</div>

---

## 📸 Overview

CrowdPilot provides **live stadium heatmaps**, **queue wait times**, and **crowd density alerts** for both attendees and venue administrators. It features a dual-view system:

- **👤 User View** — Attendee-facing interface for checking crowd levels, entry gates, and service queues
- **🔧 Admin View** — Full analytics dashboard with charts, zone monitoring, and AI suggestions

---

## ✨ Features

### User Features
- 🔴 **Live Crowd Status** — Real-time density indicator (Low / Moderate / High)
- 🗺️ **Interactive Stadium Map** — Visual zone heatmap with clickable zones
- ⏱️ **Queue Status** — Live wait times for gates, food stalls, and restrooms
- 🔔 **Alert Center** — Critical, warning, and info system-wide notifications
- ⚡ **Best Entry Suggestion** — AI-picked least-crowded gate in real time

### Admin Features
- 📊 **Dashboard Overview** — Stat cards for avg density, critical zones, safe zones, alerts
- 📈 **Zone Density Bar Chart** — Powered by Recharts with custom tooltips
- 🧠 **AI Suggestions** — Auto-recommended crowd management actions
- 📋 **Live Zone Monitor Table** — Sortable, scrollable zone list with density bars
- 🔄 **Manual Sync** — Force data refresh on demand

### Platform & Architecture
- 💻 **Fully Responsive Web App** — Desktop, tablet, and mobile
- 🍔 **Hamburger Menu** — Smooth slide-in navigation on mobile
- 🌑 **Dark Mode Design** — Glassmorphism, gradients, and micro-animations
- 📡 **Live Simulated Data** — Auto-refreshing every few seconds
- ♿ **WCAG Accessible** — Semantic roles, labels, and AAA-level readable contrast across the spectrum
- ✔️ **Robust Core Testing** — Full coverage of core pathways via Vitest & React Testing Library
- ☁️ **Google Services Integration** — Native tracking hooks & Firebase application layer integrations

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router DOM 6 |
| Testing | Vitest, React Testing Library, Happy-DOM |
| Telemetry | Google Analytics (GTag), Firebase Web SDK |
| Charts | Recharts |
| Icons | Lucide React |
| Build Tool | Vite 5 |
| Styling | Vanilla CSS (Design Tokens + Glassmorphism) |
| Containerization | Docker (multi-stage build, nginx:alpine) |
| CI/CD | Google Cloud Build |
| Hosting | Google Cloud Run |
| Image Registry | Google Artifact Registry |

---

## 🚀 Getting Started

### Prerequisites
- Node.js `>= 18`
- npm `>= 9`

### Local Development

```bash
# Clone the repository
git clone https://github.com/AdityaP116/CrowdPilot.git
cd CrowdPilot

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Production Build

```bash
npm run build
# Output is in the dist/ folder
```

---

## 🐳 Docker

### Build & Run Locally

```bash
# Build the image
docker build -t crowdpilot .

# Run the container
docker run -p 8080:8080 crowdpilot
```

Visit `http://localhost:8080`

---

## ☁️ Google Cloud Deployment

### Prerequisites
- Google Cloud project with billing enabled
- `gcloud` CLI installed and authenticated
- **Artifact Registry** repository created:

```bash
gcloud artifacts repositories create cloud-run-source-lib \
  --repository-format=docker \
  --location=us-central1
```

### Deploy via Cloud Build

```bash
gcloud builds submit --config cloudbuild.yaml .
```

This will:
1. Build the Docker image
2. Push it to Artifact Registry (`us-central1-docker.pkg.dev`)
3. Deploy to **Google Cloud Run** with:
   - 2 CPU / 2Gi RAM
   - Auto-scaling (0–10 instances)
   - Public unauthenticated access

### Cloud Build Specs

| Option | Value |
|---|---|
| Machine Type | `E2_HIGHCPU_32` |
| Build Timeout | 1 hour |
| Memory (Cloud Run) | 2Gi |
| CPU (Cloud Run) | 2 |

### Troubleshooting
- **Rollup Linux Error**: If you see an error regarding `@rollup/rollup-linux-x64-gnu` during deployment, this is typically due to cross-platform lockfile conflicts. This issue has been patched in the current `Dockerfile` by automatically removing the Windows-generated `package-lock.json` and forcefully installing the Linux Rollup binary during the CI/CD build.

---

## 📁 Project Structure

```
CrowdPilot/
├── public/                  # Static assets
├── src/
│   ├── components/
│   │   ├── WebNavbar.jsx    # Responsive top navigation bar
│   │   ├── Navbar.jsx       # Legacy mobile bottom nav (deprecated)
│   │   ├── AlertBadge.jsx   # Alert card component
│   │   ├── StadiumMap.jsx   # SVG stadium zone map
│   │   └── ZoneCard.jsx     # Zone info card
│   ├── data/
│   │   └── simulation.js    # Live data simulation engine
│   ├── hooks/
│   │   └── useCrowdData.js  # Context + real-time data hook
│   ├── pages/
│   │   ├── user/
│   │   │   ├── Home.jsx
│   │   │   ├── CrowdMap.jsx
│   │   │   ├── QueueStatus.jsx
│   │   │   └── Alerts.jsx
│   │   └── admin/
│   │       └── Dashboard.jsx
│   ├── App.jsx              # Root app with routing
│   ├── main.jsx             # Entry point
│   └── index.css            # Global design system
├── Dockerfile               # Multi-stage Docker build
├── nginx.conf               # Nginx config with dynamic $PORT
├── cloudbuild.yaml          # Google Cloud Build CI/CD pipeline
├── .dockerignore
└── vite.config.js
```

---

## 🧭 Route Map

| Route | View | Description |
|---|---|---|
| `/` | Home | Live status, hero stats, quick nav |
| `/map` | Crowd Map | Interactive stadium zone heatmap |
| `/queue` | Queue Status | Live wait times by category |
| `/alerts` | Alerts | Critical, warning, and info alerts |
| `/admin` | Admin Dashboard | Full analytics + zone management |

---

## 🎨 Design System

CrowdPilot uses a custom CSS design system with tokens defined in `index.css`:

- **Primary Accent**: `#6366F1` (Indigo)
- **Background**: `#0B1220` (Deep Navy)
- **Status Colors**: Green / Amber / Red for Low / Moderate / High density
- **Typography**: Inter / Segoe UI system stack
- **Effects**: Glassmorphism backdrop blur, gradient cards, pulse animations

---

## 📜 License

MIT License — feel free to fork and build on it.

---

## 👤 Author

**Aditya Pushpakar**
- GitHub: [@AdityaP116](https://github.com/AdityaP116)
- Email: pushpakaraditya7317@gmail.com

---

<div align="center">
  Made with ❤️ for real-time stadium experiences
</div>
