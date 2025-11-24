package com.example.practiceBack.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class Role {
    @NotBlank
    private String roleId;
    @NotBlank
    private String roleName;
}
