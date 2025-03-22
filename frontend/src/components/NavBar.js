import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  AppBar,
  Tabs,
  Tab
} from "@mui/material";

import { Link as RouterLink } from "react-router-dom";

export default function NavBar() {      

  const { userId } = useParams();
  const [ selectedTab, setSelectedTab ] = useState("medications");
  const handleTabChange = (newValue) => {
    setSelectedTab(newValue);
  };

return (
    createTabBar()
  );


    function createTabBar() {
        return <AppBar position="static">
            <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                centered
            >
                <Tab
                    label="Lista Utenti"
                    value="userlist"
                    component={RouterLink}
                    to={`/`} />
                <Tab
                    label="Farmaci"
                    value="medications"
                    component={RouterLink}
                    to={`/user/${userId}/medications`} />
                <Tab
                    label="Diabete"
                    value="diabete"
                    component={RouterLink}
                    to={`/user/${userId}/diabete`} />
            </Tabs>
        </AppBar>;
    }
}