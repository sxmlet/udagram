import { Router } from 'express';
import { FilterImageRouter } from "./filteredimage/routes";

const router: Router = Router();

router.use('/filteredimage', FilterImageRouter);

router.get('/');

export default router
