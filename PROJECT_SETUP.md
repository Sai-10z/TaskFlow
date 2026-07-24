# TaskFlow Developer Setup Guide

This guide provides comprehensive instructions for setting up, running, and deploying the TaskFlow application.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
- [PostgreSQL](https://www.postgresql.org/) (if running locally without Docker)
- [Git](https://git-scm.com/)

---

## 1. Local Development Setup (Without Docker)

### Database Setup
1. Create a PostgreSQL database named `taskflow`.
2. Ensure you have a user with access to this database.

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` (or configure as follows):
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=your_db_password
   DB_NAME=taskflow
   JWT_SECRET=your_jwt_secret
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend will be available at `http://localhost:5000`.

### Frontend Setup
1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file (if required) or just rely on defaults:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`.

---

## 2. Running with Docker Compose (Recommended)

To run the entire stack (Frontend, Backend, and PostgreSQL) in containers, use Docker Compose.

1. Configure the `.env` file in the `backend` directory with your database credentials and JWT secret.
2. Build and start the containers from the project root:
   ```bash
   docker-compose up -d --build
   ```
3. The application will be available at:
   - Frontend: `http://localhost`
   - Backend API: `http://localhost:5000/api`

**Useful Docker Commands:**
- View logs: `docker-compose logs -f`
- Stop containers: `docker-compose down`
- Rebuild containers after changes: `docker-compose up -d --build`

---

## 3. CI/CD & Deployment Setup

TaskFlow includes a complete Jenkins CI/CD pipeline and AWS EC2 deployment scripts.

### Docker Hub Setup
1. Create a Docker Hub account.
2. In Jenkins, add a credential named `dockerhub-credentials` with your username and password/token.

### AWS EC2 Setup
1. Provision an Ubuntu EC2 instance and associate an Elastic IP.
2. Configure Security Groups to allow port 80 (HTTP), 443 (HTTPS), 22 (SSH), and optionally 5000 (API).
3. SSH into the instance and install Docker and Docker Compose.
4. Add the EC2 SSH private key to Jenkins as a credential named `ec2-ssh-key`.

### Jenkins Pipeline Setup
1. Create a new Pipeline job in Jenkins.
2. Point it to your forked GitHub repository.
3. The `Jenkinsfile` in the repository root will automatically handle:
   - Installing dependencies and running tests
   - Building Docker images
   - Pushing images to your Docker Registry
   - Connecting to the EC2 instance via SSH
   - Pulling the latest changes and restarting Docker containers

*Note: Ensure you update the placeholders (`your-dockerhub-username`, `your-ec2-public-ip`) in the `Jenkinsfile` and `docker-compose.yml` to match your environment.*

---

## Troubleshooting & Common Errors

- **Database Connection Refused**: Ensure PostgreSQL is running on port 5432 and the credentials in `.env` match your database setup.
- **Port Conflicts**: If port 5000 or 80/5173 is already in use, you can modify the ports in `docker-compose.yml` or your `.env` files.
- **CORS Errors**: Ensure the `VITE_API_URL` exactly matches the backend's address, including `http://` or `https://`.
- **Jenkins SSH Errors**: Verify that your EC2 Security Group allows SSH access from the IP address of your Jenkins server.
