import {pool} from '../db/mysql.js';

export async function getAllCountries(req, res) {
    try {
        const [rows] = await pool.query('SELECT * FROM Country');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }

}



export async function getCountriesPaginated(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        const [rows] = await pool.query(
            `SELECT * FROM Country ORDER BY Name LIMIT ?, ?`,
            [offset, limit]
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}



export async function getCountryByCode(req, res) {
    const countryCode = req.params.code;

    try {
        const [rows] = await pool.query('SELECT * FROM Country WHERE Code = ?', [countryCode]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Country not found' });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export async function getCountriesByRegion(req, res) {
    const region = req.query.region || 'Africa';

    try {
        const [rows] = await pool.query('SELECT * FROM Country WHERE Region = ? ORDER BY Name', [region]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'No countries found in this region' });
        }

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export async function getCountryByName(req, res) {
    let countryName = req.query.name;
    if (countryName === undefined || countryName === '') {
        countryName = 'Kenya';
    }
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM Country WHERE Name = ?',
            [countryName]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Country not found' });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }  
}

export async function getCountriesByLanguage(req, res) {
    const language = req.query.language || 'English';

    try {
        const [rows] = await pool.query(
            'SELECT Country.Name, Country.Code FROM Country JOIN CountryLanguage ON Country.Code = CountryLanguage.CountryCode WHERE CountryLanguage.Language = ? ORDER BY Country.Name',
            [language]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'No countries found with this language' });
        }

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

