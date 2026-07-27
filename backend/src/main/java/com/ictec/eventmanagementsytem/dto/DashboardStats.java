package com.ictec.eventmanagementsytem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStats {

    private long totalEvents;

    private long approvedEvents;

    private long totalRegistrations;

    private long totalStudents;
}