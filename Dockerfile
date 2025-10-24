# Étape 1: Installation des dépendances de production
FROM node:lts-alpine AS production-deps
RUN apk add --no-cache libc6-compat openssl

# Installer pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# Installer les dépendances de production uniquement
RUN pnpm install --frozen-lockfile --prod

# Étape 2: Build de l'application
FROM node:lts-alpine AS builder
RUN apk add --no-cache libc6-compat openssl

# Installer pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# Installer toutes les dépendances (dev inclus)
RUN pnpm install --frozen-lockfile

# Copier le code source
COPY . .

# Générer le client Prisma pour Alpine Linux
RUN pnpm prisma generate

# Variables d'environnement pour le build
ENV NEXT_TELEMETRY_DISABLED 1

# Build de l'application
RUN pnpm build

# Étape 3: Image finale pour la production
FROM node:lts-alpine AS runner
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Créer un utilisateur non-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copier les fichiers nécessaires depuis le builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copier le schema Prisma et le client généré dans src/generated
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/src/generated ./src/generated

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Commande de démarrage
CMD ["node", "server.js"]