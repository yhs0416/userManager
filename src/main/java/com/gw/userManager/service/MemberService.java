package com.gw.userManager.service;

import com.gw.userManager.domain.user.Member;
import com.gw.userManager.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class MemberService {
    private final MemberRepository repository;

    @Autowired
    public MemberService(MemberRepository repository) {
        this.repository = repository;
    }

    public Optional<Member> findOne(String userId) {
        return repository.findByUserid(userId);
    }
}
