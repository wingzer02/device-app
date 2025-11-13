package com.example.practiceBack.dto;

import lombok.Data;

@Data
public class User {
    private String userid;
    private String name;
    private String password;
    private String email;
    private String refreshToken;
    private String photoUrl;
    private String role;
    private String roleName;
    private boolean delFlg;
}
