# Deployment Plan: Customer Support Ticket System

## Overview
- **Project**: Customer Support Ticket System (FastAPI Backend only)
- **Target**: Azure Container Apps (Consumption Plan)
- **Subscription**: `38d6b49d-6042-4f94-9962-0f299d8935e6` (Azure Student)
- **Region**: `eastus`
- **Resource Group**: `rg-support-ticket`
- **IaC**: Bicep (Azure-native)
- **Deployment Method**: Azure CLI (two-phase deployment)

## Architecture

| Component | Azure Service | Config |
|-----------|---------------|--------|
| Backend API | Container App | External ingress, port 8000, 0.5 CPU / 1Gi, min 1 replica |
| Image Registry | Container Registry (ACR) | Basic tier, system-assigned MI |
| Logging | Log Analytics Workspace | 7-day retention |
| Monitoring | Application Insights | Free tier |
| Secrets | Key Vault | Standard, RBAC for Container App MI |
| Database | External (Supabase) | Connection via Key Vault |
| Vector Store | External (Pinecone) | API key in Key Vault |
| Embeddings | External (Ollama VM) | `http://20.219.192.28:11434` |
| LLM | External (Groq) | API key in Key Vault |
| Reranker | External (Cohere) | API key in Key Vault |

## Required Secrets (Key Vault)

| Secret Name | Source |
|-------------|--------|
| `COHERE-API-KEY` | User provided |
| `GROQ-API-KEY` | User provided |
| `PINECONE-API-KEY` | User provided |
| `PGPASSWORD` | Supabase password (user provided) |
| `PGHOST` | Supabase host (user provided) |
| `OLLAMA-BASE-URL` | `http://20.219.192.28:11434` |
| `CORS-ORIGINS` | Vercel frontend URL (user provided) |

## Bicep Module Structure

```
infra/
├── main.bicep
├── modules/
│   ├── log-analytics.bicep
│   ├── app-insights.bicep
│   ├── container-registry.bicep
│   ├── container-apps-env.bicep
│   ├── key-vault.bicep
│   ├── container-app.bicep
│   └── acr-pull-role.bicep
└── azure.yaml
```

## Two-Phase Deployment (Mandatory)

### Phase 1: Infrastructure + Placeholder Image
Deploy all Bicep modules with placeholder image (`mcr.microsoft.com/azuredocs/containerapps-helloworld:latest`)

### Phase 2: Build & Deploy Real Image
1. `az acr build --registry <acr> --image support-ticket-api:latest ./backend`
2. `az containerapp registry set --name <app> --resource-group rg-support-ticket --server <acr-server> --identity system`
3. `az containerapp update --name <app> --resource-group rg-support-ticket --image <acr-server>/support-ticket-api:latest`

## Container App Spec

```yaml
cpu: 0.5
memory: 1Gi
minReplicas: 1
maxReplicas: 3
ingress:
  external: true
  targetPort: 8000
  transport: auto
probes:
  - type: liveness
    httpGet: { path: /health, port: 8000 }
    initialDelaySeconds: 30
    periodSeconds: 30
  - type: readiness
    httpGet: { path: /health, port: 8000 }
    initialDelaySeconds: 10
    periodSeconds: 10
```

## Estimated Monthly Cost (Student)

| Resource | Est. Cost |
|----------|-----------|
| ACR Basic | ~$5.00 |
| Container Apps (Consumption) | ~$8-15 |
| Log Analytics | ~$2.50 |
| App Insights | $0 |
| Key Vault | ~$1.00 |
| **Total** | **~$16-24/mo** |

## Deployment Steps

1. `az login` + `az account set`
2. `az group create --name rg-support-ticket --location eastus`
3. `az deployment group create -g rg-support-ticket -f infra/main.bicep -p environmentName=prod`
4. `az acr build -r <acr-name> -t support-ticket-api:latest ./backend`
5. Configure ACR identity link + update image (Phase 2)
6. Populate Key Vault secrets
7. Restart Container App to pick up secrets
8. Verify health + API endpoint

## Status
**Status**: Validated
**Last Updated**: 2026-06-23

## Files Created
- `infra/main.bicep` - Main orchestrator
- `infra/modules/log-analytics.bicep` - Log Analytics Workspace
- `infra/modules/app-insights.bicep` - Application Insights
- `infra/modules/container-registry.bicep` - ACR (Basic)
- `infra/modules/container-apps-env.bicep` - Container Apps Environment
- `infra/modules/key-vault.bicep` - Key Vault with RBAC
- `infra/modules/container-app.bicep` - Container App (placeholder image)
- `infra/modules/acr-pull-role.bicep` - AcrPull role assignment
- `infra/azure.yaml` - AZD config
- `backend/Dockerfile` - Container image definition
- `backend/.dockerignore` - Docker ignore rules
- `deploy.ps1` - Automated deployment script

## Section 7: Validation Proof

### Bicep Build Validation
**Command**: `az bicep build --file infra/main.bicep --outdir infra/out`
**Result**: SUCCESS (no errors)

```
WARNING: C:\Files\Customer Support Ticket System\infra\modules\log-analytics.bicep(24,34) : Warning 
outputs-should-not-contain-secrets: Outputs should not contain secrets. Found possible secret: function 'listKeys'
WARNING: C:\Files\Customer Support Ticket System\infra\modules\container-apps-env.bicep(21,20) : Warning 
use-secure-value-for-secure-inputs: Property 'sharedKey' expects a secure value, but the value provided may not be secure.
```

**Notes**: 
- Warning about `listKeys()` output is acceptable for dev/student deployment
- Warning about `sharedKey` secure value is acceptable (passed as parameter at deployment time)
- No errors - template compiles to valid ARM JSON

### Template Structure Validation
- All 7 modules compile correctly
- Two-phase deployment pattern implemented (placeholder image → real image)
- System-assigned managed identity for ACR authentication
- Key Vault secrets referenced via Key Vault URI (not hardcoded)
- Health probes configured in container template (not configuration)
- HTTP scaling rule configured (100 concurrent requests)

### Dockerfile Validation
**File**: `backend/Dockerfile`
- Base image: `python:3.11-slim` (matches runtime.txt)
- Dependencies: requirements.txt copied first for layer caching
- Artifacts: app/, scripts/, rag_artifacts/ copied (includes ML models ~750KB + RAG artifacts ~95MB)
- Port: 8000 exposed (matches uvicorn)
- Health check: `/health` endpoint
- Startup: `uvicorn app.main:app --host 0.0.0.0 --port 8000`

### Deployment Script Validation
**File**: `deploy.ps1`
- Phase 1: `az deployment group create` with main.bicep
- Phase 2: `az acr build` → `az containerapp registry set` → `az containerapp update`
- Key Vault secrets populated interactively
- Container App restart to pick up new secrets
- Health check verification with retries

### Cost Estimation
- ACR Basic: ~$5/mo
- Container Apps Consumption (0.5 CPU, 1Gi, min 1): ~$8-15/mo
- Log Analytics (1GB/day): ~$2.50/mo
- App Insights: Free tier
- Key Vault: ~$1/mo
- **Total: ~$16-24/mo** (within student account limits)