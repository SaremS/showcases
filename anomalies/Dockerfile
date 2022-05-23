FROM julia:1.7.2-alpine3.15

COPY . /app
WORKDIR /app
RUN chmod a+x ./run_server.jl
RUN chmod a+x ./install.jl
RUN julia ./install.jl

ENV JULIA_ENV=PROD

EXPOSE 8081
CMD julia ./run_server.jl
