package com.example.practiceBack.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class Device {
    private Integer id;
    private String serialNumber;
    private Integer catId;
    private String catName;
    private String deviceName;
    private String company;
    private LocalDate purchaseDate;
}
