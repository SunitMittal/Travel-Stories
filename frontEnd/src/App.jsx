import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React from "react";

import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" exact element={<Root />} />
          <Route path="/signup" exact element={<SignUp />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/dashboard" exact element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
};

// define the root component to handle the initial redirect
const Root = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  );
};

export default App;
