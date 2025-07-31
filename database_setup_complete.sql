-- 완전한 옥셔너리 데이터베이스 스키마

-- 사용자 테이블
CREATE TABLE user (
    user_id VARCHAR(100) PRIMARY KEY,
    password VARCHAR(100) NOT NULL,
    name VARCHAR(50) NOT NULL,
    birth_date DATE,
    phone_number VARCHAR(20),
    email VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'admin'))
);

-- 카테고리 테이블 (계층형)
CREATE TABLE Category (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(50) NOT NULL,
    parent_id INT,
    FOREIGN KEY (parent_id) REFERENCES Category(category_id)
);

-- 상품 테이블
CREATE TABLE Product (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(100) NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    image_path VARCHAR(255),
    category_id INT,
    auction_start_date DATETIME NOT NULL,
    auction_end_date DATETIME NOT NULL,
    starting_price INT NOT NULL,
    bid_unit INT NOT NULL,
    transaction_status VARCHAR(30) NOT NULL CHECK (transaction_status IN ('AUCTIONING', 'ENDED', 'SOLD')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (category_id) REFERENCES Category(category_id)
);

-- 입찰 테이블
CREATE TABLE Bid (
    bid_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    user_id VARCHAR(100) NOT NULL,
    bid_price INT NOT NULL,
    bid_date DATETIME NOT NULL,
    FOREIGN KEY (product_id) REFERENCES Product(product_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);

-- 찜 테이블
CREATE TABLE Wishlist (
    user_id VARCHAR(100),
    product_id INT,
    PRIMARY KEY (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (product_id) REFERENCES Product(product_id)
);

-- 채팅방 테이블
CREATE TABLE Chat (
    chat_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    sender_id VARCHAR(100) NOT NULL,
    receiver_id VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES Product(product_id),
    FOREIGN KEY (sender_id) REFERENCES User(user_id),
    FOREIGN KEY (receiver_id) REFERENCES User(user_id)
);

-- 채팅 내역 테이블
CREATE TABLE Chat_History (
    message_id INT PRIMARY KEY AUTO_INCREMENT,
    chat_id INT NOT NULL,
    sender_id VARCHAR(100) NOT NULL,
    content TEXT,
    send_date DATETIME NOT NULL,
    `read` BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (chat_id) REFERENCES Chat(chat_id),
    FOREIGN KEY (sender_id) REFERENCES User(user_id)
);

-- 거래 내역 테이블
CREATE TABLE Trade_History (
    trade_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    buyer_id VARCHAR(100) NOT NULL,
    seller_id VARCHAR(100) NOT NULL,
    final_price INT NOT NULL,
    trade_date DATETIME NOT NULL,
    trade_status VARCHAR(30) DEFAULT 'COMPLETED',
    UNIQUE (product_id),
    FOREIGN KEY (product_id) REFERENCES Product(product_id),
    FOREIGN KEY (buyer_id) REFERENCES User(user_id),
    FOREIGN KEY (seller_id) REFERENCES User(user_id)
);

-- 거래 후기 테이블
CREATE TABLE Review (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    trade_id INT NOT NULL,
    reviewer_id VARCHAR(100) NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    content TEXT,
    review_date DATETIME NOT NULL,
    FOREIGN KEY (trade_id) REFERENCES Trade_History(trade_id),
    FOREIGN KEY (reviewer_id) REFERENCES User(user_id)
);

-- 문의 테이블
CREATE TABLE Inquiry (
    inquiry_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(100) NOT NULL,
    inquiry_title VARCHAR(200) NOT NULL,
    inquiry_content TEXT,
    create_date DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);

-- 답변 테이블
CREATE TABLE Answer (
    answer_id INT PRIMARY KEY AUTO_INCREMENT,
    inquiry_id INT NOT NULL,
    user_id VARCHAR(100) NOT NULL,
    reply_title VARCHAR(200),
    reply_content TEXT,
    reply_create_date DATETIME NOT NULL,
    FOREIGN KEY (inquiry_id) REFERENCES Inquiry(inquiry_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);

-- 포인트 기록 테이블
CREATE TABLE Point_History (
    history_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(100) NOT NULL,
    action_type VARCHAR(50),
    point_change INT NOT NULL,
    final_point INT NOT NULL,
    change_date DATETIME NOT NULL,
    note TEXT,
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);

-- 포인트 충전/환전 요청 테이블
CREATE TABLE Point_Transaction (
    transaction_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(100) NOT NULL,
    transaction_type VARCHAR(50) NOT NULL,
    amount INT NOT NULL,
    request_date DATETIME NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('REQUESTED', 'APPROVED', 'REJECTED')),
    process_date DATETIME,
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);

-- 샘플 데이터 삽입

-- 사용자 데이터
INSERT INTO User (user_id, password, name, birth_date, phone_number, email, role) VALUES
('hero', 'demo', 'AuctionHero', '1990-01-01', '010-1234-5678', 'hero@auctionary.com', 'user'),
('vtech', 'demo', 'V-Tech', '1985-05-15', '010-2345-6789', 'vtech@auctionary.com', 'user'),
('timemaster', 'demo', 'TimeMaster', '1988-12-25', '010-3456-7890', 'timemaster@auctionary.com', 'user'),
('collector', 'demo', 'Collector', '1992-08-10', '010-4567-8901', 'collector@auctionary.com', 'user'),
('admin', 'admin123', '관리자', '1980-01-01', '010-0000-0000', 'admin@auctionary.com', 'admin');

-- 카테고리 데이터
INSERT INTO Category (category_name, parent_id) VALUES
('전자기기', NULL),
('의류', NULL),
('도서', NULL),
('스포츠', NULL),
('컬렉션', NULL);

INSERT INTO Category (category_name, parent_id) VALUES
('스마트폰', 1),
('노트북', 1),
('태블릿', 1),
('남성의류', 2),
('여성의류', 2),
('소설', 3),
('자기계발', 3),
('축구', 4),
('야구', 4),
('골동품', 5),
('우표', 5);

-- 상품 데이터
INSERT INTO Product (user_id, product_name, description, image_path, category_id, auction_start_date, auction_end_date, starting_price, bid_unit, transaction_status) VALUES
('timemaster', '빈티지 롤렉스 서브마리너', '1980년대 빈티지 롤렉스 서브마리너입니다. 원본 박스와 서류가 함께 있습니다.', '/images/rolex.jpg', 10, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 8000000, 100000, 'AUCTIONING'),
('hero', '레트로 게임기 슈퍼 패미컴', '레트로 게임기 슈퍼 패미컴 신품급입니다. 모든 게임팩이 포함되어 있습니다.', '/images/super-famicom.jpg', 1, NOW(), DATE_ADD(NOW(), INTERVAL 5 DAY), 200000, 10000, 'AUCTIONING'),
('collector', '친필 사인 해리포터 초판본 전집', 'J.K. 롤링의 친필 사인이 포함된 초판본 전집입니다. 매우 희귀한 아이템입니다.', '/images/harry-potter.jpg', 6, NOW(), DATE_ADD(NOW(), INTERVAL 10 DAY), 5000000, 500000, 'AUCTIONING'),
('vtech', '애플 맥북 프로 16인치', '2023년형 애플 맥북 프로 16인치입니다. M2 Pro 칩셋, 32GB RAM, 1TB SSD.', '/images/macbook-pro.jpg', 2, NOW(), DATE_ADD(NOW(), INTERVAL 3 DAY), 3000000, 100000, 'AUCTIONING');

-- 입찰 데이터
INSERT INTO Bid (product_id, user_id, bid_price, bid_date) VALUES
(1, 'hero', 8100000, NOW() - INTERVAL 2 HOUR),
(1, 'collector', 8200000, NOW() - INTERVAL 1 HOUR),
(2, 'timemaster', 210000, NOW() - INTERVAL 30 MINUTE),
(3, 'vtech', 5100000, NOW() - INTERVAL 1 DAY);

-- 찜 데이터
INSERT INTO Wishlist (user_id, product_id) VALUES
('hero', 1),
('hero', 3),
('collector', 2),
('vtech', 1);

-- 채팅 데이터
INSERT INTO Chat (product_id, sender_id, receiver_id) VALUES
(1, 'hero', 'timemaster'),
(2, 'collector', 'hero');

-- 채팅 내역 데이터
INSERT INTO Chat_History (chat_id, sender_id, content, send_date) VALUES
(1, 'hero', '안녕하세요, 낙찰자입니다. 배송은 언제쯤 시작될까요?', NOW() - INTERVAL 9 MINUTE),
(1, 'timemaster', '네, 안녕하세요! 오늘 바로 포장해서 내일 오전에 발송해 드리겠습니다.', NOW() - INTERVAL 8 MINUTE),
(2, 'collector', '상품 잘 받았습니다. 감사합니다!', NOW() - INTERVAL 30 MINUTE);

-- 거래 내역 데이터 (완료된 거래)
INSERT INTO Trade_History (product_id, buyer_id, seller_id, final_price, trade_date) VALUES
(4, 'hero', 'vtech', 3200000, NOW() - INTERVAL 1 DAY);

-- 리뷰 데이터
INSERT INTO Review (trade_id, reviewer_id, rating, content, review_date) VALUES
(1, 'hero', 5, '정말 좋은 판매자입니다. 상품도 만족스럽고 배송도 빠르네요!', NOW() - INTERVAL 12 HOUR);

-- 포인트 기록 데이터
INSERT INTO Point_History (user_id, action_type, point_change, final_point, change_date, note) VALUES
('hero', 'CHARGE', 10000000, 10000000, NOW() - INTERVAL 1 DAY, '초기 포인트 충전'),
('collector', 'CHARGE', 5000000, 5000000, NOW() - INTERVAL 1 DAY, '초기 포인트 충전'),
('timemaster', 'CHARGE', 8000000, 8000000, NOW() - INTERVAL 1 DAY, '초기 포인트 충전'),
('vtech', 'CHARGE', 3000000, 3000000, NOW() - INTERVAL 1 DAY, '초기 포인트 충전'),
('hero', 'BID', -8200000, 1800000, NOW() - INTERVAL 1 HOUR, '입찰: 빈티지 롤렉스 서브마리너'),
('collector', 'BID', -210000, 4790000, NOW() - INTERVAL 30 MINUTE, '입찰: 레트로 게임기 슈퍼 패미컴'); 