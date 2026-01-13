# CI/CD Setup

Este proyecto usa GitHub Actions para construir y publicar automáticamente una imagen Docker con frontend y backend integrados.

## Configuración

### 1. La imagen se publica automáticamente a GitHub Container Registry (GHCR)

Cada push a `main` o `master` construye y publica la imagen con el tag `latest`.

### 2. Desplegar en el servidor

En tu servidor, crea un archivo `.env` con las variables necesarias:

```bash
GITHUB_REPOSITORY=tu-usuario/tu-repo
```

Luego ejecuta:

```bash
# Hacer pull de la última imagen
docker pull ghcr.io/tu-usuario/tu-repo:latest

# Levantar el servicio
docker-compose -f docker-compose.prod.yml up -d
```

### 3. Script de actualización automática

Crear un script `update.sh`:

```bash
#!/bin/bash
docker pull ghcr.io/tu-usuario/tu-repo:latest
docker-compose -f docker-compose.prod.yml up -d --force-recreate
docker image prune -f
```

## Construcción local

Para probar localmente la imagen unificada:

```bash
docker build -t cv-project:latest .
docker run -p 80:80 -p 8000:8000 --env-file backend/.env cv-project:latest
```

## Arquitectura

- **Frontend**: Nginx en el puerto 80
- **Backend**: FastAPI/Gunicorn en el puerto 8000
- **Supervisor**: Gestiona ambos procesos en un solo contenedor
