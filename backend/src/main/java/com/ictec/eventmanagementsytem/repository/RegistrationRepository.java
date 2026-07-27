package com.ictec.eventmanagementsytem.repository;

import com.ictec.eventmanagementsytem.entity.Registration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    boolean existsByStudentIdAndEventId(Long studentId, Long eventId);
    List<Registration> findByStudentId(Long studentId);
    List<Registration> findByEventId(Long eventId);
    long countByEventId(Long eventId);
    long count();
}
