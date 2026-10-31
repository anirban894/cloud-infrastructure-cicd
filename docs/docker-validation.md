# Docker Practical Validation — StoreOps API

**Project:** Cloud Infrastructure Setup & CI/CD Automation

**Application:** StoreOps API

**Docker Images:** `storeops-api:1.0.0` (original validation) and `storeops-api:1.0.0-linux-verified` (31 October Linux-native build)

**Validation Date:** 30–31 October 2026

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

## 3. Image Build — Verified

**Command executed:**

```bash
sudo docker build --no-cache -t storeops-api:1.0.0 .
```

**Observed results:**

- Docker image built successfully.
- Image inspection confirmed the configured non-root user `node`.
- Image inspection confirmed exposed port `3000/tcp`.
- Adding `.dockerignore` reduced the reported build context to approximately `20.48 kB`.

## 4. API Endpoint Validation — Verified

The detached container was tested on host port `3001`, mapped to container port `3000`.

| Request | Observed result |
|---|---|
| `GET /health` | HTTP 200; `{"status":"healthy","service":"storeops-api"}` |
| `GET /version` | HTTP 200; service `storeops-api`, version `1.0.0` |
| `GET /` | HTTP 200; welcome response with version `1.0.0` |
| `GET /unknown-route` | HTTP 404 |

The endpoints responded successfully while the WSL2 Ubuntu environment and Docker Engine were running.

### Additional Recovery Container Validation — 30 October 2026

An existing recovery-test container was inspected and validated.

**Container configuration:**

- Container name: `storeops-api-recovery-test`
- Image: `storeops-api:1.0.0`
- Container status: Running
- Restart policy: `unless-stopped`
- Port mapping: host `3002` to container `3000`
- Image ID: `sha256:af908ce79c8e22bd06ac0b26e026717e99d5ccb47d32367274d806a1cbe63d9b`
- Image size: `62,499,202` bytes

**Observed container inspection:**

- Exit code: `0`
- Restart policy confirmed as `unless-stopped`
- Host port `3002` mapped to container port `3000`

**Endpoint validation on host port 3002:**

| Request | Observed result |
|---|---|
| `GET /health` | HTTP 200; `{"status":"healthy","service":"storeops-api"}` |
| `GET /version` | HTTP 200; service `storeops-api`, version `1.0.0` |
| `GET /` | HTTP 200; welcome response with version `1.0.0` |
| `GET /unknown-route` | HTTP 404; `{"error":"Not Found"}` |

All four endpoint responses matched the expected behavior.

**Validation limitation (as of 30 October 2026):** The container's restart policy was configured, but a new Docker daemon restart and WSL shutdown/restart recovery test had not been performed at that time. The configuration alone did not establish successful automatic recovery.

## 5. Fresh Linux-Native Docker Build & Validation — 31 October 2026

### Environment
- OS: Ubuntu 22.04.5 LTS (WSL2)
- Node.js: 24.22.2 (NVM 0.40.3)
- npm: 11.19.1
- Docker Engine: 29.1.3

### Application Test Validation
- Command: `npm test`
- Result: PASS — 4 tests passed, 0 failed.
- Tested endpoints: `/`, `/health`, `/version`, `/unknown`

### Fresh Docker Image Build
- Command: `docker build -t storeops-api:1.0.0-linux-verified .`
- Result: Successful.
- Build context: 26.11 kB
- Base image: `node:24-alpine`
- Runtime user: `node`
- Exposed port: `3000`
- Image ID: `sha256:18dbf853859b4971cb391c75245b2212aadaa5ec44ff6f1ea6c72ca029e88482`
- Image size: 62,499,192 bytes.
- Legacy builder deprecation warning appeared; build succeeded.

### Fresh Container Deployment
- Command: `docker run -d --name storeops-api-linux-build-test -p 3003:3000 storeops-api:1.0.0-linux-verified`
- Result: Container started successfully and remained running.
- Container ID: `93baea2175b8cdf4dc21a1fa33df99e841259c849918c8de7fb80fefec0fe5f7`
- Port mapping: host `3003` to container `3000`.

### Endpoint Validation
All requests were tested against `http://localhost:3003`.
- `/` — HTTP 200 — PASS
- `/health` — HTTP 200 — PASS
- `/version` — HTTP 200 — PASS
- `/unknown-route` — HTTP 404 — PASS

Response bodies matched the expected application responses.

### Validation Boundary
The fresh Linux-native image build, container startup, and endpoint functionality were verified. At the time of this build validation, recovery after a Docker daemon restart or WSL shutdown/restart had not yet been tested. The subsequent daemon-restart test is documented below.

### Docker Daemon Restart Recovery Validation — 31 October 2026

**Environment:** Ubuntu 22.04.5 LTS (WSL2), Docker Engine 29.1.3.

