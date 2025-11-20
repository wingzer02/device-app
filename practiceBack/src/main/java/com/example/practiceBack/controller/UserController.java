package com.example.practiceBack.controller;

import com.example.practiceBack.dto.User;
import com.example.practiceBack.dto.LoginRequest;
import com.example.practiceBack.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

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

    // 사용자 전체 조회(사용자 관리)
    @GetMapping("/admin")
    public List<User> listAllUsersAdmin(@AuthenticationPrincipal User currentUser) {
        if (currentUser == null || !"admin".equals(currentUser.getRole())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "관리자만 접근 가능합니다.");
        }
        return userService.findAllAdminPage();
    }

    // 회원가입
    @PostMapping("/register")
    public void insert(@RequestBody User user) {
        userService.register(user);
    }

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<Void> login(
            @RequestBody LoginRequest req,
            HttpServletResponse response
    ) {
        Map<String, String> tokens = userService.login(req);
        String accessToken = tokens.get("accessToken");
        String refreshToken = tokens.get("refreshToken");

        // access token 쿠키
        ResponseCookie accessCookie = ResponseCookie.from("accessToken", accessToken)
                .httpOnly(true)
                .path("/")
                .maxAge(10 * 60)
                .build();

        // refresh token 쿠키
        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .path("/")
                .maxAge(7 * 24 * 60 * 60)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

        return ResponseEntity.ok().build();
    }

    // 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        ResponseCookie deleteAccess = ResponseCookie.from("accessToken", "")
                .httpOnly(true)
                .path("/")
                .maxAge(0)
                .build();

        ResponseCookie deleteRefresh = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .path("/")
                .maxAge(0)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, deleteAccess.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, deleteRefresh.toString());

        return ResponseEntity.ok().build();
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
    @PostMapping("/update-role")
    public void updateRole(@RequestBody User user) {
        userService.updateRole(user);
    }

    // 관리자 권한 신청
    @PostMapping("/request-admin/{userid}")
    public void requestAdmin(@PathVariable String userid) {
        userService.requestAdmin(userid);
    }

    // 관리자 신청 승인
    @PostMapping("/approve-admin/{userid}")
    public void approveAdmin(@PathVariable String userid) {
        userService.approveAdmin(userid);
    }

    // 관리자 신청 취소
    @PostMapping("/cancel-admin/{userid}")
    public void cancelAdmin(@PathVariable String userid) {
        userService.cancelAdmin(userid);
    }

    // 토큰 재발급
    @PostMapping("/reissue")
    public ResponseEntity<?> reissue(
            @CookieValue(value = "refreshToken", required = false) String refreshToken,
            HttpServletResponse response
    ) {
        if (refreshToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("refresh token 이 없습니다.");
        }
        Map<String, String> tokens = userService.reissueTokens(refreshToken);

        String newAccess = tokens.get("accessToken");
        String newRefresh = tokens.get("refreshToken");

        ResponseCookie accessCookie = ResponseCookie.from("accessToken", newAccess)
                .httpOnly(true)
                .path("/")
                .maxAge(10 * 60)
                .sameSite("Lax")
                .build();

        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", newRefresh)
                .httpOnly(true)
                .path("/")
                .maxAge(7 * 24 * 60 * 60)
                .sameSite("Lax")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    public ResponseEntity<User> me(@AuthenticationPrincipal User user) {
        if (user == null) {
            // JWT 없거나, 만료/무효이면 401
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(user);
    }
}
