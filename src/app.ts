import 'dotenv/config';
import express from 'express';
import { connectToDatabase } from './database';

const PORT = process.env.PORT || 3000;
const app = express();

// Inicia conexão com o banco de dados
connectToDatabase();

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`SERVER RUNNING => http://localhost:${PORT}/`);
});