**Pre-test state:**
- Docker service: active and enabled.
- `storeops-api-recovery-test`: running, restart policy `unless-stopped`.
- `storeops-api-linux-build-test`: running, restart policy `no`.
- Recovery container baseline ID: `fd5dd116391d0b4e67b32685f26dddeb75ac962ef4ffcc56583479ceecb42a13`.
- Baseline start time: `2026-10-31T04:47:04.309670432Z`.
- Baseline restart count: `0`.
- Baseline health endpoint on port `3002`: HTTP 200.

**Test procedure:**

Command executed: `sudo systemctl restart docker`

Docker service returned to `active`.

**Observed recovery results:**

| Check | `unless-stopped` container | `no` policy container |
|---|---|---|
| Before daemon restart | Running | Running |
| After daemon restart | Running | Exited (1) |
| Automatic recovery | Yes | No |
| Manual start required | No | Yes |
| Post-recovery health check | HTTP 200 | HTTP 200 after manual start |

The `unless-stopped` container retained its original ID. Its new start time was `2026-10-31T09:33:16.361389854Z`, confirming that the original container was started again. Its reported restart count remained `0`.

The `no` policy container was subsequently started manually with `docker start storeops-api-linux-build-test`. Both containers were confirmed running, and both health endpoints returned HTTP 200.

**Result:** Docker daemon restart recovery was successfully verified for the `unless-stopped` container. The container configured with `no` did not automatically restart.

**Validation boundary:** This test covers a Docker daemon restart. Full WSL distribution shutdown and restart recovery is documented in the following section.

### WSL Distribution Shutdown & Restart Recovery Validation — 31 October 2026

**Environment:** Windows 10, WSL2, Ubuntu-22.04, Docker Engine 29.1.3.

**Pre-test state:**
- Ubuntu-22.04 was running under WSL 2.
- Docker service was enabled and active.
- `storeops-api-recovery-test` was running with restart policy `unless-stopped`.
- Container ID: `fd5dd116391d0b4e67b32685f26dddeb75ac962ef4ffcc56583479ceecb42a13`.
- Pre-shutdown start time: `2026-10-31T09:33:16.361389854Z`.
- Pre-shutdown restart count: `0`.

**Test procedure:**

From Windows PowerShell, the following command was executed:

`wsl --terminate Ubuntu-22.04`

The Ubuntu distribution was then relaunched using:

`wsl -d Ubuntu-22.04`

On relaunch, WSL displayed a systemd user-session warning:

`Failed to start the systemd user session for 'ubuntu'. See journalctl for more details.`

This warning did not prevent Docker from starting.

**Observed recovery results:**

| Check | Result |
|---|---|
| Ubuntu-22.04 relaunch | Successful |
| Docker service after relaunch | Active |
| Recovery container after relaunch | Running |
| Container ID | Unchanged |
| Restart policy | `unless-stopped` |
| New StartedAt | `2026-10-31T15:02:52.401211427Z` |
| Reported RestartCount | `0` |
| Health endpoint on port `3002` | HTTP 200 |

The unchanged container ID and updated start timestamp confirm that the existing container was automatically started again after the WSL distribution restarted.

The final health check was executed using:

`curl -i http://localhost:3002/health`

Response: HTTP 200 OK.

`{"status":"healthy","service":"storeops-api"}`

**Result:** Automatic recovery of the `unless-stopped` container was successfully verified after a complete Ubuntu-22.04 WSL distribution termination and relaunch.

**Validation boundary:** This test verifies recovery of the `unless-stopped` container. Automatic recovery of the `no` policy container after a full WSL distribution restart has not been tested. The systemd user-session warning was observed but its cause has not been established.

## 6. Container Lifecycle Investigation

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

## 7. Current Status and Limitations

- Docker image build: **Verified successful**
- API endpoint behavior: **Verified successful**
- Detached container operation: **Verified during an active WSL session**
- Container recovery across WSL shutdown/restart: **Not yet validated**
- Root cause of the WSL shutdown trigger: **Unresolved**
- Container restart policy: **Configured as `unless-stopped` on the recovery-test container**
- Recovery after Docker daemon restart: **Verified on 31 October 2026 for the `unless-stopped` container; the `no` policy container required manual start**
- Recovery after WSL shutdown/restart: **Not newly validated in this session**

Docker Engine runs inside the WSL2 Ubuntu distribution. When that distribution shuts down, its Docker daemon and running containers stop as well.

## 8. Next Actions

1. Preserve the current verified evidence.
2. Investigate the WSL shutdown trigger only if necessary.
3. Completed: Docker daemon restart recovery validated on 31 October 2026.
4. Separately validate recovery after WSL shutdown/restart, if approved and required.
5. Do not create AWS resources or run `terraform apply` as part of this Docker validation.

**Evidence rule:** Mark a task complete only when its result has been observed and verified. Keep unresolved causes and untested behavior explicitly identified.
