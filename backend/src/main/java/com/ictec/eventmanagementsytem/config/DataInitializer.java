package com.ictec.eventmanagementsytem.config;

import com.ictec.eventmanagementsytem.entity.Event;
import com.ictec.eventmanagementsytem.entity.EventStatus;
import com.ictec.eventmanagementsytem.entity.Role;
import com.ictec.eventmanagementsytem.entity.User;
import com.ictec.eventmanagementsytem.repository.EventRepository;
import com.ictec.eventmanagementsytem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Initialize Default Admin if not present
        User adminUser = userRepository.findByEmail("admin@fot.edu").orElseGet(() -> {
            User admin = new User();
            admin.setName("University Administrator");
            admin.setEmail("admin@fot.edu");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            return userRepository.save(admin);
        });

        // Initialize Sample Students if not present (Students registered by Admin)
        if (!userRepository.existsByEmail("john@fot.edu")) {
            User student1 = new User();
            student1.setName("John Doe (Student)");
            student1.setEmail("john@fot.edu");
            student1.setPassword(passwordEncoder.encode("student123"));
            student1.setRole(Role.STUDENT);
            userRepository.save(student1);
        }

        if (!userRepository.existsByEmail("emily@fot.edu")) {
            User student2 = new User();
            student2.setName("Emily Watson (Student)");
            student2.setEmail("emily@fot.edu");
            student2.setPassword(passwordEncoder.encode("student123"));
            student2.setRole(Role.STUDENT);
            userRepository.save(student2);
        }

        // Initialize Sample Events if database is empty
        if (eventRepository.count() == 0) {
            Event event1 = new Event();
            event1.setTitle("Annual FOT Tech Symposium 2026");
            event1.setDescription("Join us for the premier Faculty of Technology symposium featuring guest talks on AI, IoT, and Cloud computing.");
            event1.setLocation("Main Auditorium, FOT Campus");
            event1.setEventDate(LocalDateTime.now().plusDays(10));
            event1.setCapacity(150);
            event1.setStatus(EventStatus.APPROVED);
            event1.setCreatedBy(adminUser);
            eventRepository.save(event1);

            Event event2 = new Event();
            event2.setTitle("AI & Machine Learning Bootcamp");
            event2.setDescription("Hands-on practical workshop covering deep learning models and agentic AI systems.");
            event2.setLocation("Computer Lab 3");
            event2.setEventDate(LocalDateTime.now().plusDays(15));
            event2.setCapacity(50);
            event2.setStatus(EventStatus.APPROVED);
            event2.setCreatedBy(adminUser);
            eventRepository.save(event2);

            Event event3 = new Event();
            event3.setTitle("University Inter-Faculty Hackathon");
            event3.setDescription("24-hour coding hackathon with exciting cash prizes and internship opportunities.");
            event3.setLocation("Innovation Center");
            event3.setEventDate(LocalDateTime.now().plusDays(20));
            event3.setCapacity(100);
            event3.setStatus(EventStatus.APPROVED);
            event3.setCreatedBy(adminUser);
            eventRepository.save(event3);

            Event event4 = new Event();
            event4.setTitle("Robotics & Drone Expo");
            event4.setDescription("Showcase of student-built autonomous robotics and drone flight demonstrations.");
            event4.setLocation("Open Courtyard");
            event4.setEventDate(LocalDateTime.now().plusDays(25));
            event4.setCapacity(80);
            event4.setStatus(EventStatus.PENDING_APPROVAL);
            event4.setCreatedBy(adminUser);
            eventRepository.save(event4);
        }
    }
}
