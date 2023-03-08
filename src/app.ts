import 'dotenv/config';
import express from 'express';
import { connectToDatabase } from './database';
import commentRoutes from './routes/commentRoutes';
import postRoutes from './routes/postRoutes';
import userRoutes from './routes/userRoutes';

const PORT = process.env.PORT || 3000;
const app = express();

// Rotas
app.use('/comments', commentRoutes);
app.use('/posts', postRoutes);
app.use('/users', userRoutes);

// Inicia conexão com o banco de dados
connectToDatabase();

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`SERVER RUNNING => http://localhost:${PORT}/`);
});
