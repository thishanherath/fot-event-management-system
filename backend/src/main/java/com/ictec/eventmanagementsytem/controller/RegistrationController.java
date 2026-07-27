package com.ictec.eventmanagementsytem.controller;

import com.ictec.eventmanagementsytem.entity.Registration;
import com.ictec.eventmanagementsytem.service.RegistrationService;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/registrations")
@RequiredArgsConstructor
public class RegistrationController {

    private final RegistrationService registrationService;

    @PostMapping("/event/{eventId}")
    public Registration registerForEvent(@PathVariable Long eventId, Authentication authentication) {

        return registrationService.registerForEvent(
                eventId,
                authentication.getName()
        );
    }

    @GetMapping("/my")
    public List<Registration> getMyRegistrations(Authentication authentication) {
        return registrationService.getMyRegistrations(
                authentication.getName()
        );
    }

    @GetMapping("/event/{eventId}")
    public List<Registration> getParticipants(@PathVariable Long eventId) {
        return registrationService.getEventParticipants(eventId);
    }

    @DeleteMapping("/{id}")
    public String cancelRegistration(@PathVariable Long id, Authentication authentication) {
        registrationService.cancelRegistration(id, authentication.getName());
        return "Registration cancelled successfully";
    }

}
