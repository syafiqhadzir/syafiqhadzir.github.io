# ============================================================================
# MAKEFILE
# Universal task runner for the portfolio project
# ============================================================================

.PHONY: help install dev build clean lint test verify deploy

# Default target
help:
	@echo "Available commands:"
	@echo "  make install    - Install dependencies"
	@echo "  make dev        - Start development server"
	@echo "  make build      - Build for production"
	@echo "  make clean      - Clean build artifacts"
	@echo "  make lint       - Run all linters"
	@echo "  make test       - Run all tests"
	@echo "  make verify     - Run all checks (lint + test + build)"
	@echo "  make deploy     - Build and prepare for deployment"

# Install dependencies
install:
	npm ci

# Development server
dev:
	npm run dev

# Production build
build:
	npm run build:prod

# Clean build artifacts
clean:
	npm run clean

# Linting
lint: lint-js lint-css lint-md

lint-js:
	npm run lint:js

lint-css:
	npm run lint:css

lint-md:
	@if command -v markdownlint > /dev/null; then markdownlint "**/*.md" --ignore node_modules; fi

# Testing
test: test-unit test-e2e

test-unit:
	npm run test:unit

test-e2e:
	npm run test:e2e

test-coverage:
	npm run test:unit:coverage

# Type checking
typecheck:
	npm run typecheck

# Full verification (CI simulation)
verify: lint typecheck test-unit build
	@echo "✅ All checks passed!"

# Housekeeping
housekeeping:
	npm run housekeeping

# Performance audit
perf:
	npm run perf:local

# AMP validation
validate-amp:
	npm run validate:amp

# Schema validation
validate-schema:
	npm run validate:schema

# All validations
validate: validate-amp validate-schema

# SonarCloud scan
sonar:
	npm run sonar

# Deploy preparation
deploy: clean verify
	@echo "📦 Build ready for deployment in _site/"

# Quick check (fast feedback loop)
check: lint-js lint-css typecheck
	@echo "✅ Quick checks passed!"

# Format code
format:
	npx prettier --write .

# Update dependencies
update:
	npm update
	npm audit fix

# Docker commands
docker-build:
	docker compose build

docker-up:
	docker compose up -d

docker-down:
	docker compose down

docker-logs:
	docker compose logs -f

# Cypress interactive mode
cypress:
	npm run test:e2e:open
