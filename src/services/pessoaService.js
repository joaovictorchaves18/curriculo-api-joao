import models from "../models/index.js";

const getAllPessoas = async () => {
  return await models.Pessoa.findAll({
    include: [
      { model: models.ExperienciaAcademica, as: "experienciasAcademicas" },
      { model: models.ExperienciaProfissional, as: "experienciasProfissionais" },
      { model: models.Projeto, as: "projetos" },
      { model: models.Habilidade, as: "habilidades" },
    ],
  });
};

const getPessoaById = async (id) => {
  return await models.Pessoa.findByPk(id, {
    include: [
      { model: models.ExperienciaAcademica, as: "experienciasAcademicas" },
      { model: models.ExperienciaProfissional, as: "experienciasProfissionais" },
      { model: models.Projeto, as: "projetos" },
      { model: models.Habilidade, as: "habilidades" },
    ],
  });
};

const createPessoa = async (data) => {
  return await models.Pessoa.create(data);
};

const updatePessoa = async (id, data) => {
  const pessoa = await models.Pessoa.findByPk(id);
  if (!pessoa) {
    return null;
  }
  const { nome, titulo, resumo, email, telefone, linkedin, github } = data;
  return await pessoa.update({
    ...(nome !== undefined && { nome }),
    ...(titulo !== undefined && { titulo }),
    ...(resumo !== undefined && { resumo }),
    ...(email !== undefined && { email }),
    ...(telefone !== undefined && { telefone }),
    ...(linkedin !== undefined && { linkedin }),
    ...(github !== undefined && { github }),
  });
};

const deletePessoa = async (id) => {
  const count = await models.Pessoa.destroy({
    where: { id },
  });
  return count > 0;
};

export default {
  getAllPessoas,
  getPessoaById,
  createPessoa,
  updatePessoa,
  deletePessoa,
};
