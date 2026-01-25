# Deploy to Docker Hub

This guide explains how to build and publish your Search Algorithm Visualizer Docker image to Docker Hub, making it accessible to anyone.

## What is Docker Hub?

Docker Hub is a cloud-based registry service for storing and sharing Docker images. Think of it as "GitHub for Docker images."

## Prerequisites

- Docker installed locally
- Docker Hub account (free at https://hub.docker.com)

---

## Step 1: Create Docker Hub Account

1. Go to https://hub.docker.com
2. Sign up for a free account
3. Verify your email
4. Note your Docker Hub username (you'll need it)

---

## Step 2: Login to Docker Hub

```bash
# Login from terminal
docker login

# Enter your Docker Hub username and password
# You should see: "Login Succeeded"
```

---

## Step 3: Build Your Image with Proper Tag

Docker Hub images use the format: `username/repository:tag`

```bash
# Replace YOUR_USERNAME with your Docker Hub username
docker build -t YOUR_USERNAME/search-algorithm-visualizer:latest .

# Example:
# docker build -t johnsmith/search-algorithm-visualizer:latest .
```

**Tag conventions:**
- `latest` - Most recent stable version
- `v1.0` - Specific version number
- `dev` - Development version

You can create multiple tags:
```bash
# Build with version tag
docker build -t YOUR_USERNAME/search-algorithm-visualizer:v1.0 .
docker build -t YOUR_USERNAME/search-algorithm-visualizer:latest .
```

---

## Step 4: Push to Docker Hub

```bash
# Push the image
docker push YOUR_USERNAME/search-algorithm-visualizer:latest

# If you created multiple tags, push them all
docker push YOUR_USERNAME/search-algorithm-visualizer:v1.0
```

This will upload your image to Docker Hub. The first push may take 2-5 minutes depending on your internet speed.

---

## Step 5: Verify on Docker Hub

1. Go to https://hub.docker.com
2. Login to your account
3. You should see your repository: `YOUR_USERNAME/search-algorithm-visualizer`
4. Click on it to see details, tags, and pull commands

---

## Using Your Published Image

Now anyone can run your app with a single command:

```bash
# Pull and run your image
docker run -d -p 80:80 YOUR_USERNAME/search-algorithm-visualizer:latest

# Or with docker-compose, update docker-compose.yml:
services:
  web:
    image: YOUR_USERNAME/search-algorithm-visualizer:latest
    ports:
      - "80:80"
    restart: unless-stopped
```

---

## Make Repository Public or Private

### Public (Free)
- Anyone can pull your image
- Good for open-source projects
- Unlimited public repositories

### Private (Paid or Limited Free)
- Only you (and authorized users) can pull
- Free tier: 1 private repository
- Requires authentication to pull

**To change visibility:**
1. Go to your repository on Docker Hub
2. Click Settings
3. Change visibility to Public or Private

---

## Automated Builds with GitHub (Optional)

You can set up automatic builds when you push to GitHub.

### Steps:

1. **Link GitHub Account**
   - Docker Hub → Account Settings → Linked Accounts
   - Connect GitHub

2. **Create Automated Build**
   - Repository → Builds → Configure Automated Builds
   - Select your GitHub repository
   - Set build rules:
     - **Source**: `main` branch
     - **Docker Tag**: `latest`
     - **Dockerfile location**: `/Dockerfile`

3. **Trigger Rules**
   - Builds automatically when you push to `main`
   - Can set up multiple rules for different branches/tags

4. **Build Configuration**
   ```yaml
   # Example build rules
   Source Type: Branch
   Source: main
   Docker Tag: latest
   Dockerfile location: /Dockerfile
   Build Context: /
   ```

Now every git push triggers a Docker Hub build automatically!

---

## Update Your Image Later

When you make changes to your app:

```bash
# Pull latest code
git pull origin main

# Rebuild with new changes
docker build -t YOUR_USERNAME/search-algorithm-visualizer:latest .

# Push updated image
docker push YOUR_USERNAME/search-algorithm-visualizer:latest

# Optional: Tag with version number
docker build -t YOUR_USERNAME/search-algorithm-visualizer:v1.1 .
docker push YOUR_USERNAME/search-algorithm-visualizer:v1.1
```

---

## Best Practices

### 1. Use Semantic Versioning
```bash
# Major.Minor.Patch
docker build -t YOUR_USERNAME/search-algorithm-visualizer:1.0.0 .
docker build -t YOUR_USERNAME/search-algorithm-visualizer:1.0 .
docker build -t YOUR_USERNAME/search-algorithm-visualizer:latest .
```

### 2. Add README to Docker Hub
Create a `README.md` in your repo root with:
- What the app does
- How to run it
- Environment variables
- Example commands

Docker Hub automatically displays this as your repository description.

### 3. Tag Images Properly
```bash
# Good tags
:latest          # Always points to newest stable
:v1.0.0          # Specific version
:1.0             # Minor version
:stable          # Production-ready
:dev             # Development version

# Avoid
:test            # Too vague
:working         # Not descriptive
```

### 4. Keep Images Small
- Use multi-stage builds (you already have this!)
- Use Alpine base images (you already have this!)
- Don't include unnecessary files (.dockerignore)

Your current setup already follows these best practices!

---

## Complete Workflow Example

```bash
# 1. Make changes to your code
git add .
git commit -m "Add new feature"
git push origin main

# 2. Build new Docker image
docker build -t YOUR_USERNAME/search-algorithm-visualizer:v1.1 .
docker build -t YOUR_USERNAME/search-algorithm-visualizer:latest .

# 3. Test locally (optional)
docker run -d -p 8080:80 YOUR_USERNAME/search-algorithm-visualizer:latest
# Open http://localhost:8080 to verify

# 4. Push to Docker Hub
docker push YOUR_USERNAME/search-algorithm-visualizer:v1.1
docker push YOUR_USERNAME/search-algorithm-visualizer:latest

# 5. Update deployment (if running on server)
ssh user@your-server
docker pull YOUR_USERNAME/search-algorithm-visualizer:latest
docker-compose down
docker-compose up -d
```

---

## Sharing Your Image

Once published, share these commands with others:

```bash
# Quick start
docker run -d -p 80:80 YOUR_USERNAME/search-algorithm-visualizer:latest

# With docker-compose
curl -O https://raw.githubusercontent.com/YOUR_USERNAME/Search-Algorithm-Visualizer/main/docker-compose.yml
# Edit docker-compose.yml to use your image
docker-compose up -d
```

---

## Docker Hub + DigitalOcean

You can combine Docker Hub with DigitalOcean deployment:

```bash
# On DigitalOcean Droplet
docker pull YOUR_USERNAME/search-algorithm-visualizer:latest
docker run -d -p 80:80 --name search-viz \
  --restart unless-stopped \
  YOUR_USERNAME/search-algorithm-visualizer:latest
```

Or update `docker-compose.yml`:
```yaml
version: '3.8'
services:
  web:
    image: YOUR_USERNAME/search-algorithm-visualizer:latest
    ports:
      - "80:80"
    restart: unless-stopped
```

Then deploy:
```bash
docker-compose pull
docker-compose up -d
```

---

## Troubleshooting

### Login Issues
```bash
# Logout and login again
docker logout
docker login

# Use access token instead of password (more secure)
# Generate token at: https://hub.docker.com/settings/security
```

### Push Denied
```bash
# Make sure you're logged in
docker login

# Verify image name matches your username
docker images | grep search-algorithm

# Image name must be: YOUR_USERNAME/repository:tag
```

### Build Fails
```bash
# Check Docker is running
docker ps

# Check Dockerfile syntax
docker build -t test .

# View detailed logs
docker build --no-cache -t YOUR_USERNAME/search-algorithm-visualizer:latest .
```

### Image Too Large
```bash
# Check image size
docker images | grep search-algorithm

# Your multi-stage build should produce ~50-100MB image
# If larger, check .dockerignore is working
```

---

## Cost

**Docker Hub is FREE for:**
- Unlimited public repositories
- 1 private repository
- Unlimited pulls from public repos

**Paid plans start at $5/month:**
- Unlimited private repositories
- Automated builds
- Parallel builds
- Vulnerability scanning

For this project, the **free tier is perfect**.

---

## Next Steps

1. Create Docker Hub account
2. Build and push your image
3. Test pulling and running it
4. Set up automated builds (optional)
5. Add to your portfolio/resume

Your image will be publicly accessible and runnable with just one command!

---

## Resources

- Docker Hub: https://hub.docker.com
- Docker Hub Docs: https://docs.docker.com/docker-hub/
- Automated Builds: https://docs.docker.com/docker-hub/builds/
- Best Practices: https://docs.docker.com/develop/dev-best-practices/
