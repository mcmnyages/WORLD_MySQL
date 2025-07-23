import express from 'express';
import dotenv from 'dotenv';
import citiesRoutes from './routes/citiesRoutes.js';
import countryRoutes from './routes/countryRoutes.js';
import countryLanguageRoutes from './routes/countryLanguageRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.use('/api/cities', citiesRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/country-languages', countryLanguageRoutes);

app.get('/', (req, res) => {
  res.send('🌍 World API is running');
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
