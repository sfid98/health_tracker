import React, { useState, useEffect } from "react";
import { useParams, Route, Routes } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Tabs,
  Tab,
  Container,
} from "@mui/material";
import { fetchMedications, addMedication, updateMedication, refillMedication, deleteMedication } from "../services/api";
import EditMedicationModal from "./EditMedicationModal";
import AddMedicationModal from "./AddMedicationModal";
import { calculateRemainingPills } from "../utils/utils";
import Documents from "./AnalisiSangue";
import Medications from "./Medications";
import { Link as RouterLink } from "react-router-dom";

const UserMedicationTracker = () => {
  const { userId } = useParams();
  const [medications, setMedications] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMedication, setEditingMedication] = useState(null);
  const [selectedTab, setSelectedTab] = useState("medications");

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

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Box>
      <AppBar position="static">

        
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          centered
        >

          <Tab
            label="Lista Utenti"
            value="userlist"
            component={RouterLink}
            to={`/`}
          />
          <Tab
            label="Farmaci"
            value="medications"
            component={RouterLink}
            to={`/user/${userId}/medications`}
          />
          <Tab
            label="Documenti"
            value="documents"
            component={RouterLink}
            to={`/user/${userId}/documents`}
          />
  
        </Tabs>
      </AppBar>
      <Container sx={{ mt: 4 }}>
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
          <Route path="documents" element={<Documents />} />
        </Routes>

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
  );
};

export default UserMedicationTracker;
