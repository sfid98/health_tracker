# Usa una base compatibile con ARM64
FROM node:18-alpine

# Imposta la directory di lavoro
WORKDIR /app

# Copia i file package.json e package-lock.json
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia tutto il resto del codice
COPY . .

# Costruisce il progetto
RUN npm run build

# Usa un server statico per servire i file (opzionale)
RUN npm install -g serve

# Espone la porta del frontend
EXPOSE 3000

# Comando di avvio
CMD ["serve", "-s", "build"]
