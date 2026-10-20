import {
  pessoaService,
  experienciaAcademicaService,
  experienciaProfissionalService,
  projetoService,
  habilidadeService,
} from "../services/index.js";
import { AppError } from "../utils/index.js";

const getPessoas = async (req, res) => {
  const pessoas = await pessoaService.getAllPessoas();
  return res.status(200).send(pessoas);
};

const getPessoa = async (req, res) => {
  const pessoa = await pessoaService.getPessoaById(req.params.pessoaId);
  if (!pessoa) {
    throw new AppError("Pessoa não encontrada.", 404);
  }
  return res.status(200).send(pessoa);
};

const createPessoa = async (req, res) => {
  const { nome, titulo, resumo, email, telefone, linkedin, github } = req.body || {};
  const pessoa = await pessoaService.createPessoa({
    nome,
    titulo,
    resumo,
    email,
    telefone,
    linkedin,
    github,
  });
  return res.status(201).send(pessoa);
};

const updatePessoa = async (req, res) => {
  const { nome, titulo, resumo, email, telefone, linkedin, github } = req.body || {};
  const pessoa = await pessoaService.updatePessoa(req.params.pessoaId, {
    nome,
    titulo,
    resumo,
    email,
    telefone,
    linkedin,
    github,
  });
  if (!pessoa) {
    throw new AppError("Pessoa não encontrada.", 404);
  }
  return res.status(200).send(pessoa);
};

const deletePessoa = async (req, res) => {
  const isDeleted = await pessoaService.deletePessoa(req.params.pessoaId);
  if (!isDeleted) {
    throw new AppError("Pessoa não encontrada.", 404);
  }
  return res.status(204).send();
};

// Rotas de relacionamento (sub-recursos de uma pessoa)
const getExperienciasAcademicasByPessoa = async (req, res) => {
  const pessoa = await pessoaService.getPessoaById(req.params.pessoaId);
  if (!pessoa) {
    throw new AppError("Pessoa não encontrada.", 404);
  }
  const experiencias = await experienciaAcademicaService.getAllExperienciasAcademicas(
    req.params.pessoaId
  );
  return res.status(200).send(experiencias);
};

const getExperienciasProfissionaisByPessoa = async (req, res) => {
  const pessoa = await pessoaService.getPessoaById(req.params.pessoaId);
  if (!pessoa) {
    throw new AppError("Pessoa não encontrada.", 404);
  }
  const experiencias = await experienciaProfissionalService.getAllExperienciasProfissionais(
    req.params.pessoaId
  );
  return res.status(200).send(experiencias);
};

const getProjetosByPessoa = async (req, res) => {
  const pessoa = await pessoaService.getPessoaById(req.params.pessoaId);
  if (!pessoa) {
    throw new AppError("Pessoa não encontrada.", 404);
  }
  const projetos = await projetoService.getAllProjetos(req.params.pessoaId);
  return res.status(200).send(projetos);
};

const getHabilidadesByPessoa = async (req, res) => {
  const pessoa = await pessoaService.getPessoaById(req.params.pessoaId);
  if (!pessoa) {
    throw new AppError("Pessoa não encontrada.", 404);
  }
  const habilidades = await habilidadeService.getAllHabilidades(req.params.pessoaId);
  return res.status(200).send(habilidades);
};

export default {
  getPessoas,
  getPessoa,
  createPessoa,
  updatePessoa,
  deletePessoa,
  getExperienciasAcademicasByPessoa,
  getExperienciasProfissionaisByPessoa,
  getProjetosByPessoa,
  getHabilidadesByPessoa,
};
