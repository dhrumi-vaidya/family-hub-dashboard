# KutumbOS Backend API

Production-grade REST API for KutumbOS family management system.

## Features

- **JWT Authentication**: Secure token-based authentication with refresh tokens
- **Role-Based Access Control**: Admin and member roles with proper permissions
- **Security**: Helmet, CORS, rate limiting, input validation
- **TypeScript**: Full type safety and modern development experience
- **Mock Database**: Structured data layer ready for real database integration

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Environment variables configured (see `.env.example`)

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

The API will be available at `http://localhost:3333`

### Environment Variables

```bash
PORT=3333
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
BCRYPT_ROUNDS=12
```

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/auth/me` - Get current user
- `GET /api/auth/families` - Get user families

### Health Check

- `GET /api/health` - API health status

## Test Users

The mock database includes these test users:

**Admin User:**
- Email: `rahul@sharma.com` or Phone: `9876543210`
- Password: `password123`
- Role: Admin
- Families: Sharma Family, Verma Family

**Member User:**
- Email: `sunita@sharma.com` or Phone: `9876543211`
- Password: `password123`
- Role: Member
- Families: Sharma Family

## Example Usage

### Login Request

```bash
curl -X POST http://localhost:3333/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"rahul@sharma.com","password":"password123"}'
```

### Authenticated Request

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3333/api/auth/me
```

## Development

### Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server

### Project Structure

```
server/
├── src/
│   ├── config/         # Database and configuration
│   ├── middleware/     # Express middleware
│   ├── routes/         # API route handlers
│   ├── types/          # TypeScript type definitions
│   └── index.ts        # Main application entry
├── .env.example        # Environment variables template
└── package.json        # Dependencies and scripts
```

## Security Features

- **Password Hashing**: bcrypt with configurable rounds
- **JWT Tokens**: Secure token generation with expiration
- **Rate Limiting**: Configurable request rate limits
- **Input Validation**: express-validator for request validation
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers for production

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET`
3. Configure proper CORS origins
4. Set up a real database (replace mock database)
5. Configure proper logging and monitoring
6. Use HTTPS in production

## Next Steps

- Replace mock database with real database (PostgreSQL/MongoDB)
- Add comprehensive API documentation (Swagger/OpenAPI)
- Implement audit logging
- Add email/SMS notifications
- Set up automated testing
- Add API versioning
- Implement file upload for health records