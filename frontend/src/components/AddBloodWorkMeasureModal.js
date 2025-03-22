import React from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
} from "@mui/material";

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { data } from "react-router-dom";
import { DataArray } from "@mui/icons-material";

import dayjs from 'dayjs';


const AddBloodWorkMeausureModal = ({ isOpen, onRequestClose, onSave }) => {  
    const [newBloodWorkMeasurement, setNewBloodWorkMeasurement] = React.useState({
        descrizioneEsameTest: "",
        risultato: "",
        uM: "",
        valoriDiRiferimento: "",
        dataAnalisi: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewBloodWorkMeasurement((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDateChange = (date) => {

        const formattedDate = date.year() + "-" + date.month() + "-" + date.day();

        console.log(formattedDate);
        setNewBloodWorkMeasurement((prev) => ({
            ...prev,
            dataAnalisi: formattedDate,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(newBloodWorkMeasurement);
        onRequestClose();
    };

    return ( 
        <Modal
            open={isOpen}
            onClose={onRequestClose}
            aria-labelledby="add-bloodwork-modal"
            aria-describedby="add-bloodwork-description"
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
                <Typography variant="h6" id="add-bloodwork-modal">
                    Add Blood Work Measurement
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Descrizione Esame Test"
                                name="descrizioneEsameTest"
                                value={newBloodWorkMeasurement.descrizioneEsameTest}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Risultato"
                                name="risultato"
                                value={newBloodWorkMeasurement.risultato}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Unità di Misura"
                                name="uM"
                                value={newBloodWorkMeasurement.uM}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Valori di Riferimento"
                                name="valoriDiRiferimento"
                                value={newBloodWorkMeasurement.valoriDiRiferimento}
                                onChange={handleInputChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DatePicker']}>
                                    <DatePicker 
                                        label="Data Analisi"
                                        name = "dataAnalisi"
                                        value={dayjs(newBloodWorkMeasurement.dataAnalisi)}
                                        onChange={handleDateChange}
                                        />
                                </DemoContainer>
                            </LocalizationProvider>                        
                        </Grid>
                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" color="primary">
                                Aggiungi Misurazione
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Modal>
    );
}

export default AddBloodWorkMeausureModal;