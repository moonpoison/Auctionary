package edu.sm.repository;

import edu.sm.dto.User;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Mapper
public interface UserRepository {
    User select(String userId);
    List<User> selectAll();
    void insert(User user);
    void update(User user);
    void delete(String userId);
    User selectByEmail(String email);
}