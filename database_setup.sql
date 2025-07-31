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

-- Chat 테이블 생성
CREATE TABLE IF NOT EXISTS `Chat` (
    `chat_id` INT AUTO_INCREMENT PRIMARY KEY,
    `sender_id` VARCHAR(100) NOT NULL,
    `receiver_id` VARCHAR(100) NOT NULL,
    `product_id` INT NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`sender_id`) REFERENCES `User`(`user_id`),
    FOREIGN KEY (`receiver_id`) REFERENCES `User`(`user_id`)
);

-- Chat_History 테이블 생성
CREATE TABLE IF NOT EXISTS `Chat_History` (
    `message_id` INT AUTO_INCREMENT PRIMARY KEY,
    `chat_id` INT NOT NULL,
    `sender_id` VARCHAR(100) NOT NULL,
    `content` TEXT NOT NULL,
    `send_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `read` BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (`chat_id`) REFERENCES `Chat`(`chat_id`),
    FOREIGN KEY (`sender_id`) REFERENCES `User`(`user_id`)
);

-- 데모 채팅 데이터 삽입
INSERT INTO `Chat` (`sender_id`, `receiver_id`, `product_id`) VALUES
('hero', 'timemaster', 1),
('collector', 'hero', 2);

-- Product 테이블 생성 (채팅 기능을 위해)
CREATE TABLE IF NOT EXISTS `Product` (
    `product_id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `price` DECIMAL(10,2),
    `seller_id` VARCHAR(100),
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`seller_id`) REFERENCES `User`(`user_id`)
);

-- 데모 상품 데이터 삽입
INSERT INTO `Product` (`product_id`, `name`, `description`, `price`, `seller_id`) VALUES
(789, '친필 사인 해리포터 초판본 전집', 'J.K. 롤링의 친필 사인이 포함된 초판본 전집입니다.', 5000000.00, 'user-me'),
(101, '빈티지 롤렉스 서브마리너', '1980년대 빈티지 롤렉스 서브마리너입니다.', 8000000.00, 'timemaster'),
(456, '레트로 게임기 슈퍼 패미컴', '레트로 게임기 슈퍼 패미컴 신품급입니다.', 200000.00, 'hero');

-- 데모 채팅 메시지 데이터 삽입
INSERT INTO `Chat_History` (`chat_id`, `sender_id`, `content`, `send_date`) VALUES
(1, 'hero', '안녕하세요, 낙찰자입니다. 배송은 언제쯤 시작될까요?', NOW() - INTERVAL 9 MINUTE),
(1, 'timemaster', '네, 안녕하세요! 오늘 바로 포장해서 내일 오전에 발송해 드리겠습니다.', NOW() - INTERVAL 8 MINUTE),
(2, 'collector', '상품 잘 받았습니다. 감사합니다!', NOW() - INTERVAL 30 MINUTE); 