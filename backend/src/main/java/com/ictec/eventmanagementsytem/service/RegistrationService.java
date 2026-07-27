package com.ictec.eventmanagementsytem.service;

import com.ictec.eventmanagementsytem.entity.*;
import com.ictec.eventmanagementsytem.repository.*;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public Registration registerForEvent(Long eventId, String email) {

        User student = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        Event event = eventRepository.findById(eventId).orElseThrow(() -> new RuntimeException("Event not found"));

        if (event.getStatus() != EventStatus.APPROVED) {
            throw new RuntimeException(
                    "This event is not approved"
            );
        }

        boolean alreadyRegistered = registrationRepository.existsByStudentIdAndEventId(student.getId(), eventId);

        if (alreadyRegistered) {
            throw new RuntimeException(
                    "Already registered for this event"
            );
        }

        long currentRegistrations = registrationRepository.countByEventId(eventId);

        if (currentRegistrations >= event.getCapacity()) {
            throw new RuntimeException(
                    "Event capacity reached"
            );
        }

        Registration registration = new Registration();

        registration.setStudent(student);

        registration.setEvent(event);

        registration.setRegisteredAt(LocalDateTime.now());

        return registrationRepository.save(registration);
    }

    public List<Registration> getMyRegistrations(String email) {

        User student = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        return registrationRepository.findByStudentId(student.getId());
    }

    public List<Registration> getEventParticipants(Long eventId) {

        return registrationRepository.findByEventId(eventId);
    }

    public void cancelRegistration(Long registrationId, String email) {
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new RuntimeException("Registration not found"));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!registration.getStudent().getEmail().equals(email) && user.getRole() != Role.ADMIN) {
            throw new RuntimeException("You can only cancel your own registrations");
        }

        registrationRepository.delete(registration);
    }

}
