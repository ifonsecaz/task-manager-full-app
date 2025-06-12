import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { postData } from './callBack';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: #f5f7fa;
`;

const Card = styled.div`
    background: #fff;
    padding: 2rem 2.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.08);
    min-width: 320px;
`;

const Title = styled.h2`
    margin-bottom: 1.5rem;
    color: #333;
    text-align: center;
`;

const Input = styled.input`
    width: 100%;
    padding: 0.75rem;
    margin-bottom: 1rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;
`;

const Button = styled.button`
    width: 100%;
    padding: 0.75rem;
    background: #1976d2;
    color: #fff;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.2s;
    &:hover {
        background: #1565c0;
    }
`;

const ErrorMsg = styled.div`
    color: #d32f2f;
    margin-bottom: 1rem;
    text-align: center;
`;

const VerifyOTP = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');
        try {
            let body= JSON.stringify({
                    "username": sessionStorage.getItem('username'),
                    "mfaOtp": otp
            });
            const result = await postData('/auth/verify-otp', body,true);
            if (result.status===200) {
                sessionStorage.setItem('accessToken', result.data);
                navigate('/taskList');
            } else {
                setError(result.message || 'Invalid OTP. Please try again.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <Container>
            <Card>
                <Title>Verify OTP</Title>
                <form onSubmit={handleVerify}>
                    {error && <ErrorMsg>{error}</ErrorMsg>}
                    <Input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={e => setOtp(e.target.value)}
                        required
                    />
                    <Button type="submit">Verify</Button>
                </form>
            </Card>
        </Container>
    );
};

export default VerifyOTP;