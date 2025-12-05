"use strict";

module.exports = (sequelize, DataTypes) => {
  const ProductTable = sequelize.define(
    "ProductTable",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      section: DataTypes.STRING(20),
      chapter: DataTypes.INTEGER,
      main_category: DataTypes.TEXT,
      subcategory: DataTypes.TEXT,
      group_name: DataTypes.TEXT,
      hts_code: {
        type: DataTypes.STRING(100),
        unique: true,
      },
      product: DataTypes.TEXT,
      unit_of_quantity: DataTypes.STRING(255),
      general_rate_of_duty: DataTypes.STRING(255),
      special_rate_of_duty: DataTypes.STRING(255),
      column2_rate_of_duty: DataTypes.STRING(255),
      last_updated: DataTypes.DATE,
    },
    {
      tableName: "product_table",
      timestamps: true,
      createdAt: false,
      updatedAt: "last_updated",
    }
  );

  return ProductTable;
};
