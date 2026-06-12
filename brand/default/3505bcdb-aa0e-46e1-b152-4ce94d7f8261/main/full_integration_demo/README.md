# Full Integration Demo Application

This is a full-stack application demonstrating integration between:
- Frontend: React
- Backend: FastAPI
- Database: PostgreSQL
- Orchestration: Docker Compose
- Testing: Pytest (backend), Playwright (E2E)
- CI/CD: GitHub Actions

## Project Structure

```
full_integration_demo/
├── backend/              # FastAPI application
├── frontend/             # React application
├── docker-compose.yml    # Docker Compose configuration
├── .github/workflows/    # GitHub Actions CI/CD
├── tests/                # End-to-end tests
└── README.md
```

## Getting Started

1. Clone the repository
2. Run `docker-compose up` to start all services
3. Access the application at http://localhost:3000
4. Access the API documentation at http://localhost:8000/docs

## Development

### Backend
- FastAPI application runs on port 8000
- PostgreSQL database runs on port 5432
- Run tests with `docker-compose run backend pytest`

### Frontend
- React application runs on port 3000
- Auto-reloads on code changes

## Testing

### Backend Tests
Run with: `docker-compose run backend pytest`

### End-to-End Tests
Run with: `docker-compose run e2e-tests`

## CI/CD
GitHub Actions workflow configured in `.github/workflows/ci.yml`