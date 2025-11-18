package com.example.practiceBack.dto;

import lombok.Data;

@Data
public class Asset {
    private String assetSerialNumber;
    private String assetName;
    private String location;
    private String userid;
    private String userName;
    private String deviceSerialNumber;
    private String startDate;
    private String endDate;
}
