import models from "../models/index.js";

const getAllExperienciasProfissionais = async (pessoaId) => {
  const where = pessoaId ? { pessoaId } : {};
  return await models.ExperienciaProfissional.findAll({
    where,
    include: [{ model: models.Pessoa, as: "pessoa", attributes: ["id", "nome", "email"] }],
  });
};

const getExperienciaProfissionalById = async (id) => {
  return await models.ExperienciaProfissional.findByPk(id, {
    include: [{ model: models.Pessoa, as: "pessoa", attributes: ["id", "nome", "email"] }],
  });
};

const createExperienciaProfissional = async (data) => {
  return await models.ExperienciaProfissional.create(data);
};

const updateExperienciaProfissional = async (id, data) => {
  const experiencia = await models.ExperienciaProfissional.findByPk(id);
  if (!experiencia) {
    return null;
  }
  const { empresa, cargo, dataInicio, dataFim, descricao, pessoaId } = data;
  return await experiencia.update({
    ...(empresa !== undefined && { empresa }),
    ...(cargo !== undefined && { cargo }),
    ...(dataInicio !== undefined && { dataInicio }),
    ...(dataFim !== undefined && { dataFim }),
    ...(descricao !== undefined && { descricao }),
    ...(pessoaId !== undefined && { pessoaId }),
  });
};

const deleteExperienciaProfissional = async (id) => {
  const count = await models.ExperienciaProfissional.destroy({
    where: { id },
  });
  return count > 0;
};

export default {
  getAllExperienciasProfissionais,
  getExperienciaProfissionalById,
  createExperienciaProfissional,
  updateExperienciaProfissional,
  deleteExperienciaProfissional,
};
