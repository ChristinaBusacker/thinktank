import express from 'express';
import cmsRouter from './cms';
import searchRouter from './search';
import contactRouter from './contact';

const router = express.Router();

router.use('/cms', cmsRouter);
router.use('/search', searchRouter);
router.use('/contact', contactRouter);

export default router;