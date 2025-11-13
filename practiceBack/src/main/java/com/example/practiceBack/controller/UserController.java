package com.example.practiceBack.controller;

import com.example.practiceBack.dto.User;
import com.example.practiceBack.dto.LoginRequest;
import com.example.practiceBack.service.UserService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
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
    public void insert(@RequestBody User user) {
        userService.register(user);
    }

    // 로그인
    @PostMapping("/login")
    public Map<String, String> login(@RequestBody LoginRequest req) {
        return userService.login(req);
    }

    // 사용자 정보 조회
    @GetMapping("/{userid}")
    public User getByUserid(@PathVariable String userid) {
        return userService.findByUserid(userid);
    }

    // 사용자 정보 갱신
    @PutMapping("/{userid}")
    public User update(@PathVariable String userid,
                       @RequestPart("user") User user,
                       @RequestPart(value = "file", required = false)MultipartFile file) throws Exception {

        user.setUserid(userid);

        String url = userService.storeProfileImage(file, userid);
        if (url != null) {
            user.setPhotoUrl(url);
        }
        userService.updateUser(user);
        return userService.findByUserid(userid);
    }

    // 사용자 정보 삭제
    @PostMapping("/{userid}")
    public void deleteUser(@PathVariable String userid) {
        userService.deleteUser(userid);
    }

    // 사용자 권한 갱신
    @PostMapping("/updateRole")
    public void updateRole(@RequestBody User user) {
        userService.updateRole(user);
    }

    // 토큰 재발급 (미완성_테스트중)
    @PostMapping("/reissue")
    public Map<String, String> reissue(@RequestBody Map<String, String> body) {
        String refreshToken = body.get("refreshToken");
        return userService.reissueTokens(refreshToken);
    }
}
