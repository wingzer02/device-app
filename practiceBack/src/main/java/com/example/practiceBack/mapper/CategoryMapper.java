package com.example.practiceBack.mapper;

import com.example.practiceBack.dto.Category;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface CategoryMapper {
    List<Category> findAll();
}
