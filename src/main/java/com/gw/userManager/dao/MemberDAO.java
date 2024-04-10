package com.gw.userManager.dao;

import org.apache.ibatis.annotations.MapKey;
import org.apache.ibatis.annotations.Mapper;

import java.util.Map;

@Mapper
public interface MemberDAO {
    @MapKey("")
    Map<String, String> selectMember();
}
