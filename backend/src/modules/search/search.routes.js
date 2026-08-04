import { Router } from 'express';
import { search, suggest } from './search.controller.js';
import { validateSearch, validateSuggest } from './search.validator.js';

const router = Router();

router.get('/', validateSearch, search);
router.get('/suggest', validateSuggest, suggest);

export default router;
