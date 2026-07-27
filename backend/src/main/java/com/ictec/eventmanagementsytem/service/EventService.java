package com.ictec.eventmanagementsytem.service;

import com.ictec.eventmanagementsytem.dto.EventRequest;
import com.ictec.eventmanagementsytem.entity.Event;
import com.ictec.eventmanagementsytem.entity.EventStatus;
import com.ictec.eventmanagementsytem.entity.User;
import com.ictec.eventmanagementsytem.repository.EventRepository;
import com.ictec.eventmanagementsytem.repository.RegistrationRepository;
import com.ictec.eventmanagementsytem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.ictec.eventmanagementsytem.dto.DashboardStats;

import java.util.List;

@Service
@RequiredArgsConstructor

public class EventService {
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final RegistrationRepository registrationRepository;

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

    public void deleteEventById(Long id, String email) {
        Event event = getEventById(id);
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        if (!event.getCreatedBy().getEmail().equals(email) && user.getRole() != com.ictec.eventmanagementsytem.entity.Role.ADMIN) {
            throw new RuntimeException(
                    "You can only delete your own events"
            );
        }
        eventRepository.delete(event);
    }

    public Event approveEvent(Long id) {
        Event event = eventRepository.findById(id).orElseThrow(() -> new RuntimeException("Event not found"));
        event.setStatus(EventStatus.APPROVED);
        return eventRepository.save(event);
    }

    public Event rejectEvent(Long id) {
        Event event = eventRepository.findById(id).orElseThrow(() -> new RuntimeException("Event not found"));
        event.setStatus(EventStatus.REJECTED);
        return eventRepository.save(event);
    }

    public Event updateEvent(Long eventId, EventRequest request, String email) {
        Event event = eventRepository.findById(eventId).orElseThrow(() -> new RuntimeException("Event not found"));

        if (!event.getCreatedBy().getEmail().equals(email)) {
            throw new RuntimeException(
                    "You can only update your own events"
            );
        }

        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setLocation(request.getLocation());
        event.setEventDate(request.getEventDate());
        event.setCapacity(request.getCapacity());

        return eventRepository.save(event);
    }

    public List<Event> getMyEvents(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        return eventRepository.findByCreatedById(user.getId());
    }

    public DashboardStats getDashboardStats() {
        long totalEvents = eventRepository.count();
        long approvedEvents = eventRepository.countByStatus(EventStatus.APPROVED);
        long totalRegistrations = registrationRepository.count();

        return new DashboardStats(
                totalEvents,
                approvedEvents,
                totalRegistrations
        );

    }
}
