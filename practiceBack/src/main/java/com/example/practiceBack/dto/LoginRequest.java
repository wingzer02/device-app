package com.example.practiceBack.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class LoginRequest {
    @NotBlank(message = "아이디는 필수입니다.")
    private String userid;
    @NotBlank(message = "비밀번호는 필수입니다.")
    private String password;
}
