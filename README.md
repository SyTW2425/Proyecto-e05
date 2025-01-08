# CineTrunk 🎥🍿

**CineTrunk** es una aplicación web diseñada para los amantes del cine. Permite explorar películas, compartir reseñas, gestionar listas personalizadas y conectar con otros usuarios a través de una experiencia atractiva e interactiva.

## 📚 Descripción del Proyecto
CineTrunk está desarrollado en una arquitectura frontend-backend, utilizando tecnologías modernas como **Vue.js** para el cliente y **Node.js** con **TypeScript** para el servidor. La base de datos utilizada es **MongoDB**, y se integra con la API de **TMDB** para obtener información de películas.

## ⚙️ Configuración Inicial
1. **Clonar el repositorio**
```bash
git clone <URL_DEL_REPOSITORIO>
cd Proyecto-e05
```
2. **Crear el archivo .env**
En las carpeta backend, crea un archivo `.env` con la siguiente configuración:
**Backend (backend/.env)**
```
MONGODB_URI=<TU_MONGODB_URI>
TMDB_API_KEY=<TU_CLAVE_DE_API_TMDB>
```

3. **Instalar dependencias**
```shell
# Instalar dependencias del backend
cd backend
npm install

# Instalar dependencias del frontend
cd ../frontend
npm install
```

## 🚀 Scripts Disponibles
**Backend**
- `npm run dev`: Inicial el servidor en modo desarrollo.
- `npm run test`: Ejecuta las pruebas unitarias.
- `npm run build`: Compila el backend

**Frontend**
- `npm run dev`: Inicial el servidor de desarrollo.
- `npm run test`: Ejecuta las pruebas unitarias.
- `npm run build`: Compila el frontend para producción.

## 🚧 Tareas Pendientes
- Escribir el archivo **Sonar-project** para el control de calidad del código.
- Configurar **Docker**.
