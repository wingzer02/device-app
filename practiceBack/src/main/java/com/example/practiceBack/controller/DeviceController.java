package com.example.practiceBack.controller;

import com.example.practiceBack.dto.Device;
import com.example.practiceBack.service.DeviceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/devices")
public class DeviceController {
    private final DeviceService deviceService;

    public DeviceController(DeviceService deviceService) {
        this.deviceService = deviceService;
    }

    // 장비 전체 조회
    @GetMapping
    public List<Device> getAllDevices() {
        return deviceService.findAll();
    }

    // 장비 추가
    @PostMapping
    public void addDevice(@RequestBody Device device) {
        deviceService.addDevice(device);
    }

    // 장비 사용자 등록
    @PostMapping("/registerDeviceUser")
    public void registerDeviceUser(@RequestBody Device device) {
        deviceService.registerDeviceUser(device);
    }

    // 장비 삭제
    @DeleteMapping("/{serialNumber}")
    public void deleteDevice(@PathVariable String serialNumber) {
        deviceService.deleteDeviceBySerial(serialNumber);
    }
}
