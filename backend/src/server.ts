import app from './app.js';
import * as dotenv from 'dotenv';

dotenv.config();

(BigInt.prototype as any).toJSON = function () {
  return Number(this);
};

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});