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

    // 장비 사용자 DB 등록
    public Device registerDeviceUser(Device device) {
        // 일련번호로 장비 검색
        Device existing = deviceMapper.findBySerialNumber(device.getSerialNumber());
        if (existing == null) {
            throw new RuntimeException("해당 일련번호의 장치를 찾을 수 없습니다.");
        }

        // DB 업데이트
        deviceMapper.updateDeviceUser(device);

        // 최신 데이터 반환
        return deviceMapper.findBySerialNumber(device.getSerialNumber());
    }

    // 장비 DB 삭제
    public void deleteDeviceBySerial(String serialNumber) {
        int deleted = deviceMapper.deleteBySerialNumber(serialNumber);
        if (deleted == 0) {
            throw new RuntimeException("장치가 삭제되지 않았습니다: " + serialNumber);
        }
    }
}
