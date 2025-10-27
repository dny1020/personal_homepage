#!/bin/bash
# Force reload frontend after .env changes

echo "🔄 Reloading CV Portfolio..."
echo ""

cd "$(dirname "$0")"

# Step 1: Restart backend to reload .env
echo "⏳ Step 1/2: Restarting backend (reload .env)..."
docker-compose restart backend
sleep 2

# Step 2: Restart frontend to clear any cache
echo "⏳ Step 2/2: Restarting frontend (clear cache)..."
docker-compose restart frontend
sleep 2

echo ""
echo "✅ CV Portfolio reloaded successfully!"
echo ""
echo "🌐 Your website: http://localhost:3000"
echo "📡 API endpoint: http://localhost:3000/api/info"
echo ""
echo "📌 IMPORTANT: Clear your browser cache!"
echo "   • Chrome/Firefox: Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)"
echo "   • Safari: Cmd+Option+E"
echo "   • Or do a Hard Refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)"
echo ""
echo "💡 If you still don't see changes, try opening in Incognito/Private mode"
