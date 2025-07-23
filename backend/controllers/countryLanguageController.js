import {pool} from '../db/mysql.js';

export async function getAllCountryLanguages(req, res){
    try {
        const [rows] = await pool.query('SELECT * FROM CountryLanguage');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export async function getAllCountryLanguagesPaginated(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        const [rows] = await pool.query(
            `SELECT * FROM CountryLanguage ORDER BY Language LIMIT ?, ?`,
            [offset, limit]
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}