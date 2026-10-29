# Docker Practical Validation â€” StoreOps API

**Project:** Cloud Infrastructure Setup & CI/CD Automation
**Application:** StoreOps API
**Docker Image:** `storeops-api:1.0.0`
**Validation Date:** 29 October 2026

## 1. Objective

Build a Docker image for the StoreOps API, validate its endpoints in a container, and document container lifecycle behavior in the WSL2 Ubuntu environment.

## 2. Dockerfile Configuration

The root `Dockerfile` uses:

- Base image: `node:24-alpine`
- Working directory: `/app`
- Application files: `package.json` and `src/`
- Runtime user: `node` (non-root)
- Exposed container port: `3000`
- Startup command: `npm start`

## 3. Image Build â€” Verified

**Command executed:**

```bash
sudo docker build --no-cache -t storeops-api:1.0.0 .
```

**Observed results:**

- Docker image built successfully.
- Image inspection confirmed the configured non-root user `node`.
- Image inspection confirmed exposed port `3000/tcp`.
- Adding `.dockerignore` reduced the reported build context to approximately `20.48 kB`.

## 4. API Endpoint Validation â€” Verified

The detached container was tested on host port `3001`, mapped to container port `3000`.

| Request | Observed result |
|---|---|
| `GET /health` | HTTP 200; `{"status":"healthy","service":"storeops-api"}` |
| `GET /version` | HTTP 200; service `storeops-api`, version `1.0.0` |
| `GET /` | HTTP 200; welcome response with version `1.0.0` |
| `GET /unknown-route` | HTTP 404 |

The endpoints responded successfully while the WSL2 Ubuntu environment and Docker Engine were running.

## 5. Container Lifecycle Investigation

A detached API container and an independent Node.js heartbeat container were observed running successfully during testing.

Later, the API container stopped. Its logs showed:

```text
npm error signal SIGTERM
```

Docker inspection reported `OOMKilled=false`.

The system journal subsequently showed:

- Ubuntu's systemd began shutting down at approximately 14:25:52 IST.
- Docker Engine was stopped during that shutdown.
- The container was deactivated shortly afterward.
- WSL reported that its shutdown process did not terminate within the expected timeout.

### Finding

The evidence confirms that the WSL2 Ubuntu instance powered down and Docker stopped with it. This explains the container termination.

**The initiating cause of the WSL shutdown remains undetermined.** The available evidence does not prove that the systemd user-session warning caused it.

## 6. Current Status and Limitations

- Docker image build: **Verified successful**
- API endpoint behavior: **Verified successful**
- Detached container operation: **Verified during an active WSL session**
- Container persistence across WSL shutdown: **Not supported by the current setup**
- Root cause of the WSL shutdown trigger: **Unresolved**
- Automatic restart or recovery after WSL shutdown: **Not yet implemented or validated**

Docker Engine runs inside the WSL2 Ubuntu distribution. When that distribution shuts down, its Docker daemon and running containers stop as well.

## 7. Next Actions

1. Preserve the current verified evidence.
2. Investigate the WSL shutdown trigger only if necessary.
3. Decide on an appropriate container restart strategy after understanding the environment.
4. Revalidate container lifecycle behavior after any approved configuration change.
5. Do not create AWS resources or run `terraform apply` as part of this Docker validation.

**Evidence rule:** Mark a task complete only when its result has been observed and verified. Keep unresolved causes and untested behavior explicitly identified.
