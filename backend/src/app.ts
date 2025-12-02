import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.route.js';
import healthRoutes from './routes/health.route.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 라우터 등록
app.use('/api/auth', authRoutes);
app.use('/api/health', healthRoutes);

app.get('/', (req, res) => {
  res.send('Salus Backend API is running...');
});

export default app;