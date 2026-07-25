package com.ictec.eventmanagementsytem.repository;

import com.ictec.eventmanagementsytem.entity.Registration;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    boolean existsByStudentIdAndEventId(Long studentId, Long eventId);
}
