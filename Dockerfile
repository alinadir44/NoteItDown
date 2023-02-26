FROM python:3.7-slim
COPY ./requirements.txt /app/requirements.txt
WORKDIR /app
EXPOSE 5000
EXPOSE 3306
EXPOSE 80
RUN apt-get update
RUN apt-get install -y gcc
RUN apt-get install -y default-libmysqlclient-dev
RUN pip3 install -r requirements.txt
COPY . /app