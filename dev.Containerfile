FROM node:22-alpine

RUN apk add --no-cache libc6-compat git

ARG USER_NAME=nextjs
ARG USER_GROUP=nodejs

# Set correct permissions for nextjs user and don't run as root
RUN addgroup $USER_GROUP
RUN adduser -SDH $USER_NAME

# Enable corepack and prepare pnpm as root user
RUN npm install -g pnpm

# Set up working directory
WORKDIR /app

# Change ownership of the /app directory to the non-root user
RUN chown -R $USER_NAME:$USER_GROUP /app

# Switch to the non-root user
USER $USER_NAME

# Copy package files and install dependencies as root
COPY --chown=$USER_NAME:$USER_GROUP package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prefer-frozen-lockfile

# Copy application files
COPY --chown=$USER_NAME:$USER_GROUP . .

ENV NODE_ENV development
ENV NEXT_TELEMETRY_DISABLED 1
CMD ["pnpm", "dev"]
EXPOSE 3000
