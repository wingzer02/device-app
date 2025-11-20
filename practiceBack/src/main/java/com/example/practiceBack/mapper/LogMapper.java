package com.example.practiceBack.mapper;

import com.example.practiceBack.dto.Log;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface LogMapper {
    List<Log> findAll();
    void insertLog(@Param("assetSerialNumber") String assetSerialNumber);
    Log findByAssetSerialNumber(@Param("assetSerialNumber") String assetSerialNumber);
    void updateLog(Log log);
}
