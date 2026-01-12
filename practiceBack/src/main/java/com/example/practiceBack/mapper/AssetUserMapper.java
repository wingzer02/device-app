package com.example.practiceBack.mapper;

import com.example.practiceBack.dto.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AssetUserMapper {
    // 해당 자산 관리번호의 사용자 리스트 검색
    List<User> findUsersByAssetSerialNumber(@Param("assetSerialNumber") String assetSerialNumber);
    // 자산-사용자 삭제(해당 자산 관리번호)
    void deleteByAssetSerialNumber(@Param("assetSerialNumber") String assetSerialNumber);
    // 자산 사용자 등록
    void insertAssetUser(
            @Param("assetSerialNumber") String assetSerialNumber,
            @Param("userid") String userid
    );
    // 자산-사용자 삭제(해당 사용자 아이디)
    void deleteByUserId(@Param("userid") String userid);
}
