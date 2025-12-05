module.exports = (sequelize, DataTypes) => {
  const Agreement = sequelize.define("Agreement", {
    AgreementCode: {
      type: DataTypes.STRING(10),
      primaryKey: true,
      allowNull: false
    },
    AgreementName: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    CountriesIncluded: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    ValidityPeriod: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    Status: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    tableName: "agreement",
    timestamps: false
  });

  return Agreement;
};
