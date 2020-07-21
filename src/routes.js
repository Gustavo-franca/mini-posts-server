import express from 'express';


const app = express.Router();


import appRouter from './app/routes';

app.use('/app',appRouter);

export default app;