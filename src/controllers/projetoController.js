import { projetoService, pessoaService } from "../services/index.js";
import { AppError } from "../utils/index.js";

const getProjetos = async (req, res) => {
  const { pessoaId } = req.query;
  const projetos = await projetoService.getAllProjetos(pessoaId);
  return res.status(200).send(projetos);
};

const getProjeto = async (req, res) => {
  const projeto = await projetoService.getProjetoById(req.params.projetoId);
  if (!projeto) {
    throw new AppError("Projeto não encontrado.", 404);
  }
  return res.status(200).send(projeto);
};

const createProjeto = async (req, res) => {
  const { nome, descricao, tecnologias, urlRepositorio, urlDeploy, pessoaId } = req.body || {};
  if (!pessoaId) {
    throw new AppError("O campo pessoaId é obrigatório.", 400);
  }
  const pessoa = await pessoaService.getPessoaById(pessoaId);
  if (!pessoa) {
    throw new AppError("Pessoa informada não encontrada.", 404);
  }
  const projeto = await projetoService.createProjeto({
    nome,
    descricao,
    tecnologias,
    urlRepositorio,
    urlDeploy,
    pessoaId,
  });
  return res.status(201).send(projeto);
};

const updateProjeto = async (req, res) => {
  const { nome, descricao, tecnologias, urlRepositorio, urlDeploy, pessoaId } = req.body || {};
  if (pessoaId) {
    const pessoa = await pessoaService.getPessoaById(pessoaId);
    if (!pessoa) {
      throw new AppError("Pessoa informada não encontrada.", 404);
    }
  }
  const projeto = await projetoService.updateProjeto(req.params.projetoId, {
    nome,
    descricao,
    tecnologias,
    urlRepositorio,
    urlDeploy,
    pessoaId,
  });
  if (!projeto) {
    throw new AppError("Projeto não encontrado.", 404);
  }
  return res.status(200).send(projeto);
};

const deleteProjeto = async (req, res) => {
  const isDeleted = await projetoService.deleteProjeto(req.params.projetoId);
  if (!isDeleted) {
    throw new AppError("Projeto não encontrado.", 404);
  }
  return res.status(204).send();
};

export default {
  getProjetos,
  getProjeto,
  createProjeto,
  updateProjeto,
  deleteProjeto,
};
