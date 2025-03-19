import React from "react";
import Modal from "react-modal";
Modal.setAppElement("#root"); // Imposta l'elemento root per accessibilità

const AddMedicationModal = ({ isOpen, onRequestClose, onSave }) => {
  const [newMedication, setNewMedication] = React.useState({
    name: "",
    pillsWeek: { Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0, Sunday: 0 },
    totalPerBox: 0,
    lastRefillDate: "",
    availableSinceLastRefill: 0,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMedication((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePillsWeekChange = (day, value) => {
    setNewMedication((prev) => ({
      ...prev,
      pillsWeek: {
        ...prev.pillsWeek,
        [day]: parseInt(value, 10) || 0,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(newMedication);
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Aggiungi Farmaco"
    >
      <h2>Aggiungi Farmaco</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Nome Farmaco</label>
          <input
            type="text"
            id="name"
            name="name"
            value={newMedication.name}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Consumo Settimanale</label>
          {Object.keys(newMedication.pillsWeek).map((day) => (
            <div key={day} className="input-group mb-2">
              <span className="input-group-text">{day}</span>
              <input
                type="number"
                value={newMedication.pillsWeek[day]}
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
            value={newMedication.totalPerBox}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>
        

        <button type="submit" className="btn btn-primary">Aggiungi Farmaco</button>
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

export default AddMedicationModal;