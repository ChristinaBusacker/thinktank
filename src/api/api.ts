import express from 'express';
import cmsRouter from './cms';
import searchRouter from './search';

const router = express.Router();

router.use('/cms', cmsRouter);
router.use('/search', searchRouter);

// Weitere API-Endpunkte hier definieren...

export default router;