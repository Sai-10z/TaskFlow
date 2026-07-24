# ⚡ TaskFlow – A Full-Stack Task Management & Automated CI/CD Pipeline

TaskFlow is a Full-Stack Task Management application developed during my internship to apply modern software engineering, DevOps, containerization, and cloud deployment practices. It enables users to manage tasks through an interactive Kanban board, task prioritization, subtasks, Markdown support, deadline tracking, and productivity analytics.

The project also demonstrates an end-to-end CI/CD workflow using Docker, Docker Compose, Jenkins, Nginx, PostgreSQL, and AWS EC2 for automated deployment.

---

# ✨ Project Highlights

- Full-Stack Task Management Application
- Secure JWT Authentication
- Interactive Kanban Task Management
- Dockerized Multi-Container Architecture
- Automated CI/CD Pipeline with Jenkins
- Automated Deployment to AWS EC2
- Nginx Reverse Proxy & PostgreSQL Integration
- Responsive Modern User Interface

---

# 🎯 Project Objectives

This project was built to:

- Develop a modern Full-Stack web application using React and Express.js
- Implement secure JWT-based authentication
- Learn Docker containerization and multi-container orchestration
- Build an automated CI/CD pipeline using Jenkins
- Deploy applications on AWS EC2 using Docker and Nginx
- Gain practical experience with DevOps and cloud technologies

---

# 🛠️ Tech Stack

<p align="left">

### Frontend

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

### Backend

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)

### Database

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)

### DevOps

