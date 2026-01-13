#!/bin/bash
# Script para actualizar y verificar el despliegue

echo "🔄 Pulling latest image..."
docker pull ghcr.io/dny1020/personal_homepage:latest

echo "🔄 Recreating container..."
docker compose down
docker compose up -d

echo "⏳ Waiting for container to start..."
sleep 5

echo "🔍 Container status:"
docker compose ps

echo ""
echo "🔍 Checking environment variables in container:"
docker compose exec app printenv | grep -E "NAME|ROLE|BIO" | head -5

echo ""
echo "🔍 Backend health check:"
docker compose exec app curl -s http://localhost:8000/health

echo ""
echo "🔍 Environment debug endpoint:"
docker compose exec app curl -s http://localhost:8000/api/debug/env

echo ""
echo "📋 Recent logs:"
docker compose logs --tail=20
