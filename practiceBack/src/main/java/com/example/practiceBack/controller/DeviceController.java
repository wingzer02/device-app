package com.example.practiceBack.controller;

import com.example.practiceBack.dto.Device;
import com.example.practiceBack.service.DeviceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/devices")
@CrossOrigin(origins = "http://localhost:3000")
public class DeviceController {
    private final DeviceService deviceService;

    public DeviceController(DeviceService deviceService) {
        this.deviceService = deviceService;
    }

    // 장치 전체 조회
    @GetMapping
    public List<Device> getAllDevices() {
        return deviceService.findAll();
    }

    // 장치 추가
    @PostMapping
    public void addDevice(@RequestBody Device device) {
        deviceService.addDevice(device);
    }

    // 장치 사용자 등록
    @PostMapping("/register")
    public ResponseEntity<?> registerDeviceUser(@RequestBody Device device) {
        Device updated = deviceService.registerDeviceUser(device);
        return ResponseEntity.ok(updated);
    }

    // 장치 삭제
    @DeleteMapping("/{serialNumber}")
    public ResponseEntity<?> deleteDevice(@PathVariable String serialNumber) {
        deviceService.deleteDeviceBySerial(serialNumber);
        return ResponseEntity.ok().build();
    }
}
