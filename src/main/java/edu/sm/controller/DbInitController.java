package edu.sm.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("/api/db")
public class DbInitController {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @PostMapping("/init")
    public String initializeDatabase() {
        try {
            // 기존 테이블 삭제
            dropTables();
            
            // 새로운 스키마 생성
            createTables();
            
            // 샘플 데이터 삽입
            insertSampleData();
            
            return "데이터베이스 초기화가 완료되었습니다.";
            
        } catch (Exception e) {
            return "데이터베이스 초기화 중 오류가 발생했습니다: " + e.getMessage();
        }
    }
    
    private void dropTables() {
        // 외래키 제약조건 때문에 순서 중요
        String[] dropQueries = {
            "DROP TABLE IF EXISTS Review",
            "DROP TABLE IF EXISTS Chat_History", 
            "DROP TABLE IF EXISTS Chat",
            "DROP TABLE IF EXISTS Wishlist",
            "DROP TABLE IF EXISTS Bid",
            "DROP TABLE IF EXISTS Trade_History",
            "DROP TABLE IF EXISTS Point_History",
            "DROP TABLE IF EXISTS Point_Transaction",
            "DROP TABLE IF EXISTS Answer",
            "DROP TABLE IF EXISTS Inquiry",
            "DROP TABLE IF EXISTS Product",
            "DROP TABLE IF EXISTS Category",
            "DROP TABLE IF EXISTS User"
        };
        
        for (String query : dropQueries) {
            jdbcTemplate.execute(query);
        }
    }
    
    private void createTables() throws IOException {
        // database_setup_complete.sql 파일 읽기
        ClassPathResource resource = new ClassPathResource("database_setup_complete.sql");
        String sql = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
        
        // CREATE TABLE 문들만 실행
        String[] createStatements = sql.split(";");
        for (String statement : createStatements) {
            String trimmed = statement.trim();
            if (trimmed.startsWith("CREATE TABLE") || trimmed.startsWith("--")) {
                if (!trimmed.startsWith("--")) {
                    jdbcTemplate.execute(trimmed);
                }
            }
        }
    }
    
    private void insertSampleData() {
        // 사용자 데이터
        jdbcTemplate.execute("INSERT INTO User (user_id, password, name, birth_date, phone_number, email, role) VALUES ('hero', 'demo', 'AuctionHero', '1990-01-01', '010-1234-5678', 'hero@auctionary.com', 'user')");
        jdbcTemplate.execute("INSERT INTO User (user_id, password, name, birth_date, phone_number, email, role) VALUES ('vtech', 'demo', 'V-Tech', '1985-05-15', '010-2345-6789', 'vtech@auctionary.com', 'user')");
        jdbcTemplate.execute("INSERT INTO User (user_id, password, name, birth_date, phone_number, email, role) VALUES ('timemaster', 'demo', 'TimeMaster', '1988-12-25', '010-3456-7890', 'timemaster@auctionary.com', 'user')");
        jdbcTemplate.execute("INSERT INTO User (user_id, password, name, birth_date, phone_number, email, role) VALUES ('collector', 'demo', 'Collector', '1992-08-10', '010-4567-8901', 'collector@auctionary.com', 'user')");
        jdbcTemplate.execute("INSERT INTO User (user_id, password, name, birth_date, phone_number, email, role) VALUES ('admin', 'admin123', '관리자', '1980-01-01', '010-0000-0000', 'admin@auctionary.com', 'admin')");
        
        // 카테고리 데이터
        jdbcTemplate.execute("INSERT INTO Category (category_name, parent_id) VALUES ('전자기기', NULL)");
        jdbcTemplate.execute("INSERT INTO Category (category_name, parent_id) VALUES ('의류', NULL)");
        jdbcTemplate.execute("INSERT INTO Category (category_name, parent_id) VALUES ('도서', NULL)");
        jdbcTemplate.execute("INSERT INTO Category (category_name, parent_id) VALUES ('스포츠', NULL)");
        jdbcTemplate.execute("INSERT INTO Category (category_name, parent_id) VALUES ('컬렉션', NULL)");
        
        // 상품 데이터
        jdbcTemplate.execute("INSERT INTO Product (user_id, product_name, description, image_path, category_id, auction_start_date, auction_end_date, starting_price, bid_unit, transaction_status) VALUES ('timemaster', '빈티지 롤렉스 서브마리너', '1980년대 빈티지 롤렉스 서브마리너입니다.', '/images/rolex.jpg', 5, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 8000000, 100000, 'AUCTIONING')");
        jdbcTemplate.execute("INSERT INTO Product (user_id, product_name, description, image_path, category_id, auction_start_date, auction_end_date, starting_price, bid_unit, transaction_status) VALUES ('hero', '레트로 게임기 슈퍼 패미컴', '레트로 게임기 슈퍼 패미컴 신품급입니다.', '/images/super-famicom.jpg', 1, NOW(), DATE_ADD(NOW(), INTERVAL 5 DAY), 200000, 10000, 'AUCTIONING')");
        
        // 포인트 기록 데이터
        jdbcTemplate.execute("INSERT INTO Point_History (user_id, action_type, point_change, final_point, change_date, note) VALUES ('hero', 'CHARGE', 10000000, 10000000, NOW(), '초기 포인트 충전')");
        jdbcTemplate.execute("INSERT INTO Point_History (user_id, action_type, point_change, final_point, change_date, note) VALUES ('collector', 'CHARGE', 5000000, 5000000, NOW(), '초기 포인트 충전')");
        jdbcTemplate.execute("INSERT INTO Point_History (user_id, action_type, point_change, final_point, change_date, note) VALUES ('timemaster', 'CHARGE', 8000000, 8000000, NOW(), '초기 포인트 충전')");
        jdbcTemplate.execute("INSERT INTO Point_History (user_id, action_type, point_change, final_point, change_date, note) VALUES ('vtech', 'CHARGE', 3000000, 3000000, NOW(), '초기 포인트 충전')");
    }
} 