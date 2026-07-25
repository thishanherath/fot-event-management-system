package com.ictec.eventmanagementsytem.service;

import com.ictec.eventmanagementsytem.dto.EventRequest;
import com.ictec.eventmanagementsytem.entity.Event;
import com.ictec.eventmanagementsytem.entity.EventStatus;
import com.ictec.eventmanagementsytem.entity.User;
import com.ictec.eventmanagementsytem.repository.EventRepository;
import com.ictec.eventmanagementsytem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor

public class EventService {
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public Event createEvent(EventRequest request, String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        Event event = new Event();
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setLocation(request.getLocation());
        event.setEventDate(request.getEventDate());
        event.setCapacity(request.getCapacity());
        // New events need admin approval
        event.setStatus(EventStatus.PENDING_APPROVAL);
        event.setCreatedBy(user);
        return eventRepository.save(event);
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event getEventById(Long id) {
        return eventRepository.findById(id).orElseThrow(() -> new RuntimeException("Event not found"));
    }

    public void deleteEventById(Long id) {
        Event event = getEventById(id);
        eventRepository.delete(event);
    }
}
