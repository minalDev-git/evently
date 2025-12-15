# Set the python version as a build-time argument
ARG PYTHON_VERSION=3.13-slim-bookworm
FROM python:${PYTHON_VERSION}

# --- 1. Setup & Environment ---
# Create a virtual environment
RUN python -m venv /opt/venv

# Set the virtual environment as the current location
ENV PATH=/opt/venv/bin:$PATH

# Upgrade pip
RUN pip install --upgrade pip

# Set Python-related environment variables
# PREVENTS Python from writing pyc files to disc (equivalent to python -B)
ENV PYTHONDONTWRITEBYTECODE 1
# PREVENTS Python from buffering stdout and stderr (equivalent to python -u)
ENV PYTHONUNBUFFERED 1

# --- 2. OS Dependencies ---
# Install dependencies in a single layer to reduce image size
RUN apt-get update && apt-get install -y \
    # build-essential contains gcc and other compile tools
    build-essential \
    # libpq-dev for building psycopg2 (Postgres)
    libpq-dev \
    # libjpeg-dev for Pillow (Image processing)
    libjpeg-dev \
    # libcairo2 for CairoSVG
    libcairo2 \
    # other
    gcc \
    && rm -rf /var/lib/apt/lists/*

# --- 3. Project Setup ---
WORKDIR /code

# Copy requirements.txt and install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# --- 4. Cleanup (Optimization) ---
# Now that pip install is done, remove build tools like gcc to save space.
# We keep libpq5 (runtime) but remove the dev headers.
RUN apt-get remove --purge -y build-essential libpq-dev \
    && apt-get autoremove -y \
    && apt-get clean

# --- 5. Code & Static Files ---
COPY . /code

# Collect Static Files
# CRITICAL: Render will not serve static files (CSS/JS) automatically.
# You need 'whitenoise' installed and this command run during build.
RUN python manage.py collectstatic --noinput

# --- 6. Security (Non-Root User) ---
# Create a non-root user 'django_user'
RUN addgroup --system django_user && adduser --system --ingroup django_user django_user

# Give ownership of the code and venv to the new user
RUN chown -R django_user:django_user /code /opt/venv

# Switch to non-root user
USER django_user

# --- 7. Runtime Script ---
ARG PROJ_NAME="evently"

# Create the runner script
# Note: We use the PORT environment variable provided by Render
RUN printf "#!/bin/bash\n" > ./paracord_runner.sh && \
    printf "RUN_PORT=\"\${PORT:-8000}\"\n\n" >> ./paracord_runner.sh && \
    printf "python manage.py migrate --no-input\n" >> ./paracord_runner.sh && \
    printf "gunicorn ${PROJ_NAME}.wsgi:application --bind \"0.0.0.0:\$RUN_PORT\"\n" >> ./paracord_runner.sh

# Make executable
RUN chmod +x paracord_runner.sh

# Start
CMD ["./paracord_runner.sh"]