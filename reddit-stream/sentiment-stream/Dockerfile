FROM hseeberger/scala-sbt:8u312_1.6.2_2.12.15


COPY ./src/ ./streamer/src/
COPY ./project/ ./streamer/project/
COPY ./build.sbt ./streamer/build.sbt

WORKDIR ./streamer


RUN sbt compile


CMD ["sbt", "run"]


