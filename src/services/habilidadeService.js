import models from "../models/index.js";

const getAllHabilidades = async (pessoaId) => {
  const where = pessoaId ? { pessoaId } : {};
  return await models.Habilidade.findAll({
    where,
    include: [{ model: models.Pessoa, as: "pessoa", attributes: ["id", "nome", "email"] }],
  });
};

const getHabilidadeById = async (id) => {
  return await models.Habilidade.findByPk(id, {
    include: [{ model: models.Pessoa, as: "pessoa", attributes: ["id", "nome", "email"] }],
  });
};

const createHabilidade = async (data) => {
  return await models.Habilidade.create(data);
};

const updateHabilidade = async (id, data) => {
  const habilidade = await models.Habilidade.findByPk(id);
  if (!habilidade) {
    return null;
  }
  const { nome, nivel, categoria, pessoaId } = data;
  return await habilidade.update({
    ...(nome !== undefined && { nome }),
    ...(nivel !== undefined && { nivel }),
    ...(categoria !== undefined && { categoria }),
    ...(pessoaId !== undefined && { pessoaId }),
  });
};

const deleteHabilidade = async (id) => {
  const count = await models.Habilidade.destroy({
    where: { id },
  });
  return count > 0;
};

export default {
  getAllHabilidades,
  getHabilidadeById,
  createHabilidade,
  updateHabilidade,
  deleteHabilidade,
};
