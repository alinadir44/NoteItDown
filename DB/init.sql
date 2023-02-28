CREATE DATABASE notepad;
CREATE USER 'root'@'%';
GRANT ALL PRIVILEGES ON notepad.* TO 'root'@'%';
CREATE TABLE IF NOT EXISTS notepad.USERS (user_id INTEGER PRIMARY KEY AUTO_INCREMENT,userFullName varchar(50) NOT NULL,user_email varchar(30) NOT NULL,user_pass varchar(30) NOT NULL);
CREATE TABLE IF NOT EXISTS notepad.NOTES (note_id INTEGER PRIMARY KEY AUTO_INCREMENT, user_id INTEGER, note_title varchar(20) NOT NULL,note_body varchar(3000) NOT NULL)