# ShoupNumbus Frontend

A modern React + Vite frontend application with integrated AI capabilities using Anthropic Claude API, OpenAI, and local model support.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Configuration](#environment-configuration)
- [Project Structure](#project-structure)
- [Development Guide](#development-guide)
- [API Integration](#api-integration)
- [Building & Deployment](#building--deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing Guidelines](#contributing-guidelines)

---

## Project Overview

**ShoupNumbus Frontend** is a React-based web application designed with modern development practices. It integrates multiple AI services (Anthropic Claude, OpenAI, local models) to provide intelligent features and real-time interactions.

### Key Features
- ⚡ Fast development with Vite HMR (Hot Module Replacement)
- 🤖 Multi-AI provider support (Anthropic, OpenAI, Local Models)
- 🔑 Environment-based API key management
- 📦 Optimized production builds
- 🧪 ESLint configured for code quality
- ♿ Modern React patterns and best practices

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 18+ |
| **Build Tool** | Vite |
| **Runtime Refresh** | HMR (Hot Module Replacement) |
| **Linting** | ESLint |
| **Package Manager** | npm or yarn |
| **Node Version** | 16.x or higher |
| **AI Providers** | Anthropic Claude, OpenAI, Local Models |

---

## Prerequisites

Before you begin, ensure you have installed:

- **Node.js** (v16.x or higher) - [Download](https://nodejs.org/)
- **npm** (v8+) or **yarn** (v1.22+)
- **Git** for version control

### Verify Installation
```bash
node --version
npm --version
git --version
```

---

## Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/ravigoswami01/shoupnumbus_frontend.git
cd shoupnumbus_frontend
```

### 2. Install Dependencies
```bash
npm install
# or if using yarn
yarn install
```

### 3. Start Development Server
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173` (default Vite port).

---

## Environment Configuration

### Setting Up API Keys

Create a `.env.local` file in the project root with the following variables:

```env
# Anthropic Claude API
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key_here

# OpenAI API Configuration
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_OPENAI_ORG_ID=your_org_id_optional

# Local Model Configuration
VITE_LOCAL_MODEL_ENDPOINT=http://localhost:3000
VITE_LOCAL_MODEL_API_KEY=your_local_model_key_optional

# General Configuration
VITE_APP_ENV=development
VITE_API_TIMEOUT=30000
```

### Environment Variables Explanation

| Variable | Purpose | Required | Example |
|----------|---------|----------|---------|
| `VITE_ANTHROPIC_API_KEY` | Anthropic Claude API authentication | Yes | `sk-ant-v2-xxx...` |
| `VITE_OPENAI_API_KEY` | OpenAI API authentication | No | `sk-...` |
| `VITE_OPENAI_ORG_ID` | OpenAI organization ID | No | `org-xxx` |
| `VITE_LOCAL_MODEL_ENDPOINT` | Local AI model server URL | No | `http://localhost:3000` |
| `VITE_LOCAL_MODEL_API_KEY` | Local model authentication | No | `your-key` |
| `VITE_APP_ENV` | Application environment | Yes | `development` or `production` |

### Getting API Keys

#### Anthropic Claude API
1. Visit [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy and paste into `.env.local`

#### OpenAI API
1. Visit [platform.openai.com](https://platform.openai.com)
2. Create an account or log in
3. Go to API keys section
4. Create a new secret key
5. Copy and paste into `.env.local`

#### Local Model Setup
Ensure your local model server is running on the specified endpoint before starting the app.

---

## Project Structure

```
shoupnumbus_frontend/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable React components
│   │   ├── AIChat/        # AI chat interface components
│   │   ├── APIConfig/     # API configuration UI
│   │   └── ...
│   ├── hooks/             # Custom React hooks
│   │   ├── useAnthropic.js
│   │   ├── useOpenAI.js
│   │   └── useLocalModel.js
│   ├── services/          # API services & integrations
│   │   ├── anthropicService.js
│   │   ├── openaiService.js
│   │   ├── localModelService.js
│   │   └── apiClient.js
│   ├── utils/             # Utility functions
│   │   ├── apiKeyValidator.js
│   │   ├── errorHandler.js
│   │   └── logger.js
│   ├── contexts/          # React Context for state management
│   ├── App.jsx            # Main application component
│   ├── App.css
│   └── main.jsx           # Entry point
├── .env.local             # Local environment variables (create this)
├── .env.example           # Example environment file
├── .eslintrc.cjs          # ESLint configuration
├── vite.config.js         # Vite configuration
├── package.json           # Project dependencies
├── package-lock.json      # Locked dependency versions
└── README.md              # This file
```

---

## Development Guide

### Running the Development Server

```bash
npm run dev
```

**Features:**
- 🔥 Hot Module Replacement (HMR) - Changes reflect instantly
- 📊 Fast rebuild on file changes
- 🐛 Browser DevTools support
- ⚠️ ESLint warnings in console

### Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

### Previewing Production Build

```bash
npm run preview
```

Serves the production build locally for testing.

### Running ESLint

```bash
npm run lint
```

Fixes linting issues automatically:
```bash
npm run lint -- --fix
```

### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes and test locally**
   ```bash
   npm run dev
   ```

3. **Lint and format code**
   ```bash
   npm run lint -- --fix
   ```

4. **Commit changes**
   ```bash
   git commit -m "feat: add your feature description"
   ```

5. **Push to remote**
   ```bash
   git push origin feature/your-feature-name
   ```

---

## API Integration

### Anthropic Claude Integration

**Service Location:** `src/services/anthropicService.js`

```javascript
import { useAnthropic } from '../hooks/useAnthropic';

function MyComponent() {
  const { sendMessage, loading, response } = useAnthropic();

  const handleQuery = async (userMessage) => {
    const result = await sendMessage(userMessage);
    console.log('Response:', result);
  };

  return (
    // Component JSX
  );
}
```

**Configuration:**
- API Endpoint: `https://api.anthropic.com/v1/messages`
- Model: Claude 3 (configurable)
- Max Tokens: 2048 (configurable)

### OpenAI Integration

**Service Location:** `src/services/openaiService.js`

```javascript
import { useOpenAI } from '../hooks/useOpenAI';

function ChatComponent() {
  const { sendMessage, loading } = useOpenAI();
  // Implementation
}
```

### Local Model Integration

**Service Location:** `src/services/localModelService.js`

```javascript
import { useLocalModel } from '../hooks/useLocalModel';

function LocalAIComponent() {
  const { sendMessage, loading } = useLocalModel();
  // Implementation
}
```

### Error Handling

All API calls include comprehensive error handling:

```javascript
try {
  const response = await apiClient.request(config);
} catch (error) {
  if (error.response?.status === 401) {
    // Handle unauthorized
  } else if (error.response?.status === 429) {
    // Handle rate limit
  } else {
    // Handle other errors
  }
}
```

---

## Building & Deployment

### Production Build

```bash
npm run build
```

Outputs optimized files to `dist/` directory.

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

Build and run:
```bash
docker build -t shoupnumbus-frontend .
docker run -p 3000:3000 shoupnumbus-frontend
```

---

## Troubleshooting

### Issue: "API key not found" error

**Solution:**
1. Verify `.env.local` file exists in project root
2. Ensure all required API keys are set
3. Restart dev server after changing `.env.local`

### Issue: Port 5173 already in use

**Solution:**
```bash
npm run dev -- --port 3001
```

### Issue: Module not found errors

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: CORS errors when calling APIs

**Solution:**
- Ensure API keys are correct
- Check if local model server is running
- Verify network connectivity

### Issue: Hot reload not working

**Solution:**
1. Clear Vite cache: `rm -rf .vite`
2. Restart dev server
3. Check browser console for errors

---

## Contributing Guidelines

### Code Style

- Use ES6+ syntax
- Follow ESLint rules
- Use meaningful variable names
- Add comments for complex logic

### Commit Messages

Follow conventional commits:
```
feat: add new feature
fix: resolve bug
docs: update documentation
refactor: restructure code
test: add tests
```

### Pull Request Process

1. Create a feature branch
2. Make atomic commits
3. Keep PRs focused and small
4. Add meaningful PR description
5. Request review from team members
6. Address review comments

---

## Performance Optimization Tips

1. **Code Splitting:** Use React lazy loading
   ```javascript
   const Component = React.lazy(() => import('./Component'));
   ```

2. **Image Optimization:** Use optimized image formats
   ```javascript
   import { Picture } from './components/Picture';
   ```

3. **Minimize Bundle Size:** Monitor with `npm run build`

4. **API Caching:** Implement response caching
   ```javascript
   const cache = new Map();
   ```

---

## Security Best Practices

⚠️ **Never commit `.env.local` to version control**

1. Add `.env.local` to `.gitignore`:
   ```
   .env.local
   .env.*.local
   ```

2. Never expose API keys in client code
3. Use HTTPS in production
4. Validate user inputs
5. Keep dependencies updated: `npm audit fix`

---

## Available Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run lint -- --fix` | Fix linting issues |

---

## Getting Help

- 📖 [Vite Documentation](https://vitejs.dev/)
- ⚛️ [React Documentation](https://react.dev/)
- 🤖 [Anthropic API Docs](https://docs.anthropic.com/)
- 🔌 [OpenAI API Docs](https://platform.openai.com/docs/)
- 💬 Create an issue on GitHub

---

## License

This project is licensed under the MIT License. See LICENSE file for details.

---

## Project Maintainer

- **Author:** Ravi Goswami
- **GitHub:** [@ravigoswami01](https://github.com/ravigoswami01)

---

**Last Updated:** June 2026
