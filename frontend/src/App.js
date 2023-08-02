import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import SignIn from "./components/pages/SignIn";
import SignUp from "./components/pages/SignUp";
import NotFound from "./components/pages/NotFound";
import Dashboard from "./components/layout/Dashboard";
import ResetPassword from "./components/pages/ResetPassword";
function App() {
  return (
    <Router>
      <Routes>
        {/* <Route exact path="/" element={<PrivateRoute component={NotFound} />} /> */}
        <Route exact path="/signin/" element={<SignIn />} />
        <Route exact path="/signup/" element={<SignUp />} />
        <Route exact path="/resetpassword/" element={<ResetPassword />} />
        <Route exact path="/" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
