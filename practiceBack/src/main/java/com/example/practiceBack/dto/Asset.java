package com.example.practiceBack.dto;

import lombok.Data;

import java.util.List;

@Data
public class Asset {
    private String assetSerialNumber;
    private String assetName;
    private String location;
    private String userid;
    private String userName;
    private List<String> userIds;
    private List<String> userNames;
    private String deviceSerialNumber;
    private String deviceName;
    private String startDate;
    private String endDate;
}
