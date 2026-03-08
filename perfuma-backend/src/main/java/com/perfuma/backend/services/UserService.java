package com.perfuma.backend.services;

import com.perfuma.backend.dto.LoginRequest;
import com.perfuma.backend.models.User;
import com.perfuma.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User register(User user) {
        if (user.getRole() == null || user.getRole().isBlank()) {
            user.setRole("CUS");
        }
        return userRepository.save(user);
    }

    public Optional<User> login(LoginRequest loginRequest) {
        return userRepository.findByEmail(loginRequest.getEmail())
                .filter(user -> user.getPassword().equals(loginRequest.getPassword()));
    }
}
