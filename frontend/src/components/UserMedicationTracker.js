import React, { useState, useEffect } from "react";
import { useParams, Route, Routes } from "react-router-dom";
import { Box, Container, Toolbar } from "@mui/material";
import { fetchMedications, addMedication, updateMedication, refillMedication, deleteMedication } from "../services/api";
import EditMedicationModal from "./EditMedicationModal";
import AddMedicationModal from "./AddMedicationModal";
import { calculateRemainingPills } from "../utils/utils";
import BloodWork from "./BloodWork";
import BloodWorkList from "./BloodWorkList";
import Medications from "./Medications";
import Diabete from "./Diabete";
import NavBar from "./NavBar";

const UserMedicationTracker = () => {
  const { userId, date } = useParams();
  const [medications, setMedications] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMedication, setEditingMedication] = useState(null);

  useEffect(() => {
    const getMedications = async () => {
      const medications = await fetchMedications(userId);
      setMedications(medications);
    };

    getMedications();
  }, [userId]);

  const handleAddMedication = async (newMedication) => {
    await addMedication(userId, newMedication);
    const medications = await fetchMedications(userId);
    setMedications(medications);
    setIsAddModalOpen(false);
  };

  const handleEditMedication = (medication) => {
    setEditingMedication(medication);
    setIsEditModalOpen(true);
  };

  const handleUpdateMedication = async (updatedMedication) => {
    await updateMedication(userId, updatedMedication._id, updatedMedication);
    const medications = await fetchMedications(userId);
    setMedications(medications);
    setIsEditModalOpen(false);
  };

  const handleRefillMedication = async (med, numOfBox) => {
    await refillMedication(userId, med._id, calculateRemainingPills(med), numOfBox);
    const medications = await fetchMedications(userId);
    setMedications(medications);
  };

  const handleDeleteMedication = async (medication) => {
    await deleteMedication(userId, medication._id);
    const medications = await fetchMedications(userId);
    setMedications(medications);
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* NavBar (sidebar) */}
      <NavBar />

      {/* Contenuto principale */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: { sm: "240px" }, // Lascia spazio per la sidebar su schermi grandi
        }}
      >
        {/* Toolbar per spaziare correttamente sotto l'AppBar */}
        <Toolbar />

        <Container>
          <Routes>
            <Route
              path="medications"
              element={
                <Medications
                  medications={medications}
                  onAdd={() => setIsAddModalOpen(true)}
                  onEdit={handleEditMedication}
                  onRefill={handleRefillMedication}
                  onDelete={handleDeleteMedication}
                />
              }
            />
            <Route path="diabete" element={<Diabete />} />
            <Route path="bloodworklist" element={<BloodWorkList userId={userId} />} />
            <Route path="bloodwork/:date" element={<BloodWork/>} />
          </Routes>

          {/* Modali */}
          <AddMedicationModal
            isOpen={isAddModalOpen}
            onRequestClose={() => setIsAddModalOpen(false)}
            onSave={handleAddMedication}
          />
          <EditMedicationModal
            isOpen={isEditModalOpen}
            onRequestClose={() => setIsEditModalOpen(false)}
            medication={editingMedication}
            onSave={handleUpdateMedication}
          />
        </Container>
      </Box>
    </Box>
  );
};

export default UserMedicationTracker;