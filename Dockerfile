# ==========================================
# Stage 1: Build the React + Vite Frontend
# ==========================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# ==========================================
# Stage 2: Production Python & Flask Runtime
# ==========================================
FROM python:3.11-slim
WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=5001

# Install system curl for health checks
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies with extended timeout
COPY requirements.txt .
RUN pip install --no-cache-dir --default-timeout=300 -r requirements.txt

# Copy Flask backend code and machine learning model assets
COPY app.py .
COPY final_expanded_xgboost_model.json .
COPY final_expanded_model_features.pkl .

# Copy built frontend assets from Stage 1 into frontend/dist
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Expose default port
EXPOSE 5001

# Launch production server with Gunicorn (binds dynamically to Render's $PORT)
CMD ["sh", "-c", "gunicorn --bind 0.0.0.0:${PORT:-5001} --workers 2 --timeout 120 app:app"]