![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Docker Compose](https://img.shields.io/badge/Docker--Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)
![Jenkins](https://img.shields.io/badge/Jenkins-D24939?style=for-the-badge&logo=jenkins&logoColor=white)

### Cloud

![AWS EC2](https://img.shields.io/badge/AWS-EC2-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)
![Ubuntu](https://img.shields.io/badge/Ubuntu-20.04-E95420?style=for-the-badge&logo=ubuntu&logoColor=white)

### Tools

![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)

</p>

---

# ⭐ Core Features

- Secure User Registration & Login using JWT Authentication
- Create, Update, Delete, and Complete Tasks
- Interactive Kanban Board with Task Prioritization
- Subtask Management with Progress Tracking
- Markdown Support for Rich Task Descriptions
- Calendar-Based Deadline Management
- Productivity Dashboard with Analytics
- Responsive Glassmorphism User Interface

---

## 🏗️ Architecture Overview

TaskFlow follows a modern three-tier architecture consisting of a React frontend, an Express.js backend, and a PostgreSQL database.

- **Frontend:** Built with React and Vite, providing a responsive and interactive user interface for task management.
- **Backend:** Developed using Express.js, exposing REST APIs for authentication, task management, analytics, and business logic.
- **Database:** PostgreSQL stores all persistent application data, including users, tasks, priorities, and subtasks.

For production deployment:

- The application is containerized using **Docker**.
- Multiple services are orchestrated with **Docker Compose**.
- **Nginx** serves the frontend and acts as a reverse proxy for backend API requests.
- **Jenkins** automates testing, image creation, and deployment through a CI/CD pipeline.
- **Docker Hub** stores versioned container images.
- **AWS EC2** hosts the production environment and runs the Docker Compose stack.

This architecture separates the presentation, application, and data layers, resulting in a modular, scalable, and maintainable application.

```text
                           ┌────────────────────────┐
                           │        Browser         │
                           └────────────┬───────────┘
                                        │
                               HTTP / HTTPS
                                        │
                                        ▼
                          ┌────────────────────────┐
                          │    Nginx Web Server    │
                          │    Reverse Proxy       │
                          └───────┬────────┬───────┘
                                  │        │
                    Serves React  │        │ /api/*
                                  │        │
                                  ▼        ▼
                     ┌─────────────────┐  ┌──────────────────┐
                     │ React Frontend  │  │ Express Backend  │
                     │     (Vite)      │  │   REST APIs      │
                     └─────────────────┘  └─────────┬────────┘
                                                    │
                                                    ▼
                                         ┌──────────────────┐
                                         │ PostgreSQL DB    │
                                         └──────────────────┘
```

---

## 🔄 CI/CD Pipeline

Every push to the `main` branch triggers a Jenkins pipeline that installs dependencies, runs automated tests, builds Docker images, publishes them to Docker Hub, and deploys the latest version to AWS EC2.

```text
Developer
    │
    ▼
GitHub Repository
    │
    ▼
Jenkins CI/CD Pipeline
    │
    ├── Checkout Source
    ├── Install Dependencies
    ├── Run Tests
    ├── Build Frontend
    ├── Build Backend
    ├── Build Docker Images
    ├── Push Images to Docker Hub
    │
    ▼
AWS EC2 Server
    │
    ├── Pull Latest Images
    ├── Update Docker Compose Stack
    └── Restart Containers
    │
    ▼
Live TaskFlow Application
```

---

# 🛠️ Engineering Challenges Solved

Throughout the project, I encountered and resolved several real-world engineering challenges, including:

- Configuring secure JWT authentication and protected API routes
- Setting up Docker networking between frontend, backend, and PostgreSQL containers
- Configuring Nginx as a reverse proxy for production deployment
- Automating multi-container deployments using Docker Compose
- Building a Jenkins CI/CD pipeline for automated builds and deployments
- Managing Linux-based server configuration and remote application deployment on AWS EC2
- Troubleshooting containerization, networking, and deployment issues

---

## ▶️ Getting Started

TaskFlow can be run in three different ways depending on your use case.

| Option | Description |
|--------|-------------|
| **Local Development (Docker)** | Run the complete application locally using Docker Compose. |
| **Local Development (Native)** | Run the frontend and backend separately without Docker. |
| **Production Deployment** | Deploy using Jenkins, Docker, Docker Hub, Nginx, and AWS EC2 to replicate the production environment. |

For detailed local development, Docker, Jenkins, and AWS deployment instructions, see [SETUP.md](SETUP.md).

## 1) Clone the Repository

```bash
git clone https://github.com/Sai-10z/TaskFlow.git
```

Move into the project directory:

```bash
cd TaskFlow
```

---

## 2) Configure Environment Variables

Create a `.env` file inside the **backend** directory.

Example:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=taskflow
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_jwt_secret

NODE_ENV=development
```

> Update the database credentials according to your local PostgreSQL installation.

---

## 3) Run Using Docker Compose (Recommended)

Build and start all containers:

```bash
docker compose up -d --build
```

View running containers:

```bash
docker ps
```

Stop containers:

```bash
docker compose down
```

---

## 4) Run Without Docker (Development)

### Backend

```bash
cd backend
npm install
npm start
```

Backend runs at:

```text
http://localhost:5000
```

---

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

---

## 5) Access the Application

### Frontend

```text
http://localhost
```

or

```text
http://localhost:5173
```

### Backend API

```text
http://localhost:5000/api
```

---

# 📸 Project Snapshots

| Screenshot | Description |
|------------|-------------|
| *(Add Screenshot)* | Login Page |
| *(Add Screenshot)* | Register Page |
| *(Add Screenshot)* | Dashboard |
| *(Add Screenshot)* | Kanban Task Board |
| *(Add Screenshot)* | Calendar View |
| *(Add Screenshot)* | Analytics Dashboard |
| *(Add Screenshot)* | Jenkins Pipeline Success |
| *(Add Screenshot)* | Docker Containers Running |
| *(Add Screenshot)* | AWS EC2 Deployment |

---

# 🎯 What I Learned

Throughout this project, I gained practical experience in:

- Building scalable REST APIs using Express.js
- Implementing secure JWT-based authentication
- Designing responsive full-stack web applications
- Containerizing applications using Docker
- Managing multi-container deployments with Docker Compose
- Configuring Nginx as a reverse proxy
- Building automated CI/CD pipelines using Jenkins
- Deploying applications on AWS EC2
- Managing Linux servers and SSH-based deployments
- Troubleshooting Docker networking and deployment issues

---

# 🔮 Future Improvements

### Cloud & Infrastructure

- Amazon RDS
- Amazon CloudFront
- AWS CloudWatch Monitoring
- HTTPS using Let's Encrypt
- Infrastructure as Code with Terraform

### Application Features

- Team Collaboration
- Role-Based Access Control (RBAC)
- File Attachments
- Real-Time Updates
- Email Notifications
- Task Comments

---

# 👨‍💻 Internship Project

TaskFlow was developed during my internship to apply Full-Stack Development and DevOps concepts in a practical, end-to-end software project.

During this project, I was responsible for:

- Designing and developing the React frontend
- Building the Express.js REST API
- Integrating PostgreSQL
- Implementing JWT Authentication
- Developing the Dashboard, Kanban Board, Calendar, and Analytics modules
- Containerizing the application with Docker
- Configuring Docker Compose
- Deploying the application on AWS EC2
- Configuring Nginx as a Reverse Proxy
- Building an automated Jenkins CI/CD pipeline
- Troubleshooting deployment, networking, and containerization issues

---
