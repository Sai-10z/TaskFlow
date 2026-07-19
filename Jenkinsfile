pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS_ID = 'dockerhub-credentials'
        DOCKER_REGISTRY = 'sai102402'
        APP_NAME_FRONTEND = 'taskflow-frontend'
        APP_NAME_BACKEND = 'taskflow-backend'
        IMAGE_TAG = "${env.BUILD_NUMBER}"
        EC2_USER = 'ec2-user'
        EC2_IP = 'your.elastic.ip.address'
        SSH_KEY_ID = 'ec2-ssh-key'
    }

    stages {
        stage('Clone Repository') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('frontend') {
                    sh 'npm ci'
                }
                dir('backend') {
                    sh 'npm ci'
                }
            }
        }

        stage('Run Automated Tests') {
            steps {
                dir('backend') {
                    sh 'npm run test'
                }
            }
        }

        stage('Build Assets') {
            steps {
                // Testing and building code locally before Docker
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    // Build frontend image
                    docker.build("${DOCKER_REGISTRY}/${APP_NAME_FRONTEND}:${IMAGE_TAG}", "./frontend")
                    docker.build("${DOCKER_REGISTRY}/${APP_NAME_FRONTEND}:latest", "./frontend")
                    
                    // Build backend image
                    docker.build("${DOCKER_REGISTRY}/${APP_NAME_BACKEND}:${IMAGE_TAG}", "./backend")
                    docker.build("${DOCKER_REGISTRY}/${APP_NAME_BACKEND}:latest", "./backend")
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', "${DOCKER_CREDENTIALS_ID}") {
                        docker.image("${DOCKER_REGISTRY}/${APP_NAME_FRONTEND}:${IMAGE_TAG}").push()
                        docker.image("${DOCKER_REGISTRY}/${APP_NAME_FRONTEND}:latest").push()
                        
                        docker.image("${DOCKER_REGISTRY}/${APP_NAME_BACKEND}:${IMAGE_TAG}").push()
                        docker.image("${DOCKER_REGISTRY}/${APP_NAME_BACKEND}:latest").push()
                    }
                }
            }
        }

        stage('Deploy Automatically to EC2') {
            steps {
                sshagent(["${SSH_KEY_ID}"]) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_IP} "
                            cd /home/ec2-user/TaskFlow &&
                            git pull origin main &&
                            docker-compose pull &&
                            docker-compose up -d --remove-orphans
                        "
                    """
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment successful! Application is live.'
            // Optional: slackSend(message: "Successfully deployed TaskFlow Build #${env.BUILD_NUMBER}")
        }
        failure {
            echo 'Deployment failed! Check Jenkins logs.'
            // Optional: slackSend(message: "Failed deployment TaskFlow Build #${env.BUILD_NUMBER}", color: 'danger')
        }
    }
}
