FROM mysql/mysql-server

MAINTAINER edgecake88@gmail.com

ENV MYSQL_ROOT_PASSWORD=notepass

EXPOSE 3306

COPY init.sql /docker-entrypoint-initdb.d/

CMD ["mysqld"]
