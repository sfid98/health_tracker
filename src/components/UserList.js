import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchUsers } from "../services/api";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
} from "@mui/material";

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      const users = await fetchUsers();
      setUsers(users);
    };

    getUsers();
  }, []);

  return (
    <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Elenco Utenti
      </Typography>
      <List>
        {users.map((user) => (
          <ListItem key={user._id} divider>
            <ListItemText primary={user.name} />
            <ListItemSecondaryAction>
              <Button
                component={Link}
                to={`/user/${user._id}/medications`}
                variant="contained"
                color="primary"
                size="small"
              >
                Visualizza Farmaci
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default UserList;