package com.etask.gatewayservice.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseCookie;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.etask.gatewayservice.entity.*;
import com.etask.gatewayservice.repository.TokenvalidRepository;
import com.etask.gatewayservice.security.JwtUtil;
import com.etask.gatewayservice.security.RateLimiterService;

import io.github.bucket4j.Bucket;


@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private RateLimiterService rateLimiterService;
    @Autowired
    private JwtUtil jwtUtils;
    @Autowired
    private TokenvalidRepository tokenvalidRepository;

    private String parseJwtFromCookie(HttpServletRequest request) {
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("jwt".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody SimpleUserDTO ruser, HttpServletRequest request, HttpServletResponse response) {
        String ip = request.getRemoteAddr();
        Bucket bucket = rateLimiterService.resolveBucket(ip,"login");
        if (bucket.tryConsume(1)) {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<SimpleUserDTO> entity = new HttpEntity<>(ruser,headers);

            String uri = "http://localhost:8081/auth/login";
             
            try {
                ResponseEntity<String[]> response2 = restTemplate.exchange(uri, HttpMethod.POST, entity, String[].class);

                if(response2.getStatusCode()== HttpStatus.OK){
                    ResponseCookie jwtCookie = ResponseCookie.from("jwt", response2.getBody()[0])
                        .httpOnly(true)
                        .secure(true) 
                        .path("/")
                        .maxAge(24 * 60 * 60) 
                        .sameSite("Strict") 
                        .build();

                    response.addHeader(HttpHeaders.SET_COOKIE, jwtCookie.toString());

                return ResponseEntity.ok(response2.getBody()[1]);
                }
                else{
                    return ResponseEntity.status(response2.getStatusCode()).body(response2.getBody());
                }

            } catch (HttpClientErrorException | HttpServerErrorException ex) {
                // This captures 4xx and 5xx errors and returns them as-is
                return ResponseEntity
                        .status(ex.getStatusCode())
                        .body(ex.getResponseBodyAsString());

            } catch (Exception ex) {
                // Fallback for unexpected issues (e.g., timeout, no connection)
                return ResponseEntity
                        .status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("An unexpected error occurred: " + ex.getMessage());
            }
        } else {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body("Too many attempts");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok("Logged out successfully");
    }

     @PostMapping("/refresh")
    public ResponseEntity<?> refreshtoken(HttpServletRequest request) {    
        String token = parseJwtFromCookie(request);  
        if (token != null) {
            long user_id = jwtUtils.getUserIdFromToken(token);
            LocalDateTime lastPassReset=tokenvalidRepository.findById(user_id).get().getLast_password_reset();

                if (jwtUtils.validateJwtToken(token, lastPassReset)) {
                     final String uri = "http://localhost:8081/user/refresh/" + user_id;
                    RestTemplate restTemplate = new RestTemplate();
                    
                    try{
                        return restTemplate.exchange(uri, HttpMethod.POST, null, String.class);
                    } catch (HttpClientErrorException | HttpServerErrorException ex) {
                        // Handle error response as String
                        String errorBody = ex.getResponseBodyAsString();
                        HttpStatusCode statusCode = ex.getStatusCode();

                        return ResponseEntity.status(statusCode).body(errorBody);
                    } catch (Exception ex) {
                        // Catch all other unexpected errors
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error: " + ex.getMessage());
                    }
                }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication error");
    }


    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody OtpVerificationRequestDTO request, HttpServletResponse response) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<OtpVerificationRequestDTO> entity = new HttpEntity<>(request,headers);

        String uri = "http://localhost:8081/auth/verify-otp";
        
        try {
            ResponseEntity<String[]> response2 = restTemplate.exchange(uri, HttpMethod.POST, entity, String[].class);
            String token=response2.getBody()[0];
            Tokenvalid newU=new Tokenvalid(jwtUtils.getUserIdFromToken(token), LocalDateTime.now().minusMinutes(1));
            tokenvalidRepository.save(newU);

            ResponseCookie jwtCookie = ResponseCookie.from("jwt", token)
                .httpOnly(true)
                .secure(true) // set to true in production (HTTPS only)
                .path("/")
                .maxAge(24 * 60 * 60) // 1 day
                .sameSite("Strict")   // or "Lax"
                .build();
                
            response.addHeader(HttpHeaders.SET_COOKIE, jwtCookie.toString());

            return ResponseEntity.status(response2.getStatusCode()).body(response2.getBody()[1]);

        } catch (HttpClientErrorException | HttpServerErrorException ex) {
            // This captures 4xx and 5xx errors and returns them as-is
            return ResponseEntity
                    .status(ex.getStatusCode())
                    .body(ex.getResponseBodyAsString());

        } catch (Exception ex) {
            // Fallback for unexpected issues (e.g., timeout, no connection)
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred: " + ex.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserDTO user) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<UserDTO> entity = new HttpEntity<>(user,headers);

        String uri = "http://localhost:8081/auth/register";

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                uri, HttpMethod.POST, entity, String.class
            );
            return ResponseEntity.status(response.getStatusCode()).body(response.getBody());

        } catch (HttpClientErrorException | HttpServerErrorException ex) {
            // This captures 4xx and 5xx errors and returns them as-is
            return ResponseEntity
                    .status(ex.getStatusCode())
                    .body(ex.getResponseBodyAsString());

        } catch (Exception ex) {
            // Fallback for unexpected issues (e.g., timeout, no connection)
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred: " + ex.getMessage());
        }
        
    }

    @PostMapping("/register/admin")
    public ResponseEntity<?> registerAdmin(@RequestBody UserDTO user) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<UserDTO> entity = new HttpEntity<>(user,headers);

        String uri = "http://localhost:8081/auth/register/admin";
         
        try {
            ResponseEntity<String> response = restTemplate.exchange(uri, HttpMethod.POST, entity, String.class);
            return ResponseEntity.status(response.getStatusCode()).body(response.getBody());

        } catch (HttpClientErrorException | HttpServerErrorException ex) {
            // This captures 4xx and 5xx errors and returns them as-is
            return ResponseEntity
                    .status(ex.getStatusCode())
                    .body(ex.getResponseBodyAsString());

        } catch (Exception ex) {
            // Fallback for unexpected issues (e.g., timeout, no connection)
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred: " + ex.getMessage());
        }
    }
}

