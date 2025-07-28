package edu.sm.service;

import edu.sm.dto.User;
import edu.sm.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AccountService {

    final AccountRepository accountRepository;

    public void insert(User user) throws Exception {
        accountRepository.insert(user);
    }

    public void update(User user) throws Exception {
        accountRepository.update(user);
    }

    public void delete(String userId) throws Exception {
        accountRepository.delete(userId);
    }

    public List<User> selectAll() throws Exception {
        return accountRepository.selectAll();
    }

    public User select(String userId) throws Exception {
        return accountRepository.select(userId);
    }
}
