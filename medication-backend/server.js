const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/medications";
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("MongoDB connected!");
});
  
// Schema principale con un array di farmaci
const medicationSchema = new mongoose.Schema({
  name: String,
  pillsWeek: {
    type: Map,
    of: Number, // Ogni giorno è una chiave con un valore numerico (pillole)
    required: true,
  },
  totalPerBox: Number,
  lastRefillDate: String,
  availableSinceLastRefill: Number,
  userId: mongoose.Schema.Types.ObjectId, // Associazione all'utente
});

const userSchema = new mongoose.Schema({
  name: String,
});

const Medication = mongoose.model("Medication", medicationSchema);
const User = mongoose.model("Users", userSchema);



app.post("/api/users/:userId/medications", async (req, res) => {
  try {
    const userId = req.params.userId;
    const medication = new Medication(req.body);
    medication.userId = userId
    await medication.save();
    res.status(200).send(medication);
  } catch (error) {
    console.log(error)
    res.status(500).send("Errore durante l'aggiunta del farmaco.");
  }
});



app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find(); // Recupera tutti gli utenti
    res.json(users);
  } catch (error) {
    res.status(500).send("Errore nel recupero degli utenti.");
  }
});


app.get("/api/users/:userId/medications", async (req, res) => {
  try {
    const userId = req.params.userId;
    const medications = await Medication.find({ userId }); // Assumendo che ogni farmaco abbia un campo userId
    res.json(medications);
  } catch (error) {
    res.status(500).send("Errore nel recupero dei farmaci.");
  }
});


// Endpoint per aggiornare un farmaco
app.put("/api/users/:userId/medications/:medicationId", async (req, res) => {
  try {

    console.log(req.params)
    const { userId, medicationId } = req.params;
    const updatedMedication = req.body;

    // Verifica che il farmaco appartenga all'utente specificato
    const medication = await Medication.findOne({ _id: medicationId, userId });

    if (!medication) {
      return res.status(404).send("Farmaco non trovato o non associato a questo utente.");
    }

    // Aggiorna il farmaco
    Object.assign(medication, updatedMedication);
    await medication.save();

    res.status(200).send(medication);
  } catch (error) {
    console.error(error);
    res.status(500).send("Errore durante l'aggiornamento del farmaco.");
  }
});


// Endpoint per aggiornare la data di ultima ricarica
app.put("/api/users/:userId/medications/:medicationId/remainingPills/:remainingPills/refill", async (req, res) => {
  try {
    const { userId, medicationId, remainingPills, totalPerBox } = req.params;
    // Trova il farmaco e aggiorna la data di ultima ricarica
    const medication = await Medication.findOneAndUpdate(
      { _id: medicationId, userId },
      { 
        lastRefillDate: new Date().toISOString().split("T")[0], // Formato YYYY-MM-DD
        availableSinceLastRefill: Number(remainingPills) + Number(totalPerBox)
      },
      { new: true }
    );

    if (!medication) {
      return res.status(404).send("Farmaco non trovato o non associato a questo utente.");
    }


    res.status(200).send(medication);
  } catch (error) {
    console.error(error);
    res.status(500).send("Errore durante l'aggiornamento della data di ricarica.");
  }
});


// Avvia il server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server avviato sulla porta ${PORT}`);
});