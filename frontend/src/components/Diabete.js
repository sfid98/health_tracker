import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";

import {
    Box
  } from "@mui/material";

import { fetchDiabeteMeasurements } from '../services/api';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import AddDiabeteMeasureModal from './AddDiabeteMeasureModal';
import { Button } from '@mui/material';
import { addDiabeteMeasurement } from '../services/api';
import { LineChart } from '@mui/x-charts/LineChart';


export default function Diabete() {
    const { userId } = useParams();

    const [diabeteMeasurements, setDiabeteMeasurements] = useState([]);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const diabeteMeasurementsValue = diabeteMeasurements.map((measure) => measure.value);

    const  handleAddDiabeteMeasurement = async (newDiabeteMeasurement) => {
        await addDiabeteMeasurement(userId, newDiabeteMeasurement);
        const diabetes = await fetchDiabeteMeasurements(userId);
        setDiabeteMeasurements(diabetes);
        setIsAddModalOpen(false);
    }

    useEffect(() => {
        const getDiabeteMeasurements = async () => {
            const diabeteMeasurements = await fetchDiabeteMeasurements(userId);
            setDiabeteMeasurements(diabeteMeasurements);
        };
        getDiabeteMeasurements();
    }
    , [userId]);

  return (

    <Box>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell align="right">Time</TableCell>
            <TableCell align="right">Value</TableCell>
            <TableCell align="right">Unit Measure</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {diabeteMeasurements.map((measure) => (
            <TableRow
              key={measure.value}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell align="right">{measure.date}</TableCell>
              <TableCell align="right">{measure.time}</TableCell>
              <TableCell align="right">{measure.value}</TableCell>
              <TableCell align="right">{measure.um}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    <Button
        variant="contained"
        color="primary"
        onClick={() => {setIsAddModalOpen(true)}}
        sx={{ mt: 2 }}
    >
        Aggiungi Misurazione
    </Button>

    <AddDiabeteMeasureModal 
        isOpen={isAddModalOpen} 
        onRequestClose={() => {setIsAddModalOpen(false)}}
        onSave={handleAddDiabeteMeasurement}
        />



    <LineChart
      xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
      series={[
        {
          data: diabeteMeasurementsValue,
        },
      ]}
      width={500}
      height={300}
    />;
    </Box>


  );
}