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

## Git Workflow

1. Crear rama desde `develop`: `git checkout -b feature/nombre`
2. Desarrollar y hacer commits
3. Crear Pull Request a `develop`
4. Después de approval, merge a `develop`
5. `main` solo recibe merges de `develop`

## Licencia

MIT
