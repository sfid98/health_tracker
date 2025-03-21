import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserList from "./components/UserList";
import UserMedicationTracker from "./components/UserMedicationTracker";

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },

  primary: {
    main: '#ff5252',
  },
});

const App = () => {

  
  return (
  <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <Router>
      <Routes>
        <Route path="/" element={<UserList />} />
        <Route path="/user/:userId/*" element={<UserMedicationTracker />} />
      </Routes>
    </Router>
  </ThemeProvider>

  );
};

export default App;
