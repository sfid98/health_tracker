import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";

import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { fetchBloodWorkMeasurements } from '../services/api';
import { Link } from "react-router-dom";
import { Card, CardContent, Grid, IconButton, TextField } from "@mui/material";
import { Gauge } from '@mui/x-charts/Gauge';
import AddBloodWorkMeausureModal from './AddBloodWorkMeasureModal';
import { addBloodWorkMeasurement } from '../services/api';


import {
    Typography,
    Button,
    Box,
  } from "@mui/material";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

export default function BloodWork() {

    const { userId, date } = useParams(); 

    const [bloodWorkMeasurements, setBloodWorkMeasurements] = useState([]);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const handleAddBloodWorkMeasurement = async (newBloodWorkMeasurement) => {
        await addBloodWorkMeasurement(userId, newBloodWorkMeasurement);
        const bloodWorkMeasurements = await fetchBloodWorkMeasurements(userId);
        setBloodWorkMeasurements(bloodWorkMeasurements);
        setIsAddModalOpen(false
        );
    }

    /**{
        _id: ObjectId('67dee5ff020dde8b475a5e7a'),
        descrizioneEsameTest: 'PDW',
        risultato: '12,3',
        uM: 'fL',
        valoriDiRiferimento: '10-16',
        userId: ObjectId('67dee30ba525fd3f9facd001')
      } */


    useEffect(() => {
        const getBloodWorkMeasurements = async () => {
            const bloodWorkMeasurements = await fetchBloodWorkMeasurements(userId);
            const bloodWorkMeasurementsByDate = bloodWorkMeasurements.filter((measurement) => measurement.dataAnalisi === date);
            setBloodWorkMeasurements(bloodWorkMeasurementsByDate);
        };
        getBloodWorkMeasurements();
    }
    , [userId
    ]);

    return (  
        <Box>
        <Grid container spacing={2}>
          {bloodWorkMeasurements.map((item, index) => (
            
            <Grid item xs={12} sm={6} md={4}>

            <Card>
            <CardContent>
                <Typography variant="body2" gutterBottom>
                <strong>Descrizione esame:</strong> {item.descrizioneEsameTest}
                </Typography>
                <Typography variant="body2">
                <strong>Risultato:</strong> {item.risultato}

                <Gauge width={100} height={100} value={item.risultato} />

                </Typography>
                <Typography variant="body2">
                <strong>Unità di misura:</strong> {item.uM}
                </Typography>
                <Typography variant="body2">
                <strong>Valori di riferimento:</strong> {item.valoriDiRiferimento}
                </Typography>

            </CardContent>
            </Card>
            </Grid>
))}

      </Grid>
        <Button
        variant="contained"
        color="primary"
        onClick={() => setIsAddModalOpen(true)}
        sx={{ mt: 2 }}
      >
        Aggiungi Misurazione
      </Button>

      <Button
          component={Link}
          to={`/user/${userId}/bloodworklist`}
          variant="contained"
          color="primary"
          sx={{ mt: 2 , ml: 2 }}>
          Lista Analisi
      </Button>
      
        <AddBloodWorkMeausureModal 
        isOpen={isAddModalOpen}
        onRequestClose={() => setIsAddModalOpen(false)}
        onSave={handleAddBloodWorkMeasurement}
        />
      </Box>

   
    )


}