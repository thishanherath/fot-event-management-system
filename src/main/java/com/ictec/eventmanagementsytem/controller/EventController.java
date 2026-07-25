package com.ictec.eventmanagementsytem.controller;

import com.ictec.eventmanagementsytem.dto.EventRequest;
import com.ictec.eventmanagementsytem.entity.Event;
import com.ictec.eventmanagementsytem.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor

public class EventController {
    private final EventService eventService;

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

    @DeleteMapping("/{id}")
    public String deleteEventById(@PathVariable long id) {
        eventService.deleteEventById(id);
        return "Event deleted successfully";
    }
}
