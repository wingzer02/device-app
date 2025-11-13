package com.example.practiceBack.service;

import com.example.practiceBack.dto.Role;
import com.example.practiceBack.mapper.RoleMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleService {

    @Autowired
    private final RoleMapper roleMapper;

    public RoleService (RoleMapper roleMapper) {
        this.roleMapper = roleMapper;
    }

    public List<Role> getAll() {
        return roleMapper.findAll();
    }

}
