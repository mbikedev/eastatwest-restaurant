#!/bin/bash
echo "Starting dev server test..."
npm run dev &
PID=$!
sleep 10
echo "Checking if server is running..."
curl -I http://localhost:3000 2>&1 | head -5
kill $PID 2>/dev/null
echo "Test complete"
