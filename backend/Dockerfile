# Set the python version as a build-time argument
# with Python 3.13 as the default, using the bookworm base
ARG PYTHON_VERSION=3.13-slim-bookworm
FROM python:${PYTHON_VERSION}

# --- Virtual Environment Setup ---
# Create a virtual environment
RUN python -m venv /opt/venv

# Set the virtual environment as the current location
ENV PATH=/opt/venv/bin:$PATH

# Upgrade pip
RUN pip install --upgrade pip

# Set Python-related environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# --- OS Dependencies Installation & Cleanup ---
# Install os dependencies
RUN apt-get update && apt-get install -y \
    # for postgres
    libpq-dev \
    # for Pillow
    libjpeg-dev \
    # for CairoSVG
    libcairo2 \
    # other
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Clean up apt cache to reduce image size (moved up for better layer caching)
RUN apt-get remove --purge -y \
    && apt-get autoremove -y \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# --- Project Setup ---
# Create the code directory and set it as the working directory
# This '/code' directory will be the root of your Django project (where manage.py lives)
WORKDIR /code

# Copy requirements.txt and install dependencies first (for better layer caching)
# Assuming requirements.txt is in the BACKEND root
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy the rest of the project code into the container's working directory (/code)
# Assuming the Dockerfile is in the BACKEND root, '.' refers to the BACKEND directory content
COPY . /code

# database isn't available during build
# run any other commands that do not need the database
# such as:
# RUN python manage.py collectstatic --noinput

# set the Django default project name
ARG PROJ_NAME="evently"

# --- Runtime Script ---
# create a bash script to run the Django project
# this script will execute at runtime when
# the container starts and the database is available
RUN printf "#!/bin/bash\n" > ./paracord_runner.sh && \
    printf "RUN_PORT=\"\${PORT:-8000}\"\n\n" >> ./paracord_runner.sh && \
    printf "python manage.py migrate --no-input\n" >> ./paracord_runner.sh && \
    printf "gunicorn ${PROJ_NAME}.wsgi:application --bind \"[::]:\$RUN_PORT\"\n" >> ./paracord_runner.sh

# make the bash script executable
RUN chmod +x paracord_runner.sh

# Run the Django project via the runtime script
# when the container starts
CMD ["./paracord_runner.sh"]