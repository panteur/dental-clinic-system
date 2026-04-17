# Dental Clinic System

Sistema de gestión de citas para clínica dental.

## Stack Tecnológico

- **Frontend:** Next.js + Tailwind CSS
- **Backend:** Node.js + Express
- **Base de datos:** MySQL 8.0
- **Contenedores:** Docker + Docker Compose

## Inicio Rápido

### Requisitos
- Docker y Docker Compose
- Node.js 18+ (para desarrollo local)

### Desarrollo con Docker

```bash
# Iniciar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

### Desarrollo Local

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (en otra terminal)
cd frontend
npm install
npm run dev
```

## Estructura del Proyecto

```
/
├── frontend/          # Next.js app
├── backend/          # Express API
├── docker-compose.yml
└── AGENTS.md
```

## Roles del Sistema

| Rol | Descripción |
|-----|-------------|
| admin | Acceso total al sistema |
| dentista | Gestionar sus citas y pacientes |
| recepcionista | Gestionar citas y pacientes |

## API Base URL

- Desarrollo: `http://localhost:4000/api`
- Frontend: `http://localhost:3000`

## Deployment - Google Cloud Run

### Requisitos
- gcloud CLI instalado (`brew install google-cloud-sdk` o descargar installer)
- Proyecto GCP configurado
- MySQL externo (freesqldatabase.com u otro)

### Pasos

```bash
# 1. Autenticarse
gcloud auth login
gcloud config set project TU_PROYECTO

# 2. Habilitar servicios
gcloud services enable run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com

# 3. Deploy Backend
cd backend
gcloud run deploy dental-backend \
  --source . \
  --platform managed \
  --region southamerica-east1 \
  --allow-unauthenticated \
  --set-env-vars PORT=4000,DB_HOST=sql10.freesqldatabase.com,DB_PORT=3306,DB_NAME=sql10823552,DB_USER=sql10823552,DB_PASSWORD=TU_PASSWORD,JWT_SECRET=TU_SECRET,SMTP_HOST=smtp.gmail.com,SMTP_PORT=587,SMTP_USER=sservex@gmail.com,SMTP_PASS=TU_APP_PASSWORD,CLINIC_PHONE=+56948139501

# 4. Deploy Frontend (usar URL del backend del paso anterior)
cd ../frontend
gcloud run deploy dental-frontend \
  --source . \
  --platform managed \
  --region southamerica-east1 \
  --allow-unauthenticated \
  --set-env-vars NEXT_PUBLIC_API_URL=https://dental-backend-xxx.a.run.app/api

# 5. Actualizar FRONTEND_URL en backend con la URL del frontend
```

###Notas
- DB_HOST: usar host externo (sql10.freesqldatabase.com)
- La primera implementación toma ~5 minutos
- Cloud Run ofrece ~2Mrequests/gratis/mes

## Git Workflow

1. Crear rama desde `develop`: `git checkout -b feature/nombre`
2. Desarrollar y hacer commits
3. Crear Pull Request a `develop`
4. Después de approval, merge a `develop`
5. `main` solo recibe merges de `develop`

## Licencia

MIT
