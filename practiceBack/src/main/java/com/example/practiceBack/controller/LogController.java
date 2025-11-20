package com.example.practiceBack.controller;

import com.example.practiceBack.dto.Log;
import com.example.practiceBack.service.LogService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/logs")
public class LogController {

    private final LogService logService;

    public LogController(LogService logService) {
        this.logService = logService;
    }

    @GetMapping
    public List<Log> getAllLogs() {
        return logService.findAll();
    }

    @GetMapping("/{assetSerialNumber}")
    public Log getLog(@PathVariable String assetSerialNumber) {
        return logService.getLog(assetSerialNumber);
    }

    @PutMapping("/{assetSerialNumber}")
    public void updateLog(@PathVariable String assetSerialNumber, @RequestBody Log log) {
        log.setAssetSerialNumber(assetSerialNumber);
        logService.updateLog(log);
    }
}
