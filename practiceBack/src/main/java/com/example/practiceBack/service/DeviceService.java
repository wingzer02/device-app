package com.example.practiceBack.service;

import com.example.practiceBack.dto.Device;
import com.example.practiceBack.mapper.DeviceMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DeviceService {

    @Autowired
    private final DeviceMapper deviceMapper;

    public DeviceService(DeviceMapper deviceMapper) {
        this.deviceMapper = deviceMapper;
    }

    // 장비 DB 전부 검색
    public List<Device> findAll() {
        return deviceMapper.findAll();
    }

    // 장비 DB 추가
    public void addDevice(Device device) {
        deviceMapper.insertDevice(device);
    }

    // 장비 DB 삭제
    public void deleteDeviceBySerial(String serialNumber) {
        deviceMapper.deleteBySerialNumber(serialNumber);
    }
}
