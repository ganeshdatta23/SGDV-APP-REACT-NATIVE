# Local Development Setup

## Prerequisites
1. **Node.js 18+** - Download from https://nodejs.org/
2. **Git** - Download from https://git-scm.com/
3. **PostgreSQL** (optional) - Or use a cloud database

## Quick Start

### 1. Clone/Download the Project
```bash
# If you have git access to this Replit
git clone https://your-replit-url.git sri-guru-app
cd sri-guru-app

# OR download the files manually and extract them
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```bash
# Database (required)
DATABASE_URL="postgresql://username:password@localhost:5432/sri_guru_db"

# Admin token (optional, defaults to Appaji@1942)
ADMIN_SECRET_TOKEN="Appaji@1942"

# Port (optional, defaults to 5000)
PORT=5000
```

### 4. Database Setup Options

**Option A: Local PostgreSQL**
```bash
# Install PostgreSQL locally
# Create database
createdb sri_guru_db

# The app will create tables automatically
```

**Option B: Free Cloud Database (Recommended)**
1. Go to https://neon.tech/ or https://supabase.com/
2. Create a free PostgreSQL database
3. Copy the connection string to your `.env` file

### 5. Run the Application
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The app will be available at: http://localhost:5000

## Troubleshooting

**"Module not found" errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Database connection errors:**
- Check your DATABASE_URL is correct
- Ensure PostgreSQL is running (if using local)
- Try the cloud database option

**Port already in use:**
- Change PORT in `.env` file
- Or kill the process: `lsof -ti:5000 | xargs kill`

## File Structure
```
sri-guru-app/
├── client/          # Frontend React app
├── server/          # Backend Express server
├── shared/          # Shared types and schemas
├── mobile/          # React Native mobile apps
├── package.json     # Dependencies and scripts
└── .env            # Environment variables
```

## Mobile App Setup (Optional)
For native Android/iOS apps, see `mobile/README.md`