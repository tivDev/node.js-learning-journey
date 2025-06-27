// src/countrollers/userRoleController.js

const dataAccess = require("../utils/dataAccess");
const { successResponse } = require("../utils/responseHandler");

const handleResponse = (res, status, data) => data && successResponse(res, status, data);

exports.getAllUserRoles = async (req, res) => {
    const userRoles = await dataAccess.getAll("user_roles", res);
    const users = await dataAccess.getAll("users", res);
    const roles = await dataAccess.getAll("roles", res);
    const userRolesWithDetails = userRoles.map(userRole => {
        const user = users.find(u => u.id === userRole.user_id);
        const role = roles.find(r => r.id === userRole.role_id);
        return {
            ...userRole,
            user_name: user ? user.name : 'Unknown User',
            role_name: role ? role.name : 'Unknown Role',
            user_email: user ? user.email : 'No Email',
        };
    });
    return handleResponse(res, 200, userRolesWithDetails);
}

exports.assignRoleToUser = async (req, res) => {
    const { user_id, role_id } = req.body;
    const currentUser = req.user;
    const tableName = "user_roles";
    handleResponse(res, 201, await dataAccess.insertRecord(tableName, { user_id, role_id, created_by: currentUser.id, modified_by: currentUser.id }, res));

}
