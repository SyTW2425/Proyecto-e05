import dotenv from 'dotenv';
import mongoose, { mongo } from 'mongoose';
import express from 'express';

dotenv.config();

const mongoURI = process.env.MONGODB_URI!;


const testSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const Test = mongoose.model('Test', testSchema);


mongoose.connect(mongoURI).then(async () => {
  console.log('Conectado a MongoDB');
  
  const testDoc = new Test({ name: 'Test Entry'});
  const savedDoc = await testDoc.save();
  
  console.log('Documento insertado:', savedDoc);
  
  const fetchedDoc = await Test.findById(savedDoc._id);
  console.log('Documento recuperado:', fetchedDoc);
}).catch((err) => {
  console.error('Error de conexión a MongoDB:', err);
});



// const app = express();
// app.use(express.json());


// // Start the server
// const port = process.env.PORT || 5000;
// app.listen(port, () => {
//   console.log(`Servidor corriendo en http://localhost:${port}`);
// });
