const getExperienciaAcademicaModel = (sequelize, { DataTypes }) => {
  const ExperienciaAcademica = sequelize.define("experienciaAcademica", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    instituicao: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    curso: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    grau: {
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

  ExperienciaAcademica.associate = (models) => {
    ExperienciaAcademica.belongsTo(models.Pessoa, {
      foreignKey: "pessoaId",
      as: "pessoa",
    });
  };

  return ExperienciaAcademica;
};

export default getExperienciaAcademicaModel;
