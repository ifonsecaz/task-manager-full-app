package com.etask.userservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.etask.userservice.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);

    List<User> findByAcvalidatedFalse();

}