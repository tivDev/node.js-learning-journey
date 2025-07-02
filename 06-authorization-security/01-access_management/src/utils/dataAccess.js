1.// src/utils/dataAccess.js
const db = require('../config/database');
const { get } = require('../routes/authRoutes');
const { errorResponse } = require('./responseHandler');
require('dotenv').config();

const databaseName = process.env.DB_NAME;

const getAllTables = async (res) => {
    try {
        const [tables] = await db.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = '${databaseName}'`);
        return tables.map(table => table.table_name);
    } catch (error) {
        return errorResponse(res, 500, error.message || error);
    }
};

/**
 * check if a table exists.
 * @param {string} tableName - The table name it must exist in the database.
 * @param {Response} res - Express response object for errors.
 */
const checkTableExists = async (tableName, res) => {
    try {
        const [result] = await db.query(`SELECT COUNT(*) AS table_exists FROM information_schema.tables WHERE table_schema = '${databaseName}' AND table_name = '${tableName}'`);
        return result[0].table_exists > 0;
    } catch (error) {
        return errorResponse(res, 500, error.message || error);
    }
};

/**
 * Count total records in a table.
 * @param {string} tableName - The table name.
 * @param {Response} res - Express response object for errors.
 * @returns {Promise<number|undefined>}
 */
const countRecords = async (tableName, res) => {
    try {
        const [result] = await db.query(`SELECT COUNT(*) AS total FROM \`${tableName}\``);
        return result[0].total;
    } catch (error) {
        return errorResponse(res, 500, error.message || error);
    }
};

/**
 * Convert filters object to SQL WHERE clause string.
 * Example: { id: 1, name: 'John' } -> WHERE `id` = 1 AND `name` = 'John'
 * @param {Object} filters
 * @returns {string} WHERE clause or empty string
 */
function generateWhereClause(filters) {
    const conditions = [];

    for (const [key, value] of Object.entries(filters)) {
        const safeKey = `\`${key}\``;
        if (typeof value === 'string') {
            // Escape single quotes by doubling them (SQL standard)
            const escapedValue = value.replace(/'/g, "''");
            conditions.push(`${safeKey} = '${escapedValue}'`);
        } else if (value === null) {
            conditions.push(`${safeKey} IS NULL`);
        } else {
            conditions.push(`${safeKey} = ${value}`);
        }
    }

    if (conditions.length === 0) {
        return '';
    }

    return 'WHERE ' + conditions.join(' AND ');
}
function generateSetClause(filters) {
    const conditions = [];

    for (const [key, value] of Object.entries(filters)) {
        const safeKey = `\`${key}\``;
        if (typeof value === 'string') {
            // Escape single quotes by doubling them (SQL standard)
            const escapedValue = value.replace(/'/g, "''");
            conditions.push(`${safeKey} = '${escapedValue}'`);
        } else if (value === null) {
            conditions.push(`${safeKey} IS NULL`);
        } else {
            conditions.push(`${safeKey} = ${value}`);
        }
    }

    if (conditions.length === 0) {
        return '';
    }

    return conditions.join(' , ');
}


/**
 * Get all records from a table, with optional field selection and filters.
 * @param {string} tableName - The table name.
 * @param {Object} options - { fields: [], filters: {} }
 * @param {Response} res - Express response object for errors.
 * @returns {Promise<Array>|undefined}
 */
const getAll = async (tableName, options = {}, res) => {
    try {
        const [columnsData] = await db.query(`SHOW COLUMNS FROM \`${tableName}\``);
        const tableFields = columnsData.map(col => col.Field);

        let fields = options.fields;
        // console.log('fields: ', fields);
        if (fields && fields.length > 0) {
            const invalidFields = fields.filter(f => !tableFields.includes(f));
            if (invalidFields.length > 0) {
                return errorResponse(
                    res,
                    400,
                    `Invalid fields: ${invalidFields.join(', ')}. Valid fields are: ${tableFields.join(', ')}`
                );
            }
        } else {
            fields = tableFields;
        }

        let sql = `SELECT ${fields.map(f => `\`${f}\``).join(', ')} FROM \`${tableName}\``;

        if (options.filters && typeof options.filters === 'object' && Object.keys(options.filters).length > 0) {
            const whereClause = generateWhereClause(options.filters);
            if (whereClause) {
                sql += ' ' + whereClause;
            }
        }

        // 👉 Add LIMIT and OFFSET if provided
        const limit = options.limit ?? null;
        const offset = options.offset ?? null;

        if (limit != null && offset != null) {
            sql += ` LIMIT ${parseInt(offset)}, ${parseInt(limit)}`;
        } else if (limit != null) {
            sql += ` LIMIT ${parseInt(limit)}`;
        }

        // console.log('sql:', sql);

        const [rows] = await db.query(sql);

        if (!rows || rows.length === 0) {
            let filterDescription = 'none';
            if (options.filters && Object.keys(options.filters).length > 0) {
                filterDescription = Object.entries(options.filters)
                    .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
                    .join(', ');
            }

            return errorResponse(
                res,
                404,
                `No records found in '${tableName}' with filters: ${filterDescription}.`
            );
        }

        return rows;
    } catch (error) {
        const errorMsg = error.message || error;
        const isTableMissing = !res || errorMsg.includes("doesn't exist");

        return errorResponse(
            res || options,
            isTableMissing ? 404 : 500,
            isTableMissing ? `Table '${tableName}' doesn't exist in the system` : errorMsg
        );
    }
};



