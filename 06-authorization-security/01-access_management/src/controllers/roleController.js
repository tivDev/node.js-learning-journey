// src/controllers/itemController.js

const dataAccess = require("../utils/dataAccess");
const { successResponse } = require("../utils/responseHandler");

const handleResponse = (res, status, data) => data && successResponse(res, status, data);

exports.getAllRoles = async (req, res) =>
  handleResponse(res, 200, await dataAccess.getAll("roles", res));

exports.getRoleById = async (req, res) =>
  handleResponse(res, 200, await dataAccess.getAll("roles", { filters: { id: req.params.id } }, res));

exports.createRole = async (req, res) => {
  const { name, description } = req.body;
  handleResponse(res, 201, await dataAccess.insertRecord("roles", { name, description }, res));
};
exports.updateRole = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  handleResponse(res, 200, await dataAccess.updateRecord("roles", { name, description }, { id }, res), id);
};
exports.deleteRole = async (req, res) =>
  handleResponse(res, 200, await dataAccess.deleteRecord("roles", { id: req.params.id }, res));



// Get roles -> permissions

exports.getRolesPermissions = async (req, res) => {
  const roles = await dataAccess.getAll("roles", res);
  const permissions = await dataAccess.getAll("permissions", res);
  const rolePermissions = await dataAccess.getAll("role_permissions", res);

  const result = roles
    .map(role => {
      const permissionsForRole = rolePermissions
        .filter(rp => rp.role_id === role.id)
        .map(rp => {
          const perm = permissions.find(p => p.id === rp.permission_id);
          console.log('perm: ', perm);
          return perm
            ? {
                id: perm.id,
                name: perm.name,
                target_table: perm.target_table,
                permission_label: `${perm.name}: ${rp.target_table}`
              }
            : null;
        })
        .filter(Boolean);

      // If role has no permissions, skip
      if (permissionsForRole.length === 0) return null;

      return {
        id: role.id,
        name: role.name,
        permissions: permissionsForRole
      };
    })
    .filter(Boolean); // Remove null roles

  handleResponse(res, 200, result);
};

// Get users -> roles -> permissions
exports.getUsersRolesPermissions = async (req, res) => {
  try {
    const users = await dataAccess.getAll("users", res);
    const roles = await dataAccess.getAll("roles", res);
    const userRoles = await dataAccess.getAll("user_roles", res);
    const permissions = await dataAccess.getAll("permissions", res);
    const rolePermissions = await dataAccess.getAll("role_permissions", res);

    const result = users
      .map(user => {
        // Find all role assignments for the user
        const assignedRoles = userRoles
          .filter(ur => ur.user_id === user.id)
          .map(ur => roles.find(r => r.id === ur.role_id))
          .filter(Boolean);

        // If user has no roles, skip
        if (assignedRoles.length === 0) return null;

        const rolesWithPermissions = assignedRoles
          .map(role => {
            const permissionsForRole = rolePermissions
              .filter(rp => rp.role_id === role.id)
              .map(rp => {
                const perm = permissions.find(p => p.id === rp.permission_id);
                return perm
                  ? {
                      id: perm.id,
                      name: perm.name,
                      target_table: perm.target_table,
                      permission_label: `${perm.name}: ${rp.target_table}`
                    }
                  : null;
              })
              .filter(Boolean);

            // If role has no permissions, skip
            if (permissionsForRole.length === 0) return null;

            return {
              id: role.id,
              name: role.name,
              permissions: permissionsForRole
            };
          })
          .filter(Boolean);

        // If none of the roles have permissions, skip user
        if (rolesWithPermissions.length === 0) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          roles: rolesWithPermissions
        };
      })
      .filter(Boolean); // Remove null users

    handleResponse(res, 200, result);
  } catch (error) {
    console.error("Error fetching roles and permissions:", error);
    handleResponse(res, 500, { message: "Internal server error" });
  }
};
