package com.example.practiceBack.controller;

import com.example.practiceBack.dto.User;
import com.example.practiceBack.dto.LoginRequest;
import com.example.practiceBack.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // 사용자 전체 조회
    @GetMapping
    public List<User> listAllUsers() {
        return userService.findAll();
    }

    // 회원가입
    @PostMapping("/register")
    public String insert(@RequestBody User user) {
        userService.register(user);
        return "회원가입 성공!";
    }

    // 로그인
    @PostMapping("/login")
    public Map<String, String> login(@RequestBody LoginRequest req) {
        return userService.login(req);
    }

    // 토큰갱신
    @PostMapping("/refresh")
    public Map<String, String> refresh(@RequestBody Map<String, String> req) {
        String refreshToken = req.get("refreshToken");
        return userService.refreshAccessToken(refreshToken);
    }
}
