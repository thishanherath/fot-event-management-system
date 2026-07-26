package com.ictec.eventmanagementsytem.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;



@Entity
@Table(name = "registrations")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class Registration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id")
    @JsonIgnoreProperties({"events", "password"})
    private User student;

    @ManyToOne
    @JoinColumn(name = "event_id")
    @JsonIgnoreProperties({"registrations"})
    private Event event;

    private LocalDateTime registeredAt;

}
