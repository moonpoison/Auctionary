-- 기존 테이블 삭제 (외래키 제약조건 때문에 순서 중요)

-- 먼저 자식 테이블들 삭제
DROP TABLE IF EXISTS Review;
DROP TABLE IF EXISTS Chat_History;
DROP TABLE IF EXISTS Chat;
DROP TABLE IF EXISTS Wishlist;
DROP TABLE IF EXISTS Bid;
DROP TABLE IF EXISTS Trade_History;
DROP TABLE IF EXISTS Point_History;
DROP TABLE IF EXISTS Point_Transaction;
DROP TABLE IF EXISTS Answer;
DROP TABLE IF EXISTS Inquiry;
DROP TABLE IF EXISTS Product;

-- 그 다음 부모 테이블들 삭제
DROP TABLE IF EXISTS Category;
DROP TABLE IF EXISTS User; 