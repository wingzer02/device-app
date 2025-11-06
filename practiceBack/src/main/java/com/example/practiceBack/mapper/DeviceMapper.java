package com.example.practiceBack.mapper;

import com.example.practiceBack.dto.Device;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface DeviceMapper {
    List<Device> findAll();
    void insertDevice(Device device);
    Device findBySerialNumber(@Param("serialNumber") String serialNumber);
    void updateDeviceUser(Device device);
    int deleteBySerialNumber(@Param("serialNumber") String serialNumber);
}
