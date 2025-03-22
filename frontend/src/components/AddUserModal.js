import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const AddUserModal = ({ isOpen, onRequestClose, onSave }) => {
  const [newUser, setNewUser] = React.useState({
    name: "",
    surname: ""  
  });

  const [errors, setErrors] = React.useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Rimuovi errore se il campo è stato aggiornato
  } 

  const validateFields = () => {
    const newErrors = {};
    if (!newUser.name) {
      newErrors.name = "Il nome è obbligatorio.";
    }
    if (!newUser.surname) {
      newErrors.surname = "Il cognome è obbligatorio.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Restituisce true se non ci sono errori
  };

  const handleSave = () => {
    if (validateFields()) {
      onSave(newUser);
      onRequestClose();
    }
  };

  return ( <Modal open={isOpen} onClose={onRequestClose} aria-labelledby="add-user-modal" aria-describedby="add-user-description">
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
      }}
    >
      <Typography variant="h6" component="h2" gutterBottom>
        Aggiungi Utente
      </Typography>
      <TextField
        fullWidth
        label="Nome"
        name="name"
        value={newUser.name}
        onChange={handleInputChange}
        error={!!errors.name}
        helperText={errors.name}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Cognome"
        name="surname"
        value={newUser.surname}
        onChange={handleInputChange}
        error={!!errors.surname}
        helperText={errors.surname}
        sx={{ mb: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
      >
        Salva
      </Button>
    </Box>
  </Modal>
    )
}


export default AddUserModal;
