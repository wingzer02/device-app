package com.example.practiceBack.service;

import com.example.practiceBack.dto.Category;
import com.example.practiceBack.mapper.CategoryMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private final CategoryMapper categoryMapper;

    public CategoryService(CategoryMapper categoryMapper) {
        this.categoryMapper = categoryMapper;
    }

    public List<Category> getAll() {
        return categoryMapper.findAll();
    }
}
