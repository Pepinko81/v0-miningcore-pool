# HashMatrix Mining Dashboard

A professional cryptocurrency mining pool dashboard built with Next.js, featuring real-time pool statistics, miner information, and connection details.

## Features

- 🔄 Real-time pool data updates
- 📊 Comprehensive pool statistics
- 👥 Miner connection tracking
- 🌐 Network hashrate and difficulty monitoring
- 📱 Responsive design
- 🎨 Beautiful animated UI with floating elements
- ⚡ Fast and optimized performance

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone <your-repo-url>
cd hashmatrix-mining-dashboard
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. Update the API configuration in `app/page.tsx`:
\`\`\`typescript
const API_BASE_URL = "https://your-api-endpoint.com/api"
const DOMAIN = "your-domain.com"
\`\`\`

4. Run the development server:
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Docker

\`\`\`bash
# Build the image
docker build -t hashmatrix-dashboard .

# Run the container
docker run -p 3000:3000 hashmatrix-dashboard
\`\`\`

### Manual Deployment

\`\`\`bash
# Build the application
npm run build

# Start the production server
npm start
\`\`\`

## API Endpoints

The dashboard expects the following Miningcore API endpoints:

- `/api/pools` - Get all pools
- `/api/pools/<pool-id>/blocks` - Get pool blocks
- `/api/pools/<pool-id>/payments` - Get pool payments
- `/api/pools/<pool-id>/miners` - Get pool miners
- `/api/pools/<pool-id>/performance` - Get pool performance

## Configuration

Update the following variables in `app/page.tsx`:

- `API_BASE_URL`: Your Miningcore API endpoint
- `DOMAIN`: Your mining pool domain

## License

MIT License - see LICENSE file for details.
\`\`\`

```dockerfile file="Dockerfile"
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
