-- Chat_History 테이블에 read 컬럼 추가
ALTER TABLE Chat_History ADD COLUMN `read` BOOLEAN NOT NULL DEFAULT FALSE;

-- 기존 데이터의 read 값을 FALSE로 설정
UPDATE Chat_History SET `read` = FALSE WHERE `read` IS NULL; 