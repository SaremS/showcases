#stage 1
FROM python:3.9-alpine AS pip_installed

COPY ./requirements.txt ./middleware/requirements.txt
RUN pip install -r ./middleware/requirements.txt

#stage 2
FROM pip_installed

COPY ./main.py ./middleware/main.py

RUN addgroup -S mwgroup
RUN adduser -S -D -h . mwuser mwgroup
RUN chown -R mwuser ./middleware

WORKDIR ./middleware

USER mwuser
EXPOSE 8765

CMD ["python", "main.py"]


