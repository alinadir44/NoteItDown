FROM python:3.7-slim
WORKDIR /app
EXPOSE 5000
EXPOSE 3306
RUN apt-get update
RUN apt-get upgrade
RUN apt-get install -y gcc
RUN apt-get install -y default-libmysqlclient-dev
COPY ./requirements.txt /app/requirements.txt
RUN pip3 install -r requirements.txt
COPY . /app
CMD ["python","main.py"]