# Deploy to DigitalOcean

This guide walks you through deploying the Search Algorithm Visualizer to DigitalOcean using Docker.

## Prerequisites

- DigitalOcean account
- GitHub repository with your code
- Basic familiarity with command line

## Deployment Options

### Option 1: DigitalOcean App Platform (Easiest - Recommended)

The App Platform is a PaaS (Platform as a Service) that automatically builds and deploys your Docker container.

#### Steps:

1. **Login to DigitalOcean**
   - Go to https://cloud.digitalocean.com/

2. **Create New App**
   - Click "Create" → "Apps"
   - Select "GitHub" as your source
   - Authorize DigitalOcean to access your GitHub account
   - Select your `Search-Algorithm-Visualizer` repository
   - Choose the `main` branch

3. **Configure Build Settings**
   - DigitalOcean will auto-detect the Dockerfile
   - **Build Command**: Leave empty (uses Dockerfile)
   - **Run Command**: Leave empty (uses Dockerfile CMD)
   - **HTTP Port**: 80

4. **Choose Plan**
   - **Basic Plan**: $5/month (512MB RAM, 1 vCPU) - Sufficient for this app
   - Or choose a different plan based on your needs

5. **Environment Settings** (Optional)
   - Region: Choose closest to your users
   - Name your app: `search-algorithm-visualizer`

6. **Deploy**
   - Click "Next" → "Create Resources"
   - Wait 3-5 minutes for the build and deployment
   - You'll get a URL like: `https://search-algorithm-visualizer-xxxxx.ondigitalocean.app`

7. **Custom Domain** (Optional)
   - Go to Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

#### Benefits:

- Automatic deployments on git push
- Built-in SSL/HTTPS
- Easy scaling
- Automatic health checks
- Zero server management

---

### Option 2: DigitalOcean Droplet (More Control)

Deploy on a virtual private server (VPS) with full control.

#### Steps:

1. **Create a Droplet**
   - Click "Create" → "Droplets"
   - Choose **Docker** from Marketplace (pre-installed Docker)
   - Or choose Ubuntu 22.04 and install Docker manually
   - **Plan**: Basic - $6/month (1GB RAM, 1 vCPU)
   - **Datacenter**: Choose closest region
   - **Authentication**: SSH key (recommended) or password
   - **Hostname**: `search-viz-prod`
   - Click "Create Droplet"

2. **SSH into Your Droplet**

   ```bash
   ssh root@YOUR_DROPLET_IP
   ```

3. **Install Docker** (if not using Docker image)

   ```bash
   # Update packages
   apt update && apt upgrade -y

   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh

   # Install Docker Compose
   apt install docker-compose -y
   ```

4. **Clone Your Repository**

   ```bash
   # Install git if needed
   apt install git -y

   # Clone your repo
   git clone https://github.com/YOUR_USERNAME/Search-Algorithm-Visualizer.git
   cd Search-Algorithm-Visualizer
   ```

5. **Build and Run with Docker Compose**

   ```bash
   # Build and start the container
   docker-compose up -d --build

   # Check if it's running
   docker-compose ps

   # View logs
   docker-compose logs -f
   ```

6. **Configure Firewall**

   ```bash
   # Allow HTTP traffic
   ufw allow 80/tcp

   # Allow HTTPS (for SSL later)
   ufw allow 443/tcp

   # Allow SSH
   ufw allow 22/tcp

   # Enable firewall
   ufw enable
   ```

7. **Access Your App**
   - Open browser: `http://YOUR_DROPLET_IP`
   - Your app should be running!

#### Optional: Add SSL/HTTPS with Let's Encrypt

```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y

# Get SSL certificate (replace with your domain)
certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Update nginx.conf to use SSL (requires modifying the file)
# Then rebuild container
docker-compose down
docker-compose up -d --build
```

#### Update Your App Later

```bash
cd Search-Algorithm-Visualizer
git pull origin main
docker-compose down
docker-compose up -d --build
```

---

### Option 3: Container Registry + Droplet

Use DigitalOcean Container Registry for more advanced deployments.

1. **Create Container Registry**
   - Go to Container Registry → Create
   - Name: `search-viz-registry`
   - Plan: Starter ($5/month)

2. **Install doctl** (DigitalOcean CLI)

   ```bash
   # On your local machine
   cd ~
   wget https://github.com/digitalocean/doctl/releases/download/v1.94.0/doctl-1.94.0-linux-amd64.tar.gz
   tar xf doctl-*.tar.gz
   sudo mv doctl /usr/local/bin
   ```

3. **Authenticate doctl**

   ```bash
   doctl auth init
   # Enter your API token from: cloud.digitalocean.com/account/api/tokens
   ```

4. **Build and Push Image**

   ```bash
   # Login to registry
   doctl registry login

   # Build image with registry tag
   docker build -t registry.digitalocean.com/search-viz-registry/search-algorithm-visualizer:latest .

   # Push to registry
   docker push registry.digitalocean.com/search-viz-registry/search-algorithm-visualizer:latest
   ```

5. **Deploy to Droplet**

   ```bash
   # SSH into droplet
   ssh root@YOUR_DROPLET_IP

   # Login to registry
   doctl registry login

   # Pull and run
   docker pull registry.digitalocean.com/search-viz-registry/search-algorithm-visualizer:latest
   docker run -d -p 80:80 --name search-viz \
     registry.digitalocean.com/search-viz-registry/search-algorithm-visualizer:latest
   ```

---

## Cost Comparison

| Option             | Monthly Cost | Best For                          |
| ------------------ | ------------ | --------------------------------- |
| App Platform       | $5+          | Easiest deployment, auto-scaling  |
| Droplet (Basic)    | $6+          | More control, multiple apps       |
| Container Registry | $5 + Droplet | CI/CD pipelines, team deployments |

---

## Recommended Setup: App Platform

For this project, **App Platform** is recommended because:

- Simplest setup (no server management)
- Automatic deployments from GitHub
- Built-in SSL/HTTPS
- Easy scaling if traffic increases
- Similar cost to managing a Droplet

---

## Monitoring & Maintenance

### App Platform

- View logs in dashboard
- Check metrics (CPU, memory, bandwidth)
- Set up alerts

### Droplet

```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs -f

# Restart container
docker-compose restart

# Stop container
docker-compose down

# Update and redeploy
git pull origin main
docker-compose up -d --build
```

---

## Troubleshooting

### Build fails

- Check Dockerfile syntax
- Ensure all dependencies are in package.json
- Check build logs in DigitalOcean dashboard

### Container won't start

```bash
# Check logs
docker-compose logs

# Verify port isn't in use
netstat -tlnp | grep :80
```

### Can't access app

- Check firewall: `ufw status`
- Verify container is running: `docker ps`
- Check nginx logs: `docker logs <container_id>`

---

## Next Steps

1. Deploy using your chosen method
2. Test the deployment
3. Set up custom domain (optional)
4. Enable HTTPS
5. Set up monitoring and alerts

Need help? Check DigitalOcean docs: https://docs.digitalocean.com/
