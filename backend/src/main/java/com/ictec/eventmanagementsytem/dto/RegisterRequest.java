package com.ictec.eventmanagementsytem.dto;
import com.ictec.eventmanagementsytem.entity.Role;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private Role role;
}
