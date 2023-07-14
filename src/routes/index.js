import { Router } from 'express';
import { join } from 'path';

var router = Router();

/*global __dirname*/
router.get('/', (req, res) => res.sendFile(join(__dirname,'../../dist/index.html')));

export default router;
