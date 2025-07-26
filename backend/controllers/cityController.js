// controllers/cityController.js
import { pool } from '../db/mysql.js';

export async function getCities(req, res) {
  try {
    const {
      name,
      countryCode,
      district,
      minPopulation,
      maxPopulation,
      fields,
      sort = 'name_asc',
      page = '1',
      limit = '10'
    } = req.query;

    // ✅ Allowed fields
    const availableFields = [
      'ID', 'Name', 'CountryCode', 'District', 'Population'
    ];

    // ✅ Field selection logic
    let selectedFields = availableFields;
    if (fields && fields.trim() !== '') {
      const requestedFields = fields.split(',').map(f => f.trim());
      selectedFields = requestedFields.filter(f => availableFields.includes(f));
      if (selectedFields.length === 0) {
        selectedFields = availableFields;
      }
    }

    const selectClause = selectedFields.join(', ');
    let sql = `SELECT ${selectClause} FROM City`;

    const conditions = [];
    const params = [];

    const addCondition = (cond, value) => {
      conditions.push(cond);
      params.push(value);
    };

    // ✅ Filters
    if (name && name.trim() !== '') {
      addCondition('Name LIKE ?', `%${name.trim()}%`);
    }

    if (countryCode && countryCode.trim() !== '') {
      addCondition('CountryCode = ?', countryCode.trim().toUpperCase());
    }

    if (district && district.trim() !== '') {
      addCondition('District LIKE ?', `%${district.trim()}%`);
    }

    if (minPopulation && !isNaN(minPopulation)) {
      addCondition('Population >= ?', parseInt(minPopulation, 10));
    }

    if (maxPopulation && !isNaN(maxPopulation)) {
      addCondition('Population <= ?', parseInt(maxPopulation, 10));
    }

    // ✅ WHERE
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    // ✅ Sorting
    const validSorts = {
      'name_asc': 'Name ASC',
      'name_desc': 'Name DESC',
      'population_asc': 'Population ASC',
      'population_desc': 'Population DESC'
    };

    const orderBy = validSorts[sort] || 'Name ASC';
    sql += ` ORDER BY ${orderBy}`;

    // ✅ Pagination
    const pageInt = Math.max(1, parseInt(page, 10) || 1);
    const limitInt = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const offset = (pageInt - 1) * limitInt;

    sql += ` LIMIT ${offset}, ${limitInt}`;

    console.log('[getCities] SQL:', sql);
    console.log('[getCities] Params:', params);

    // ✅ Query
    const [rows] = await pool.execute(sql, params);

    // ✅ Count
    let totalCount = 0;
    let countSql = 'SELECT COUNT(*) as total FROM City';
    const countParams = [...params];

    if (conditions.length > 0) {
      countSql += ' WHERE ' + conditions.join(' AND ');
    }

    const [countResult] = await pool.execute(countSql, countParams);
    totalCount = countResult[0]?.total || 0;

    res.json({
      success: true,
      filters: {
        name: name || null,
        countryCode: countryCode || null,
        district: district || null,
        minPopulation: minPopulation || null,
        maxPopulation: maxPopulation || null,
        sort,
        fields: fields || null
      },
      pagination: {
        page: pageInt,
        limit: limitInt,
        count: rows.length,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitInt)
      },
      cities: rows
    });

  } catch (err) {
    console.error('[getCities] ERROR:', err);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
}
