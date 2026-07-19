# TaskFlow

TaskFlow is a production-ready, full-stack task management application built with React, Node.js, Express, and PostgreSQL. It features a modern UI with drag-and-drop Kanban boards, a dashboard, and robust task CRUD functionalities.

## Production Infrastructure Deployment

The application has been successfully configured for production deployment on AWS using Docker and a Jenkins CI/CD pipeline.

For full deployment documentation, please refer to the `docs/` folder:

- **[Deployment Guide](docs/deployment_guide.md)**: Step-by-step instructions for provisioning AWS infrastructure (EC2, RDS), setting up Docker Compose, and configuring Nginx with SSL via Certbot.
- **[Architecture Diagram](docs/architecture_diagram.md)**: Visual representation of the AWS cloud topology (VPC, EC2, RDS, S3, CloudFront).
- **[Environment Variables Guide](docs/env_variables_guide.md)**: A complete matrix of all required environment variables for the frontend, backend, CI/CD pipeline, and AWS integration.

## Features Currently Implemented
✓ React Frontend
✓ Express Backend API
✓ PostgreSQL Database
✓ JWT Authentication
✓ Secure Authentication System
✓ Analytics Dashboard
✓ Task CRUD
✓ Kanban Board
✓ Responsive Design
✓ Real-time timezone and calendar formatting

## Local Development

To run the application locally via Docker:

1. Copy the `.env.example` to `.env` and fill in your variables.
2. Run the following command:
```bash
docker-compose up -d --build
```
3. Access the frontend at `http://localhost` and the backend API at `http://localhost:5000/api`.
