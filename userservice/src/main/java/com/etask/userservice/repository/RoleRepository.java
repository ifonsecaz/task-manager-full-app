package com.etask.userservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.etask.userservice.entity.Role;

public interface RoleRepository extends JpaRepository<Role, Integer> {
    Role findByRole(String role);
}