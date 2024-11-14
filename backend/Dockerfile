# Usa una imagen oficial de Node.js como base
FROM node:18

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de package.json y package-lock.json
COPY package*.json ./

# Actualizar a la versión 10.9.0
RUN npm install -g npm@10.9.0

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos del proyecto
COPY . .


# Expone el puerto en el que corre el servidor
EXPOSE 5000

# Ejecuta el servidor
CMD ["npm", "run", "start"]