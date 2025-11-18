package com.example.practiceBack.mapper;

import com.example.practiceBack.dto.Asset;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AssetMapper {
    List<Asset> findAll();
    void insertAsset(Asset asset);
    void updateAsset(Asset asset);
    void deleteAsset(@Param("assetSerialNumber") String assetSerialNumber);
}
