package com.ictec.eventmanagementsytem.repository;

import com.ictec.eventmanagementsytem.entity.Event;
import com.ictec.eventmanagementsytem.entity.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByStatus(EventStatus status);

    List<Event> findByCreatedById(Long userId);
}
