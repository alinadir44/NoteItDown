FROM mysql:latest

ENV MYSQL_ROOT_PASSWORD=password
ENV MYSQL_DATABASE=notepad
ENV MYSQL_USER=root
ENV MYSQL_PASSWORD=mypassword

EXPOSE 3306

COPY init.sql /docker-entrypoint-initdb.d/