/**
 * Insert a new record into a table.
 * @param {string} tableName - The table name.
 * @param {Object} data - Key-value pairs to insert.
 * @param {Response} res - Express response object for errors.
 * @returns {Promise<Object|undefined>} - The result with `insertId` if successful.
 */
const insertRecord = async (tableName, data, res) => {
    try {
        if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
            return errorResponse(res, 400, 'No data provided for insertion.');
        }

        // 1. Get columns info
        const [columnsData] = await db.query(`SHOW COLUMNS FROM \`${tableName}\``);

        // Build column map
        const columnMap = {};
        columnsData.forEach(col => {
            columnMap[col.Field] = {
                type: col.Type,
                nullable: col.Null === 'YES',
                default: col.Default,
            };
        });

        // 2. Check for invalid fields
        const dataFields = Object.keys(data);
        const invalidFields = dataFields
            .filter(f => f !== 'id' && !columnMap[f])
            .map(f => `${f} (field not found)`);

        if (invalidFields.length > 0) {
            return errorResponse(
                res,
                400,
                `Invalid fields for table '${tableName}': ${invalidFields.join(', ')}`
            );
        }

        // 3. Check for missing required fields
        const missingRequiredFields = [];
        for (const [field, info] of Object.entries(columnMap)) {
            if (field === 'id') continue;
            if (!info.nullable && info.default === null && !dataFields.includes(field)) {
                missingRequiredFields.push(`${field} (expected type: ${info.type})`);
            }
        }

        if (missingRequiredFields.length > 0) {
            return errorResponse(
                res,
                400,
                `Missing required fields for table '${tableName}': ${missingRequiredFields.join(', ')}`
            );
        }

        // 4. Type and value validation (with ENUM & Required prefix)
        for (const [field, value] of Object.entries(data)) {
            if (field === 'id') continue;

            const colType = columnMap[field].type.toLowerCase();
            const isRequired = !columnMap[field].nullable;
            const requiredPrefix = isRequired ? 'Required field: ' : '';

            if (value === null) {
                if (isRequired) {
                    return errorResponse(
                        res,
                        400,
                        `${requiredPrefix}Field '${field}' cannot be null`
                    );
                }
                continue;
            }

            if (colType.startsWith('int') || colType.startsWith('tinyint') ||
                colType.startsWith('smallint') || colType.startsWith('mediumint') ||
                colType.startsWith('bigint')) {
                if (typeof value !== 'number' || !Number.isInteger(value)) {
                    return errorResponse(
                        res,
                        400,
                        `${requiredPrefix}Field '${field}' must be an integer`
                    );
                }
            } else if (colType.startsWith('decimal') || colType.startsWith('float') ||
                       colType.startsWith('double')) {
                if (typeof value !== 'number') {
                    return errorResponse(
                        res,
                        400,
                        `${requiredPrefix}Field '${field}' must be a number`
                    );
                }
            } else if (colType.startsWith('varchar') || colType.startsWith('char') ||
                       colType.startsWith('text')) {
                if (typeof value !== 'string') {
                    return errorResponse(
                        res,
                        400,
                        `${requiredPrefix}Field '${field}' must be a string`
                    );
                }
            } else if (colType.startsWith('date') || colType.startsWith('datetime') ||
                       colType.startsWith('timestamp')) {
                if (typeof value !== 'string' || isNaN(Date.parse(value))) {
                    return errorResponse(
                        res,
                        400,
                        `${requiredPrefix}Field '${field}' must be a valid date/time string`
                    );
                }
            } else if (colType.startsWith('enum')) {
                const matches = colType.match(/enum\((.*)\)/);
                if (matches && matches[1]) {
                    const allowedValues = matches[1]
                        .split(',')
                        .map(v => v.trim().replace(/^'(.*)'$/, '$1'));

                    if (!allowedValues.includes(value)) {
                        return errorResponse(
                            res,
                            400,
                            `${requiredPrefix}Field '${field}' has invalid enum value '${value}'. Allowed values: ${allowedValues.join(', ')}`
                        );
                    }
                }
            }
        }

        // 5. Construct insert SQL
        const columns = dataFields.map(key => `\`${key}\``).join(', ');
        const placeholders = dataFields.map(() => '?').join(', ');
        const values = dataFields.map(field => data[field]);

        const sql = `INSERT INTO \`${tableName}\` (${columns}) VALUES (${placeholders})`;

        const [result] = await db.query(sql, values);
        return { insertId: result.insertId };

    } catch (error) {
        let statusCode = 500;
        if (error.message.includes("Duplicate entry")) {
            statusCode = 409;
        }
        if (error.code === 'ER_NO_SUCH_TABLE') {
            return errorResponse(res, 404, `Table '${tableName}' doesn't exist in the system.`);
        }
        return errorResponse(res, statusCode, error.message || error);
    }
};



