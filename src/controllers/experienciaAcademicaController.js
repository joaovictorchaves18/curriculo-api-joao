import { experienciaAcademicaService, pessoaService } from "../services/index.js";
import { AppError } from "../utils/index.js";

const getExperienciasAcademicas = async (req, res) => {
  const { pessoaId } = req.query;
  const experiencias = await experienciaAcademicaService.getAllExperienciasAcademicas(pessoaId);
  return res.status(200).send(experiencias);
};

const getExperienciaAcademica = async (req, res) => {
  const experiencia = await experienciaAcademicaService.getExperienciaAcademicaById(
    req.params.experienciaId
  );
  if (!experiencia) {
    throw new AppError("Experiência acadêmica não encontrada.", 404);
  }
  return res.status(200).send(experiencia);
};

const createExperienciaAcademica = async (req, res) => {
  const { instituicao, curso, grau, dataInicio, dataFim, descricao, pessoaId } = req.body || {};
  if (!pessoaId) {
    throw new AppError("O campo pessoaId é obrigatório.", 400);
  }
  const pessoa = await pessoaService.getPessoaById(pessoaId);
  if (!pessoa) {
    throw new AppError("Pessoa informada não encontrada.", 404);
  }
  const experiencia = await experienciaAcademicaService.createExperienciaAcademica({
    instituicao,
    curso,
    grau,
    dataInicio,
    dataFim,
    descricao,
    pessoaId,
  });
  return res.status(201).send(experiencia);
};

const updateExperienciaAcademica = async (req, res) => {
  const { instituicao, curso, grau, dataInicio, dataFim, descricao, pessoaId } = req.body || {};
  if (pessoaId) {
    const pessoa = await pessoaService.getPessoaById(pessoaId);
    if (!pessoa) {
      throw new AppError("Pessoa informada não encontrada.", 404);
    }
  }
  const experiencia = await experienciaAcademicaService.updateExperienciaAcademica(
    req.params.experienciaId,
    {
      instituicao,
      curso,
      grau,
      dataInicio,
      dataFim,
      descricao,
      pessoaId,
    }
  );
  if (!experiencia) {
    throw new AppError("Experiência acadêmica não encontrada.", 404);
  }
  return res.status(200).send(experiencia);
};

const deleteExperienciaAcademica = async (req, res) => {
  const isDeleted = await experienciaAcademicaService.deleteExperienciaAcademica(
    req.params.experienciaId
  );
  if (!isDeleted) {
    throw new AppError("Experiência acadêmica não encontrada.", 404);
  }
  return res.status(204).send();
};

export default {
  getExperienciasAcademicas,
  getExperienciaAcademica,
  createExperienciaAcademica,
  updateExperienciaAcademica,
  deleteExperienciaAcademica,
};
