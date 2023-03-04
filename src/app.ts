import 'dotenv/config';
import express from 'express';

const PORT = 3000;
const app = express();

app.listen(PORT, () => {
  console.log(`SERVER RUNNING => http://localhost:${PORT}/`);
});
