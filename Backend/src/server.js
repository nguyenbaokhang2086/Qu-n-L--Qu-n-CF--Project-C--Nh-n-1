import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js'; // Nhớ đuôi .js
import userRoutes from './routes/userRoutes.js'; // Nhớ đuôi .js
import projectRoutes from './routes/projectRoutes.js';
import { swaggerDocs } from './swagger.js';
import cors from 'cors';

// Load biến môi trường
dotenv.config();

const app = express();

// Cấu hình CORS
const allowedOrigins = [
  "https://app.com",
  "https://admin.app.com",
  "http://localhost:3000"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// Swagger docs
swaggerDocs(app);

// Middleware quan trọng: Giúp Express hiểu được dữ liệu JSON
// Nếu thiếu dòng này, req.body sẽ bị undefined
app.use(express.json());

// Kết nối Database
connectDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});