const express = require("express");
const cors = require("cors");
require("dotenv").config();
const axios = require("axios");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// CouchDB Connection
const couchDBUrl = process.env.COUCHDB_URL || "http://admin:admin@couchdb:5984";
const usersDB = `${couchDBUrl}/users`;
const medicationsDB = `${couchDBUrl}/medications`;
const diabeteDB = `${couchDBUrl}/diabete`;

// Funzione di supporto per gestire errori di CouchDB
const handleCouchError = (error, res) => {
  console.error("CouchDB error:", error.response?.data || error.message);
  res.status(500).send("Errore nel database.");
};

// Endpoints

// Crea un utente
app.post("/api/users", async (req, res) => {
  try {
    const user = req.body;
    const response = await axios.post(usersDB, user);
    res.status(200).send(response.data);
  } catch (error) {
    handleCouchError(error, res);
  }
});

// Recupera tutti gli utenti
app.get("/api/users", async (req, res) => {
  try {
    console.log(`${usersDB}/_all_docs?include_docs=true`)
    const response = await axios.get(`${usersDB}/_all_docs?include_docs=true`);
    const users = response.data.rows.map((row) => row.doc);
    res.json(users);
  } catch (error) {
    handleCouchError(error, res);
  }
});

// Crea un farmaco per un utente specifico
app.post("/api/users/:userId/medications", async (req, res) => {
  try {
    const medication = { ...req.body, userId: req.params.userId };
    const response = await axios.post(medicationsDB, medication);
    res.status(200).send(response.data);
  } catch (error) {
    handleCouchError(error, res);
  }
});

// Recupera tutti i farmaci di un utente
app.get("/api/users/:userId/medications", async (req, res) => {
  try {
    const userId = req.params.userId;

    const response = await axios.post(`${medicationsDB}/_find`, {
      selector: {
        userId: userId,
      },
    });
    
    res.json(response.data.docs);
  } catch (error) {
    handleCouchError(error, res);
  }
});

// Aggiorna un farmaco
app.put("/api/users/:userId/medications/:medicationId", async (req, res) => {
  try {
    const { userId, medicationId } = req.params;
    const medication = req.body;

    // Recupera il farmaco esistente
    const existing = await axios.get(`${medicationsDB}/${medicationId}`);
    const updated = { ...existing.data, ...medication, userId };

    // Aggiorna il documento
    const response = await axios.put(`${medicationsDB}/${medicationId}`, updated);
    res.status(200).send(response.data);
  } catch (error) {
    handleCouchError(error, res);
  }
});

// Elimina un farmaco
app.delete("/api/users/:userId/medications/:medicationId", async (req, res) => {
  try {
    const { medicationId } = req.params;

    // Recupera il farmaco esistente
    const existing = await axios.get(`${medicationsDB}/${medicationId}`);

    // Elimina il documento
    const response = await axios.delete(`${medicationsDB}/${medicationId}`, {
      params: { rev: existing.data._rev },
    });

    res.status(200).send({ message: "Farmaco eliminato con successo.", medication: response.data });
  } catch (error) {
    handleCouchError(error, res);
  }
});


app.put("/api/users/:userId/medications/:medicationId/remainingPills/:remainingPills/numOfBox/:numOfBox/refill", async (req, res) => {
  try {
    const { userId, medicationId, remainingPills, numOfBox } = req.params;

    // Trova il farmaco specifico
    const medicationResponse = await axios.get(`${medicationsDB}/${medicationId}`);
    const medication = medicationResponse.data;

    if (!medication || medication.userId !== userId) {
      return res.status(404).send("Farmaco non trovato o non associato a questo utente.");
    }

    // Calcola le pillole disponibili dall'ultima ricarica
    const availableSinceLastRefill =
      Number(remainingPills) + Number(medication.totalPerBox) * Number(numOfBox);

    // Aggiorna il documento del farmaco
    medication.lastRefillDate = new Date().toISOString().split("T")[0];
    medication.availableSinceLastRefill = availableSinceLastRefill;

    const updateResponse = await axios.put(`${medicationsDB}/${medicationId}`, medication);

    res.status(200).send(updateResponse.data);
  } catch (error) {
    console.error("Errore durante l'aggiornamento della data di ricarica:", error.response?.data || error.message);
    res.status(500).send("Errore durante l'aggiornamento della data di ricarica.");
  }
});


// Aggiungi o aggiorna una misurazione di diabete
app.post("/api/users/:userId/diabete", async (req, res) => {
  try {
    const diabete = { ...req.body, userId: req.params.userId };
    const response = await axios.post(diabeteDB, diabete);
    res.status(200).send(response.data);
  } catch (error) {
    handleCouchError(error, res);
  }
});

// Recupera tutte le misurazioni di diabete di un utente
app.get("/api/users/:userId/diabete", async (req, res) => {
  try {
    const userId = req.params.userId
    const response = await axios.post(`${diabeteDB}/_find`, {
      selector: {
        userId: userId,
      },
    });

    res.json(response.data.docs);
  } catch (error) {
    handleCouchError(error, res);
  }
});

// Avvia il server
const PORT = process.env.PORT || 5500;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server avviato sulla porta ${PORT}`);
});
