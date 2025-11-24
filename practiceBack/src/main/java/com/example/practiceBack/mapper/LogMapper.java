package com.example.practiceBack.mapper;

import com.example.practiceBack.dto.Log;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface LogMapper {
    // 로그 전체 조회
    List<Log> findAll();
    // 로그 등록
    void insertLog(@Param("assetSerialNumber") String assetSerialNumber);
    // 로그 단건 조회
    Log findByAssetSerialNumber(@Param("assetSerialNumber") String assetSerialNumber);
    // 로그 갱신
    void updateLog(Log log);
}
