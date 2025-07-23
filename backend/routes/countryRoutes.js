import express from 'express';
import { 
    getAllCountries,
    getCountriesPaginated,
    getCountryByCode,
    getCountriesByRegion,
    getCountriesByLanguage,

} from '../controllers/countryController.js';
const router = express.Router();


router.get('/', getAllCountries);
router.get('/paginated', getCountriesPaginated);
router.get('/:code', getCountryByCode);
router.get('/region', getCountriesByRegion);
router.get('/language', getCountriesByLanguage);


export default router;