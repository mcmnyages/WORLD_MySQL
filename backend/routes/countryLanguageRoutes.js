import express from 'express';
import { 
    getAllCountryLanguages,
    getAllCountryLanguagesPaginated

 } from '../controllers/countryLanguageController.js';


const router = express.Router();

router.get('/', getAllCountryLanguages);
router.get('/paginated', getAllCountryLanguagesPaginated);

export default router;