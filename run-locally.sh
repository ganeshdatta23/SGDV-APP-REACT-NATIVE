#!/bin/bash

echo "Setting up Sri Guru Dig Vandanam locally..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOL
# Database URL - Replace with your PostgreSQL connection string
DATABASE_URL="postgresql://username:password@localhost:5432/sri_guru_db"

# Admin secret token
ADMIN_SECRET_TOKEN="Appaji@1942"

# Server port
PORT=5000
EOL
    echo "⚠️  Please edit .env file with your database connection details"
fi

# Check if database URL is set
if grep -q "username:password@localhost" .env; then
    echo ""
    echo "🔧 SETUP REQUIRED:"
    echo "1. Get a free PostgreSQL database from:"
    echo "   - https://neon.tech/ (recommended)"
    echo "   - https://supabase.com/"
    echo "   - Or install PostgreSQL locally"
    echo ""
    echo "2. Update the DATABASE_URL in .env file"
    echo ""
    echo "3. Then run: npm run dev"
    echo ""
else
    echo "🚀 Starting the application..."
    npm run dev
fi