const { exec } = require('child_process');
const axios = require('axios');

const couchdbUrl = process.env.MONGO_URI || "http://admin:admin@couchdb:5984";

// Funzione per verificare se CouchDB è pronto
async function checkCouchDBReady() {
  try {
    const response = await axios.get(couchdbUrl);
    return response.status === 200;
  } catch (error) {
    console.log("CouchDB non è ancora pronto...");
    return false;
  }
}

// Funzione per eseguire comandi shell
function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Errore durante l'esecuzione del comando: ${command}`, error);
        reject(error);
      } else {
        console.log(stdout);
        resolve(stdout);
      }
    });
  });
}

// Avvia il server e poi inizializza il database
async function start() {
  try {
    // Avvia il server
    const serverProcess = exec('node server.js');

    // Attendi che CouchDB sia pronto
    let isCouchDBReady = false;
    while (!isCouchDBReady) {
      isCouchDBReady = await checkCouchDBReady();
      if (!isCouchDBReady) {
        await new Promise(resolve => setTimeout(resolve, 5000)); // Attendi 5 secondi prima di riprovare
      }
    }

    // Inizializza il database
    await runCommand('node init-couchdb.js');

    console.log('Server e database inizializzati con successo.');
  } catch (error) {
    console.error('Errore durante l\'avvio del server o l\'inizializzazione del database:', error);
    process.exit(1);
  }
}

start();