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


  export const refillMedication = async (userId, medicationId, remainingPills, numOfBox) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/users/${userId}/medications/${medicationId}/remainingPills/${remainingPills}/numOfBox/${numOfBox}/refill`
      );
      return response.data;
    } catch (error) {
      console.error("Errore durante l'aggiornamento della data di ricarica:", error);
      throw error;
    }
  };

  export const deleteMedication = async (userId, medicationId) => {  
    try {
      await axios.delete(`${API_BASE_URL}/users/${userId}/medications/${medicationId}`);
    } catch (error) {
      console.error("Errore durante l'eliminazione del farmaco:", error);
      throw error;
    }
  }



  export const fetchDiabeteMeasurements = async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${userId}/diabete`);
      return response.data;
    } catch (error) {
      console.error("Errore durante il recupero delle misurazioni:", error);
      return [];
    }
  };

  export const addDiabeteMeasurement = async (userId, measurement) => {
    try {
      await axios.post(`${API_BASE_URL}/users/${userId}/diabete`, measurement);
    } catch (error) {
      console.error("Errore durante l'aggiunta della misurazione:", error);
    }
  }



  export const addUser = async (user) => {
    try {
      await axios.post(`${API_BASE_URL}/users`, user);
    } catch (error) {
      console.error("Errore durante l'aggiunta dell'utente:", error);
    }
  }