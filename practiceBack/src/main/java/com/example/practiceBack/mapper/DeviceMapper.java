package com.example.practiceBack.mapper;

import com.example.practiceBack.dto.Device;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface DeviceMapper {
    List<Device> findAll();
    void insertDevice(Device device);
    void deleteBySerialNumber(@Param("serialNumber") String serialNumber);
    int findCatIdBySerialNumber(@Param("serialNumber") String serialNumber);
}
