package edu.sm.controller;

import edu.sm.service.CustService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/test")
public class DbTestController {

    @Autowired
    private DataSource dataSource;

    @Autowired
    private CustService custService;

    // 데이터베이스 연결 테스트
    @GetMapping("/db-connection")
    public Map<String, Object> testDbConnection() {
        Map<String, Object> result = new HashMap<>();
        
        try (Connection connection = dataSource.getConnection()) {
            DatabaseMetaData metaData = connection.getMetaData();
            
            result.put("success", true);
            result.put("message", "데이터베이스 연결 성공!");
            result.put("database", metaData.getDatabaseProductName());
            result.put("version", metaData.getDatabaseProductVersion());
            result.put("url", metaData.getURL());
            result.put("username", metaData.getUserName());
            
            // 테이블 목록 조회
            List<String> tables = new ArrayList<>();
            ResultSet tableResult = metaData.getTables(null, null, "%", new String[]{"TABLE"});
            while (tableResult.next()) {
                tables.add(tableResult.getString("TABLE_NAME"));
            }
            result.put("tables", tables);
            
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "데이터베이스 연결 실패: " + e.getMessage());
            result.put("error", e.toString());
        }
        
        return result;
    }

    // User 테이블 데이터 조회 테스트
    @GetMapping("/user-data")
    public Map<String, Object> testUserData() {
        Map<String, Object> result = new HashMap<>();
        
        try {
            List<edu.sm.dto.User> users = custService.selectAll();
            result.put("success", true);
            result.put("message", "User 테이블 조회 성공!");
            result.put("userCount", users.size());
            result.put("users", users);
            
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "User 테이블 조회 실패: " + e.getMessage());
            result.put("error", e.toString());
        }
        
        return result;
    }

    // 특정 사용자 조회 테스트
    @GetMapping("/user/{userId}")
    public Map<String, Object> testUserSelect(@PathVariable String userId) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            edu.sm.dto.User user = custService.select(userId);
            if (user != null) {
                result.put("success", true);
                result.put("message", "사용자 조회 성공!");
                result.put("user", user);
            } else {
                result.put("success", false);
                result.put("message", "사용자를 찾을 수 없습니다: " + userId);
            }
            
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "사용자 조회 실패: " + e.getMessage());
            result.put("error", e.toString());
        }
        
        return result;
    }
} 