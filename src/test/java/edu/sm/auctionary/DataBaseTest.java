package edu.sm.auctionary;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootTest
@Slf4j
class DataBaseTest {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    @PostConstruct
    public void testConnection() {
        try {
            String result = jdbcTemplate.queryForObject("select final_point from point_history where user_id='user01' order by change_date desc limit 1;", String.class);
            System.out.println("✅ DB 연결 성공: 현재 시간 = " + result);
        } catch (Exception e) {
            System.err.println("❌ DB 연결 실패: " + e.getMessage());
            e.printStackTrace();
        }
    }

}
