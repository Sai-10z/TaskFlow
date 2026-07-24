# TaskFlow Production Deployment Guide

This guide provides step-by-step instructions to deploy the TaskFlow application to AWS for a production environment.

## 1. Provisioning AWS Infrastructure
1. **EC2 Instance**: Launch an Amazon Linux 2023 or Ubuntu Server 22.04 LTS instance. Ensure the instance has at least 2GB of RAM (e.g., t3.small).
2. **Elastic IP**: Allocate an Elastic IP address and associate it with your EC2 instance to ensure a static IP address for DNS records.
3. **Security Groups**: Ensure the EC2 security group allows inbound traffic on ports `80` (HTTP), `443` (HTTPS), and `22` (SSH).
4. **RDS PostgreSQL**: Provision a PostgreSQL instance using Amazon RDS (Free Tier db.t3.micro is sufficient for start). Make sure its Security Group allows inbound connections from your EC2 instance's Security Group.

## 2. Server Configuration
SSH into your EC2 instance:
```bash
ssh -i /path/to/your-key.pem ec2-user@<YOUR-ELASTIC-IP>
```

Install Docker and Docker Compose:
```bash
sudo yum update -y
sudo yum install docker -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ec2-user
```
Install docker-compose plugin as per official docs.

## 3. Cloning and Setup
Clone the repository:
```bash
git clone https://github.com/your-username/TaskFlow.git
cd TaskFlow
```

Create a `.env` file in the root directory (refer to `env_variables_guide.md` for details).

## 4. Running the Application
Run Docker Compose in detached mode:
```bash
docker-compose up -d --build
```
This will spin up:
- The React Frontend (via Nginx on port 80)
- The Express Backend API
- (Optional) A local Postgres DB if not using RDS. (Remove the `db` service from docker-compose.yml if exclusively using RDS).

## 5. SSL & Nginx Reverse Proxy (Certbot)
If running Nginx natively on EC2 for HTTPS termination:
1. Install Nginx and Certbot.
2. Copy `deployment/nginx.conf` to `/etc/nginx/conf.d/taskflow.conf`.
3. Map your domain name (e.g., `taskflow.yourdomain.com`) to the Elastic IP via Route 53 or your DNS provider.
4. Run Certbot to provision the SSL certificate:
```bash
sudo certbot --nginx -d taskflow.yourdomain.com
```

## 6. S3 & CloudFront (Optional Assets)
If you wish to serve user uploads via S3:
1. Create an S3 Bucket and enable public read access (or keep private and use pre-signed URLs in the backend).
2. Create a CloudFront Distribution with the S3 bucket as the origin.
3. Update backend `.env` to include AWS access keys and CloudFront URLs.

## 7. CloudWatch Monitoring
1. Install the unified CloudWatch Agent on your EC2 instance.
2. Copy `deployment/cloudwatch-agent-config.json` to `/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json`.
3. Start the agent:
```bash
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json -s
```
4. Set up CloudWatch Alarms and link them to an SNS topic to receive email/SMS alerts if CPU > 80% or if application errors occur.
