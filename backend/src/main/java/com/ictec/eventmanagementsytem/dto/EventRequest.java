package com.ictec.eventmanagementsytem.dto;


import lombok.Data;

import java.time.LocalDateTime;

@Data
public class EventRequest {
    private String title;
    private String description;
    private String location;
    private LocalDateTime eventDate;
    private Integer capacity;
}