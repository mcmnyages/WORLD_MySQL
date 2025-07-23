import { pool } from '../db/mysql.js';



export async function getAllCities(req, res) {
    try {
        const [rows] = await pool.query('SELECT * FROM City');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


export async function getCitiesPaginated(req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    // Use template literals to inject limit and offset directly into the query string
    const query = `SELECT id, Name, District, Population FROM City ORDER BY Population DESC LIMIT ${limit} OFFSET ${offset}`;
    const [rows] = await pool.query(query);
    res.json({
      page,
      limit,
      cities: rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


export async function getCitiesByCountry(req, res) {
  const countryCode = req.query.country || 'KEN';

  try {
    const [rows] = await pool.execute(
      'SELECT Name, District, Population FROM City WHERE CountryCode = ? ORDER BY Population DESC',
      [countryCode]
    );

    res.json({
      country: countryCode,
      cities: rows,
    });
  } catch (error) {
    console.error('DB error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function getCityByName(req, res) {
    let cityName = req.query.name;
    if (cityName === undefined || cityName === '') {
        cityName = 'Nairobi';
    }
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM City WHERE Name = ?',
            [cityName]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'City not found' });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }  
}
