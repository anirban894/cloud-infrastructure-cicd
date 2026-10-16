
# Cloud Infrastructure Setup & CI/CD Automation

## Overview

This project demonstrates a hands-on approach to Cloud Infrastructure Setup and CI/CD Automation. The initial implementation includes a lightweight Node.js API, automated HTTP endpoint tests, and Git-based source control.

The project will be extended incrementally with infrastructure automation and CI/CD practices as those components are implemented and verified.

## Current Implementation

- Node.js HTTP API using built-in modules
- `GET /` - returns the service welcome message and version
- `GET /health` - returns the service health status
- Unknown routes return HTTP 404
- Automated tests using Node.js's built-in test runner
- Git version control with a GitHub-hosted repository

## Prerequisites

- Node.js
- npm
- Git

## Run Locally

Clone the repository:

```bash
git clone https://github.com/anirban894/cloud-infrastructure-cicd.git
cd cloud-infrastructure-cicd
```

Run the automated tests:

```bash
npm test
```

Start the API:

```bash
npm start
```

The service listens on port 3000 by default. Set the `PORT` environment variable to use a different port.

## API Endpoints

| Method | Endpoint | Expected result |
|---|---|---|
| GET | `/` | HTTP 200 with welcome message and version |
| GET | `/health` | HTTP 200 with health status |
| GET | `/unknown` | HTTP 404 Not Found |

## Technology Stack

- Node.js
- JavaScript
- Git and GitHub
- Automated testing with `node:test` and `node:assert/strict`

## Planned Enhancements

The following items are planned and should not be considered implemented until verified:

- Terraform-based infrastructure automation
- CI/CD workflow and automated test execution
- Infrastructure validation and deployment practices
- Project documentation and troubleshooting evidence

## Project Status

The initial API implementation and three automated tests have been verified locally and published to GitHub. Infrastructure automation and CI/CD integration remain in progress.

## Cost and Security

Development begins locally. Any cloud resources will be assessed for cost and security before use. Never commit credentials, access tokens, private keys, or other secrets.
