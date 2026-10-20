import models from "../models/index.js";

const getAllProjetos = async (pessoaId) => {
  const where = pessoaId ? { pessoaId } : {};
  return await models.Projeto.findAll({
    where,
    include: [{ model: models.Pessoa, as: "pessoa", attributes: ["id", "nome", "email"] }],
  });
};

const getProjetoById = async (id) => {
  return await models.Projeto.findByPk(id, {
    include: [{ model: models.Pessoa, as: "pessoa", attributes: ["id", "nome", "email"] }],
  });
};

const createProjeto = async (data) => {
  return await models.Projeto.create(data);
};

const updateProjeto = async (id, data) => {
  const projeto = await models.Projeto.findByPk(id);
  if (!projeto) {
    return null;
  }
  const { nome, descricao, tecnologias, urlRepositorio, urlDeploy, pessoaId } = data;
  return await projeto.update({
    ...(nome !== undefined && { nome }),
    ...(descricao !== undefined && { descricao }),
    ...(tecnologias !== undefined && { tecnologias }),
    ...(urlRepositorio !== undefined && { urlRepositorio }),
    ...(urlDeploy !== undefined && { urlDeploy }),
    ...(pessoaId !== undefined && { pessoaId }),
  });
};

const deleteProjeto = async (id) => {
  const count = await models.Projeto.destroy({
    where: { id },
  });
  return count > 0;
};

export default {
  getAllProjetos,
  getProjetoById,
  createProjeto,
  updateProjeto,
  deleteProjeto,
};
