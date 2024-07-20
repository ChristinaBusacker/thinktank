import express from 'express';
import cmsRouter from './cms';

const router = express.Router();

router.use('/cms', cmsRouter);

// Weitere API-Endpunkte hier definieren...

export default router;