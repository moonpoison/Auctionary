package edu.sm.repository;

import edu.sm.dto.User;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface AccountRepository {
    
    void insert(User user) throws Exception;
    
    void update(User user) throws Exception;
    
    void delete(String userId) throws Exception;
    
    List<User> selectAll() throws Exception;
    
    User select(String userId) throws Exception;
}
