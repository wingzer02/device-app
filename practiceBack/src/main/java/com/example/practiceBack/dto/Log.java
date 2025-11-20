package com.example.practiceBack.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class Log {
    private String assetSerialNumber;
    private String assetName;
    private String deviceSerialNumber;
    private String deviceName;
    private Integer cpuUsage;
    private Integer memoryUsage;
    private Integer diskUsage;
    private LocalDate checkDate;
}
