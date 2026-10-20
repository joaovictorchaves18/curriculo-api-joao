import models from "../models/index.js";

const getAllExperienciasAcademicas = async (pessoaId) => {
  const where = pessoaId ? { pessoaId } : {};
  return await models.ExperienciaAcademica.findAll({
    where,
    include: [{ model: models.Pessoa, as: "pessoa", attributes: ["id", "nome", "email"] }],
  });
};

const getExperienciaAcademicaById = async (id) => {
  return await models.ExperienciaAcademica.findByPk(id, {
    include: [{ model: models.Pessoa, as: "pessoa", attributes: ["id", "nome", "email"] }],
  });
};

const createExperienciaAcademica = async (data) => {
  return await models.ExperienciaAcademica.create(data);
};

const updateExperienciaAcademica = async (id, data) => {
  const experiencia = await models.ExperienciaAcademica.findByPk(id);
  if (!experiencia) {
    return null;
  }
  const { instituicao, curso, grau, dataInicio, dataFim, descricao, pessoaId } = data;
  return await experiencia.update({
    ...(instituicao !== undefined && { instituicao }),
    ...(curso !== undefined && { curso }),
    ...(grau !== undefined && { grau }),
    ...(dataInicio !== undefined && { dataInicio }),
    ...(dataFim !== undefined && { dataFim }),
    ...(descricao !== undefined && { descricao }),
    ...(pessoaId !== undefined && { pessoaId }),
  });
};

const deleteExperienciaAcademica = async (id) => {
  const count = await models.ExperienciaAcademica.destroy({
    where: { id },
  });
  return count > 0;
};

export default {
  getAllExperienciasAcademicas,
  getExperienciaAcademicaById,
  createExperienciaAcademica,
  updateExperienciaAcademica,
  deleteExperienciaAcademica,
};
