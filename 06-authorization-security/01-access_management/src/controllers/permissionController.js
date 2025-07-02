// src/controllers/permissionController.js

const e = require("cors");
const dataAccess = require("../utils/dataAccess");
const { successResponse, errorResponse } = require("../utils/responseHandler");
const handleResponse = (res, status, data) => data && successResponse(res, status, data);

/**
 * Get all permissions
 * @route GET /permissions
 */
exports.getAllPermissions = async (req, res) => 
  handleResponse(res, 200, await dataAccess.getAll("permissions", res));

/**
 * Get permission by ID
 * @route GET /permissions/:id
 */
exports.getPermissionById = async (req, res) => {
   handleResponse(res, 200, await dataAccess.getAll("permissions", { filters: { id: req.params.id } }, res));
};

/** * Create a new permission
 * @route POST /permissions/create
 */
exports.createPermission = async (req, res) => {
      const { name } = req.body;
      handleResponse(res, 201, await dataAccess.insertRecord("permissions", { name }, res));
};