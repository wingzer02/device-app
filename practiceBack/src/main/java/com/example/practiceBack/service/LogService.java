package com.example.practiceBack.service;

import com.example.practiceBack.dto.Log;
import com.example.practiceBack.mapper.LogMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LogService {

    private final LogMapper logMapper;

    public LogService(LogMapper logMapper) {
        this.logMapper = logMapper;
    }

    public List<Log> findAll() {
        return logMapper.findAll();
    }

    public Log getLog(String assetSerialNumber) {
        return logMapper.findByAssetSerialNumber(assetSerialNumber);
    }

    public void updateLog(Log log) {
        logMapper.updateLog(log);
    }
}
