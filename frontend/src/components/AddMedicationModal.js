import React from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
} from "@mui/material";

const AddMedicationModal = ({ isOpen, onRequestClose, onSave }) => {
  const [newMedication, setNewMedication] = React.useState({
    name: "",
    pillsWeek: { Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0, Sunday: 0 },
    totalPerBox: 0,
    lastRefillDate: "",
    availableSinceLastRefill: 0,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMedication((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePillsWeekChange = (day, value) => {
    setNewMedication((prev) => ({
      ...prev,
      pillsWeek: {
        ...prev.pillsWeek,
        [day]: parseInt(value, 10) || 0,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(newMedication);
    onRequestClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={onRequestClose}
      aria-labelledby="add-medication-modal"
      aria-describedby="add-medication-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography id="add-medication-modal" variant="h6" component="h2" gutterBottom>
          Aggiungi Farmaco
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nome Farmaco"
            name="name"
            value={newMedication.name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
          />

          <Typography variant="body1" gutterBottom>
            Consumo Settimanale
          </Typography>
          <Grid container spacing={2}>
            {Object.keys(newMedication.pillsWeek).map((day) => (
              <Grid item xs={6} key={day}>
                <TextField
                  label={day}
                  type="number"
                  value={newMedication.pillsWeek[day]}
                  onChange={(e) => handlePillsWeekChange(day, e.target.value)}
                  fullWidth
                />
              </Grid>
            ))}
          </Grid>

          <TextField
            label="Totale per Scatola"
            name="totalPerBox"
            type="number"
            value={newMedication.totalPerBox}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{ mr: 2 }}
            >
              Aggiungi Farmaco
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={onRequestClose}
            >
              Annulla
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default AddMedicationModal;