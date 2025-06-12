package com.etask.userservice.controller;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.etask.userservice.repository.UserRepository;
import com.etask.userservice.security.JwtUtil;
import com.etask.userservice.service.EmailService;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.etask.userservice.entity.User;
import com.etask.userservice.entity.UserDTO;
import com.etask.userservice.entity.EmailChangeRequest;
import com.etask.userservice.entity.OtpVerificationRequest;
import com.etask.userservice.entity.PasswordResetRequest;


@RestController
@RequestMapping("/user")
public class ApiUserController {
    private final UserRepository userRepository;
    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    PasswordEncoder encoder;
    @Autowired
    private EmailService emailService;
    @Autowired
    JwtUtil jwtUtils;


    public ApiUserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    
    @PostMapping("/refresh/{userId}")
    public ResponseEntity<?> refreshToken(@PathVariable Long userId) {
        Optional<User> user = userRepository.findById(userId);
        String accessToken="";
        if(user.isPresent()){
            accessToken = jwtUtils.generateAccessToken(user.get()); //gateway service
        }
        return ResponseEntity.ok(accessToken);
    }


    @GetMapping("/info/{username}")
    public ResponseEntity<?> getUserInfo(@PathVariable String username) {
        
        User user=userRepository.findByUsername(username);
        UserDTO res=null;
        if(user!=null){
            res=new UserDTO(user.getUser_id(), user.getUsername(), user.getPassword(), user.getRole().getRole(), user.getLastPasswordReset(), user.getEmail(), user.getAcvalidated(),user.getOldEmail());
        }

        return ResponseEntity.status(HttpStatus.OK).body(res);
    }

    @PostMapping("/resetpwd/{username}")
    public ResponseEntity<?> getUserInfo(@PathVariable String username, @RequestBody PasswordResetRequest req, HttpServletRequest request) {

        if (!req.new_password.equals(req.confirm_password)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Passwords don't match");
        }

        if (req.new_password.length() < 8) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Password too short");
        }

        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, req.password)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Password is incorrect");
        }

        User user=userRepository.findByUsername(username);
        user.setPassword(encoder.encode(req.new_password));
        userRepository.save(user);
        return ResponseEntity.status(HttpStatus.OK).body("Password was updated");
        
    }
        
    //Need logic to not make the mail change if account is not validated
    @PostMapping("/changemail/{username}")
    public ResponseEntity<?> getUserInfo(@PathVariable String username, @RequestBody EmailChangeRequest req, HttpServletRequest request) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, req.password)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Password is incorrect");
        }

        User user=userRepository.findByUsername(username);
        user.setOldEmail(user.getEmail());
        user.setEmail(req.email);
        user.setAcvalidated(false);
        user.setLastPasswordReset(); //Used to check when last change was made
        userRepository.save(user); 

        String otp = String.valueOf(new Random().nextInt(900000) + 100000); // 6-digit
        user.setMfaOtp(otp);
        user.setMfaOtpExpiry(LocalDateTime.now().plusMinutes(5));

        // Send OTP via email
        emailService.sendOtp(user.getEmail(), otp);

        return ResponseEntity.status(HttpStatus.OK).body("Email was updated, please verify your mail");
    }


   
}
    