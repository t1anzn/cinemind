# Use official Python image
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY . .

# Copy the .env file into the container
COPY .env .env

# Expose Flask port
EXPOSE 5000

# Run your Flask app (note the app/app.py path)
CMD ["python", "app/app.py"]