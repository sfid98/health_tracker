const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/";
const dbName = "health_tracker"; // Nome del database
let db;

MongoClient.connect(mongoURI)
  .then((client) => {
    console.log("MongoDB connected!");
    db = client.db(dbName);
  })
  .catch((error) => console.error("Errore nella connessione a MongoDB:", error));

// Endpoints

// Crea un farmaco per un utente specifico
app.post("/api/users/:userId/medications", async (req, res) => {
  try {
    const userId = req.params.userId;
    const medication = { ...req.body, userId: new ObjectId(userId) };
    const result = await db.collection("medications").insertOne(medication);
    res.status(200).send(result.ops[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Errore durante l'aggiunta del farmaco.");
  }
});

// Recupera tutti gli utenti
app.get("/api/users", async (req, res) => {
  try {
    const users = await db.collection("users").find().toArray();
    res.json(users);
  } catch (error) {
    res.status(500).send("Errore nel recupero degli utenti.");
  }
});

// Recupera tutti i farmaci di un utente
app.get("/api/users/:userId/medications", async (req, res) => {
  try {
    const userId = req.params.userId;
    const medications = await db
      .collection("medications")
      .find({ userId: new ObjectId(userId) })
      .toArray();
    res.json(medications);
  } catch (error) {
    res.status(500).send("Errore nel recupero dei farmaci.");
  }
});

// Aggiorna un farmaco
app.put("/api/users/:userId/medications/:medicationId", async (req, res) => {
  try {
    const { userId, medicationId } = req.params;
    const updatedMedication = req.body;

    const result = await db.collection("medications").findOneAndUpdate(
      { _id: new ObjectId(medicationId), userId: new ObjectId(userId) },
      { $set: updatedMedication },
      { returnDocument: "after" }
    );

    if (!result.value) {
      return res.status(404).send("Farmaco non trovato o non associato a questo utente.");
    }
    res.status(200).send(result.value);
  } catch (error) {
    console.error(error);
    res.status(500).send("Errore durante l'aggiornamento del farmaco.");
  }
});

// Aggiorna la data di ultima ricarica
app.put("/api/users/:userId/medications/:medicationId/remainingPills/:remainingPills/numOfBox/:numOfBox/refill", async (req, res) => {
  try {
    const { userId, medicationId, remainingPills, numOfBox } = req.params;

    const medication = await db.collection("medications").findOne({
      _id: new ObjectId(medicationId),
      userId: new ObjectId(userId),
    });

    if (!medication) {
      return res.status(404).send("Farmaco non trovato o non associato a questo utente.");
    }

    const availableSinceLastRefill =
      Number(remainingPills) + Number(medication.totalPerBox) * Number(numOfBox);

    const result = await db.collection("medications").findOneAndUpdate(
      { _id: new ObjectId(medicationId), userId: new ObjectId(userId) },
      {
        $set: {
          lastRefillDate: new Date().toISOString().split("T")[0],
          availableSinceLastRefill,
        },
      },
      { returnDocument: "after" }
    );

    res.status(200).send(result.value);
  } catch (error) {
    console.error(error);
    res.status(500).send("Errore durante l'aggiornamento della data di ricarica.");
  }
});

// Elimina un farmaco
app.delete("/api/users/:userId/medications/:medicationId", async (req, res) => {
  try {
    const { userId, medicationId } = req.params;

    const result = await db.collection("medications").findOneAndDelete({
      _id: new ObjectId(medicationId),
      userId: new ObjectId(userId),
    });

    if (!result) {
      return res.status(404).send("Farmaco non trovato o non associato a questo utente.");
    }
    res.status(200).send({ message: "Farmaco eliminato con successo.", medication: result.value });
  } catch (error) {
    console.error("Errore durante l'eliminazione del farmaco:", error);
    res.status(500).send("Errore durante l'eliminazione del farmaco.");
  }
});


//Diabete

app.get("/api/users/:userId/diabete", async (req, res) => {
  try {
    const userId = req.params.userId;
    const diabete = await db
      .collection("diabete")
      .find({ userId: new ObjectId(userId) })
      .toArray();
    res.json(diabete);
  } catch (error) {
    res.status(500).send("Errore nel recupero delle misurazioni .");
  }
});

app.post("/api/users/:userId/diabete", async (req, res) => {
  try {
    const userId = req.params.userId;
    const diabete = { ...req.body, userId: new ObjectId(userId) };
    const result = await db.collection("diabete").insertOne(diabete);
    res.status(200).send(result.ops[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Errore durante l'aggiunta della misurazione.");
  }
});

// Avvia il server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server avviato sulla porta ${PORT}`);
});
