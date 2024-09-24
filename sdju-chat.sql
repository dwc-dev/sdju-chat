CREATE TABLE `User`
(
    `user_id`           int          NOT NULL,
    `password`          varchar(255) NOT NULL,
    `nickname`          varchar(255) NOT NULL,
    `sex`               enum('Male','Female','Other') NOT NULL,
    `registration_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `user_icon`         varchar(255) NOT NULL,
    `email`             varchar(255) NOT NULL,
    `birthday`          date         NOT NULL,
    `address`           varchar(255) NOT NULL,
    `personal_profile`  text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
    PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Group`
(
    `group_id`          int          NOT NULL,
    `group_name`        varchar(255) NOT NULL,
    `group_create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `group_icon`        varchar(255) NOT NULL,
    PRIMARY KEY (`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `UserGroup`
(
    `user_id`  int NOT NULL DEFAULT '0',
    `group_id` int NOT NULL DEFAULT '0',
    PRIMARY KEY (`user_id`, `group_id`),
    KEY        `group_id` (`group_id`),
    CONSTRAINT `UserGroup_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`),
    CONSTRAINT `UserGroup_ibfk_2` FOREIGN KEY (`group_id`) REFERENCES `Group` (`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Friendship`
(
    `user1_id` int NOT NULL DEFAULT '0',
    `user2_id` int NOT NULL DEFAULT '0',
    PRIMARY KEY (`user1_id`, `user2_id`),
    KEY        `user2_id` (`user2_id`),
    CONSTRAINT `Friendship_ibfk_1` FOREIGN KEY (`user1_id`) REFERENCES `User` (`user_id`),
    CONSTRAINT `Friendship_ibfk_2` FOREIGN KEY (`user2_id`) REFERENCES `User` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Message`
(
    `message_id`  int      NOT NULL AUTO_INCREMENT,
    `sender_id`   int      NOT NULL,
    `receiver_id` int DEFAULT NULL,
    `group_id`    int DEFAULT NULL,
    `content`     longtext NOT NULL,
    `timestamp`   bigint   NOT NULL,
    PRIMARY KEY (`message_id`),
    KEY           `sender_id` (`sender_id`),
    KEY           `receiver_id` (`receiver_id`),
    KEY           `group_id` (`group_id`),
    CONSTRAINT `Message_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `User` (`user_id`),
    CONSTRAINT `Message_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `User` (`user_id`),
    CONSTRAINT `Message_ibfk_3` FOREIGN KEY (`group_id`) REFERENCES `Group` (`group_id`)
) ENGINE=InnoDB AUTO_INCREMENT=535 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Reset_password`
(
    `user_id`       varchar(32) NOT NULL,
    `question_id_1` int         NOT NULL,
    `answer1`       varchar(64) NOT NULL,
    `question_id_2` int         NOT NULL,
    `answer2`       varchar(64) NOT NULL,
    `question_id_3` int         NOT NULL,
    `answer3`       varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
