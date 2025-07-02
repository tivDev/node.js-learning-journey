// src/seeders/permissionSeeder.js

const db = require("../config/database");

module.exports.seedPermissions = async (systemUserId) => {
  const actions = ["create", "read", "update", "delete","print"];

  console.log("Seeding permissions...");

  try {
    for (const action of actions) {
      const [existing] = await db.query(
        "SELECT id FROM permissions WHERE name = ?",
        [action]
      );

      if (existing.length === 0) {
        await db.query(
          "INSERT INTO permissions (name, created_by, modified_by) VALUES (?, ?, ?)",
          [action, systemUserId, systemUserId]
        );
        console.log(`Created permission: ${action}`);
      }
    }

    console.log("Permissions seeded successfully");
  } catch (error) {
    console.error("Error seeding permissions:", error);
    throw error;
  }
};

