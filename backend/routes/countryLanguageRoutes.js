import express from 'express';
import { 
    getCountryLanguages

 } from '../controllers/countryLanguageController.js';


const router = express.Router();

router.get('/', getCountryLanguages);


export default router;