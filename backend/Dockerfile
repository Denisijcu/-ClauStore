FROM python:3.11-slim

# Solo necesitamos una base limpia. 
# Si usas 'psycopg2-binary', el resto no hace falta.
WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
