package com.example.practiceBack.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class User {
    private String userid;
    private String name;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY) // 단방향 설정
    private String password;
    private String email;
    private String refreshToken;
    private String photoUrl;
    private String role;
    private String roleName;
    private boolean delFlg;
    private boolean adminRequestFlg;
}
