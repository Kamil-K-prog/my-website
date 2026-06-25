FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt ./
RUN pip install -r requirements.txt --no-cache-dir
COPY . ./
ENTRYPOINT ["gunicorn", "--bind=0.0.0.0:5000", "app:app"]
# expose не будет, так как этот контейнер будет общаться только с nginx во внутренней сети