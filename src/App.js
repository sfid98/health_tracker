import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserList from "./components/UserList";
import UserMedicationTracker from "./components/UserMedicationTracker";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserList />} />
        <Route path="/user/:userId" element={<UserMedicationTracker />} />
      </Routes>
    </Router>
  );
};

export default App;