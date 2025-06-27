// src/controllers/userController.js

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dataAccess = require("../utils/dataAccess");
const { successResponse } = require("../utils/responseHandler");
const db = require("../config/database");
const handleResponse = (res, status, data) => data && successResponse(res, status, data);


/**
 * Get all users
 * @route GET /users
 */

// exports.getAllUsers = async (req, res) => 
//   handleResponse(res, 200, await dataAccess.getAll("users", res));

exports.getAllUsers = async (req, res) => {
  const currentUser = req.user;
  
  // First get the users created by current user
  const users = await dataAccess.getAll("users", res);
  
  // Get ALL potential creators (or at least the ones needed)
  // You might need to adjust this query based on your actual user relationships
  const allCreators = await dataAccess.getAll("users", {}, res);
  
  // Create a map of user IDs to names for quick lookup
  const userMap = {};
  allCreators.forEach(user => {
      userMap[user.id] = user.name;
  });

  // Add creator_name to each user
  const usersWithCreator = users.map(user => {
      return {
          ...user,
          creator_name: userMap[user.created_by] || 'Unknown'
      };
  });
  
  handleResponse(res, 200, usersWithCreator);
}

/** * Get user by ID
 * @route GET /users/:id
 */
exports.getUserById = async (req, res) => 
  handleResponse(res, 200, await dataAccess.getAll("users", { filters: { id: req.params.id } }, res));

/**
 * Create a new user
 * @route POST /users/create
 */
exports.createUser = async (req, res) => {
  const { name, email, password } = req.body;
  const currentUser = req.user;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await dataAccess.insertRecord("users", { name, email, password: hashedPassword, created_by: currentUser.id, modified_by: currentUser.id }, res);
  handleResponse(res, 201, newUser);
  req.app.get("io").emit("user_created", newUser);
};


/**
 * Update user by ID
 * @route PUT /users/update/:id
 */
exports.updateUser = async (req, res) => {
  const userId = req.params.id;
  const { name, email } = req.body;

  handleResponse(res, 200, await dataAccess.updateRecord("users", userId, { name, email }, res));
}

/**
 * Inactivate user by ID
 * @route PUT /users/inactivate/:id
 */
exports.inactivateUser = async (req, res) => {
  const id = req.params.id;

  handleResponse(res, 200, await dataAccess.updateRecord("users", { is_active: 0 },{id}, res));
}
/**
 * Delete user by ID
 * @route DELETE /users/delete/:id
 */
exports.deleteUser = async (req, res) => {
  const id = req.params.id;
  handleResponse(res, 200, await dataAccess.deleteRecord("users", { id }, res));
}
