package edu.sm.service;

import edu.sm.dto.User;
import edu.sm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User getUserById(String userId) {
        return userRepository.select(userId);
    }
}