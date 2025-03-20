import React from "react";
import Modal from "react-modal";
//import "../EditMedicationModal.css"; // Importa il file CSS

Modal.setAppElement("#root"); // Imposta l'elemento root per accessibilità

const EditMedicationModal = ({ isOpen, onRequestClose, medication, onSave }) => {
  const [editedMedication, setEditedMedication] = React.useState({
    name: "",
    pillsWeek: { Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0, Sunday: 0 },
    totalPerBox: 0,
    lastRefillDate: "",
  });

  React.useEffect(() => {
    if (medication) {
      setEditedMedication(medication);
    }
  }, [medication]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedMedication((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePillsWeekChange = (day, value) => {
    setEditedMedication((prev) => ({
      ...prev,
      pillsWeek: {
        ...prev.pillsWeek,
        [day]: parseInt(value, 10) || 0,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(editedMedication); // Debug
    onSave(editedMedication);
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      shouldFocusAfterRender={true} // Assicura che il focus venga gestito correttamente
      contentLabel="Modifica Farmaco"

    >
      <h2>Modifica Farmaco</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Nome Farmaco</label>
          <input
            type="text"
            id="name"
            name="name"
            value={editedMedication.name}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Consumo Settimanale</label>
          {Object.keys(editedMedication.pillsWeek).map((day) => (
            <div key={day} className="input-group mb-2">
              <span className="input-group-text">{day}</span>
              <input
                type="number"
                value={editedMedication.pillsWeek[day]}
                onChange={(e) => handlePillsWeekChange(day, e.target.value)}
                className="form-control"
              />
            </div>
          ))}
        </div>
        <div className="mb-3">
          <label htmlFor="totalPerBox" className="form-label">Totale per Scatola</label>
          <input
            type="number"
            id="totalPerBox"
            name="totalPerBox"
            value={editedMedication.totalPerBox}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="availableSinceLastRefill" className="form-label">Numero compresse disponibili prima dell'ultima ricarica</label>
          <input
            type="number"
            id="availableSinceLastRefill"
            name="availableSinceLastRefill"
            value={editedMedication.availableSinceLastRefill}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="lastRefillDate" className="form-label">Data Ultima Ricarica</label>
          <input
            type="date"
            id="lastRefillDate"
            name="lastRefillDate"
            value={editedMedication.lastRefillDate}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Salva Modifiche</button>
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={onRequestClose}
        >
          Annulla
        </button>
      </form>
    </Modal>
  );
};

export default EditMedicationModal;