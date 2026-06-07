FROM python:3.11-slim

WORKDIR /app

# Install dependencies first (cached layer)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY scripts/ ./scripts/
COPY portal/ ./portal/
COPY sources/ ./sources/
COPY main.py .

# knowledge/, data/, config/ are mounted as volumes at runtime
# but we copy them here as defaults so the container works standalone too
COPY knowledge/ ./knowledge/
COPY config/ ./config/

ENV PYTHONUNBUFFERED=1
EXPOSE 8766

CMD ["uvicorn", "scripts.serve:app", "--host", "0.0.0.0", "--port", "8766"]
