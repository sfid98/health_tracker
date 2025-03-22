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
  Box,
  TextField,

} from "@mui/material";

import {addUser} from "../services/api";

import AddUserModal from "./AddUserModal";

const UserList = () => {
  const [users, setUsers] = useState([]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);


  const handleAddUser = async (newUser) => {
    await addUser(newUser);
    const users = await fetchUsers();
    setUsers(users);
    setIsAddModalOpen(false);
  }

  useEffect(() => {
    const getUsers = async () => {
      const users = await fetchUsers();
      setUsers(users);
    };

    getUsers();
  }, []);

  return (

    <Box>
    <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Elenco Utenti
      </Typography>
      <List>
        {users.map((user) => (
          <ListItem key={user._id} divider>
            <ListItemText primary={user.name + ' ' + user.surname } />
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


      <Button 
    variant="contained"
    color="primary"
    size="small"
    onClick={() => setIsAddModalOpen(true)}
    >
      Aggiungi Utente
    </Button>
    </Container>

    <AddUserModal
    isOpen={isAddModalOpen}
    onRequestClose={() => setIsAddModalOpen(false)}
    onSave={handleAddUser}
    />





    </Box>
    
  );
};

export default UserList;