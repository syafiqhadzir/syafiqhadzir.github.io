# ==============================================================================
# Multi-Stage Dockerfile for Eleventy Static Site
# ==============================================================================
# Portfolio: syafiqhadzir.dev
# Architecture: Multi-stage build (Node.js build → Nginx production)
# Best Practices: Security hardening, minimal image size, non-root user
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Build
# ------------------------------------------------------------------------------
# Use Node.js Alpine for smaller image size and faster builds
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Add labels for metadata (OCI Image Spec)
LABEL org.opencontainers.image.title="Syafiq Hadzir Portfolio"
LABEL org.opencontainers.image.description="Google AMP Portfolio - Software QA Engineer"
LABEL org.opencontainers.image.url="https://syafiqhadzir.dev"
LABEL org.opencontainers.image.source="https://github.com/syafiqhadzir/syafiqhadzir.github.io"
LABEL org.opencontainers.image.authors="Syafiq Hadzir <syafiqhadzir@live.com.my>"
LABEL org.opencontainers.image.licenses="CC0-1.0"

# Install dependencies first (better layer caching)
# Copy only package files to leverage Docker cache
COPY package.json package-lock.json ./

# Install dependencies with npm ci for deterministic, reproducible builds
# --ignore-scripts: Skip postinstall scripts for security
# --no-audit: Skip vulnerability audit during install (do it separately)
RUN npm ci --ignore-scripts && \
    npm cache clean --force

# Copy source files needed for build
# Order matters: least frequently changed files first for better caching
COPY tsconfig.json eleventy.config.js ./
COPY src/ ./src/
COPY _includes/ ./_includes/

# Copy static assets and configuration files
COPY favicons/ ./favicons/
COPY fonts/ ./fonts/
COPY Images/ ./Images/
COPY .well-known/ ./.well-known/
COPY CNAME humans.txt browserconfig.xml robots.txt sitemap.xml ror.xml ./
COPY sw.js sw.html _headers ./

# Compile TypeScript filters, shortcodes, and transforms
RUN npm run compile:ts

# Build the Eleventy static site
RUN npm run build

# Verify build output exists
RUN test -d _site && echo "✅ Build successful: _site directory created"

# ------------------------------------------------------------------------------
# Stage 2: Production
# ------------------------------------------------------------------------------
# Use Nginx Alpine Slim for minimal production image (~11MB)
FROM nginx:stable-alpine-slim AS production

# Set working directory for Nginx content
WORKDIR /usr/share/nginx/html

# Remove default Nginx configuration and content
RUN rm -rf /etc/nginx/conf.d/default.conf /usr/share/nginx/html/*

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy static site from builder stage
COPY --from=builder /app/_site ./

# Security: Set proper permissions
# Nginx user (nginx) needs read access to static files
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Security: Create required directories with proper permissions
# Nginx needs write access to these directories for pid and cache
RUN mkdir -p /var/cache/nginx /var/run && \
    chown -R nginx:nginx /var/cache/nginx /var/run && \
    chmod -R 755 /var/cache/nginx /var/run

# Security: Remove unnecessary packages and clear cache
RUN rm -rf /var/cache/apk/*

# Switch to non-root user for security
USER nginx

# Expose HTTP port
EXPOSE 80

# Health check for container orchestration (Kubernetes, Docker Swarm, etc.)
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Start Nginx in foreground mode
CMD ["nginx", "-g", "daemon off;"]
