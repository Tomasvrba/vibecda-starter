FROM mcr.microsoft.com/devcontainers/javascript-node:1-22-bookworm

USER root
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg imagemagick zip unzip ripgrep \
    && rm -rf /var/lib/apt/lists/*
RUN mkdir -p /opt/vibecda/tools /opt/vibecda/npm-cache /opt/vibecda/playwright \
    && chown -R node:node /opt/vibecda

ENV PATH="/opt/vibecda/tools/bin:${PATH}"
ENV PLAYWRIGHT_BROWSERS_PATH=/opt/vibecda/playwright
ENV npm_config_cache=/opt/vibecda/npm-cache

# Install pinned tools at image build time. Every participant authenticates later.
USER node
RUN npm install --global --prefix /opt/vibecda/tools \
    @anthropic-ai/claude-code@2.1.322 \
    @openai/codex@0.167.2 \
    @google/gemini-cli@0.68.0

USER root
WORKDIR /opt/vibecda/starter
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund \
    && npx playwright install --with-deps chromium \
    && chown -R node:node /opt/vibecda
USER node
WORKDIR /workspaces
