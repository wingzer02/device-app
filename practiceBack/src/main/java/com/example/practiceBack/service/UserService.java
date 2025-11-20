package com.example.practiceBack.service;

import com.example.practiceBack.dto.User;
import com.example.practiceBack.dto.LoginRequest;
import com.example.practiceBack.mapper.AssetMapper;
import com.example.practiceBack.mapper.UserMapper;
import com.example.practiceBack.security.JwtUtil;
import io.jsonwebtoken.ExpiredJwtException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserService {

    private final UserMapper userMapper;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final AssetMapper assetMapper;

    public UserService(UserMapper userMapper, JwtUtil jwtUtil, PasswordEncoder passwordEncoder, AssetMapper assetMapper) {
        this.userMapper = userMapper;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
        this.assetMapper = assetMapper;
    }

    // 회원가입
    public void register(User user) {
        // 중복 검사
        if (userMapper.findByUserid(user.getUserid()) != null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "이미 존재하는 사용자명입니다.");
        }

        // 비밀번호 암호화
        String encodedPw = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPw);

        // DB 저장
        userMapper.insertUser(user);
    }

    // 로그인
    public Map<String, String> login(LoginRequest req) {
        // 이름으로 사용자 DB 검색
        User user = userMapper.findByUserid(req.getUserid());
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "존재하지 않는 사용자입니다.");
        }

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "잘못된 비밀번호입니다.");
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
    // 사용자 전체 조회(사용자 관리용)
    public List<User> findAllAdminPage() {
        return userMapper.findAllAdminPage();
    }

    // 사용자 정보 조회
    public User findByUserid(String userid) {
        return userMapper.findByUserid(userid);
    }

    // 사용자 정보 갱신
    public void updateUser(User user) {
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            String encodedPw = passwordEncoder.encode(user.getPassword());
            user.setPassword(encodedPw);
        } else {
            user.setPassword(null);
        }
        userMapper.updateUser(user);
    }

    // 사용자 삭제
    public void deleteUser(String userid) {
        assetMapper.clearUser(userid);
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

        Path dir = Paths.get(uploadRoot, "profile");
        Files.createDirectories(dir);

        String filename = userid + "_" + System.currentTimeMillis() + ".jpg";
        Path dest = dir.resolve(filename);
        file.transferTo(dest.toFile());

        return "/uploads/profile/" + filename;
    }

    // 토큰 재발급
    public Map<String, String> reissueTokens(String refreshToken) {
        try {

            // 토큰에서 사용자 아이디 추출 (만료면 여기서 예외 발생)
            String userid = jwtUtil.extractUserid(refreshToken);

            // DB에서 유저 정보 + 저장된 refresh 토큰 조회
            User user = userMapper.findByUserid(userid);

            if (user == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "존재하지 않는 사용자입니다.");
            }
            if (user.getRefreshToken() == null ||
                !user.getRefreshToken().equals(refreshToken)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "유효하지 않은 리프레시 토큰입니다.");
            }

            // 새 토큰 발급
            String newAccess = jwtUtil.generateAccessToken(userid);
            String newRefresh = jwtUtil.generateRefreshToken(userid);

            // DB에 새 리프레시 토큰 저장
            userMapper.updateRefreshToken(userid, newRefresh);

            Map<String, String> res = new HashMap<>();
            res.put("accessToken", newAccess);
            res.put("refreshToken", newRefresh);
            return res;
        } catch (ExpiredJwtException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "리프레시 토큰이 만료되었습니다. 다시 로그인해주세요.");
        }
    }
}
