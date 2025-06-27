// src/controllers/testController.js

const dataAccess = require('../utils/dataAccess');
const { successResponse, errorResponse } = require('../utils/responseHandler');

const getAll = async (req, res) => {
        const data = await dataAccess.getAll('userssd');
        if (data.error) {
            return errorResponse(res, 500, 'Error fetching data', data.error);
        }
        return successResponse(res, 200, 'Data fetched successfully', data);

};

module.exports = {
    getAll,
};

