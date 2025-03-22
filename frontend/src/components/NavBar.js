import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  AppBar,
  Tabs,
  Tab,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link as RouterLink } from "react-router-dom";

export default function NavBar() {
  const { userId } = useParams();
  const [selectedTab, setSelectedTab] = useState("medications");
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleTabChange = (newValue) => {
    setSelectedTab(newValue);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar />
      <Tabs
        orientation="vertical"
        value={selectedTab}
        onChange={(e, newValue) => handleTabChange(newValue)}
        centered
      >
        <Tab
          label="Lista Utenti"
          value="userlist"
          component={RouterLink}
          to={`/`}
        />
        <Tab
          label="Farmaci"
          value="medications"
          component={RouterLink}
          to={`/user/${userId}/medications`}
        />
        <Tab
          label="Diabete"
          value="diabete"
          component={RouterLink}
          to={`/user/${userId}/diabete`}
        />
        <Tab
          label="Analisi Sangue"
          value="bloodWork"
          component={RouterLink}
          to={`/user/${userId}/bloodworklist`}
        />
      </Tabs>
    </div>
  );

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            My App
          </Typography>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            width: 240,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: 240, boxSizing: "border-box" },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </>
  );
}