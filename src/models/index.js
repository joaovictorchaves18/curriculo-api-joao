import Sequelize from "sequelize";
import pg from "pg";

import getPessoaModel from "./pessoa.js";
import getExperienciaAcademicaModel from "./experienciaAcademica.js";
import getExperienciaProfissionalModel from "./experienciaProfissional.js";
import getProjetoModel from "./projeto.js";
import getHabilidadeModel from "./habilidade.js";

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectModule: pg,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

const models = {
  Pessoa: getPessoaModel(sequelize, Sequelize),
  ExperienciaAcademica: getExperienciaAcademicaModel(sequelize, Sequelize),
  ExperienciaProfissional: getExperienciaProfissionalModel(sequelize, Sequelize),
  Projeto: getProjetoModel(sequelize, Sequelize),
  Habilidade: getHabilidadeModel(sequelize, Sequelize),
};

Object.keys(models).forEach((key) => {
  if ("associate" in models[key]) {
    models[key].associate(models);
  }
});

export { sequelize };

export default models;
