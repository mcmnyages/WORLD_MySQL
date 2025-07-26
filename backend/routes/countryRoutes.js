import express from 'express';
import {  
     getCountries,
     getCountriesFlexible,
     getCountryByCode,
     getContinents,
     getRegions,
     getCountryStats,
     searchCountries,
    } from '../controllers/countryController.js';
const router = express.Router();


router.get('/', getCountries);
router.get('/flexible', getCountriesFlexible);
router.get('/continents', getContinents);
router.get('/regions', getRegions);
router.get('/stats', getCountryStats);
router.get('/:code', getCountryByCode)
router.get('/search/:query', searchCountries);


export default router;