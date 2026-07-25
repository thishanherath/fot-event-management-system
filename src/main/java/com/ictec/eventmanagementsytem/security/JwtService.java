package com.ictec.eventmanagementsytem.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;


import java.nio.charset.StandardCharsets;
import java.util.Date;



@Service
public class JwtService {


    private final String SECRET_KEY = "FOTEMS_SECRET_KEY_2026_EVENT_MANAGEMENT_SYSTEM";

    public String generateToken(String email){

        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(
                        new Date(
                                System.currentTimeMillis() + 86400000
                        )
                )
                .signWith(
                        Keys.hmacShaKeyFor(
                                SECRET_KEY.getBytes(
                                        StandardCharsets.UTF_8
                                )
                        )
                )
                .compact();
    }


    public String extractEmail(String token){

        return Jwts.parser()
                .verifyWith(
                        Keys.hmacShaKeyFor(
                                SECRET_KEY.getBytes(
                                        StandardCharsets.UTF_8
                                )
                        )
                )
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

}