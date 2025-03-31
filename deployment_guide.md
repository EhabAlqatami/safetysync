# SafetySync Deployment Guide

This document provides instructions for deploying the SafetySync EHS application.

## System Requirements

- Node.js 16.x or higher
- MongoDB 4.4 or higher
- 2GB RAM minimum (4GB recommended)
- 20GB storage minimum

## Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/your-organization/safetysync.git
cd safetysync
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb://your-mongodb-connection-string
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRE=1h
EMAIL_SERVICE=your-email-service
EMAIL_USERNAME=your-email-username
EMAIL_PASSWORD=your-email-password
EMAIL_FROM=noreply@safetysync.com
```

## Database Setup

1. Create a MongoDB database for SafetySync
2. Run the initial database migrations:
```bash
npm run db:migrate
```

3. (Optional) Seed the database with sample data:
```bash
npm run db:seed
```

## Building for Production

1. Build the frontend assets:
```bash
npm run build
```

2. Verify the build was successful:
```bash
ls -la public/
```

## Deployment Options

### Option 1: Self-hosted Deployment

1. Start the application:
```bash
npm start
```

2. For production environments, use a process manager like PM2:
```bash
npm install -g pm2
pm2 start server.js --name safetysync
```

3. Configure a reverse proxy (Nginx or Apache) to forward requests to the application port.

### Option 2: Cloud Deployment

#### AWS Deployment

1. Create an EC2 instance with Node.js installed
2. Set up a MongoDB Atlas cluster or use Amazon DocumentDB
3. Deploy the application code to the EC2 instance
4. Configure security groups to allow traffic on the application port
5. Set up an Application Load Balancer for high availability

#### Azure Deployment

1. Create an Azure App Service for Node.js
2. Set up Azure Cosmos DB with MongoDB API
3. Configure environment variables in the App Service settings
4. Deploy the application using Azure DevOps or GitHub Actions

#### Google Cloud Deployment

1. Create a Google Compute Engine instance or use Google App Engine
2. Set up MongoDB Atlas or use MongoDB on Google Cloud
3. Deploy the application code
4. Configure firewall rules to allow traffic

## Multi-School Deployment

For deploying SafetySync across multiple schools:

1. Set up the main instance with the licensing system
2. Create a license for each school through the admin interface
3. Provide each school with their unique license key
4. Schools can activate their instance using the license key

## SSL Configuration

For secure HTTPS connections:

1. Obtain an SSL certificate (Let's Encrypt or commercial)
2. Configure your web server to use the SSL certificate
3. Ensure all traffic is redirected from HTTP to HTTPS

## Backup and Recovery

1. Set up automated MongoDB backups:
```bash
mongodump --uri="your-mongodb-uri" --out=/backup/$(date +"%Y-%m-%d")
```

2. Configure a backup rotation policy
3. Test the restore process periodically:
```bash
mongorestore --uri="your-mongodb-uri" /backup/2025-03-31/
```

## Monitoring

1. Set up application monitoring using:
   - PM2 monitoring
   - MongoDB Atlas monitoring
   - Application logs

2. Configure alerts for:
   - High CPU/memory usage
   - Database connection issues
   - API endpoint errors
   - Authentication failures

## Updating the Application

1. Pull the latest code:
```bash
git pull origin main
```

2. Install any new dependencies:
```bash
npm install
```

3. Run database migrations:
```bash
npm run db:migrate
```

4. Rebuild the frontend:
```bash
npm run build
```

5. Restart the application:
```bash
pm2 restart safetysync
```

## Troubleshooting

Common issues and solutions:

1. **Connection refused errors**: Check MongoDB connection string and network settings
2. **Authentication failures**: Verify JWT_SECRET is properly set
3. **File upload issues**: Check storage permissions and file size limits
4. **Performance problems**: Monitor database query performance and optimize indexes

## Support

For additional support, contact:
- Technical support: support@safetysync.com
- Documentation: docs.safetysync.com
- Community forum: community.safetysync.com
