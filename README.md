# ⚡ TaskFlow – Full-Stack Task Management & Automated CI/CD Pipeline

TaskFlow is a production-ready Full-Stack Task Management application designed to organize and manage tasks through an interactive Kanban board, priority management, subtasks, Markdown support, deadline tracking, and productivity analytics.

Beyond application development, TaskFlow showcases an end-to-end DevOps workflow using Docker, Docker Compose, Jenkins, Nginx, PostgreSQL, and AWS EC2. Every push to the `main` branch automatically triggers a CI/CD pipeline that builds, containerizes, and deploys the latest version of the application to a production environment.

---

## ✨ Project Highlights

- Production-Ready Full-Stack Web Application
- Secure JWT Authentication & Authorization
- Interactive Kanban Task Management
- Dockerized Multi-Container Architecture
- Automated CI/CD Pipeline with Jenkins
- Zero-Touch Deployment to AWS EC2
- Nginx Reverse Proxy & PostgreSQL Integration
- Modern Responsive User Interface

---

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- JavaScript
- CSS3

### Backend
- Node.js
- Express

### Database
- PostgreSQL

### DevOps & Cloud
- Docker & Docker Compose
- Nginx
- Jenkins
- AWS EC2
- Ubuntu

---

## ⭐ Core Features

- Secure User Registration & Login using JWT Authentication
- Create, Update, Delete, and Complete Tasks
- Interactive Kanban Board with Priority Management
- Subtasks with Progress Tracking
- Markdown-Based Task Descriptions
- Calendar-Based Deadline Tracking
- Productivity Dashboard & Analytics
- Responsive Glassmorphism User Interface

---

## 🏗️ Architecture Overview

TaskFlow follows a modern full-stack architecture where the React frontend communicates with the Express backend through REST APIs. The backend handles authentication, business logic, and database operations while PostgreSQL stores persistent application data.

The complete application is containerized using Docker and orchestrated through Docker Compose. Nginx serves the production frontend and securely proxies API requests to the backend. Jenkins automates the build, testing, Docker image creation, and deployment process, while AWS EC2 hosts the production environment.

```text
                    ┌────────────────────────┐
                    │        Browser         │
                    └────────────┬───────────┘
                                 │
                                 ▼
                     React Frontend (Vite)
                                 │
                          Axios REST API
                                 │
                                 ▼
                     Nginx Reverse Proxy
                                 │
                                 ▼
                     Express.js Backend
                                 │
                JWT Authentication & APIs
                                 │
                                 ▼
                        PostgreSQL Database
```

---

## 🔄 CI/CD Pipeline

Every push to the `main` branch triggers a fully automated Jenkins pipeline that builds, tests, containerizes, and deploys the latest version of the application.

```text
Developer ──> GitHub ──> Jenkins
                            ├── Install Dependencies
                            ├── Run Tests
                            ├── Build Frontend & Backend
                            ├── Build Docker Images
                            ├── Push to Docker Hub
                            └── Deploy to AWS EC2
                                       │
                                       ▼
                                 Docker Compose
                                       │
                                       ▼
                             Live Production Application
```

---

## ▶️ Getting Started

For full installation and deployment instructions, please read our comprehensive [Developer Setup Guide](PROJECT_SETUP.md).

### Quick Start (Docker Compose)

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/TaskFlow.git
   cd TaskFlow
   ```
2. Configure `.env` in the `backend` directory.
3. Start all containers:
   ```bash
   docker-compose up -d --build
   ```
4. Access the frontend at `http://localhost` and the API at `http://localhost:5000/api`.

---

## 📸 Project Snapshots

- User Authentication Flow
- Interactive Kanban Board
- Analytics Dashboard
- Containerized Architecture
- Jenkins Pipeline

---

## 🔮 Future Improvements

- Amazon RDS integration
- HTTPS with Let's Encrypt
- Amazon CloudFront
- AWS CloudWatch Monitoring
- Terraform Infrastructure as Code
- Role-Based Access Control (RBAC)
- Real-Time Updates (WebSockets)
- File Attachments
