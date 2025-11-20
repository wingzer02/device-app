package com.example.practiceBack.service;

import com.example.practiceBack.dto.Asset;
import com.example.practiceBack.dto.Device;
import com.example.practiceBack.mapper.AssetMapper;
import com.example.practiceBack.mapper.DeviceMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class DeviceService {

    @Autowired
    private final DeviceMapper deviceMapper;
    private final AssetMapper assetMapper;

    public DeviceService(DeviceMapper deviceMapper, AssetMapper assetMapper) {
        this.deviceMapper = deviceMapper;
        this.assetMapper = assetMapper;
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
        String assetSn = assetMapper.findAssetSnByDeviceSn(serialNumber);
        if (assetSn != null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, assetSn);
        }
        deviceMapper.deleteBySerialNumber(serialNumber);
    }
}
