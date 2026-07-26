package com.ictec.eventmanagementsytem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardStats {

    private long totalEvents;

    private long approvedEvents;

    private long totalRegistrations;
}