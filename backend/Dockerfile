# Usa un'immagine Node.js
FROM node:16

# Crea la directory di lavoro
WORKDIR /usr/src/app

# Copia i file package.json e package-lock.json
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia l'intera directory
COPY . .

# Espone la porta 5500
EXPOSE 5500

# Comando di avvio
CMD node start.js 