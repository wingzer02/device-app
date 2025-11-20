package com.example.practiceBack.mapper;

import com.example.practiceBack.dto.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface UserMapper {

    List<User> findAll();

    List<User> findAllAdminPage();

    // 회원가입
    void insertUser(User user);

    // 사용자 정보 갱신
    void updateUser(User user);

    // 사용자 조회
    User findByUserid(String userid);

    // 회원탈퇴
    void deleteUser(String userid);

    // 사용자 권한 갱신
    void updateRole(User user);

    // 관리자 신청 플래그 갱신
    void updateAdminRequest(User user);

    // 리프레시 토큰 갱신
    void updateRefreshToken(@Param("userid") String userid, @Param("refreshToken") String refreshToken);
}
