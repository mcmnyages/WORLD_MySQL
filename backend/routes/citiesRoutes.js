import express from 'express';
import { getAllCities, 
    getCitiesByCountry, 
    getCitiesPaginated,
    getCityByName
} from '../controllers/cityController.js';

const router = express.Router();

router.get('/', getAllCities)
router.get('/cityByCountryCode', getCitiesByCountry);
router.get('/paginated', getCitiesPaginated);
router.get('/cityByName', getCityByName);

export default router;
