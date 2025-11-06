package com.example.practiceBack.mapper;

import com.example.practiceBack.dto.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface UserMapper {

    List<User> findAll();

    // 회원가입
    void insertUser(User user);
    User findByUserid(String userid);

    void updateRefreshToken(@Param("userid") String userid, @Param("refreshToken") String refreshToken);
    User findByRefreshToken(String refreshToken);
}
