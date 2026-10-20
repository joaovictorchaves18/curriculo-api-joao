import { experienciaProfissionalService, pessoaService } from "../services/index.js";
import { AppError } from "../utils/index.js";

const getExperienciasProfissionais = async (req, res) => {
  const { pessoaId } = req.query;
  const experiencias = await experienciaProfissionalService.getAllExperienciasProfissionais(
    pessoaId
  );
  return res.status(200).send(experiencias);
};

const getExperienciaProfissional = async (req, res) => {
  const experiencia = await experienciaProfissionalService.getExperienciaProfissionalById(
    req.params.experienciaId
  );
  if (!experiencia) {
    throw new AppError("Experiência profissional não encontrada.", 404);
  }
  return res.status(200).send(experiencia);
};

const createExperienciaProfissional = async (req, res) => {
  const { empresa, cargo, dataInicio, dataFim, descricao, pessoaId } = req.body || {};
  if (!pessoaId) {
    throw new AppError("O campo pessoaId é obrigatório.", 400);
  }
  const pessoa = await pessoaService.getPessoaById(pessoaId);
  if (!pessoa) {
    throw new AppError("Pessoa informada não encontrada.", 404);
  }
  const experiencia = await experienciaProfissionalService.createExperienciaProfissional({
    empresa,
    cargo,
    dataInicio,
    dataFim,
    descricao,
    pessoaId,
  });
  return res.status(201).send(experiencia);
};

const updateExperienciaProfissional = async (req, res) => {
  const { empresa, cargo, dataInicio, dataFim, descricao, pessoaId } = req.body || {};
  if (pessoaId) {
    const pessoa = await pessoaService.getPessoaById(pessoaId);
    if (!pessoa) {
      throw new AppError("Pessoa informada não encontrada.", 404);
    }
  }
  const experiencia = await experienciaProfissionalService.updateExperienciaProfissional(
    req.params.experienciaId,
    {
      empresa,
      cargo,
      dataInicio,
      dataFim,
      descricao,
      pessoaId,
    }
  );
  if (!experiencia) {
    throw new AppError("Experiência profissional não encontrada.", 404);
  }
  return res.status(200).send(experiencia);
};

const deleteExperienciaProfissional = async (req, res) => {
  const isDeleted = await experienciaProfissionalService.deleteExperienciaProfissional(
    req.params.experienciaId
  );
  if (!isDeleted) {
    throw new AppError("Experiência profissional não encontrada.", 404);
  }
  return res.status(204).send();
};

export default {
  getExperienciasProfissionais,
  getExperienciaProfissional,
  createExperienciaProfissional,
  updateExperienciaProfissional,
  deleteExperienciaProfissional,
};
