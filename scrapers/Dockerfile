FROM python:3.12-slim

WORKDIR /app

# Sistem bağımlılıkları + Playwright gereksinimleri
RUN apt-get update && apt-get install -y \
    curl gcc \
    # Playwright Chromium bağımlılıkları
    libnss3 libnspr4 libdbus-1-3 libatk1.0-0 libatk-bridge2.0-0 \
    libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 \
    libxfixes3 libxrandr2 libgbm1 libasound2 \
    && rm -rf /var/lib/apt/lists/*

# Python bağımlılıkları
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Playwright Chromium kur
RUN playwright install chromium

COPY . .

CMD ["celery", "-A", "celery_app", "worker", "--loglevel=info", "--concurrency=4"]
