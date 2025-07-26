// controllers/countryLanguageController.js
import { pool } from '../db/mysql.js';

export async function getCountryLanguages(req, res) {
  try {
    const {
      countryCode,
      language,
      isOfficial,
      minPercentage,
      maxPercentage,
      fields,
      sort = 'percentage_desc',
      page = '1',
      limit = '10'
    } = req.query;

    // ✅ Define safe fields
    const availableFields = ['CountryCode', 'Language', 'IsOfficial', 'Percentage'];

    let selectedFields = availableFields;
    if (fields && fields.trim() !== '') {
      const requestedFields = fields.split(',').map(f => f.trim());
      selectedFields = requestedFields.filter(f => availableFields.includes(f));
      if (selectedFields.length === 0) {
        selectedFields = availableFields;
      }
    }

    const selectClause = selectedFields.join(', ');
    let sql = `SELECT ${selectClause} FROM CountryLanguage`;

    const conditions = [];
    const params = [];

    const addCondition = (cond, val) => {
      conditions.push(cond);
      params.push(val);
    };

    // ✅ Filters
    if (countryCode && countryCode.trim() !== '') {
      addCondition('CountryCode = ?', countryCode.trim().toUpperCase());
    }

    if (language && language.trim() !== '') {
      addCondition('Language LIKE ?', `%${language.trim()}%`);
    }

    if (isOfficial && ['T', 'F'].includes(isOfficial.trim().toUpperCase())) {
      addCondition('IsOfficial = ?', isOfficial.trim().toUpperCase());
    }

    if (minPercentage && !isNaN(minPercentage)) {
      addCondition('Percentage >= ?', parseFloat(minPercentage));
    }

    if (maxPercentage && !isNaN(maxPercentage)) {
      addCondition('Percentage <= ?', parseFloat(maxPercentage));
    }

    // ✅ WHERE
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    // ✅ Sorting
    const validSorts = {
      'percentage_asc': 'Percentage ASC',
      'percentage_desc': 'Percentage DESC',
      'language_asc': 'Language ASC',
      'language_desc': 'Language DESC'
    };

    const orderBy = validSorts[sort] || 'Percentage DESC';
    sql += ` ORDER BY ${orderBy}`;

    // ✅ Pagination
    const pageInt = Math.max(1, parseInt(page, 10) || 1);
    const limitInt = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const offset = (pageInt - 1) * limitInt;

    sql += ` LIMIT ${offset}, ${limitInt}`;

    console.log('[getCountryLanguages] SQL:', sql);
    console.log('[getCountryLanguages] Params:', params);

    // ✅ Execute main query
    const [rows] = await pool.execute(sql, params);

    // ✅ Count for total
    let totalCount = 0;
    let countSql = 'SELECT COUNT(*) as total FROM CountryLanguage';
    const countParams = [...params];
    if (conditions.length > 0) {
      countSql += ' WHERE ' + conditions.join(' AND ');
    }

    const [countResult] = await pool.execute(countSql, countParams);
    totalCount = countResult[0]?.total || 0;

    // ✅ Response
    res.json({
      success: true,
      filters: {
        countryCode: countryCode || null,
        language: language || null,
        isOfficial: isOfficial || null,
        minPercentage: minPercentage || null,
        maxPercentage: maxPercentage || null,
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
      languages: rows
    });

  } catch (err) {
    console.error('[getCountryLanguages] ERROR:', err);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
}
