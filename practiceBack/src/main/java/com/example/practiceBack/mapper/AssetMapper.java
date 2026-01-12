package com.example.practiceBack.mapper;

import com.example.practiceBack.dto.Asset;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.security.core.parameters.P;

import java.util.List;

@Mapper
public interface AssetMapper {
    // 자산 전체 조회
    List<Asset> findAll();

    List<Asset> findPage(
            @Param("offset") int offset,
            @Param("limit") int limit,
            @Param("sortColumn") String sortColumn,
            @Param("sortDir") String sortDir
    );
    int countAll();
    // 자산 단건 조회
    Asset findBySerialNumber(@Param("assetSerialNumber") String assetSerialNumber);
    // 해당 장비 일련번호의 자산 관리 번호 조회
    String findAssetSnByDeviceSn(@Param("deviceSerialNumber") String deviceSerialNumber);
    // 자산 등록
    void insertAsset(Asset asset);
    // 자산 갱신
    void updateAsset(Asset asset);
    // 자산 삭제
    void deleteAsset(@Param("assetSerialNumber") String assetSerialNumber);
}
