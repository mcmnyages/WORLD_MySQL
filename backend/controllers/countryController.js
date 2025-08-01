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


export async function getWorldData(req, res) {
  try {
    const {
      // Country filters
      region,
      continent,
      countryName,
      countryCode,
      localName,
      governmentForm,
      headOfState,
      minPopulation,
      maxPopulation,
      minSurfaceArea,
      maxSurfaceArea,
      minLifeExpectancy,
      maxLifeExpectancy,
      minGNP,
      maxGNP,
      minIndepYear,
      maxIndepYear,
      
      // City filters
      cityName,
      district,
      minCityPopulation,
      maxCityPopulation,
      
      // Language filters
      language,
      isOfficial, // 'true', 'false', or undefined for both
      minLanguagePercentage,
      maxLanguagePercentage,
      
      // Data options
      includeCapitalOnly, // 'true' to only include capital cities
      includeOfficialLanguagesOnly, // 'true' to only include official languages
      groupBy, // 'country', 'city', 'language' - affects how data is structured
      
      // Field selection
      fields,
      
      // Sorting and pagination
      sort = 'country_name_asc',
      page = '1',
      limit = '20'
    } = req.query;

    // Define available fields for security
    const availableFields = {
      country: [
        'co.Code as country_code', 'co.Name as country_name', 'co.Continent as continent',
        'co.Region as region', 'co.SurfaceArea as surface_area', 'co.IndepYear as independence_year',
        'co.Population as country_population', 'co.LifeExpectancy as life_expectancy',
        'co.GNP as gnp', 'co.GNPOld as gnp_old', 'co.LocalName as local_name',
        'co.GovernmentForm as government_form', 'co.HeadOfState as head_of_state',
        'co.Capital as capital_id', 'co.Code2 as country_code2'
      ],
      city: [
        'ci.ID as city_id', 'ci.Name as city_name', 'ci.CountryCode as city_country_code',
        'ci.District as district', 'ci.Population as city_population'
      ],
      capital: [
        'cap.Name as capital_name', 'cap.Population as capital_population'
      ],
      language: [
        'cl.Language as language_name', 'cl.IsOfficial as is_official',
        'cl.Percentage as language_percentage'
      ]
    };

    // Handle field selection
    let selectedFields = [
      ...availableFields.country,
      ...availableFields.city,
      ...availableFields.capital,
      ...availableFields.language
    ];

    if (fields && fields.trim() !== '') {
      const requestedCategories = fields.split(',').map(f => f.trim());
      selectedFields = [];
      
      requestedCategories.forEach(category => {
        if (availableFields[category]) {
          selectedFields.push(...availableFields[category]);
        }
      });
      
      // If no valid categories provided, use all fields
      if (selectedFields.length === 0) {
        selectedFields = [
          ...availableFields.country,
          ...availableFields.city,
          ...availableFields.capital,
          ...availableFields.language
        ];
      }
    }

    // Build the SELECT clause
    const selectClause = selectedFields.join(', ');
    
    // Base query with joins
    let sql = `
      SELECT DISTINCT ${selectClause}
      FROM country co
      LEFT JOIN city cap ON co.Capital = cap.ID
      LEFT JOIN city ci ON co.Code = ci.CountryCode
      LEFT JOIN countrylanguage cl ON co.Code = cl.CountryCode
    `;

    // Handle special cases
    if (includeCapitalOnly === 'true') {
      sql = sql.replace('LEFT JOIN city ci ON co.Code = ci.CountryCode', 
                       'LEFT JOIN city ci ON co.Capital = ci.ID');
    }

    if (includeOfficialLanguagesOnly === 'true') {
      sql = sql.replace('LEFT JOIN countrylanguage cl ON co.Code = cl.CountryCode',
                       'LEFT JOIN countrylanguage cl ON co.Code = cl.CountryCode AND cl.IsOfficial = "T"');
    }

    const conditions = [];
    const params = [];

    // Helper function to add conditions
    const addCondition = (condition, value) => {
      conditions.push(condition);
      params.push(value);
    };

    // Country filters
    if (region && region.trim() !== '') {
      addCondition('co.Region = ?', region.trim());
    }

    if (continent && continent.trim() !== '') {
      addCondition('co.Continent = ?', continent.trim());
    }

    if (countryName && countryName.trim() !== '') {
      addCondition('co.Name LIKE ?', `%${countryName.trim()}%`);
    }

    if (countryCode && countryCode.trim() !== '') {
      if (countryCode.trim().length === 3) {
        addCondition('co.Code = ?', countryCode.trim().toUpperCase());
      } else {
        addCondition('co.Code LIKE ?', `%${countryCode.trim().toUpperCase()}%`);
      }
    }

    if (localName && localName.trim() !== '') {
      addCondition('co.LocalName LIKE ?', `%${localName.trim()}%`);
    }

    if (governmentForm && governmentForm.trim() !== '') {
      addCondition('co.GovernmentForm LIKE ?', `%${governmentForm.trim()}%`);
    }

    if (headOfState && headOfState.trim() !== '') {
      addCondition('co.HeadOfState LIKE ?', `%${headOfState.trim()}%`);
    }

    // Country numeric filters
    if (minPopulation && !isNaN(minPopulation)) {
      addCondition('co.Population >= ?', parseInt(minPopulation, 10));
    }

    if (maxPopulation && !isNaN(maxPopulation)) {
      addCondition('co.Population <= ?', parseInt(maxPopulation, 10));
    }

    if (minSurfaceArea && !isNaN(minSurfaceArea)) {
      addCondition('co.SurfaceArea >= ?', parseFloat(minSurfaceArea));
    }

    if (maxSurfaceArea && !isNaN(maxSurfaceArea)) {
      addCondition('co.SurfaceArea <= ?', parseFloat(maxSurfaceArea));
    }

    if (minLifeExpectancy && !isNaN(minLifeExpectancy)) {
      addCondition('co.LifeExpectancy >= ?', parseFloat(minLifeExpectancy));
    }

    if (maxLifeExpectancy && !isNaN(maxLifeExpectancy)) {
      addCondition('co.LifeExpectancy <= ?', parseFloat(maxLifeExpectancy));
    }

    if (minGNP && !isNaN(minGNP)) {
      addCondition('co.GNP >= ?', parseFloat(minGNP));
    }

    if (maxGNP && !isNaN(maxGNP)) {
      addCondition('co.GNP <= ?', parseFloat(maxGNP));
    }

    if (minIndepYear && !isNaN(minIndepYear)) {
      addCondition('co.IndepYear >= ?', parseInt(minIndepYear, 10));
    }

    if (maxIndepYear && !isNaN(maxIndepYear)) {
      addCondition('co.IndepYear <= ?', parseInt(maxIndepYear, 10));
    }

    // City filters
    if (cityName && cityName.trim() !== '') {
      addCondition('ci.Name LIKE ?', `%${cityName.trim()}%`);
    }

    if (district && district.trim() !== '') {
      addCondition('ci.District LIKE ?', `%${district.trim()}%`);
    }

    if (minCityPopulation && !isNaN(minCityPopulation)) {
      addCondition('ci.Population >= ?', parseInt(minCityPopulation, 10));
    }

    if (maxCityPopulation && !isNaN(maxCityPopulation)) {
      addCondition('ci.Population <= ?', parseInt(maxCityPopulation, 10));
    }

    // Language filters
    if (language && language.trim() !== '') {
      addCondition('cl.Language LIKE ?', `%${language.trim()}%`);
    }

    if (isOfficial === 'true') {
      addCondition('cl.IsOfficial = ?', 'T');
    } else if (isOfficial === 'false') {
      addCondition('cl.IsOfficial = ?', 'F');
    }

    if (minLanguagePercentage && !isNaN(minLanguagePercentage)) {
      addCondition('cl.Percentage >= ?', parseFloat(minLanguagePercentage));
    }

    if (maxLanguagePercentage && !isNaN(maxLanguagePercentage)) {
      addCondition('cl.Percentage <= ?', parseFloat(maxLanguagePercentage));
    }

    // Add WHERE clause if conditions exist
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    // Enhanced sorting options
    const validSorts = {
      'country_name_asc': 'co.Name ASC',
      'country_name_desc': 'co.Name DESC',
      'country_population_asc': 'co.Population ASC',
      'country_population_desc': 'co.Population DESC',
      'surface_area_asc': 'co.SurfaceArea ASC',
      'surface_area_desc': 'co.SurfaceArea DESC',
      'life_expectancy_asc': 'co.LifeExpectancy ASC',
      'life_expectancy_desc': 'co.LifeExpectancy DESC',
      'gnp_asc': 'co.GNP ASC',
      'gnp_desc': 'co.GNP DESC',
      'independence_year_asc': 'co.IndepYear ASC',
      'independence_year_desc': 'co.IndepYear DESC',
      'city_name_asc': 'ci.Name ASC',
      'city_name_desc': 'ci.Name DESC',
      'city_population_asc': 'ci.Population ASC',
      'city_population_desc': 'ci.Population DESC',
      'language_name_asc': 'cl.Language ASC',
      'language_name_desc': 'cl.Language DESC',
      'language_percentage_asc': 'cl.Percentage ASC',
      'language_percentage_desc': 'cl.Percentage DESC',
      'continent_asc': 'co.Continent ASC',
      'continent_desc': 'co.Continent DESC'
    };

    const orderBy = validSorts[sort] || 'co.Name ASC';
    sql += ` ORDER BY ${orderBy}`;

    // Pagination
    const pageInt = Math.max(1, parseInt(page, 10) || 1);
    const limitInt = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
    const offset = (pageInt - 1) * limitInt;

    sql += ` LIMIT ${offset}, ${limitInt}`;

    console.log('[getWorldData] SQL:', sql);
    console.log('[getWorldData] Params:', params);

    // Execute main query with retry logic
    let rows;
    try {
      [rows] = await pool.execute(sql, params);
    } catch (executeError) {
      console.error('[getWorldData] Main query error:', executeError);
      
      // Retry logic for connection issues
      if (executeError.code === 'ER_MALFORMED_PACKET' || executeError.code === 'ECONNRESET') {
        console.log('[getWorldData] Retrying query due to connection issue...');
        try {
          [rows] = await pool.execute(sql, params);
        } catch (retryError) {
          console.error('[getWorldData] Retry failed:', retryError);
          throw retryError;
        }
      } else {
        throw executeError;
      }
    }

    // Get total count for pagination
    let totalCount = 0;
    try {
      let countSql = `
        SELECT COUNT(DISTINCT CONCAT(co.Code, '-', IFNULL(ci.ID, ''), '-', IFNULL(cl.Language, ''))) as total
        FROM country co
        LEFT JOIN city cap ON co.Capital = cap.ID
        LEFT JOIN city ci ON co.Code = ci.CountryCode
        LEFT JOIN countrylanguage cl ON co.Code = cl.CountryCode
      `;

      // Apply same special cases to count query
      if (includeCapitalOnly === 'true') {
        countSql = countSql.replace('LEFT JOIN city ci ON co.Code = ci.CountryCode', 
                                   'LEFT JOIN city ci ON co.Capital = ci.ID');
      }

      if (includeOfficialLanguagesOnly === 'true') {
        countSql = countSql.replace('LEFT JOIN countrylanguage cl ON co.Code = cl.CountryCode',
                                   'LEFT JOIN countrylanguage cl ON co.Code = cl.CountryCode AND cl.IsOfficial = "T"');
      }

      const countParams = [...params];
      
      if (conditions.length > 0) {
        countSql += ' WHERE ' + conditions.join(' AND ');
      }
      
      console.log('[getWorldData] Count SQL:', countSql);
      console.log('[getWorldData] Count Params:', countParams);
      
      const [countResult] = await pool.execute(countSql, countParams);
      totalCount = countResult[0]?.total || 0;
    } catch (countErr) {
      console.error('[getWorldData] Count query error:', countErr);
      // Fallback estimation
      totalCount = rows.length === limitInt ? (pageInt * limitInt) + 1 : (pageInt - 1) * limitInt + rows.length;
    }

    // Get summary statistics
    let statistics = {};
    try {
      let statsSql = `
        SELECT 
          COUNT(DISTINCT co.Code) as countries_count,
          COUNT(DISTINCT ci.ID) as cities_count,
          COUNT(DISTINCT cl.Language) as languages_count,
          AVG(co.Population) as avg_country_population,
          SUM(co.Population) as total_population,
          AVG(co.LifeExpectancy) as avg_life_expectancy,
          COUNT(DISTINCT co.Continent) as continents_count,
          AVG(ci.Population) as avg_city_population,
          AVG(cl.Percentage) as avg_language_percentage
        FROM country co
        LEFT JOIN city cap ON co.Capital = cap.ID
        LEFT JOIN city ci ON co.Code = ci.CountryCode
        LEFT JOIN countrylanguage cl ON co.Code = cl.CountryCode
      `;

      if (conditions.length > 0) {
        statsSql += ' WHERE ' + conditions.join(' AND ');
      }

      const [statsResult] = await pool.execute(statsSql, params);
      statistics = statsResult[0] || {};
      
      // Round numbers for better readability
      Object.keys(statistics).forEach(key => {
        if (typeof statistics[key] === 'number' && statistics[key] !== null) {
          statistics[key] = Math.round(statistics[key] * 100) / 100;
        }
      });
    } catch (statsErr) {
      console.error('[getWorldData] Statistics query error:', statsErr);
      statistics = { error: 'Unable to calculate statistics' };
    }

    // Process data based on groupBy parameter
    let processedData = rows;
    if (groupBy) {
      processedData = processDataByGroup(rows, groupBy);
    }

    // Response
    res.json({
      success: true,
      filters: {
        // Country filters
        region: region || null,
        continent: continent || null,
        countryName: countryName || null,
        countryCode: countryCode || null,
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
        
        // City filters
        cityName: cityName || null,
        district: district || null,
        minCityPopulation: minCityPopulation || null,
        maxCityPopulation: maxCityPopulation || null,
        
        // Language filters
        language: language || null,
        isOfficial: isOfficial || null,
        minLanguagePercentage: minLanguagePercentage || null,
        maxLanguagePercentage: maxLanguagePercentage || null,
        
        // Options
        includeCapitalOnly: includeCapitalOnly || null,
        includeOfficialLanguagesOnly: includeOfficialLanguagesOnly || null,
        groupBy: groupBy || null,
        
        sort,
        fields: fields || null
      },
      pagination: {
        page: pageInt,
        limit: limitInt,
        count: rows.length,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitInt),
        hasNext: pageInt < Math.ceil(totalCount / limitInt),
        hasPrevious: pageInt > 1
      },
      statistics,
      data: processedData
    });

  } catch (err) {
    console.error('[getWorldData] ERROR:', err);
    res.status(500).json({ 
      success: false,
      error: 'Server error',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
}

// Helper function to process data based on groupBy parameter
function processDataByGroup(rows, groupBy) {
  if (!groupBy || rows.length === 0) return rows;

  const grouped = {};

  rows.forEach(row => {
    let key;
    switch (groupBy) {
      case 'country':
        key = row.country_code;
        break;
      case 'city':
        key = row.city_id || 'no_city';
        break;
      case 'language':
        key = row.language_name || 'no_language';
        break;
      default:
        return rows;
    }

    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(row);
  });

  return grouped;
}

// Additional helper function to get filter options
export async function getWorldFilterOptions(req, res) {
  try {
    const [continentsResult] = await pool.execute('SELECT DISTINCT Continent FROM country ORDER BY Continent');
    const [regionsResult] = await pool.execute('SELECT DISTINCT Region FROM country ORDER BY Region');
    const [languagesResult] = await pool.execute('SELECT DISTINCT Language FROM countrylanguage ORDER BY Language LIMIT 100');
    const [governmentFormsResult] = await pool.execute('SELECT DISTINCT GovernmentForm FROM country WHERE GovernmentForm IS NOT NULL ORDER BY GovernmentForm');

    res.json({
      success: true,
      options: {
        continents: continentsResult.map(row => row.Continent),
        regions: regionsResult.map(row => row.Region),
        languages: languagesResult.map(row => row.Language),
        governmentForms: governmentFormsResult.map(row => row.GovernmentForm),
        sortOptions: [
          { value: 'country_name_asc', label: 'Country Name (A-Z)' },
          { value: 'country_name_desc', label: 'Country Name (Z-A)' },
          { value: 'country_population_asc', label: 'Country Population (Low to High)' },
          { value: 'country_population_desc', label: 'Country Population (High to Low)' },
          { value: 'city_population_asc', label: 'City Population (Low to High)' },
          { value: 'city_population_desc', label: 'City Population (High to Low)' },
          { value: 'language_percentage_desc', label: 'Language Percentage (High to Low)' },
          { value: 'continent_asc', label: 'Continent (A-Z)' }
        ],
        fieldCategories: ['country', 'city', 'capital', 'language']
      }
    });

  } catch (err) {
    console.error('[getWorldFilterOptions] ERROR:', err);
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