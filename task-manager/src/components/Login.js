import React, { useState } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { fetchDataAuth, postData } from './callBack';
import styled from 'styled-components';
import "./Login.css";
import { useDispatch } from "react-redux";
import { addItemZero,resetCart} from "./CartSlice";

const ErrorMessage = styled.div`
  margin-top: 0.5rem;
  color:rgb(184, 7, 7);
  font-weight: 600;
`;

const Login = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
   const [error, setError] =useState(null);
   
    const dispatch = useDispatch();
  
   const login = async (e) => {
    e.preventDefault();
    let body= JSON.stringify({
            "username": userName,
            "password": password
    });
    const response = await postData('/auth/login', body);
    if(response.status===200){ //start a timer to generate new JWT
        sessionStorage.setItem('accessToken', response.data);
        sessionStorage.setItem('username', userName);
        dispatch(resetCart());
        if(loadCart()){
            navigate('/taskList');
        }
    }
    else {
        setError('Incorrect Username/Password');
        setTimeout(() => setError(null), 5000);
    }
};

 const loadCart = async()=>{
    const response = await fetchDataAuth('/user/tasklist');
    const nearDate=[];
    const date=new Date();
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);
    if(response.status===200){
        for(let i=0;i<response.data.length;i++){
            dispatch(addItemZero(response.data[i]));

            
            const taskDate=new Date(response.data[i].dueDate);
            if(taskDate >= date && taskDate <= nextDay){
              nearDate.push(response.data[i]);
            }
        }
        if(nearDate.length>0){
          if ("Notification" in window) {
            Notification.requestPermission().then(permission => {
              if (permission === "granted") {
                console.log("Notification permission granted.");
              } else {
                console.log("Notification permission denied.");
              }
            });
          }
          if (Notification.permission === "granted") {
            new Notification("Task Synced", {
              body: "You have tasks near to expire",
              icon: "/assets/clock.png", 
            });
          }
        }
    }
    return true;
 }
  


  return (
    <div>
    <div>
      <div
        className='modalContainer'
      >
          <form className="login_panel" style={{}} onSubmit={login}>
              <div>
              <span className="input_field">Username </span>
              <input type="text"  name="username" placeholder="Username" className="input_field" onChange={(e) => setUserName(e.target.value)}/>
              </div>
              <div>
              <span className="input_field">Password </span>
              <input name="psw" type="password"  placeholder="Password" className="input_field" onChange={(e) => setPassword(e.target.value)}/>            
              </div>
              <div>
              <input className="action_button" type="submit" value="Login"/>
              </div>
              <Link to="/register" className="loginlink" >Register Now</Link>
          </form>
          {error && <ErrorMessage>{error}</ErrorMessage>}
      </div>
    </div>
    </div>
  );
};

export default Login;