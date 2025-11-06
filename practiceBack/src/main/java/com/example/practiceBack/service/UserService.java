package com.example.practiceBack.service;

import com.example.practiceBack.dto.Device;
import com.example.practiceBack.dto.User;
import com.example.practiceBack.dto.LoginRequest;
import com.example.practiceBack.mapper.UserMapper;
import com.example.practiceBack.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserService {
    @Autowired
    private final UserMapper userMapper;
    private final JwtUtil jwtUtil;

    public UserService(UserMapper userMapper, JwtUtil jwtUtil) {
        this.userMapper = userMapper;
        this.jwtUtil = jwtUtil;
    }

    // 회원가입
    public void register(User user) {
        // 중복 검사
        if (userMapper.findByUserid(user.getUserid()) != null) {
            throw new RuntimeException("이미 존재하는 사용자명입니다.");
        }

        // DB 저장
        userMapper.insertUser(user);
    }

    // 로그인
    public Map<String, String> login(LoginRequest req) {
        // 이름으로 사용자 DB 검색
        User user = userMapper.findByUserid(req.getUserid());
        if (user == null) {
            throw new RuntimeException("존재하지 않는 사용자입니다.");
        }

        // 액세스토큰 생성
        String accessToken = jwtUtil.generateAccessToken(user.getUserid());
        // 리프레시토큰 생성
        String refreshToken = jwtUtil.generateRefreshToken(user.getUserid());
        // 리프레시토큰 DB 갱신
        userMapper.updateRefreshToken(user.getUserid(), refreshToken);

        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", accessToken);
        tokens.put("refreshToken", refreshToken);
        return tokens;
    }

    // 액세스토큰 갱신
    public Map<String, String> refreshAccessToken(String refreshToken) {
        // 리프레시토큰으로 사용자 DB 검색
        User user = userMapper.findByRefreshToken(refreshToken);
        if (user == null || jwtUtil.isTokenExpired(refreshToken)) {
            throw new RuntimeException("유효하지 않은 리프레시 토큰입니다.");
        }

        // 새로운 액세스토큰 생성
        String newAccessToken = jwtUtil.generateAccessToken(user.getUserid());
        Map<String, String> result = new HashMap<>();
        result.put("accessToken", newAccessToken);
        return result;
    }

    // 사용자 전체 조회
    public List<User> findAll() {
        return userMapper.findAll();
    }
}
