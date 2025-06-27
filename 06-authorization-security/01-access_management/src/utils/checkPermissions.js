// src/utils/permissions.js

const db = require("../config/database");

exports.hasPermission = async (userId, action, targetTable) => {
  const [rows] = await db.query(
    `
    SELECT 1 AS allow_access
    FROM users u
        JOIN user_roles ur ON u.id = ur.user_id
        JOIN roles r ON ur.role_id = r.id
        JOIN role_permissions rp ON r.id = rp.role_id
        JOIN permissions p ON rp.permission_id = p.id
    WHERE u.id = ? AND p.name = ? AND rp.target_table = ? LIMIT 1;
    `,
    [userId, action, targetTable]
  );

  return rows.length > 0;
};
