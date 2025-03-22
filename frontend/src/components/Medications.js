import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Box,
} from "@mui/material";
import { calculateRemainingPills } from "../utils/utils";
import { Add, Edit, Delete } from "@mui/icons-material";
import { Card, CardContent, Grid, IconButton, TextField } from "@mui/material";

const Medications = ({ medications, onAdd, onEdit, onRefill, onDelete }) => {
    return (
      <>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={onAdd}
          sx={{ mb: 2 }}
        >
          Aggiungi Farmaco
        </Button>
  
        <Grid container spacing={2}>
          {medications.map((med, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {med.name}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Consumo settimanale:</strong>
                    <Box sx={{ display: "flex", flexWrap: "wrap", mt: 1 }}>
                      {Object.entries(med.pillsWeek).map(([day, pills]) => (
                        <Box
                          key={day}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            border: 1,
                            borderRadius: 1,
                            p: 1,
                            mr: 1,
                            mb: 1,
                            minWidth: "100px",
                          }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: "bold", mr: 1 }}>
                            {day}:
                          </Typography>
                          <Typography variant="body2">{pills} pillole</Typography>
                        </Box>
                      ))}
                    </Box>
                  </Typography>
                  <Typography variant="body2">
                    <strong>Totale per scatola:</strong> {med.totalPerBox}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Disponibili:</strong> {calculateRemainingPills(med)}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Data ultima ricarica:</strong> {med.lastRefillDate}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                    <TextField
                      type="number"
                      inputProps={{ min: 1, max: 100 }}
                      size="small"
                      placeholder="N. Scatole"
                      onChange={(e) => (med.newBoxCount = parseInt(e.target.value) || 1)}
                      sx={{ width: "80px", mr: 2 }}
                    />
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => onRefill(med, med.newBoxCount || 1)}
                    >
                      Aggiungi Scatole
                    </Button>
                  </Box>
                  <Box sx={{ display: "flex", mt: 2 }}>
                    <IconButton
                      color="warning"
                      onClick={() => onEdit(med)}
                      sx={{ mr: 1 }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => onDelete(med)}>
                      <Delete />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </>
    );
  };


  export default Medications;