/**
 * Update records in a table with given data and filters.
 * @param {string} tableName - The table name.
 * @param {Object} data - Key-value pairs to update.
 * @param {Object} filters - Conditions to select which records to update.
 * @param {Response} res - Express response object for errors.
 * @returns {Promise<Object|undefined>} - Returns result with affectedRows and message.
 */
const updateRecord = async (tableName, data, filters = {}, res) => {
    try {
        if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
            return errorResponse(res, 400, 'No data provided for update.');
        }

        // 1. Get columns info
        const [columnsData] = await db.query(`SHOW COLUMNS FROM \`${tableName}\``);

        // Build column map
        const columnMap = {};
        columnsData.forEach(col => {
            columnMap[col.Field] = {
                type: col.Type,
                nullable: col.Null === 'YES',
                default: col.Default,
            };
        });

        // 2. Filter out undefined values and validate fields
        const updateData = {};
        const dataFields = Object.keys(data);
        const filterFields = Object.keys(filters);

        // Check for invalid data fields
        const invalidDataFields = dataFields.filter(f => f !== undefined && !columnMap[f]);
        if (invalidDataFields.length > 0) {
            return errorResponse(
                res,
                400,
                `Invalid fields for table '${tableName}': ${invalidDataFields.join(', ')}`
            );
        }

        // Check for invalid filter fields
        const invalidFilterFields = filterFields.filter(f => !columnMap[f]);
        if (invalidFilterFields.length > 0) {
            return errorResponse(
                res,
                400,
                `Invalid filter fields for table '${tableName}': ${invalidFilterFields.join(', ')}`
            );
        }

        // Process each field (excluding undefined values)
        for (const field of dataFields) {
            const value = data[field];
            
            // Skip undefined values
            if (value === undefined) {
                continue;
            }

            const colInfo = columnMap[field];
            const isRequired = !colInfo.nullable;
            const requiredPrefix = isRequired ? 'Required field: ' : '';

            // Handle null values
            if (value === null) {
                if (isRequired) {
                    return errorResponse(
                        res,
                        400,
                        `${requiredPrefix}'${field}' cannot be null`
                    );
                }
                updateData[field] = null;
                continue;
            }

            // Type validation
            const colType = colInfo.type.toLowerCase();
            let isValid = true;

            if (colType.startsWith('int') || colType.startsWith('tinyint') || 
                colType.startsWith('smallint') || colType.startsWith('mediumint') || 
                colType.startsWith('bigint')) {
                isValid = typeof value === 'number' && Number.isInteger(value);
            } else if (colType.startsWith('decimal') || colType.startsWith('float') || 
                      colType.startsWith('double')) {
                isValid = typeof value === 'number';
            } else if (colType.startsWith('varchar') || colType.startsWith('char') || 
                      colType.startsWith('text')) {
                isValid = typeof value === 'string';
            } else if (colType.startsWith('date') || colType.startsWith('datetime') || 
                      colType.startsWith('timestamp')) {
                isValid = typeof value === 'string' && !isNaN(Date.parse(value));
            } else if (colType.startsWith('enum')) {
                const matches = colType.match(/enum\((.*)\)/);
                if (matches && matches[1]) {
                    const allowedValues = matches[1]
                        .split(',')
                        .map(v => v.trim().replace(/^'(.*)'$/, '$1'));
                    isValid = allowedValues.includes(value);
                }
            }

            if (!isValid) {
                return errorResponse(
                    res,
                    400,
                    `${requiredPrefix}Field '${field}' (type: ${colInfo.type}) has invalid value`
                );
            }

            updateData[field] = value;
        }

        // Check if we have any data left to update after filtering undefined values
        if (Object.keys(updateData).length === 0) {
            return errorResponse(res, 400, 'No valid data provided for update.');
        }

        const whereClause = generateWhereClause(filters);

        // Check if records exist before update
        const checkSql = `SELECT * FROM \`${tableName}\` ${whereClause}`;
        const [existingRows] = await db.query(checkSql);

        if (!existingRows || existingRows.length === 0) {
            return {
                affectedRows: 0,
                message: 'No records matched the criteria',
                filters: Object.entries(filters).map(([k, v]) => `${k}=${JSON.stringify(v)}`).join(', '),
                sql: checkSql
            };
        }

        // Check if the new data is different from existing data
        let noChangesNeeded = true;
        for (const row of existingRows) {
            for (const [field, newValue] of Object.entries(updateData)) {
                if (JSON.stringify(row[field]) !== JSON.stringify(newValue)) {
                    noChangesNeeded = false;
                    break;
                }
            }
            if (!noChangesNeeded) break;
        }

        if (noChangesNeeded) {
            return errorResponse(
                res,
                200,
                `No changes made. Fields unchanged: ${Object.entries(updateData).map(([k, v]) => `${k}=${JSON.stringify(v)}`).join(', ')}.`
            );
        }

        // Perform the update with only the provided fields
        const setClause = generateSetClause(updateData);
        const sql = `UPDATE \`${tableName}\` SET ${setClause} ${whereClause}`;
        const [result] = await db.query(sql);
        
        let message = '';
        if (result.affectedRows === 0) {
            message = 'No changes made (possible database constraint or identical data)';
        } else {
            message = 'Update successful';
        }

        return {
            affectedRows: result.affectedRows,
            message,
            filters: Object.entries(filters).map(([k, v]) => `${k}=${JSON.stringify(v)}`).join(', '),
            sql
        };

    } catch (error) {
        if (error.code === 'ER_NO_SUCH_TABLE') {
            return errorResponse(res, 404, `Table '${tableName}' doesn't exist in the system.`);
        }
        return errorResponse(res, 500, error.message || error);
    }
};

