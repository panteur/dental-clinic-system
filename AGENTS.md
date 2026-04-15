# Dental Appointment System - AGENTS.md

## Project Overview
Sistema de gestión de citas para clínica dental con:
- Frontend: Next.js + Tailwind CSS
- Backend: Node.js + Express
- Database: MySQL
- Containerization: Docker

## Project Structure (Monorepo)
```
/
├── frontend/          # Next.js app
├── backend/          # Express API
├── docker-compose.yml
└── AGENTS.md
```

## Quick Commands

### Development
```bash
# Start all services (MySQL + apps)
docker-compose up -d
cd backend && npm install && npm run dev
cd frontend && npm install && npm run dev

# Database migrations
cd backend && npm run db:migrate
```

### Docker
```bash
# Full stack
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop all
docker-compose down
```

## Important Conventions

### Branch Strategy
- `main` → producción
- `develop` → integración
- Feature: `feature/nombre-feature`
- Fix: `fix/nombre-fix`

### Commit Messages
- `feat: nueva funcionalidad`
- `fix: corrección de bug`
- `docs: documentación`
- `chore: mantenimiento`
- `refactor: refactorización`

### Roles del Sistema
1. **admin** - Acceso total
2. **dentista** - Gestionar sus citas/pacientes
3. **recepcionista** - Gestionar citas y pacientes

### API Base URL
- Development: `http://localhost:4000/api`
- Frontend: `http://localhost:3000`

## Environment Variables

### Backend (.env)
```
PORT=4000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=dental_clinic
DB_USER=root
DB_PASSWORD=secret
JWT_SECRET=your-secret-key
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

## Database Models (planned)
- `users` - dentistas, recepcionistas, admins
- `patients` - datos de pacientes
- `appointments` - citas
- `services` - especialidades (ortodoncia, limpieza, etc.)
- `schedules` - horarios configurables
- `notifications` - email/SMS logs

## Fases del Proyecto
1. FASE 0: Setup y Estructura
2. FASE 1: Backend Base
3. FASE 2: Frontend Base
4. FASE 3: Sistema de Citas
5. FASE 4: Panel de Administración
6. FASE 5: Notificaciones
7. FASE 6: Dockerización Completa
8. FASE 7: Deployment

## Notes
- No hacer commits directos a `main` (usar PRs)
- Requiere 2 autorizaciones del usuario para avanzar de fase
- Verificar lint/typecheck antes de reportar completitud de fase
