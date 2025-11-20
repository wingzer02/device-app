package com.example.practiceBack.mapper;

import com.example.practiceBack.dto.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AssetUserMapper {
    List<User> findUsersByAssetSerialNumber(@Param("assetSerialNumber") String assetSerialNumber);
}
