FROM python:3.11-slim

WORKDIR /app

# Copia primero requirements para aprovechar caché de Docker
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

# Asegúrate de que este puerto coincida con el del docker-compose (8000)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]