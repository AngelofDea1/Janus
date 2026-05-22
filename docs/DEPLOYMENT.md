# Deployment Guide: Self-Hosting JANUS

This guide explains how to deploy the JANUS Application to your own server (VPS) instead of using Vercel. 

Self-hosting allows you to deploy to a server in a region of your choosing (like Frankfurt or Tokyo), giving you the ultimate freedom to use APIs that block US traffic (like Binance Futures and Bybit).

## Prerequisites

1. A Virtual Private Server (VPS) running Ubuntu (e.g., DigitalOcean, AWS EC2, or Hetzner).
2. A custom domain name (e.g., `janus.finance`) pointing to your server's IP address.
3. [Docker](https://docs.docker.com/engine/install/) and [Docker Compose](https://docs.docker.com/compose/install/) installed on the server.

## Deployment Steps

### 1. Clone the Repository
SSH into your server and clone this repository:
```bash
git clone https://github.com/your-username/janus-app.git
cd janus-app
```

### 2. Build and Start the Container
We have fully containerized the Next.js application using `output: 'standalone'` in `next.config.ts`, making the image extremely lightweight.

Run the following command to build and spin up the production server:
```bash
docker-compose up -d --build
```
The application is now running locally on port `3000`.

### 3. Setup Nginx & SSL
To expose your app to the world securely via your custom domain, install Nginx and Certbot:

```bash
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx
```

Create a new Nginx configuration file:
```bash
sudo nano /etc/nginx/sites-available/janus
```

Paste the following (replace `yourdomain.com`):
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/janus /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 4. Enable HTTPS
Run Certbot to automatically generate and apply a free SSL certificate:
```bash
sudo certbot --nginx -d yourdomain.com
```

**That's it!** Your application is now live on your own custom domain, running securely behind Docker and Nginx.

## Note on Exchanges
If you move to a European or Asian VPS, you can safely swap the API back to Binance and Bybit without getting 403 Forbidden errors, as you are no longer constrained by Vercel's US-based servers.
