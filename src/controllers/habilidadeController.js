import { habilidadeService, pessoaService } from "../services/index.js";
import { AppError } from "../utils/index.js";

const getHabilidades = async (req, res) => {
  const { pessoaId } = req.query;
  const habilidades = await habilidadeService.getAllHabilidades(pessoaId);
  return res.status(200).send(habilidades);
};

const getHabilidade = async (req, res) => {
  const habilidade = await habilidadeService.getHabilidadeById(req.params.habilidadeId);
  if (!habilidade) {
    throw new AppError("Habilidade não encontrada.", 404);
  }
  return res.status(200).send(habilidade);
};

const createHabilidade = async (req, res) => {
  const { nome, nivel, categoria, pessoaId } = req.body || {};
  if (!pessoaId) {
    throw new AppError("O campo pessoaId é obrigatório.", 400);
  }
  const pessoa = await pessoaService.getPessoaById(pessoaId);
  if (!pessoa) {
    throw new AppError("Pessoa informada não encontrada.", 404);
  }
  const habilidade = await habilidadeService.createHabilidade({
    nome,
    nivel,
    categoria,
    pessoaId,
  });
  return res.status(201).send(habilidade);
};

const updateHabilidade = async (req, res) => {
  const { nome, nivel, categoria, pessoaId } = req.body || {};
  if (pessoaId) {
    const pessoa = await pessoaService.getPessoaById(pessoaId);
    if (!pessoa) {
      throw new AppError("Pessoa informada não encontrada.", 404);
    }
  }
  const habilidade = await habilidadeService.updateHabilidade(req.params.habilidadeId, {
    nome,
    nivel,
    categoria,
    pessoaId,
  });
  if (!habilidade) {
    throw new AppError("Habilidade não encontrada.", 404);
  }
  return res.status(200).send(habilidade);
};

const deleteHabilidade = async (req, res) => {
  const isDeleted = await habilidadeService.deleteHabilidade(req.params.habilidadeId);
  if (!isDeleted) {
    throw new AppError("Habilidade não encontrada.", 404);
  }
  return res.status(204).send();
};

export default {
  getHabilidades,
  getHabilidade,
  createHabilidade,
  updateHabilidade,
  deleteHabilidade,
};
