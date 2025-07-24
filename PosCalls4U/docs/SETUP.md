# PosCalls4U Development Setup Guide

## Prerequisites

### System Requirements
- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher
- **MongoDB**: 6.0 or higher (local or Atlas)
- **Redis**: 6.0 or higher (optional, for session storage)
- **Git**: 2.30 or higher

### Development Tools (Recommended)
- **Visual Studio Code** with extensions:
  - TypeScript and JavaScript Language Features
  - Prettier - Code formatter
  - ESLint
  - Thunder Client (for API testing)
- **MongoDB Compass** (for database management)
- **Postman** or **Thunder Client** (for API testing)

## Initial Setup

### 1. Repository Clone
```bash
git clone git@github.com:your-org/PosCalls4U.git
cd PosCalls4U
```

### 2. Environment Setup

#### Server Environment
```bash
cd server
cp .env.example .env
```

Edit `server/.env` with your configuration:

```bash
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/poscalls4u
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/poscalls4u

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-strong-and-random
JWT_EXPIRES_IN=7d

# Client Configuration
CLIENT_URL=http://localhost:3000

# Email Configuration (Gmail Setup)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
EMAIL_FROM=PosCalls4U <noreply@poscalls4u.com>

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Facebook OAuth Configuration
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret
FACEBOOK_CALLBACK_URL=http://localhost:5000/api/auth/facebook/callback

# Redis Configuration (Optional)
REDIS_URL=redis://localhost:6379

# Logging Configuration
LOG_LEVEL=info
LOG_FILE=logs/app.log
```

#### Client Environment
```bash
cd ../client
```

Create `client/.env.local`:
```bash
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=PosCalls4U
VITE_APP_VERSION=1.0.0
```

### 3. Dependencies Installation

#### Server Dependencies
```bash
cd server
npm install
```

#### Client Dependencies
```bash
cd ../client
npm install
```

## Database Setup

### Local MongoDB
1. Install MongoDB Community Server
2. Start MongoDB service:
   ```bash
   # macOS (with Homebrew)
   brew services start mongodb-community
   
   # Ubuntu/Debian
   sudo systemctl start mongod
   
   # Windows
   net start MongoDB
   ```

3. Create database and initial user:
   ```bash
   mongosh
   use poscalls4u
   db.createUser({
     user: "admin",
     pwd: "your-password",
     roles: ["readWrite", "dbAdmin"]
   })
   ```

### MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create new cluster
3. Set up database user
4. Configure network access (whitelist your IP)
5. Get connection string and add to `.env`

## External Service Configuration

