// controllers/countryController.js
import { pool } from '../db/mysql.js';

/**
 * GET /api/countries
 * Get countries with dynamic filtering, field selection, sorting, and pagination
 */
export async function getCountries(req, res) {
  try {
    const {
      // Existing filters
      region,
      continent,
      name,
      minPopulation,
      maxPopulation,
      minSurfaceArea,
      maxSurfaceArea,
      
      // New dynamic filters
      code,
      localName,
      governmentForm,
      headOfState,
      minLifeExpectancy,
      maxLifeExpectancy,
      minGNP,
      maxGNP,
      minIndepYear,
      maxIndepYear,
      
      // Field selection
      fields,
      
      // Sorting and pagination
      sort = 'name_asc',
      page = '1',
      limit = '10'
    } = req.query;

    // Define available fields for security
    const availableFields = [
      'Code', 'Name', 'Continent', 'Region', 'SurfaceArea', 
      'IndepYear', 'Population', 'LifeExpectancy', 'GNP', 
      'GNPOld', 'LocalName', 'GovernmentForm', 'HeadOfState', 
      'Capital', 'Code2'
    ];

    // Handle field selection
    let selectedFields = availableFields;
    if (fields && fields.trim() !== '') {
      const requestedFields = fields.split(',').map(f => f.trim());
      selectedFields = requestedFields.filter(field => 
        availableFields.includes(field)
      );
      
      // If no valid fields provided, use all fields
      if (selectedFields.length === 0) {
        selectedFields = availableFields;
      }
    }

    // Build the SELECT clause
    const selectClause = selectedFields.join(', ');
    let sql = `SELECT ${selectClause} FROM Country`;

    const conditions = [];
    const params = [];

    // Helper function to add conditions
    const addCondition = (condition, value) => {
      conditions.push(condition);
      params.push(value);
    };

    // String filters (exact and partial matches)
    if (region && region.trim() !== '') {
      addCondition('Region = ?', region.trim());
    }

    if (continent && continent.trim() !== '') {
      addCondition('Continent = ?', continent.trim());
    }

    if (name && name.trim() !== '') {
      addCondition('Name LIKE ?', `%${name.trim()}%`);
    }

    if (code && code.trim() !== '') {
      // Support both exact match and partial match for code
      if (code.trim().length === 3) {
        addCondition('Code = ?', code.trim().toUpperCase());
      } else {
        addCondition('Code LIKE ?', `%${code.trim().toUpperCase()}%`);
      }
    }

    if (localName && localName.trim() !== '') {
      addCondition('LocalName LIKE ?', `%${localName.trim()}%`);
    }

    if (governmentForm && governmentForm.trim() !== '') {
      addCondition('GovernmentForm LIKE ?', `%${governmentForm.trim()}%`);
    }

    if (headOfState && headOfState.trim() !== '') {
      addCondition('HeadOfState LIKE ?', `%${headOfState.trim()}%`);
    }

    // Numeric range filters
    if (minPopulation && !isNaN(minPopulation)) {
      addCondition('Population >= ?', parseInt(minPopulation, 10));
    }

    if (maxPopulation && !isNaN(maxPopulation)) {
      addCondition('Population <= ?', parseInt(maxPopulation, 10));
    }

    if (minSurfaceArea && !isNaN(minSurfaceArea)) {
      addCondition('SurfaceArea >= ?', parseFloat(minSurfaceArea));
    }

    if (maxSurfaceArea && !isNaN(maxSurfaceArea)) {
      addCondition('SurfaceArea <= ?', parseFloat(maxSurfaceArea));
    }

    if (minLifeExpectancy && !isNaN(minLifeExpectancy)) {
      addCondition('LifeExpectancy >= ?', parseFloat(minLifeExpectancy));
    }

    if (maxLifeExpectancy && !isNaN(maxLifeExpectancy)) {
      addCondition('LifeExpectancy <= ?', parseFloat(maxLifeExpectancy));
    }

    if (minGNP && !isNaN(minGNP)) {
      addCondition('GNP >= ?', parseFloat(minGNP));
    }

    if (maxGNP && !isNaN(maxGNP)) {
      addCondition('GNP <= ?', parseFloat(maxGNP));
    }

    if (minIndepYear && !isNaN(minIndepYear)) {
      addCondition('IndepYear >= ?', parseInt(minIndepYear, 10));
    }

    if (maxIndepYear && !isNaN(maxIndepYear)) {
      addCondition('IndepYear <= ?', parseInt(maxIndepYear, 10));
    }

    // Add WHERE clause if conditions exist
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    // Enhanced sorting options
    const validSorts = {
      'name_asc': 'Name ASC',
      'name_desc': 'Name DESC',
      'population_asc': 'Population ASC',
      'population_desc': 'Population DESC',
      'surfaceArea_asc': 'SurfaceArea ASC',
      'surfaceArea_desc': 'SurfaceArea DESC',
      'lifeExpectancy_asc': 'LifeExpectancy ASC',
      'lifeExpectancy_desc': 'LifeExpectancy DESC',
      'gnp_asc': 'GNP ASC',
      'gnp_desc': 'GNP DESC',
      'indepYear_asc': 'IndepYear ASC',
      'indepYear_desc': 'IndepYear DESC',
      'code_asc': 'Code ASC',
      'code_desc': 'Code DESC'
    };

    const orderBy = validSorts[sort] || 'Name ASC';
    sql += ` ORDER BY ${orderBy}`;

    // Pagination
    const pageInt = Math.max(1, parseInt(page, 10) || 1);
    const limitInt = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const offset = (pageInt - 1) * limitInt;

    sql += ` LIMIT ${offset}, ${limitInt}`;

    console.log('[getCountries] SQL:', sql);
    console.log('[getCountries] Params:', params);

    // Execute main query with retry logic
    let rows;
    try {
      [rows] = await pool.execute(sql, params);
    } catch (executeError) {
      console.error('[getCountries] Main query error:', executeError);
      
      // Retry logic for connection issues
      if (executeError.code === 'ER_MALFORMED_PACKET' || executeError.code === 'ECONNRESET') {
        console.log('[getCountries] Retrying query due to connection issue...');
        try {
          [rows] = await pool.execute(sql, params);
        } catch (retryError) {
          console.error('[getCountries] Retry failed:', retryError);
          throw retryError;
        }
      } else {
        throw executeError;
      }
    }

    // Get total count for pagination
    let totalCount = 0;
    try {
      let countSql = 'SELECT COUNT(*) as total FROM Country';
      const countParams = [...params]; // Create a copy of params
      
      if (conditions.length > 0) {
        countSql += ' WHERE ' + conditions.join(' AND ');
      }
      
      console.log('[getCountries] Count SQL:', countSql);
      console.log('[getCountries] Count Params:', countParams);
      
      const [countResult] = await pool.execute(countSql, countParams);
      totalCount = countResult[0]?.total || 0;
    } catch (countErr) {
      console.error('[getCountries] Count query error:', countErr);
      // Fallback estimation
      totalCount = rows.length === limitInt ? (pageInt * limitInt) + 1 : (pageInt - 1) * limitInt + rows.length;
    }

    // Response
    res.json({
      success: true,
      filters: {
        region: region || null,
        continent: continent || null,
        name: name || null,
        code: code || null,
        localName: localName || null,
        governmentForm: governmentForm || null,
        headOfState: headOfState || null,
        minPopulation: minPopulation || null,
        maxPopulation: maxPopulation || null,
        minSurfaceArea: minSurfaceArea || null,
        maxSurfaceArea: maxSurfaceArea || null,
        minLifeExpectancy: minLifeExpectancy || null,
        maxLifeExpectancy: maxLifeExpectancy || null,
        minGNP: minGNP || null,
        maxGNP: maxGNP || null,
        minIndepYear: minIndepYear || null,
        maxIndepYear: maxIndepYear || null,
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
      countries: rows
    });

  } catch (err) {
    console.error('[getCountries] ERROR:', err);
    res.status(500).json({ 
      success: false,
      error: 'Server error',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
}

/**
 * GET /api/countries/flexible
 * Alternative endpoint for more flexible querying with JSON-based filters
 */
export async function getCountriesFlexible(req, res) {
  try {
    const {
      filters = '{}',
      fields,
      sort = 'name_asc',
      page = '1',
      limit = '10'
    } = req.query;

    // Parse filters from JSON
    let filterObj = {};
    try {
      filterObj = JSON.parse(filters);
    } catch (parseErr) {
      return res.status(400).json({
        success: false,
        error: 'Invalid filters JSON format'
      });
    }

    // Available fields for security
    const availableFields = [
      'Code', 'Name', 'Continent', 'Region', 'SurfaceArea', 
      'IndepYear', 'Population', 'LifeExpectancy', 'GNP', 
      'GNPOld', 'LocalName', 'GovernmentForm', 'HeadOfState', 
      'Capital', 'Code2'
    ];

    // Handle field selection
    let selectedFields = availableFields;
    if (fields && fields.trim() !== '') {
      const requestedFields = fields.split(',').map(f => f.trim());
      selectedFields = requestedFields.filter(field => 
        availableFields.includes(field)
      );
      
      if (selectedFields.length === 0) {
        selectedFields = availableFields;
      }
    }

    const selectClause = selectedFields.join(', ');
    let sql = `SELECT ${selectClause} FROM Country`;

    const conditions = [];
    const params = [];

    // Process filters dynamically
    Object.entries(filterObj).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') return;

      switch (key) {
        case 'name':
        case 'localName':
        case 'governmentForm':
        case 'headOfState':
          conditions.push(`${key === 'localName' ? 'LocalName' : 
                          key === 'governmentForm' ? 'GovernmentForm' :
                          key === 'headOfState' ? 'HeadOfState' : 'Name'} LIKE ?`);
          params.push(`%${value}%`);
          break;
        
        case 'region':
        case 'continent':
          conditions.push(`${key === 'region' ? 'Region' : 'Continent'} = ?`);
          params.push(value);
          break;
        
        case 'code':
          if (value.length === 3) {
            conditions.push('Code = ?');
            params.push(value.toUpperCase());
          } else {
            conditions.push('Code LIKE ?');
            params.push(`%${value.toUpperCase()}%`);
          }
          break;
        
        case 'population':
        case 'surfaceArea':
        case 'lifeExpectancy':
        case 'gnp':
        case 'indepYear':
          if (typeof value === 'object') {
            const fieldName = key === 'surfaceArea' ? 'SurfaceArea' :
                            key === 'lifeExpectancy' ? 'LifeExpectancy' :
                            key === 'gnp' ? 'GNP' :
                            key === 'indepYear' ? 'IndepYear' :
                            'Population';
            
            if (value.min !== undefined && value.min !== null) {
              conditions.push(`${fieldName} >= ?`);
              params.push(value.min);
            }
            if (value.max !== undefined && value.max !== null) {
              conditions.push(`${fieldName} <= ?`);
              params.push(value.max);
            }
          }
          break;
      }
    });

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    // Sorting
    const validSorts = {
      'name_asc': 'Name ASC', 'name_desc': 'Name DESC',
      'population_asc': 'Population ASC', 'population_desc': 'Population DESC',
      'surfaceArea_asc': 'SurfaceArea ASC', 'surfaceArea_desc': 'SurfaceArea DESC',
      'lifeExpectancy_asc': 'LifeExpectancy ASC', 'lifeExpectancy_desc': 'LifeExpectancy DESC',
      'gnp_asc': 'GNP ASC', 'gnp_desc': 'GNP DESC',
      'indepYear_asc': 'IndepYear ASC', 'indepYear_desc': 'IndepYear DESC',
      'code_asc': 'Code ASC', 'code_desc': 'Code DESC'
    };

    const orderBy = validSorts[sort] || 'Name ASC';
    sql += ` ORDER BY ${orderBy}`;

    // Pagination
    const pageInt = Math.max(1, parseInt(page, 10) || 1);
    const limitInt = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const offset = (pageInt - 1) * limitInt;

    sql += ` LIMIT ${offset}, ${limitInt}`;

    console.log('[getCountriesFlexible] SQL:', sql);
    console.log('[getCountriesFlexible] Params:', params);

    const [rows] = await pool.execute(sql, params);

    // Get total count
    let totalCount = 0;
    try {
      let countSql = 'SELECT COUNT(*) as total FROM Country';
      if (conditions.length > 0) {
        countSql += ' WHERE ' + conditions.join(' AND ');
      }
      
      const [countResult] = await pool.execute(countSql, [...params]);
      totalCount = countResult[0]?.total || 0;
    } catch (countErr) {
      console.error('[getCountriesFlexible] Count query error:', countErr);
      totalCount = rows.length === limitInt ? (pageInt * limitInt) + 1 : (pageInt - 1) * limitInt + rows.length;
    }

    res.json({
      success: true,
      appliedFilters: filterObj,
      selectedFields: selectedFields,
      pagination: {
        page: pageInt,
        limit: limitInt,
        count: rows.length,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitInt)
      },
      countries: rows
    });

  } catch (err) {
    console.error('[getCountriesFlexible] ERROR:', err);
    res.status(500).json({ 
      success: false,
      error: 'Server error',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
}

// Keep your existing functions unchanged
export async function getCountryByCode(req, res) {
  try {
    const { code } = req.params;

    if (!code || code.length !== 3) {
      return res.status(400).json({
        success: false,
        error: 'Invalid country code. Must be 3 characters.'
      });
    }

    const sql = `
      SELECT
        Code,
        Name,
        Continent,
        Region,
        SurfaceArea,
        IndepYear,
        Population,
        LifeExpectancy,
        GNP,
        GNPOld,
        LocalName,
        GovernmentForm,
        HeadOfState,
        Capital,
        Code2
      FROM Country
      WHERE Code = ?
    `;

    const [rows] = await pool.execute(sql, [code.toUpperCase()]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Country not found'
      });
    }

    res.json({
      success: true,
      country: rows[0]
    });

  } catch (err) {
    console.error('[getCountryByCode] ERROR:', err);
    res.status(500).json({ 
      success: false,
      error: 'Server error'
    });
  }
}

export async function getContinents(req, res) {
  try {
    const sql = `
      SELECT 
        Continent,
        COUNT(*) as countryCount,
        SUM(Population) as totalPopulation,
        AVG(Population) as avgPopulation,
        SUM(SurfaceArea) as totalSurfaceArea
      FROM Country 
      GROUP BY Continent 
      ORDER BY Continent
    `;

    const [rows] = await pool.execute(sql);

    res.json({
      success: true,
      continents: rows
    });

  } catch (err) {
    console.error('[getContinents] ERROR:', err);
    res.status(500).json({ 
      success: false,
      error: 'Server error'
    });
  }
}

export async function getRegions(req, res) {
  try {
    const { continent } = req.query;

    let sql = `
      SELECT 
        Region,
        Continent,
        COUNT(*) as countryCount,
        SUM(Population) as totalPopulation,
        AVG(Population) as avgPopulation,
        SUM(SurfaceArea) as totalSurfaceArea
      FROM Country
    `;

    const params = [];

    if (continent && continent.trim() !== '') {
      sql += ' WHERE Continent = ?';
      params.push(continent.trim());
    }

    sql += ' GROUP BY Region, Continent ORDER BY Continent, Region';

    const [rows] = await pool.execute(sql, params);

    res.json({
      success: true,
      filters: {
        continent: continent || null
      },
      regions: rows
    });

  } catch (err) {
    console.error('[getRegions] ERROR:', err);
    res.status(500).json({ 
      success: false,
      error: 'Server error'
    });
  }
}

export async function getCountryStats(req, res) {
  try {
    const sql = `
      SELECT 
        COUNT(*) as totalCountries,
        SUM(Population) as worldPopulation,
        AVG(Population) as avgPopulation,
        MAX(Population) as maxPopulation,
        MIN(Population) as minPopulation,
        SUM(SurfaceArea) as totalSurfaceArea,
        AVG(SurfaceArea) as avgSurfaceArea,
        MAX(SurfaceArea) as maxSurfaceArea,
        MIN(SurfaceArea) as minSurfaceArea,
        AVG(LifeExpectancy) as avgLifeExpectancy,
        MAX(LifeExpectancy) as maxLifeExpectancy,
        MIN(LifeExpectancy) as minLifeExpectancy,
        COUNT(DISTINCT Continent) as totalContinents,
        COUNT(DISTINCT Region) as totalRegions
      FROM Country
    `;

    const [rows] = await pool.execute(sql);

    const topCountriesSql = `
      SELECT Name, Population, Continent
      FROM Country 
      ORDER BY Population DESC 
      LIMIT 10
    `;

    const [topCountries] = await pool.execute(topCountriesSql);

    const largestCountriesSql = `
      SELECT Name, SurfaceArea, Continent
      FROM Country 
      ORDER BY SurfaceArea DESC 
      LIMIT 10
    `;

    const [largestCountries] = await pool.execute(largestCountriesSql);

    res.json({
      success: true,
      stats: rows[0],
      topCountriesByPopulation: topCountries,
      largestCountriesByArea: largestCountries
    });

  } catch (err) {
    console.error('[getCountryStats] ERROR:', err);
    res.status(500).json({ 
      success: false,
      error: 'Server error'
    });
  }
}

export async function searchCountries(req, res) {
  try {
    const { query } = req.params;
    const { limit = '10' } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Search query must be at least 2 characters'
      });
    }

    const limitInt = Math.max(1, Math.min(50, parseInt(limit, 10) || 10));

    const sql = `
      SELECT
        Code,
        Name,
        Continent,
        Region,
        Population,
        SurfaceArea
      FROM Country
      WHERE Name LIKE ? OR LocalName LIKE ?
      ORDER BY 
        CASE 
          WHEN Name LIKE ? THEN 1
          WHEN Name LIKE ? THEN 2
          ELSE 3
        END,
        Population DESC
      LIMIT ${limitInt}
    `;

    const searchTerm = query.trim();
    const exactMatch = `${searchTerm}%`;
    const partialMatch = `%${searchTerm}%`;

    const [rows] = await pool.execute(sql, [
      partialMatch, partialMatch, exactMatch, partialMatch
    ]);

    res.json({
      success: true,
      query: searchTerm,
      count: rows.length,
      countries: rows
    });

  } catch (err) {
    console.error('[searchCountries] ERROR:', err);
    res.status(500).json({ 
      success: false,
      error: 'Server error'
    });
  }
}