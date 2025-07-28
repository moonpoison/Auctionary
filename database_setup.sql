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