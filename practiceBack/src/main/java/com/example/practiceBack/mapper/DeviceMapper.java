package com.example.practiceBack.mapper;

import com.example.practiceBack.dto.Device;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface DeviceMapper {
    // 장비 전체 조회
    List<Device> findAll();
    // 장비 등록
    void insertDevice(Device device);
    // 장비 삭제
    void deleteBySerialNumber(@Param("serialNumber") String serialNumber);
    // 해당 장비 분류 조회
    int findCatIdBySerialNumber(@Param("serialNumber") String serialNumber);
}
