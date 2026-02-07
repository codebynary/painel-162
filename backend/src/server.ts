import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());

// Request logger for debugging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.get('/', (req, res) => {
    res.json({ message: 'Painel 162 Backend API - Online' });
});

import authRoutes from './modules/auth/auth.routes';
import characterRoutes from './modules/characters/characters.routes';
import donateRoutes from './modules/donate/donate.routes';
import adminRoutes from './modules/admin/admin.routes';
import serverRoutes from './modules/server/server.routes';
import { checkDatabaseConnection } from './config/database';

app.use('/api/auth', authRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api/donate', donateRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/server', serverRoutes);

checkDatabaseConnection();

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
