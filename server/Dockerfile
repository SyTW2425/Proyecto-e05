# Usa una imagen oficial de Node.js como base
FROM node:16

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos del proyecto
COPY . .

# Compila el proyecto
RUN npm run build

# Expone el puerto en el que corre el servidor
EXPOSE 5000

# Ejecuta el servidor
CMD ["npm", "run", "start"]