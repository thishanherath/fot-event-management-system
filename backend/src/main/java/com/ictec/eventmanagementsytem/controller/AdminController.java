package com.ictec.eventmanagementsytem.controller;

import com.ictec.eventmanagementsytem.dto.RegisterRequest;
import com.ictec.eventmanagementsytem.entity.User;
import com.ictec.eventmanagementsytem.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/students")
    public List<User> getAllStudents() {
        return adminService.getAllStudents();
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return adminService.getAllUsers();
    }

    @PostMapping("/students")
    public User registerStudent(@Valid @RequestBody RegisterRequest request) {
        return adminService.registerStudent(request);
    }

    @DeleteMapping("/students/{id}")
    public String deleteStudent(@PathVariable Long id) {
        adminService.deleteStudent(id);
        return "Student deleted successfully";
    }
}
