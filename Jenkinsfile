pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS_ID = 'dockerhub-credentials'
        DOCKER_REGISTRY       = 'sai102402'
        APP_NAME_FRONTEND     = 'taskflow-frontend'
        APP_NAME_BACKEND      = 'taskflow-backend'
        IMAGE_TAG             = "${env.BUILD_NUMBER}"
        EC2_USER              = 'ubuntu'
        EC2_IP                = '65.2.35.247'
        SSH_KEY_ID            = 'ec2-ssh-key'
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
                    script {
                        if (isUnix()) { sh 'npm ci' } else { bat 'npm ci' }
                    }
                }
                dir('backend') {
                    script {
                        if (isUnix()) { sh 'npm ci' } else { bat 'npm ci' }
                    }
                }
            }
        }

        stage('Run Automated Tests') {
            steps {
                dir('backend') {
                    script {
                        if (isUnix()) { sh 'npm run test' } else { bat 'npm run test' }
                    }
                }
            }
        }

        stage('Build Assets') {
            steps {
                dir('frontend') {
                    script {
                        if (isUnix()) { sh 'npm run build' } else { bat 'npm run build' }
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    if (isUnix()) {
                        docker.build("${DOCKER_REGISTRY}/${APP_NAME_FRONTEND}:${IMAGE_TAG}", "./frontend")
                        docker.build("${DOCKER_REGISTRY}/${APP_NAME_FRONTEND}:latest", "./frontend")
                        docker.build("${DOCKER_REGISTRY}/${APP_NAME_BACKEND}:${IMAGE_TAG}", "./backend")
                        docker.build("${DOCKER_REGISTRY}/${APP_NAME_BACKEND}:latest", "./backend")
                    } else {
                        bat "docker build -t ${DOCKER_REGISTRY}/${APP_NAME_FRONTEND}:${IMAGE_TAG} -t ${DOCKER_REGISTRY}/${APP_NAME_FRONTEND}:latest ./frontend"
                        bat "docker build -t ${DOCKER_REGISTRY}/${APP_NAME_BACKEND}:${IMAGE_TAG} -t ${DOCKER_REGISTRY}/${APP_NAME_BACKEND}:latest ./backend"
                    }
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                script {
                    if (isUnix()) {
                        docker.withRegistry('https://index.docker.io/v1/', "${DOCKER_CREDENTIALS_ID}") {
                            docker.image("${DOCKER_REGISTRY}/${APP_NAME_FRONTEND}:${IMAGE_TAG}").push()
                            docker.image("${DOCKER_REGISTRY}/${APP_NAME_FRONTEND}:latest").push()
                            docker.image("${DOCKER_REGISTRY}/${APP_NAME_BACKEND}:${IMAGE_TAG}").push()
                            docker.image("${DOCKER_REGISTRY}/${APP_NAME_BACKEND}:latest").push()
                        }
                    } else {
                        withCredentials([usernamePassword(credentialsId: "${DOCKER_CREDENTIALS_ID}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                            bat "docker login -u %DOCKER_USER% -p %DOCKER_PASS%"
                            bat "docker push ${DOCKER_REGISTRY}/${APP_NAME_FRONTEND}:${IMAGE_TAG}"
                            bat "docker push ${DOCKER_REGISTRY}/${APP_NAME_FRONTEND}:latest"
                            bat "docker push ${DOCKER_REGISTRY}/${APP_NAME_BACKEND}:${IMAGE_TAG}"
                            bat "docker push ${DOCKER_REGISTRY}/${APP_NAME_BACKEND}:latest"
                        }
                    }
                }
            }
        }

        stage('Deploy Automatically to EC2') {
            steps {
                script {
                    withCredentials([sshUserPrivateKey(credentialsId: "${SSH_KEY_ID}", keyFileVariable: 'SSH_KEY')]) {
                        def sshCmd = "ssh -i \"%SSH_KEY%\" -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_IP} \"cd /home/${EC2_USER}/TaskFlow && git pull origin main && docker-compose pull && docker-compose up -d --remove-orphans\""
                        if (isUnix()) {
                            sh "ssh -i \"${SSH_KEY}\" -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_IP} \"cd /home/${EC2_USER}/TaskFlow && git pull origin main && docker-compose pull && docker-compose up -d --remove-orphans\""
                        } else {
                            bat "icacls \"%SSH_KEY%\" /inheritance:r /grant:r \"%USERNAME%:F\" /grant:r \"SYSTEM:F\""
                            bat sshCmd
                        }
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment successful! Application is live.'
        }
        failure {
            echo 'Deployment failed! Check Jenkins logs.'
        }
    }
}
