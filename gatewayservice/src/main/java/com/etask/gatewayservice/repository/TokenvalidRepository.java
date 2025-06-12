package com.etask.gatewayservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.etask.gatewayservice.entity.Tokenvalid;

public interface  TokenvalidRepository extends JpaRepository<Tokenvalid, Long> {
    
}
