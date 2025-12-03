"use strict";
const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashed = await bcrypt.hash("Admin123!", 10);

    return queryInterface.bulkInsert(
      "Users",
      [
        {
          username: "admin",
          email: "admin@tariffintel.com",
          password: hashed,
          role: "admin",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Users", { email: "admin@tariffintel.com" }, {});
  }
};
