package com.ictec.eventmanagementsytem.service;

import com.ictec.eventmanagementsytem.dto.RegisterRequest;
import com.ictec.eventmanagementsytem.entity.Role;
import com.ictec.eventmanagementsytem.entity.User;
import com.ictec.eventmanagementsytem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public List<User> getAllStudents() {
        return userRepository.findByRole(Role.STUDENT);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User registerStudent(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists: " + request.getEmail());
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.STUDENT);

        return userRepository.save(user);
    }

    public void deleteStudent(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        if (user.getRole() == Role.ADMIN) {
            throw new RuntimeException("Cannot delete an ADMIN user");
        }
        userRepository.delete(user);
    }
}
