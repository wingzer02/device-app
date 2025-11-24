package com.example.practiceBack.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class Asset {
    @NotBlank(message = "자산 관리코드는 필수입니다.")
    private String assetSerialNumber;
    @NotBlank(message = "자산명은 필수입니다.")
    private String assetName;
    private String location;
    private List<String> userIds;
    private List<String> userNames;
    private String deviceSerialNumber;
    private String deviceName;
    private String startDate;
    private String endDate;
}
