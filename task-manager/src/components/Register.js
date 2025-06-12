import React, { useState } from "react";
import "./Register.css";
import user_icon from "./assets/person.png"
import email_icon from "./assets/email.png"
import password_icon from "./assets/password.png"
import { postData } from "./callBack";
import { useNavigate} from 'react-router-dom';
import styled from 'styled-components';
import { useDispatch } from "react-redux";
import { resetCart} from "./CartSlice";

const ErrorMessage = styled.div`
  margin-top: 0.5rem;
  color:rgb(184, 7, 7);
  font-weight: 600;
`;

const Register = () => {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
    const dispatch = useDispatch();

    const register = async (e) => {
        e.preventDefault();
        let body= JSON.stringify({
            "username": userName,
            "password": password,
            "email":email
        });
        const response = await postData('/auth/register', body);
        if(response.status===200){ 
            sessionStorage.setItem('username', userName);
             dispatch(resetCart());
            navigate('/verify-otp');
        }
        else if(response.status===400 && response.data!==""){
            console.log(response);
            setError(response.data);
            setTimeout(() => setError(null), 5000);
        }
        else{
            setError("Email already in use");
            setTimeout(() => setError(null), 5000);
        }
    };


  return(
    <div className="register_container" style={{ width: "40%", margin:"auto", padding: "2rem", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", backgroundColor: "#bcbcbc" }}>
        <div className="header" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h2 className="text" style={{ margin: 0, fontSize: "2rem", color: "#333" }}>Sign Up</h2>
        </div>
        <hr style={{ border: "none", borderTop: "1px solid #ddd", marginBottom: "1.5rem" }} />

        <form onSubmit={register}>
            <div className="inputs" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div className="input" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <img src={user_icon} className="img_icon" alt="Username" style={{ width: "3rem" }} />
                    <input type="text" name="username" placeholder="Username" className="input_field" style={{ flex: 1, padding: "0.5rem", borderRadius: "5px", border: "1px solid #ccc" }} onChange={(e) => setUserName(e.target.value)} />
                </div>
                <div className="input" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <img src={email_icon} className="img_icon" alt="Email" style={{ width: "3rem" }} />
                    <input type="email" name="email" placeholder="Email" className="input_field" style={{ flex: 1, padding: "0.5rem", borderRadius: "5px", border: "1px solid #ccc" }} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="input" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <img src={password_icon} className="img_icon" alt="Password" style={{ width: "3rem" }} />
                    <input name="psw" type="password" placeholder="Password" className="input_field" style={{ flex: 1, padding: "0.5rem", borderRadius: "5px", border: "1px solid #ccc" }} onChange={(e) => setPassword(e.target.value)} />
                </div>
            </div>
            <div className="submit_panel" style={{ marginTop: "1.5rem", textAlign: "center" }}>
                <input className="submit" type="submit" value="Register" style={{ padding: "0.75rem 1.5rem", borderRadius: "5px", border: "none", backgroundColor: "#007BFF", color: "#fff", fontSize: "1rem", cursor: "pointer" }} />
            </div>
        </form>
        {error && <ErrorMessage>{error}</ErrorMessage>}
    </div>
  )
}

export default Register;