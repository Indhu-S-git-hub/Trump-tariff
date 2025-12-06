// models/forexHistory.js
module.exports = (sequelize, DataTypes) => {
  const ForexHistory = sequelize.define("ForexHistory", {
    from: DataTypes.STRING,
    to: DataTypes.STRING,
    year: DataTypes.INTEGER,
    month: DataTypes.STRING,     // "Jan", "Feb", ...
    rate: DataTypes.FLOAT,
  });
  return ForexHistory;
};
