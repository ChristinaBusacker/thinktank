import express from 'express';
import cmsRouter from './cms';
import searchRouter from './search';

const router = express.Router();

router.use('/cms', cmsRouter);
router.use('/search', searchRouter);

export default router;