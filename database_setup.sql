
-- Point 테이블 생성
CREATE TABLE IF NOT EXISTS `Point` (
    `user_id` VARCHAR(100) NOT NULL PRIMARY KEY,
    `point` INT NOT NULL DEFAULT 0,
    FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`)
);
