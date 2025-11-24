package com.example.practiceBack.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class Device {
    private Integer id;
    @NotBlank(message = "장비 일련번호는 필수입니다.")
    private String serialNumber;
    @Positive
    private Integer catId;
    private String catName;
    private String deviceName;
    private String company;
    @PastOrPresent(message = "구입일은 오늘 이전/오늘이어야 합니다.")
    private LocalDate purchaseDate;
}
