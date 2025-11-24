package com.example.practiceBack.mapper;

import com.example.practiceBack.dto.Role;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface RoleMapper {
    // 권한 전체 조회
    List<Role> findAll();
}
