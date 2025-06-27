// src/controllers/itemController.js

const dataAccess = require("../utils/dataAccess");
const { successResponse } = require("../utils/responseHandler");

const handleResponse = (res, status, data) => data && successResponse(res, status, data);

exports.getAllItems = async (req, res) => 
  handleResponse(res, 200, await dataAccess.getAll("items", res));

/**
 * Get all items with optional field selection
 * @route GET /users
 */

// exports.getAllItems = async (req, res) => {
//   const fields = ["id", "title", "description", "created_by", "created_at"];
//   handleResponse(res, 200, await dataAccess.getAll("itemss", { fields }, res));
// };

exports.getByCreatedBy = async (req, res) => 
  handleResponse(res, 200, await dataAccess.getAll("items", {filters: { created_by: req.user.id } }, res));

exports.getById = async (req, res) => 
  handleResponse(res, 200, await dataAccess.getAll("itemsf", { filters: { id: req.params.id } }, res));

exports.createItem = async (req, res) => {
  const { title, description } = req.body;
  handleResponse(res, 201, await dataAccess.insertRecord("items", 
    { title, description, created_by: req.user.id }, res));
};

exports.updateItem = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  handleResponse(res, 200, await dataAccess.updateRecord("items", 
    { title, description, created_by: req.user.id }, { id }, res), id);
};

exports.deleteItem = async (req, res) => 
  handleResponse(res, 200, await dataAccess.deleteRecord("items", { id: req.params.id }, res));