const getExperienciaProfissionalModel = (sequelize, { DataTypes }) => {
  const ExperienciaProfissional = sequelize.define("experienciaProfissional", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    empresa: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    cargo: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    dataInicio: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    dataFim: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    pessoaId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  });

  ExperienciaProfissional.associate = (models) => {
    ExperienciaProfissional.belongsTo(models.Pessoa, {
      foreignKey: "pessoaId",
      as: "pessoa",
    });
  };

  return ExperienciaProfissional;
};

export default getExperienciaProfissionalModel;
