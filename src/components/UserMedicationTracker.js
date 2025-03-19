import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchMedications, addMedication, updateMedication, refillMedication } from "../services/api"; // Importa la nuova funzione
import EditMedicationModal from "./EditMedicationModal";
import AddMedicationModal from "./AddMedicationModal";

import { calculateRemainingPills } from "../utils/utils.js";
import "bootstrap/dist/css/bootstrap.min.css";

const UserMedicationTracker = () => {
  const { userId } = useParams();
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

  const handleRefillMedication = async (med) => {
    try {
      const updatedMedication = await refillMedication(userId, med._id, calculateRemainingPills(med), med.totalPerBox);
      const medications = await fetchMedications(userId);
      setMedications(medications);
    } catch (error) {
      console.error("Errore durante la ricarica:", error);
    }
  };

  return (
    <div className="container my-4">
      <h1 className="text-center mb-4">Farmaci Utente</h1>
      <Link to="/" className="btn btn-secondary mb-4">Torna all'elenco utenti</Link>

      {/* Pulsante per aprire il modale di aggiunta */}
      <button
        className="btn btn-primary mb-4"
        onClick={() => setIsAddModalOpen(true)}
      >
        Aggiungi Farmaco
      </button>

      {/* Lista dei farmaci */}
      <div className="row gy-4">
        {medications.map((med, index) => (
          <div className="col-md-6 col-lg-4" key={index}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{med.name}</h5>
                <p className="card-text">
                  <strong>Consumo settimanale:</strong>
                  <ul className="list-group list-group-flush">
                    {Object.entries(med.pillsWeek).map(([day, pills]) => (
                      <li className="list-group-item" key={day}>
                        {day}: {pills} pillole
                      </li>
                    ))}
                  </ul>
                </p>
                <p className="card-text">
                  <strong>Totale per scatola:</strong> {med.totalPerBox}
                </p>
                <p className="card-text">
                  <strong>Disponibili:</strong> {calculateRemainingPills(med) + med.availableSinceLastRefill} 
                </p>
                <p className="card-text">
                  <strong>Data ultima ricarica:</strong> {med.lastRefillDate}
                </p>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEditMedication(med)}
                >
                  Modifica
                </button>
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => handleRefillMedication(med)}
                >
                  Ricarica
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modale per l'aggiunta di un farmaco */}
      <AddMedicationModal
        isOpen={isAddModalOpen}
        onRequestClose={() => setIsAddModalOpen(false)}
        onSave={handleAddMedication}
      />

      {/* Modale per la modifica di un farmaco */}
      <EditMedicationModal
        isOpen={isEditModalOpen}
        onRequestClose={() => setIsEditModalOpen(false)}
        medication={editingMedication}
        onSave={handleUpdateMedication}
      />
    </div>
  );
};

export default UserMedicationTracker;