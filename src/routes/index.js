import { Router } from 'express';
import { join } from 'path';

var router = Router();

/* GET home page. */
router.get('/', (req, res, next) => res.sendFile(join(__dirname,'../../dist/index.html')));

export default router;
