import axios from "axios";

const API_BASE_URL = "http://localhost:5500/api";

export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`);
    return response.data;
  } catch (error) {
    console.error("Errore durante il recupero degli utenti:", error);
    return [];
  }
};

export const fetchMedications = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}/medications`);
    return response.data;
  } catch (error) {
    console.error("Errore durante il recupero dei farmaci:", error);
    return [];
  }
};


const formatDateISO = (date) => {
  const isoString = date.toISOString();
  const formattedDate = isoString.split("T")[0];
  return formattedDate;
};

export const addMedication = async (userId, medication) => {
  try {
    medication.lastRefillDate = formatDateISO(new Date())
    await axios.post(`${API_BASE_URL}/users/${userId}/medications`, medication);
  } catch (error) {
    console.error("Errore durante l'aggiunta del farmaco:", error);
  }
};


export const updateMedication = async (userId, medicationId, updatedMedication) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/users/${userId}/medications/${medicationId}`,
        updatedMedication
      );
      return response.data;
    } catch (error) {
      console.error("Errore durante l'aggiornamento del farmaco:", error);
      throw error;
    }
  };


  export const refillMedication = async (userId, medicationId, remainingPills) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/users/${userId}/medications/${medicationId}/remainingPills/${remainingPills}/refill`
      );
      return response.data;
    } catch (error) {
      console.error("Errore durante l'aggiornamento della data di ricarica:", error);
      throw error;
    }
  };