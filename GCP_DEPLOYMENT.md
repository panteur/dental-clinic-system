# Dental Clinic System - Google Cloud Run Deployment
# Using Cloud Run (free tier: 2M requests/month) + Cloud SQL MySQL

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Cloud Run      │     │   Cloud Run     │     │   Cloud SQL     │
│   Frontend       │────▶│   Backend API   │────▶│   MySQL        │
│   (Next.js)     │     │   (Express)     │     │   (Free tier)  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Prerequisites

1. **Google Cloud Account** with billing enabled (required for Cloud Run)
2. **gcloud CLI** installed locally

## FREE TIER Monthly Quotas

- Cloud Run: 2,000,000 requests
- Cloud SQL: 1 vCPU, 3.75GB RAM (single instance)
- Egress: 1GB/day ( Americas zones)

---

## Quick Deployment (Step by Step)

### 1. Authenticate

```bash
gcloud auth login
gcloud auth application-default login
```

### 2. Create Project (if not exists)

```bash
gcloud projects create dental-clinic-[unique-id] --name="Dental Clinic"
gcloud config set project dental-clinic-[unique-id]
```

### 3. Enable Required Services

```bash
gcloud services enable run.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

### 4. Create Cloud SQL Instance

```bash
gcloud sql instances create dental-db \
    --database-version=MYSQL_8_0 \
    --tier=db-f1-micro \
    --region=southamerica-east1 \
    --root-password=YOUR_SECURE_PASSWORD
```

### 5. Create Database

```bash
gcloud sql databases create dental_clinic --instance=dental-db
```

### 6. Configure Environment Variables

```bash
# Set these values for your deployment
export PROJECT_ID="your-project-id"
export REGION="southamerica-east1"
export DB_PASSWORD="your-secure-password"
export JWT_SECRET="generate-secure-random-string"
export SMTP_PASS="your-gmail-app-password"
export FRONTEND_URL="https://your-service-run.app"
```

### 7. Deploy Backend (Cloud Run)

```bash
cd backend

gcloud run deploy dental-backend \
    --source . \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --service-account dental-run@$PROJECT_ID.iam.gserviceaccount.com \
    --set-env-vars NODE_ENV=production,PORT=4000,DB_HOST=/cloudsql/$PROJECT_ID:$REGION:dental-db,DB_PORT=3306,DB_NAME=dental_clinic,DB_USER=root,DB_PASSWORD=$DB_PASSWORD,JWT_SECRET=$JWT_SECRET,SMTP_HOST=smtp.gmail.com,SMTP_PORT=587,SMTP_USER=sservex@gmail.com,SMTP_PASS=$SMTP_PASS,CLINIC_PHONE=+56948139501,FRONTEND_URL=$FRONTEND_URL
```

### 8. Deploy Frontend (Cloud Run)

```bash
cd frontend

# Build with API URL pointing to backend
NEXT_PUBLIC_API_URL=https://dental-backend-[hash]-$REGION.a.run.app/api \
gcloud run deploy dental-frontend \
    --source . \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --set-env-vars NEXT_PUBLIC_API_URL=https://dental-backend-[hash]-$REGION.a.run.app/api
```

### 9. Update Backend FRONTEND_URL

After deploying frontend, update the backend environment variable:

```bash
# Update via Cloud Console or:
gcloud run services update dental-backend \
    --platform managed \
    --region $REGION \
    --set-env-vars FRONTEND_URL=https://dental-frontend-[hash]-$REGION.a.run.app
```

---

## Quick Alternative: Deploy Both Services

```bash
# 1. Backend
gcloud run deploy api \
  --source ./backend \
  --platform managed \
  --region southamerica-east1 \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production,PORT=4000,DB_HOST=/cloudsql/PROJECT:southamerica-east1:dental-db,DB_PORT=3306,DB_NAME=dental_clinic

# 2. Frontend  
gcloud run deploy web \
  --source ./frontend \
  --platform managed \
  --region southamerica-east1 \
  --allow-unauthenticated \
  --set-env-vars NEXT_PUBLIC_API_URL=https://api-xyz.a.run.app/api
```

---

## Cloud SQL Proxy (Development)

If you need local access to Cloud SQL:

```bash
# Download proxy
curl -o cloud-sql-proxy https://storage.googleapis.com/cloud-sql-connectors/cloud-sql-proxy/v2.8.0.linux.amd64
chmod +x cloud-sql-proxy

# Run proxy
./cloud-sql-proxy --port 3306 PROJECT:southamerica-east1:dental-db
```

---

## Verify Deployment

```bash
# List services
gcloud run services list

# Check status
gcloud run services describe dental-backend --region southamerica-east1

# View logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=dental-backend" --limit=50
```

---

## Cost Estimation (Monthly)

| Service | Free Tier | Est. Cost |
|---------|----------|----------|
| Cloud Run | 2M reqs | $0.00 |
| Cloud SQL | 1 vCPU | ~$5-7/m |
| Cloud Storage | 5GB | $0.00 |
| Egress | 1GB/day | ~$0.10 |
| **TOTAL** | | **~$5-7/month** |

**Note:** Cloud SQL db-f1-micro costs ~$5-7/month but includes $300 free credit for 90 days.

---

## Alternative: Use Cloud SQL Auth Proxy in Container

```dockerfile
# backend/Dockerfile.cloudrun
FROM node:18-alpine

# Install Cloud SQL Proxy
RUN wget -q https://storage.googleapis.com/cloud-sql-connectors/cloud-sql-proxy/v2.8.0.linux.amd64 -O cloud-sql-proxy && \
    chmod +x cloud-sql-proxy

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

EXPOSE 4000

# Start proxy in background + backend
CMD (./cloud-sql-proxy --port 3306 /cloudsql/PROJECT:REGION:INSTANCE &) && npm start
```

---

## Troubleshooting

### Connection Issues
```bash
# Check Cloud SQL status
gcloud sql instances describe dental-db

# Test connection
gcloud sql connect dental-db --user=root
```

### Permission Issues
```bash
# Grant Cloud SQL Client role
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:dental-run@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/cloudsql.client"
```

### View Logs
```bash
gcloud logging read "resource.type=cloud_run_revision" --limit=100 --format="table(timestamp,severity,textPayload)"
```

---

## Cleanup (Stop Billing)

```bash
gcloud sql instances delete dental-db
gcloud run services delete dental-backend --quiet
gcloud run services delete dental-frontend --quiet
```