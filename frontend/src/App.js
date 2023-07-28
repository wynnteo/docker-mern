import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import SignIn from "./components/page/SignIn";
import SignUp from "./components/page/SignUp";
import NotFound from "./components/page/NotFound";
import Dashboard from "./components/layout/Dashboard";
function App() {
  return (
    <Router>
      <Routes>
        {/* <Route exact path="/" element={<PrivateRoute component={NotFound} />} /> */}
        <Route exact path="/signin/" element={<SignIn />} />
        <Route exact path="/signup/" element={<SignUp />} />
        <Route exact path="/" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;