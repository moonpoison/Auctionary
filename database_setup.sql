-- User 테이블 생성
CREATE TABLE IF NOT EXISTS `User` (
    `user_id` VARCHAR(100) NOT NULL PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `birth_date` VARCHAR(20) NULL,
    `phone_number` VARCHAR(20) NOT NULL,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `role` VARCHAR(20) NOT NULL DEFAULT 'USER',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

-- 데모 사용자 데이터 삽입
INSERT INTO `User` (`user_id`, `name`, `password`, `birth_date`, `phone_number`, `email`, `role`) VALUES
    ('hero', 'AuctionHero', 'demo', '1990-01-01', '010-1234-5678', 'hero@auctionary.com', 'USER'),
    ('vtech', 'V-Tech', 'demo', '1985-05-15', '010-2345-6789', 'vtech@auctionary.com', 'USER'),
    ('timemaster', 'TimeMaster', 'demo', '1988-12-25', '010-3456-7890', 'timemaster@auctionary.com', 'USER'),
    ('collector', 'Collector', 'demo', '1992-08-10', '010-4567-8901', 'collector@auctionary.com', 'USER');

-- Product 테이블 생성
CREATE TABLE IF NOT EXISTS `Product` (
    `product_id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` VARCHAR(100) NOT NULL,
    `product_name` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `image_path` VARCHAR(255),
    `category_id` INT,
    `auction_start_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `auction_end_date` TIMESTAMP NOT NULL,
    `starting_price` INT NOT NULL,
    `bid_unit` INT NOT NULL,
    `transaction_status` VARCHAR(50) NOT NULL DEFAULT 'AUCTIONING',
    FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`)
);

-- Bid 테이블 생성
CREATE TABLE IF NOT EXISTS `Bid` (
    `bid_id` INT AUTO_INCREMENT PRIMARY KEY,
    `product_id` INT NOT NULL,
    `bid_user_id` VARCHAR(100) NOT NULL,
    `bid_price` INT NOT NULL,
    `bid_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`product_id`) REFERENCES `Product`(`product_id`),
    FOREIGN KEY (`bid_user_id`) REFERENCES `User`(`user_id`)
);

-- Point 테이블 생성
CREATE TABLE IF NOT EXISTS `Point` (
    `user_id` VARCHAR(100) NOT NULL PRIMARY KEY,
    `point` INT NOT NULL DEFAULT 0,
    FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`)
);

-- Point_History 테이블 생성
CREATE TABLE IF NOT EXISTS `Point_History` (
    `history_id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` VARCHAR(100) NOT NULL,
    `action_type` VARCHAR(50) NOT NULL,
    `point_change` INT NOT NULL,
    `final_point` INT NOT NULL,
    `change_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `note` VARCHAR(255),
    FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`)
);

-- 데모 사용자 포인트 데이터 삽입 (초기 1,000,000 포인트)
INSERT INTO `Point` (`user_id`, `point`) VALUES
    ('hero', 1000000),
    ('vtech', 1000000),
    ('timemaster', 1000000),
    ('collector', 1000000);
