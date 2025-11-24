package com.example.practiceBack.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PastOrPresent;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class Log {
    @NotBlank
    private String assetSerialNumber;
    private String assetName;
    private String deviceSerialNumber;
    private String deviceName;
    @Min(value = 0, message = "CPU 사용률은 0 이상이어야 합니다.")
    @Max(value = 100, message = "CPU 사용률은 100 이하이어야 합니다.")
    private Integer cpuUsage;
    @Min(value = 0, message = "메모리 사용률은 0 이상이어야 합니다.")
    @Max(value = 100, message = "메모리 사용률은 100 이하이어야 합니다.")
    private Integer memoryUsage;
    @Min(value = 0, message = "디스크 사용률은 0 이상이어야 합니다.")
    @Max(value = 100, message = "디스크 사용률은 100 이하이어야 합니다.")
    private Integer diskUsage;
    @PastOrPresent(message = "점검일은 오늘 이전/오늘이어야 합니다.")
    private LocalDate checkDate;
}
