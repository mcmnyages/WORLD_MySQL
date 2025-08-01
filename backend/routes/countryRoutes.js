import express from 'express';
import {  
     getCountries,
     getCountriesFlexible,
     getCountryByCode,
     getContinents,
     getRegions,
     getWorldData,
     getCountryStats,
     searchCountries,
    } from '../controllers/countryController.js';
const router = express.Router();


router.get('/', getCountries);
router.get('/all', getWorldData);
router.get('/filter-options', getWorldData);
router.get('/flexible', getCountriesFlexible);
router.get('/continents', getContinents);
router.get('/regions', getRegions);
router.get('/stats', getCountryStats);
router.get('/:code', getCountryByCode)
router.get('/search/:query', searchCountries);


export default router;