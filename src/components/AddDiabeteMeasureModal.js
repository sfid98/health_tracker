import React from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";

const AddDiabeteMeasureModal = ({ isOpen, onRequestClose, onSave }) => {
  const [newDiabeteMeasure, setNewDiabeteMeasure] = React.useState({
    date: "",
    time: "",
    value: "",
    um: "mg/dL",
  });

  const [errors, setErrors] = React.useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDiabeteMeasure((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Rimuovi errore se il campo è stato aggiornato
  };

  const validateFields = () => {
    const newErrors = {};
    if (!newDiabeteMeasure.date) {
      newErrors.date = "La data è obbligatoria.";
    }
    if (!newDiabeteMeasure.time) {
      newErrors.time = "L'orario è obbligatorio.";
    }
    if (!newDiabeteMeasure.value || isNaN(newDiabeteMeasure.value)) {
      newErrors.value = "Il valore è obbligatorio e deve essere numerico.";
    }
    if (!newDiabeteMeasure.um) {
      newErrors.um = "L'unità di misura è obbligatoria.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Restituisce true se non ci sono errori
  };

  const handleSave = () => {
    if (validateFields()) {
      onSave(newDiabeteMeasure);
      onRequestClose();
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onRequestClose}
      aria-labelledby="add-diabete-measure-modal"
      aria-describedby="add-diabete-measure-description"
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
        <Typography variant="h6" component="h2" gutterBottom>
          Add Diabete Measure
        </Typography>
        {Object.values(errors).length > 0 && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Per favore, correggi i campi evidenziati.
          </Alert>
        )}
        <TextField
          required
          fullWidth
          label="Date (YYYY-MM-DD)"
          name="date"
          value={newDiabeteMeasure.date}
          onChange={handleInputChange}
          error={!!errors.date}
          helperText={errors.date}
          sx={{ mb: 2 }}
        />
        <TextField
          required
          fullWidth
          label="Time (HH:MM:SS)"
          name="time"
          value={newDiabeteMeasure.time}
          onChange={handleInputChange}
          error={!!errors.time}
          helperText={errors.time}
          sx={{ mb: 2 }}
        />
        <TextField
          required
          fullWidth
          label="Value"
          name="value"
          value={newDiabeteMeasure.value}
          onChange={handleInputChange}
          error={!!errors.value}
          helperText={errors.value}
          sx={{ mb: 2 }}
        />
        <TextField
          required
          fullWidth
          label="Unit Measure"
          name="um"
          value={newDiabeteMeasure.um}
          onChange={handleInputChange}
          error={!!errors.um}
          helperText={errors.um}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          onClick={handleSave}
          sx={{ mr: 2 }}
        >
          Salva
        </Button>
        <Button
          variant="contained"
          onClick={onRequestClose}
        >
          Annulla
        </Button>
      </Box>
    </Modal>
  );
};

export default AddDiabeteMeasureModal;
