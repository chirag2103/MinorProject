import app from './app.js';
import dotenv from 'dotenv';
import connectDatabase from './config/database.js';

dotenv.config({ path: './config/config.env' });

const port = process.env.PORT || 4000;
connectDatabase();
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
