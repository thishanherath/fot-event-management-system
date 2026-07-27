package com.ictec.eventmanagementsytem.controller;

import com.ictec.eventmanagementsytem.dto.DashboardStats;
import com.ictec.eventmanagementsytem.dto.EventRequest;
import com.ictec.eventmanagementsytem.entity.Event;
import com.ictec.eventmanagementsytem.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor

public class EventController {
    private final EventService eventService;

    @PreAuthorize("hasRole('ORGANIZER') or hasRole('ADMIN')")
    @PostMapping
    public Event createEvent(@RequestBody EventRequest request, Authentication authentication) {
        return eventService.createEvent(request, authentication.getName());
    }

    @GetMapping
    public List<Event> getAllEvents() {
        return eventService.getAllEvents();
    }

    @GetMapping("/{id}")
    public Event getEventById(@PathVariable long id) {
        return eventService.getEventById(id);
    }

    @PreAuthorize("hasRole('ORGANIZER') or hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public String deleteEventById(@PathVariable long id, Authentication authentication) {
        eventService.deleteEventById(id, authentication.getName());
        return "Event deleted successfully";
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public Event approveEvent(@PathVariable Long id) {
        return eventService.approveEvent(id);
    }

    @PreAuthorize("hasRole('ORGANIZER') or hasRole('ADMIN')")
    @PutMapping("/{id}")
    public Event updateEvent(@PathVariable Long id, @RequestBody EventRequest request, Authentication authentication) {
        return eventService.updateEvent(id, request, authentication.getName());
    }

    @GetMapping("/my")
    public List<Event> getMyEvents(Authentication authentication) {
        return eventService.getMyEvents(authentication.getName());
    }

    @GetMapping("/dashboard/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public DashboardStats getDashboardStats() {
        return eventService.getDashboardStats();
    }
}
