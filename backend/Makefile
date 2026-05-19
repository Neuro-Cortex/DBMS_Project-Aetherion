.PHONY: help install run test lint format clean migrate seed docker-build docker-up docker-down logs

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	pip install -r requirements.txt
	pip install -r requirements-dev.txt 2>/dev/null || true

run: ## Run development server
	uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

run-prod: ## Run production server
	uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4

test: ## Run all tests
	pytest -v

test-cov: ## Run tests with coverage
	pytest -v --cov=app --cov-report=html --cov-report=term

test-unit: ## Run unit tests only
	pytest tests/unit/ -v

test-integration: ## Run integration tests only
	pytest tests/integration/ -v

lint: ## Run linters
	@echo "Running black..."
	black --check app tests
	@echo "Running isort..."
	isort --check app tests
	@echo "Running flake8..."
	flake8 app tests
	@echo "Running mypy..."
	mypy app

format: ## Format code
	black app tests	isort app tests

clean: ## Clean up generated files
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete
	find . -type f -name "*.pyo" -delete
	find . -type d -name "*.egg-info" -exec rm -rf {} + 2>/dev/null || true
	rm -rf .pytest_cache .mypy_cache htmlcov .coverage
	rm -rf dist build

migrate: ## Run database migrations
	alembic upgrade head

migrate-create: ## Create new migration
	alembic revision --autogenerate -m "Auto migration"

migrate-down: ## Rollback last migration
	alembic downgrade -1

seed: ## Seed database with sample data
	python scripts/seed_data.py

init-db: ## Initialize database
	python scripts/init_db.py

docker-build: ## Build Docker images
	docker-compose build

docker-up: ## Start Docker containers
	docker-compose up -d

docker-down: ## Stop Docker containers
	docker-compose down

docker-restart: ## Restart Docker containers
	docker-compose restart

docker-logs: ## View Docker logs
	docker-compose logs -f

docker-logs-backend: ## View backend logs
	docker-compose logs -f backend

docker-shell: ## Open shell in backend container
	docker-compose exec backend /bin/bash

docker-psql: ## Open PostgreSQL shell
	docker-compose exec postgres psql -U aetherion -d aetherion_db

docker-redis: ## Open Redis CLI
	docker-compose exec redis redis-cli -a redis123

requirements: ## Generate requirements.txt
	pip freeze > requirements.txt

pre-commit-install: ## Install pre-commit hooks
	pre-commit install

pre-commit-run: ## Run pre-commit on all files
	pre-commit run --all-files

check: ## Run all checks (lint + test)
	make lint
	make test

deploy: ## Deploy application
	@echo "Deploying Aetherion Healthcare Platform..."
	docker-compose -f docker-compose.prod.yml up -d --build

backup: ## Backup database
	./scripts/backup.sh

shell: ## Open Python shell with app context
	python -c "from app.core.config import settings; print(f'App: {settings.APP_NAME} v{settings.APP_VERSION}')"

routes: ## Show all API routes
	python -c "from app.main import app; [print(f'{route.methods} {route.path}') for route in app.routes]"

help:
	@echo ""
	@echo "Aetherion Healthcare Platform"
	@echo "=============================="
	@echo ""
	@make help