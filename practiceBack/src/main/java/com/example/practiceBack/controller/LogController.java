package com.example.practiceBack.controller;

import com.example.practiceBack.dto.Log;
import com.example.practiceBack.service.LogService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/logs")
public class LogController {

    private final LogService logService;

    public LogController(LogService logService) {
        this.logService = logService;
    }

    // 로그 전체 조회
    @GetMapping
    public List<Log> getAllLogs() {
        return logService.findAll();
    }

    // 해당 자산 관련번호 로그 조회
    @GetMapping("/{assetSerialNumber}")
    public Log getLog(@PathVariable String assetSerialNumber) {
        return logService.getLog(assetSerialNumber);
    }

    // 로그 갱신
    @PutMapping("/{assetSerialNumber}")
    public void updateLog(@PathVariable String assetSerialNumber, @Valid @RequestBody Log log) {
        log.setAssetSerialNumber(assetSerialNumber);
        logService.updateLog(log);
    }
}
