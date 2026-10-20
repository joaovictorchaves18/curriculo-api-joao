import { Router } from "express";
import { pessoaController } from "../controllers/index.js";

const router = Router();

// CRUD Pessoa
router.get("/", pessoaController.getPessoas);
router.get("/:pessoaId", pessoaController.getPessoa);
router.post("/", pessoaController.createPessoa);
router.put("/:pessoaId", pessoaController.updatePessoa);
router.delete("/:pessoaId", pessoaController.deletePessoa);

// Relacionamentos de Pessoa
router.get("/:pessoaId/experiencias-academicas", pessoaController.getExperienciasAcademicasByPessoa);
router.get(
  "/:pessoaId/experiencias-profissionais",
  pessoaController.getExperienciasProfissionaisByPessoa
);
router.get("/:pessoaId/projetos", pessoaController.getProjetosByPessoa);
router.get("/:pessoaId/habilidades", pessoaController.getHabilidadesByPessoa);

export default router;
