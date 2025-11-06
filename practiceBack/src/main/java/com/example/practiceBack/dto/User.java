package com.example.practiceBack.dto;

import lombok.Data;

@Data
public class User {
    private String userid;
    private String name;
    private String password;
    private String email;
    private String createdAt;
    private String refreshToken;
}
