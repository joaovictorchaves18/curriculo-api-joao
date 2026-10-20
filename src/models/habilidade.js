const getHabilidadeModel = (sequelize, { DataTypes }) => {
  const Habilidade = sequelize.define("habilidade", {
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
    nivel: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    categoria: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pessoaId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  });

  Habilidade.associate = (models) => {
    Habilidade.belongsTo(models.Pessoa, {
      foreignKey: "pessoaId",
      as: "pessoa",
    });
  };

  return Habilidade;
};

export default getHabilidadeModel;
