const axios = require("axios");

const couchdbUrl = process.env.MONGO_URI || "http://admin:admin@couchdb:5984";

// Database da creare
const databases = ["users", "medications", "diabete"];

const createDatabase = async (dbName) => {
  try {
    const response = await axios.put(`${couchdbUrl}/${dbName}`);
    console.log(`Database "${dbName}" creato:`, response.data);
  } catch (error) {
    if (error.response?.status === 412) {
      console.log(`Database "${dbName}" già esistente.`);
    } else {
      console.error(`Errore durante la creazione del database "${dbName}":`, error.message);
    }
  }
};

const initializeDatabases = async () => {
  for (const db of databases) {
    await createDatabase(db);
  }
  console.log("Inizializzazione completata.");
};

initializeDatabases();
