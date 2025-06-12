package com.etask.userservice.entity;

public class OtpVerificationRequest {
    private String username;
    private String mfaOtp;

    public OtpVerificationRequest(String username, String mfaOtp){
        this.username=username;
        this.mfaOtp=mfaOtp;
    }

    public String getUsername(){
        return username;
    }

    public String getMfaOtp(){
        return mfaOtp;
    }
}
