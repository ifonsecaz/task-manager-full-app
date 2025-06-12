
import React from 'react';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import VerifyOTP from './components/VerifyOTP';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import ProtectedRoute from './components/ProtectedRoute';

//import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 

function App() {

  return (
    <div className="App">
        <Router>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/verify-otp" element={<VerifyOTP/>}/> 
          <Route path="/taskInput" element={<ProtectedRoute><TodoInput/></ProtectedRoute>}/>
          <Route path="/taskList" element={<ProtectedRoute><TodoList/></ProtectedRoute>}/>
          <Route path="/register" element={<Register/>}/>
        </Routes>
        </Router>     
    </div>
  );
}

export default App;