/**
 * Delete records from a table based on filters.
 * @param {string} tableName - The table name.
 * @param {Object} filters - Conditions to select which records to delete.
 * @param {Response} res - Express response object for errors.
 * @returns {Promise<Object|undefined>} - Returns result with affectedRows and message.
 */
const deleteRecord = async (tableName, filters = {}, res) => {
    try {
        // 1. Get columns info to validate filter fields
        const [columnsData] = await db.query(`SHOW COLUMNS FROM \`${tableName}\``);
        const tableFields = columnsData.map(col => col.Field);

        // 2. Validate filter fields exist in the table
        const filterFields = Object.keys(filters);
        const invalidFilterFields = filterFields.filter(f => !tableFields.includes(f));
        
        if (invalidFilterFields.length > 0) {
            return errorResponse(
                res,
                400,
                `Invalid filter fields for table '${tableName}': ${invalidFilterFields.join(', ')}`
            );
        }

        // 3. Prevent accidental deletion of all records
        if (filterFields.length === 0) {
            return errorResponse(
                res,
                400,
                'Delete operation requires filters to prevent accidental mass deletion'
            );
        }

        const whereClause = generateWhereClause(filters);

        // 4. Check if records exist before deletion (optional but good practice)
        const checkSql = `SELECT * FROM \`${tableName}\` ${whereClause}`;
        const [existingRows] = await db.query(checkSql);

        if (!existingRows || existingRows.length === 0) {
            console.log('existingRows.length: ', existingRows.length);
            
            return errorResponse(
                res,
                404,
                `No records found in '${tableName}' with filters: ${Object.entries(filters)
                    .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
                    .join(', ')}`
            );
        }

        // 5. Perform the deletion
        const sql = `DELETE FROM \`${tableName}\` ${whereClause}`;
        const [result] = await db.query(sql);

        return {
            affectedRows: result.affectedRows,
            message: result.affectedRows > 0 
                ? 'Records deleted successfully' 
                : 'No records were deleted',
            filters: Object.entries(filters).map(([k, v]) => `${k}=${JSON.stringify(v)}`).join(', '),
            sql
        };

    } catch (error) {
        if (error.code === 'ER_NO_SUCH_TABLE') {
            return errorResponse(res, 404, `Table '${tableName}' not found`);
        }
        return errorResponse(res, 500, error.message || error);
    }
};



module.exports = { getAllTables, countRecords, checkTableExists,getAll, insertRecord, updateRecord, deleteRecord };


