import React, { useState, useEffect } from "react";
import { useParams, Link, Route, Routes } from "react-router-dom";
import { fetchMedications, addMedication, updateMedication, refillMedication, deleteMedication } from "../services/api";
import EditMedicationModal from "./EditMedicationModal";
import AddMedicationModal from "./AddMedicationModal";
import { calculateRemainingPills } from "../utils/utils";
import "bootstrap/dist/css/bootstrap.min.css";
import Documents from "./Documents";

const Medications = ({ medications, onAdd, onEdit, onRefill, onDelete }) => {
  return (
    <>
      <button
        className="btn btn-primary mb-4"
        onClick={onAdd}
      >
        Aggiungi Farmaco
      </button>

      <div className="row gy-4">
  {medications.map((med, index) => (
    <div className="col-md-6 col-lg-4" key={index}>
      <div className="card h-100">
        <div className="card-body">
          <h5 className="card-title">{med.name}</h5>
          <p className="card-text">
            <strong>Consumo settimanale:</strong>
            <div className="d-flex flex-wrap">
              {Object.entries(med.pillsWeek).map(([day, pills]) => (
                <div
                  key={day}
                  className="d-flex align-items-center border rounded p-1 me-2 mb-2"
                  style={{ minWidth: "100px" }}
                >
                  <strong className="me-1">{day}:</strong>
                  <span>{pills} pillole</span>
                </div>
              ))}
            </div>
          </p>
          <p className="card-text">
            <strong>Totale per scatola:</strong> {med.totalPerBox}
          </p>
          <p className="card-text">
            <strong>Disponibili:</strong> {calculateRemainingPills(med)}
          </p>
          <p className="card-text">
            <strong>Data ultima ricarica:</strong> {med.lastRefillDate}
          </p>
          <button
            className="btn btn-warning btn-sm me-2"
            onClick={() => onEdit(med)}
          >
            Modifica
          </button>
          <button
            className="btn btn-success btn-sm me-2"
            onClick={() => onRefill(med)}
          >
            Ricarica
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => onDelete(med)}
          >
            Elimina
          </button>
        </div>
      </div>
    </div>
  ))}
</div>
    </>
  );
};

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
    await refillMedication(userId, med._id, calculateRemainingPills(med), med.totalPerBox);
    const medications = await fetchMedications(userId);
    setMedications(medications);
  };

  const handleDeleteMedication = async (medication) => {
    await deleteMedication(userId, medication._id);
    const medications = await fetchMedications(userId);
    setMedications(medications);
  };

  return (
    <div className="container my-4">
      <h1 className="text-center mb-4">Gestione Utente</h1>
      <div className="mb-4">
        <Link to={`/user/${userId}/medications`} className="btn btn-secondary me-2">
          Farmaci
        </Link>
        <Link to={`/user/${userId}/documents`} className="btn btn-secondary">
          Documenti
        </Link>
      </div>
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
    </div>
  );
};

export default UserMedicationTracker;
