const getProjetoModel = (sequelize, { DataTypes }) => {
  const Projeto = sequelize.define("projeto", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    tecnologias: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    urlRepositorio: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    urlDeploy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pessoaId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  });

  Projeto.associate = (models) => {
    Projeto.belongsTo(models.Pessoa, {
      foreignKey: "pessoaId",
      as: "pessoa",
    });
  };

  return Projeto;
};

export default getProjetoModel;
