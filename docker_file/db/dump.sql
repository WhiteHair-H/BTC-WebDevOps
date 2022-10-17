grant all on btcweb.* to dana@'%';
alter user dana@'%' identified with mysql_native_password by 'Test1234!';

CREATE TABLE `User` (
  `user_id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `user_nickname` varchar(30),
  `user_pw` varchar(20),
  `user_email` varchar(50),
  `user_phone` varchar(13),
  `user_company` varchar(20)
);

CREATE TABLE `Boards` (
  `bd_no` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `bd_writer` int NOT NULL,
  `bd_review` int,
  `bd_title` varchar(50),
  `bd_hit` int,
  `bd_date` datetime,
  `bt_text` varchar(3000)
);

CREATE TABLE `Restaurant` (
  `res_name` varchar(50) PRIMARY KEY NOT NULL,
  `res_adr` varchar(100)
);

CREATE TABLE `Rec_board` (
  `rbd_no` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `rbd_title` varchar(50),
  `rbd_text` varchar(3000),
  `rbd_writer` int NOT NULL,
  `rbd_date` datetime,
  `rbd_hit` int,
  `rbd_rest` varchar(50) NOT NULL,
  `rbd_review` int
);

CREATE TABLE `Review` (
  `rev_no` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `rev_writer` int NOT NULL,
  `rev_date` datetime,
  `rev_text` varchar(3000)
);

ALTER TABLE `Boards` ADD FOREIGN KEY (`bd_writer`) REFERENCES `User` (`user_id`);

ALTER TABLE `Boards` ADD FOREIGN KEY (`bd_review`) REFERENCES `Review` (`rev_no`);

ALTER TABLE `Rec_board` ADD FOREIGN KEY (`rbd_writer`) REFERENCES `User` (`user_id`);

ALTER TABLE `Rec_board` ADD FOREIGN KEY (`rbd_rest`) REFERENCES `Restaurant` (`res_name`);

ALTER TABLE `Rec_board` ADD FOREIGN KEY (`rbd_review`) REFERENCES `Review` (`rev_no`);

ALTER TABLE `Review` ADD FOREIGN KEY (`rev_writer`) REFERENCES `User` (`user_id`);
