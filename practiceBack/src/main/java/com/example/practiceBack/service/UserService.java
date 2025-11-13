package com.example.practiceBack.service;

import com.example.practiceBack.dto.User;
import com.example.practiceBack.dto.LoginRequest;
import com.example.practiceBack.mapper.UserMapper;
import com.example.practiceBack.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
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

        if (!user.getPassword().equals(req.getPassword())) {
            throw new RuntimeException("잘못된 비밀번호입니다.");
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

    // 사용자 전체 조회
    public List<User> findAll() {
        return userMapper.findAll();
    }

    // 사용자 정보 조회
    public User findByUserid(String userid) {
        return userMapper.findByUserid(userid);
    }

    // 사용자 정보 갱신
    public void updateUser(User user) {
        userMapper.updateUser(user);
    }

    // 사용자 삭제
    public void deleteUser(String userid) {
        userMapper.deleteUser(userid);
    }

    // 사용자 권한 갱신
    public void updateRole(User user) {
        userMapper.updateRole(user);
    }

    // 프로필 이미지 업로드
    public String storeProfileImage(MultipartFile file, String userid) throws IOException {
        String uploadRoot = "C:/myapp/uploads";
        if (file == null || file.isEmpty()) {
            return null;
        }

        // 확장자 처리
        String ext = ".jpg";
        String orig = file.getOriginalFilename();
        if (orig != null && orig.contains(".")) {
            String e = orig.substring(orig.lastIndexOf('.')).toLowerCase();
            if (e.equals(".jpg") || e.equals(".jpeg") || e.equals(".png")){
                ext = ".jpg";
            }
        }

        Path dir = Paths.get(uploadRoot, "profile");
        Files.createDirectories(dir);

        String filename = userid + "_" + System.currentTimeMillis() + ext;
        Path dest = dir.resolve(filename);
        file.transferTo(dest.toFile());

        return "/uploads/profile/" + filename;
    }

    public Map<String, String> reissueTokens(String refreshToken) {
        String userid = jwtUtil.extractUserid(refreshToken);

        String newAccess = jwtUtil.generateAccessToken(userid);
        String newRefresh = jwtUtil.generateRefreshToken(userid);

        userMapper.updateRefreshToken(userid, newRefresh);

        Map<String, String> res = new HashMap<>();
        res.put("accessToken", newAccess);
        res.put("refreshToken", newRefresh);
        return res;
    }
}
