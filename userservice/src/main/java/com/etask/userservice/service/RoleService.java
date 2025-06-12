package com.etask.userservice.service;

import com.etask.userservice.entity.Role;
import com.etask.userservice.repository.RoleRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoleService {
    @Autowired
    private RoleRepository roleRepository;
    
    public Role verifyRole(String role){
        Role res=roleRepository.findByRole(role);
        if(res!=null){
            return res;
        }
        return null;
    }
}
