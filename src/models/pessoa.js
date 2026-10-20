const getPessoaModel = (sequelize, { DataTypes }) => {
  const Pessoa = sequelize.define("pessoa", {
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
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    resumo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
    },
    telefone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    linkedin: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    github: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  Pessoa.associate = (models) => {
    Pessoa.hasMany(models.ExperienciaAcademica, {
      foreignKey: "pessoaId",
      as: "experienciasAcademicas",
      onDelete: "CASCADE",
    });
    Pessoa.hasMany(models.ExperienciaProfissional, {
      foreignKey: "pessoaId",
      as: "experienciasProfissionais",
      onDelete: "CASCADE",
    });
    Pessoa.hasMany(models.Projeto, {
      foreignKey: "pessoaId",
      as: "projetos",
      onDelete: "CASCADE",
    });
    Pessoa.hasMany(models.Habilidade, {
      foreignKey: "pessoaId",
      as: "habilidades",
      onDelete: "CASCADE",
    });
  };

  return Pessoa;
};

export default getPessoaModel;
