package edu.sm.service;

import edu.sm.dto.User;
import edu.sm.repository.CustRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustService {

    final CustRepository custRepository;

    public void insert(User user) throws Exception {
        custRepository.insert(user);
    }

    public void update(User user) throws Exception {
        custRepository.update(user);
    }

    public void delete(String userId) throws Exception {
        custRepository.delete(userId);
    }

    public List<User> selectAll() throws Exception {
        return custRepository.selectAll();
    }

    public User select(String userId) throws Exception {
        return custRepository.select(userId);
    }
}