### Gmail App Password Setup
1. Enable 2-Factor Authentication on your Google account
2. Go to [Google Account Settings](https://myaccount.google.com)
3. Navigate to Security → 2-Step Verification → App passwords
4. Generate app password for "Mail"
5. Use generated password in `EMAIL_PASSWORD`

### Google OAuth Setup
1. Go to [Google Developer Console](https://console.developers.google.com)
2. Create new project or select existing
3. Enable Google+ API and Gmail API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
6. Copy Client ID and Secret to `.env`

### Facebook OAuth Setup
1. Go to [Facebook Developers](https://developers.facebook.com)
2. Create new app
3. Add Facebook Login product
4. Configure OAuth settings:
   - Valid OAuth Redirect URI: `http://localhost:5000/api/auth/facebook/callback`
   - App Domain: `localhost`
5. Copy App ID and Secret to `.env`

## Development Workflow

### Starting Development Servers

#### Method 1: Concurrent (Recommended)
```bash
# From project root
npm run dev
```

#### Method 2: Separate Terminals
**Terminal 1 - Server:**
```bash
cd server
npm run dev
```

**Terminal 2 - Client:**
```bash
cd client
npm run dev
```

### Development URLs
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api-docs (if Swagger is configured)

### Hot Reloading
Both client and server support hot reloading:
- **Client**: Vite provides instant HMR
- **Server**: Nodemon restarts on file changes

## Testing Setup

### Running Tests
```bash
# All tests
npm test

# Server tests only
cd server && npm test

# Client tests only
cd client && npm test

# With coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Test Database Setup
Tests use MongoDB Memory Server for isolation:
```bash
# No additional setup required
# MongoDB Memory Server starts automatically during tests
```

## Code Quality Tools

### Linting
```bash
# Server
cd server && npm run lint
cd server && npm run lint:fix

# Client
cd client && npm run lint
cd client && npm run lint:fix
```

### TypeScript Compilation
```bash
# Server
cd server && npm run build

# Client
cd client && npm run build
```

## Debugging Setup

### VS Code Debug Configuration
Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Server",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/server/src/index.ts",
      "outFiles": ["${workspaceFolder}/server/dist/**/*.js"],
      "env": {
        "NODE_ENV": "development"
      },
      "envFile": "${workspaceFolder}/server/.env",
      "sourceMaps": true,
      "restart": true,
      "protocol": "inspector",
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

### Browser DevTools
1. Install React Developer Tools extension
2. Install Redux DevTools extension
3. Enable source maps in browser

## Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

#### MongoDB Connection Issues
```bash
# Check MongoDB status
brew services list | grep mongodb  # macOS
sudo systemctl status mongod      # Linux

# Check MongoDB logs
tail -f /usr/local/var/log/mongodb/mongo.log  # macOS
sudo tail -f /var/log/mongodb/mongod.log     # Linux
```

#### Node Modules Issues
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear npm cache
npm cache clean --force
```

#### TypeScript Compilation Errors
```bash
# Clean build
rm -rf dist/
npm run build

# Check TypeScript config
npx tsc --showConfig
```

### Environment Variables Not Loading
1. Check `.env` file location
2. Verify environment variable names
3. Restart development server
4. Check for syntax errors in `.env`

### Authentication Issues
1. Verify JWT_SECRET is set
2. Check OAuth credentials
3. Verify callback URLs match configuration
4. Test with curl commands

## Performance Optimization

### Development
- Use React DevTools Profiler
- Monitor bundle size with webpack-bundle-analyzer
- Enable source maps for debugging
- Use Redis for session storage in development

### Database
- Create indexes for frequently queried fields
- Use MongoDB Compass to analyze query performance
- Enable MongoDB profiling for slow queries

## Security Considerations

### Development Environment
- Never commit `.env` files
- Use strong JWT secrets
- Keep OAuth credentials secure
- Use HTTPS in production

### Code Security
- Regular dependency updates
- Security linting with ESLint security plugin
- Input validation on all endpoints
- SQL injection prevention (even with NoSQL)

## Deployment Preparation

### Environment Variables
Ensure all production environment variables are configured:
- Strong JWT_SECRET
- Production database URLs
- Production OAuth callback URLs
- Email service credentials
- Logging configuration

### Build Process
```bash
# Server build
cd server && npm run build

# Client build
cd client && npm run build
```

### Health Checks
Verify these endpoints work:
- `GET /health` - Server health
- `GET /api/auth/profile` - Authentication
- Database connectivity
- Email service connectivity

## Additional Resources

- [Project README](../README.md)
- [API Documentation](./docs/api/authentication.md)
- [Testing Guide](./docs/testing/README.md)
- [Architecture Overview](./docs/ARCHITECTURE.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

## Getting Help

1. Check existing documentation
2. Search GitHub issues
3. Check console logs and error messages
4. Verify environment configuration
5. Create detailed issue with reproduction steps

## Quick Start Checklist

- [ ] Node.js 18+ installed
- [ ] MongoDB running locally or Atlas configured
- [ ] Repository cloned
- [ ] Server `.env` configured
- [ ] Client `.env.local` configured
- [ ] Dependencies installed (server & client)
- [ ] OAuth services configured
- [ ] Email service configured
- [ ] Tests passing
- [ ] Development servers running
- [ ] Authentication flow working
- [ ] Database connection successful

---

**Next Steps**: After completing setup, proceed to the [Architecture Overview](./ARCHITECTURE.md) to understand the system design.
