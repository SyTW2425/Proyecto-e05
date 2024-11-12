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

# Compila el proyecto para producción
RUN npm run build

# Instala un servidor para servir los archivos estáticos
RUN npm install -g serve

# Expone el puerto para servir la aplicación
EXPOSE 3000

# Ejecuta el servidor para la aplicación compilada
CMD ["serve", "-s", "dist"]