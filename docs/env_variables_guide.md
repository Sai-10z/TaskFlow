# TaskFlow Environment Variables Guide

This document lists all environment variables required for the production deployment of TaskFlow.
Ensure these variables are injected into your CI/CD pipeline secrets (e.g., Jenkins Credentials) or stored in a `.env` file on your production server.

## Global / Docker Compose Variables
These variables should be provided in the same directory as the `docker-compose.yml` file.

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `VITE_API_URL` | The public base URL for the backend API so the frontend knows where to fetch data. | `https://api.yourdomain.com` |
| `DB_USER` | The database username. | `postgres` |
| `DB_PASSWORD` | The database password. | `production_secure_pass_123` |
| `DB_NAME` | The name of the PostgreSQL database. | `taskflow_prod` |
| `JWT_SECRET` | A secure, random string used for signing authentication tokens. | `super_secret_jwt_key_99x` |

## Backend Variables (Node.js API)
If running the backend independently outside of Docker Compose, ensure these are set.

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `PORT` | The port the backend listens on. | `5000` |
| `NODE_ENV` | Sets the application mode (development vs production). | `production` |
| `TZ` | Enforces application timezone processing. | `Asia/Kolkata` |
| `DB_HOST` | The hostname of the Postgres database (use the RDS endpoint or Docker service name). | `db` or `taskflow-prod.xxx.us-east-1.rds.amazonaws.com` |
| `DB_PORT` | The database port. | `5432` |
| `AWS_ACCESS_KEY_ID` | (Optional) AWS Access Key for S3 integration. | `AKIAIOSFODNN7EXAMPLE` |
| `AWS_SECRET_ACCESS_KEY` | (Optional) AWS Secret Key for S3 integration. | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` |
| `AWS_REGION` | (Optional) AWS Region where the S3 bucket is hosted. | `us-east-1` |
| `S3_BUCKET_NAME` | (Optional) Name of the S3 bucket for file uploads. | `taskflow-prod-assets` |

## Frontend Variables (React/Vite)
These variables are baked into the frontend build at compile-time.

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `VITE_API_URL` | The production URL for the backend API. | `https://api.yourdomain.com` |

## Jenkins CI/CD Variables
These must be configured in Jenkins Credentials / Environment.

| Variable | Description |
|----------|-------------|
| `DOCKER_CREDENTIALS_ID` | The ID of the Jenkins credential containing DockerHub login details. |
| `DOCKER_REGISTRY` | Your DockerHub username or ECR URI. |
| `EC2_USER` | The SSH username for your EC2 instance (e.g., `ec2-user` or `ubuntu`). |
| `EC2_IP` | The Elastic IP address of your EC2 production instance. |
| `SSH_KEY_ID` | The ID of the Jenkins SSH credential containing the `.pem` key for EC2 access. |
