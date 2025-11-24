package com.example.practiceBack.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class User {
    @NotBlank(message = "아이디는 필수입니다.")
    @Size(min = 4, max = 20, message = "아이디는 4~20자여야 합니다.")
    private String userid;
    @NotBlank(message = "이름은 필수입니다.")
    private String name;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY) // 단방향 설정
    @NotBlank(message = "비밀번호는 필수입니다.")
    private String password;
    @NotBlank(message = "이메일은 필수입니다.")
    @Email(message = "이메일 형식이 올바르지 않습니다.")
    private String email;
    private String refreshToken;
    private String photoUrl;
    private String role;
    private String roleName;
    private boolean delFlg;
    private boolean adminRequestFlg;
}
