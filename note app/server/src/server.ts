import app from './app';
import { connectDB } from './config/db';
import { PORT } from './config/jwt';

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});