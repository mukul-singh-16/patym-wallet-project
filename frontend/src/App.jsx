/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Signin } from './pages/Signin';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import axios from 'axios';
import { SendMoney } from './pages/SendMoney';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Retrieve the token from localStorage
        const token = localStorage.getItem('token');
        // console.log(token);

        // Set up the headers with the token
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };

        // Make the request with the headers
        const res = await axios.get("http://localhost:3000/api/v1/user/isSignedIn", config);
        // console.log(res);

        if (res.status === 200) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error(error);
        setIsAuthenticated(false);
      }
    };

    checkAuthentication();
  } , []);

  return (
    <Router>
      <Routes>
        {/* Conditional routes based on authentication */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />} />
        <Route path="/signin" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signin />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} />
        <Route path='/send' element={<SendMoney/>}></Route>
        {/* Redirects to Signup if not authenticated */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
