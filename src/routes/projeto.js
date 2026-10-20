import { Router } from "express";
import { projetoController } from "../controllers/index.js";

const router = Router();

router.get("/", projetoController.getProjetos);
router.get("/:projetoId", projetoController.getProjeto);
router.post("/", projetoController.createProjeto);
router.put("/:projetoId", projetoController.updateProjeto);
router.delete("/:projetoId", projetoController.deleteProjeto);

export default router;
