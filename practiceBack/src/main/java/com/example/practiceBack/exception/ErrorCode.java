package com.example.practiceBack.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    USERID_DUPLICATE(HttpStatus.BAD_REQUEST, "USER_001", "이미 존재하는 사용자명입니다."),
    USER_NOT_FOUND(HttpStatus.BAD_REQUEST, "USER_002", "존재하지 않는 사용자입니다."),
    INVALID_PASSWORD(HttpStatus.BAD_REQUEST, "USER_003", "잘못된 비밀번호입니다."),

    INVALID_REFRESH_TOKEN(HttpStatus.BAD_REQUEST, "AUTH_001", "유효하지 않은 리프레시 토큰입니다."),
    REFRESH_TOKEN_EXPIRED(HttpStatus.BAD_REQUEST, "AUTH_002", "리프레시 토큰이 만료되었습니다."),
    ADMIN_ONLY(HttpStatus.FORBIDDEN, "AUTH_003", "관리자만 접근 가능합니다."),

    DEVICE_IN_USE(HttpStatus.BAD_REQUEST, "DEVICE_001", "해당 장비는 자산에 연결되어 있어 삭제할 수 없습니다."),

    VALIDATION_ERROR(HttpStatus.BAD_REQUEST, "COMMON_001", "요청 값이 올바르지 않습니다."),
    INVALID_JSON(HttpStatus.BAD_REQUEST, "COMMON_002", "요청 본문(JSON)을 읽을 수 없습니다."),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "COMMON_500", "서버 오류가 발생했습니다.");

    private final HttpStatus status;
    private final String code;
    private final String message;
}