package com.example.practiceBack.controller;

import com.example.practiceBack.dto.Role;
import com.example.practiceBack.service.RoleService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
public class RoleController {

    private final RoleService roleService;

    public RoleController (RoleService roleService) {
        this.roleService = roleService;
    }

    // 권한 전체 조회
    @GetMapping
    public List<Role> getAll() {
        return roleService.getAll();
    }

}
