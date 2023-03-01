'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('petugas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_petugas: {
        type: Sequelize.INTEGER(11)
      },
      nama_petugas: {
        type: Sequelize.STRING(35)
      },
      user_name: {
        type: Sequelize.STRING(25)
      },
      password: {
        type: Sequelize.STRING(32)
      },
      telp: {
        type: Sequelize.STRING(13)
      },
      level: {
        type: Sequelize.ENUM,
        allowNull: false,
        values: ["admin", "petugas"]
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('petugas');
  }
};